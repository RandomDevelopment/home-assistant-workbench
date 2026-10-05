import { HomeAssistantHTTPError, request } from './client';
import { owned } from './store';
import { AppError, redact } from './security';

const DAY=86400000,MAX_ROWS=5000,MAX_BYTES=1000000;
const warnings=[
 'Recorded evidence only: no guarantee of uninterrupted recording or complete time coverage. Recorder exclusions, purging, restarts, unavailable entities and permissions can leave gaps.',
 'Recorder retention and exclusion settings cannot be determined from these endpoints. Empty results do not prove no activity or no movement.',
 'Initial states are boundary observations, not transitions at the query start. Current entity timestamps are never used as historical evidence.',
 'Private household data: do not copy results into feedback or GitHub without explicit authorization.'
];
type Range={start:number;end:number;start_time:string;end_time:string;offset:number;limit:number};
type HistoryRecord={entity_id:string;state:string;recorded_at:string;last_changed:string;kind:'initial_state'|'state_change'|'attribute_update'|'repeated_state'|'observation';from_state:string|null};
export function exactEntity(value:unknown){if(typeof value!=='string'||value.length>180||!/^\w+\.\w+$/.test(value)||value!==value.toLowerCase())throw new AppError('Use an exact lowercase entity_id (domain.object_id), without wildcards.');return value;}
function timestamp(value:unknown,label:string){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/.test(value))throw new AppError(label+' must be ISO 8601 with seconds and Z or an explicit UTC offset.');
 const [year,month,day]=value.slice(0,10).split('-').map(Number),n=Date.parse(value),days=new Date(Date.UTC(year,month,0)).getUTCDate();
 const [hour,minute,second]=value.slice(11,19).split(':').map(Number),offset=value.slice(-6);
 const offsetHour=Number(offset.slice(1,3)),offsetMinute=Number(offset.slice(4));
 if(year<1970||month<1||month>12||day<1||day>days||hour>23||minute>59||second>59||(!value.endsWith('Z')&&(offsetHour>14||offsetMinute>59||(offsetHour===14&&offsetMinute!==0)))||!Number.isFinite(n))throw new AppError('Invalid '+label+'.');return n;
}
export function historyRange(a:Record<string,any>,now=Date.now()):Range{
 const start=timestamp(a.start_time,'start_time'),end=timestamp(a.end_time,'end_time');
 if(end<=start||end-start>7*DAY)throw new AppError('Use a start before end, with a maximum seven-day range.');
 if(end>now+60000)throw new AppError('History end_time must not be in the future.');
 const offset=a.offset??0,limit=a.limit??100;
 if(!Number.isInteger(offset)||offset<0||offset>MAX_ROWS||!Number.isInteger(limit)||limit<1||limit>200)throw new AppError('Use offset 0–5000 and limit 1–200.');
 return {start,end,start_time:new Date(start).toISOString(),end_time:new Date(end).toISOString(),offset,limit};
}
function entities(value:unknown){if(!Array.isArray(value)||!value.length||value.length>10)throw new AppError('Select 1–10 exact entity_ids.');const ids=value.map(exactEntity);if(new Set(ids).size!==ids.length)throw new AppError('entity_ids must be distinct.');return ids;}
function recordTime(value:unknown){if(typeof value!=='string'||!/(?:Z|[+-]\d{2}:\d{2})$/.test(value))return NaN;return Date.parse(value);}
export function normalizeHistory(raw:unknown,ids:string[],range:Range){
 if(!Array.isArray(raw)||raw.some(group=>!Array.isArray(group)))throw new AppError('Home Assistant returned an unsupported history format.',502);
 if(raw.reduce((n,group)=>n+group.length,0)>MAX_ROWS)throw new AppError('Too many history records. Use fewer entities or a shorter time range.',413);
 const byEntity=new Map<string,any[]>(ids.map(id=>[id,[]]));let ignored=0;
 for(const group of raw)for(const row of group){
  const bucket=row&&typeof row==='object'?byEntity.get(row.entity_id):undefined;if(!bucket){ignored++;continue;}
  const updated=recordTime(row.last_updated),changed=recordTime(row.last_changed);
  if(typeof row.state!=='string'||row.state.length>1000||!Number.isFinite(updated)||!Number.isFinite(changed)||changed>updated)throw new AppError('Home Assistant history contains an invalid state or timestamp. Narrow the range and verify the installed version.',502);
  if(updated>=range.end){ignored++;continue;}bucket.push({state:row.state,updated,changed});
 }
 const records:HistoryRecord[]=[],coverage=[];
 for(const [entity_id,rows] of byEntity){
  rows.sort((a,b)=>a.updated-b.updated||a.changed-b.changed);
  const boundary=rows.filter(r=>r.updated<=range.start).at(-1),selected=rows.filter(r=>r.updated>range.start);if(boundary)selected.unshift(boundary);
  let previous:string|null=null;
  for(const row of selected){
   const initial=row.updated<=range.start;
   const kind:HistoryRecord['kind']=initial?'initial_state':row.state===previous?(row.changed<row.updated?'attribute_update':'repeated_state'):row.changed===row.updated?'state_change':'observation';
   records.push({entity_id,state:row.state,recorded_at:new Date(initial?range.start:row.updated).toISOString(),last_changed:new Date(row.changed).toISOString(),kind,from_state:kind==='state_change'?previous:null});previous=row.state;
  }
  coverage.push({entity_id,records:selected.length,initial_state_available:!!boundary,status:selected.length?'recorded_evidence_available':'no_recorded_evidence',coverage_complete:false});
 }
 records.sort((a,b)=>a.recorded_at.localeCompare(b.recorded_at)||a.entity_id.localeCompare(b.entity_id));return {records,coverage,ignored};
}
function page<T>(items:T[],r:Range){return {total:items.length,offset:r.offset,limit:r.limit,items:items.slice(r.offset,r.offset+r.limit),has_more:r.offset+r.limit<items.length,next_offset:r.offset+r.limit<items.length?r.offset+r.limit:null,pagination:'Client-side over this bounded upstream query; no snapshot is stored. Repeat the same fixed range and entity IDs.'};}
async function context(owner:string,id:string,component:string){
 const installation=await owned(owner,id),config=await request(owner,id,'/api/config');
 if(!config||typeof config!=='object'||typeof config.version!=='string')throw new AppError('This installation returned an invalid configuration.',502);
 if(Array.isArray(config.components)&&(!config.components.includes('recorder')||!config.components.includes(component)))throw new AppError('This installation does not report loaded recorder and '+component+' integrations. Check its configuration and version.',409);
 return {installation_id:id,installation_name:installation.name,core_version:config.version,time_zone:typeof config.time_zone==='string'?config.time_zone:null};
}
async function read(owner:string,id:string,path:string,component:string){try{return await request(owner,id,path,'GET',undefined,MAX_BYTES);}catch(e){if(e instanceof HomeAssistantHTTPError){if(e.upstreamStatus===401||e.upstreamStatus===403)throw new AppError('Home Assistant denied '+component+' access. Check this installation’s authorization and entity permissions.',e.upstreamStatus);if([400,404,405].includes(e.upstreamStatus))throw new AppError('The '+component+' endpoint is unavailable or unsupported on this installation. Check loaded integrations, installed-version API support and permissions.',409);}throw e;}}
export async function readHistory(owner:string,id:string,a:Record<string,any>){
 await owned(owner,id);const ids=entities(a.entity_ids),r=historyRange(a);
 if(a.state!==undefined&&(typeof a.state!=='string'||!a.state.length||a.state.length>1000))throw new AppError('state must be an exact recorded state under 1001 characters.');
 const info=await context(owner,id,'history'),query=new URLSearchParams({filter_entity_id:ids.join(','),end_time:r.end_time,no_attributes:'',significant_changes_only:'0'});
 const path='/api/history/period/'+encodeURIComponent(r.start_time)+'?'+query,normalized=normalizeHistory(await read(owner,id,path,'history'),ids,r);
 const matches=a.state===undefined?undefined:ids.map(entity_id=>({entity_id,state:a.state,latest_matching_observation:normalized.records.filter(row=>row.entity_id===entity_id&&row.state===a.state).at(-1)??null,last_recorded_transition_into_state:normalized.records.filter(row=>row.entity_id===entity_id&&row.state===a.state&&row.kind==='state_change').at(-1)??null,scope:'Only this queried time range. An initial observation does not establish when the entity entered that state.'}));
 return redact({...info,query:{entity_ids:ids,start_time:r.start_time,end_time:r.end_time,end_exclusive:true,attributes_included:false},source:{api:'REST history/period',documentation:'https://developers.home-assistant.io/docs/api/rest/'},...page(normalized.records,r),entity_coverage:normalized.coverage,ignored_records:normalized.ignored,...(matches?{state_matches:matches}:{}),warnings});
}
export function normalizeLogbook(raw:unknown,entity_id:string,r:Range){
 if(!Array.isArray(raw))throw new AppError('Home Assistant returned an unsupported logbook format.',502);if(raw.length>MAX_ROWS)throw new AppError('Too many logbook records. Use a shorter time range.',413);
 const items=[];let ignored=0;
 for(const row of raw){const when=row&&typeof row==='object'?recordTime(row.when):NaN;if(row?.entity_id!==entity_id||!Number.isFinite(when)||when<r.start||when>=r.end){ignored++;continue;}
  const event:Record<string,unknown>={entity_id,when:new Date(when).toISOString()};
  for(const key of ['state','name','message','domain'])if(typeof row[key]==='string'){if(row[key].length>4000)throw new AppError('Logbook entry too large. Use a narrower range.',413);event[key]=row[key];}items.push(event);
 }
 items.sort((a,b)=>String(a.when).localeCompare(String(b.when)));return {items,ignored};
}
export async function readLogbook(owner:string,id:string,a:Record<string,any>){
 await owned(owner,id);const entity_id=exactEntity(a.entity_id),r=historyRange(a),info=await context(owner,id,'logbook');
 // REST logbook omits history's permission filter. APIEntityStateView verifies POLICY_READ first.
 try{await request(owner,id,'/api/states/'+encodeURIComponent(entity_id));}catch(e){if(e instanceof HomeAssistantHTTPError&&e.upstreamStatus===404)throw new AppError('This entity is missing from the current installation. Logbook access cannot be verified; use read_history for retained history of a removed entity.',409);throw e;}
 const query=new URLSearchParams({entity:entity_id,end_time:r.end_time}),path='/api/logbook/'+encodeURIComponent(r.start_time)+'?'+query,normalized=normalizeLogbook(await read(owner,id,path,'logbook'),entity_id,r);
 return redact({...info,query:{entity_id,start_time:r.start_time,end_time:r.end_time,end_exclusive:true},source:{api:'REST logbook',documentation:'https://developers.home-assistant.io/docs/api/rest/'},...page(normalized.items,r),status:normalized.items.length?'recorded_evidence_available':'no_recorded_evidence',ignored_records:normalized.ignored,coverage_complete:false,warnings});
}

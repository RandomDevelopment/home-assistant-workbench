import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, mkdir, rm } from 'node:fs/promises';
const req=createRequire(import.meta.url),wranglerReq=createRequire(req.resolve('wrangler/package.json'));
const {build}=await import(wranglerReq.resolve('esbuild'));
const {Miniflare}=await import(wranglerReq.resolve('miniflare'));
const mfReq=createRequire(wranglerReq.resolve('miniflare/package.json'));
const {MockAgent}=await import(mfReq.resolve('undici'));
const mock=new MockAgent();mock.disableNetConnect();
mock.get('https://cloudflare-dns.com').intercept({path:/^\/dns-query\?/}).reply(200,{Answer:[{type:1,data:'8.8.8.8'}]}).persist();
const config={version:'2026.9.4',time_zone:'America/Chicago',components:['recorder','history','logbook']};
const args={installation_id:'a0',entity_ids:['sensor.phone_room','sensor.missing'],start_time:'2026-10-03T19:00:00-05:00',end_time:'2026-10-04T01:00:00-05:00',state:'upstairs',limit:2};
const time=(hour,minute=0)=>'2026-10-04T'+String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0')+':00+00:00';
const row=(state,changed,updated=changed)=>({entity_id:'sensor.phone_room',state,last_changed:changed,last_updated:updated,attributes:{private_data:'must not be returned'}});
const fixture=[[row('basement',time(4)),row('upstairs',time(3)),row('upstairs',time(1),time(1,30)),row('bedroom',time(0)),row('upstairs',time(1)),row('bedroom',time(2)),row('basement',time(6)),{...row('foreign',time(2)),entity_id:'sensor.other_house'}]];
let historyCalls=0,logbookCalls=0;const methods=[];
const home=mock.get('https://home0.example.com');
home.intercept({path:'/api/config',method:'GET'}).reply(200,config).persist();
home.intercept({path:/^\/api\/history\/period\//,method:'GET'}).reply(options=>{
 methods.push(options.method);historyCalls++;const u=new URL(options.path,'https://home0.example.com');
 assert.equal(decodeURIComponent(u.pathname.split('/').at(-1)),'2026-10-04T00:00:00.000Z');assert.equal(u.searchParams.get('end_time'),'2026-10-04T06:00:00.000Z');
 assert.equal(u.searchParams.get('filter_entity_id'),'sensor.phone_room,sensor.missing');assert.equal(u.searchParams.get('significant_changes_only'),'0');assert(u.searchParams.has('no_attributes'));assert(!u.searchParams.has('minimal_response'));assert(!u.searchParams.has('skip_initial_state'));
 assert(JSON.stringify(options.headers).includes('fixture-a0'));
 return {statusCode:200,data:JSON.stringify(fixture)};
}).persist();
home.intercept({path:'/api/states/sensor.phone_room',method:'GET'}).reply(200,{entity_id:'sensor.phone_room',state:'NOW_not_historical_evidence',last_changed:'2026-10-04T12:00:00Z'}).persist();
home.intercept({path:/^\/api\/logbook\//,method:'GET'}).reply(options=>{methods.push(options.method);logbookCalls++;const u=new URL(options.path,'https://home0.example.com');assert.equal(u.searchParams.get('entity'),'sensor.phone_room');return {statusCode:200,data:JSON.stringify([{entity_id:'sensor.phone_room',when:time(3),message:'changed to upstairs',context_user_id:'private-user',context_entity_id:'lock.front_door'},{entity_id:'sensor.foreign',when:time(2),message:'foreign-private'},{entity_id:'sensor.phone_room',when:time(1),state:'upstairs'},{entity_id:'sensor.phone_room',when:time(6),message:'outside-range'}])};}).persist();
const denied=mock.get('https://home1.example.com');denied.intercept({path:'/api/config',method:'GET'}).reply(200,config).persist();denied.intercept({path:/^\/api\/history\//,method:'GET'}).reply(403,{}).persist();denied.intercept({path:'/api/states/sensor.phone_room',method:'GET'}).reply(403,{}).persist();
const absent=mock.get('https://home2.example.com');absent.intercept({path:'/api/config',method:'GET'}).reply(200,{...config,components:[]}).persist();
const empty=mock.get('https://home3.example.com');empty.intercept({path:'/api/config',method:'GET'}).reply(200,config).persist();empty.intercept({path:/^\/api\/history\//,method:'GET'}).reply(200,[]).persist();empty.intercept({path:'/api/states/sensor.phone_room',method:'GET'}).reply(404,{}).persist();
const unsupported=mock.get('https://home4.example.com');unsupported.intercept({path:'/api/config',method:'GET'}).reply(200,config).persist();unsupported.intercept({path:/^\/api\/history\//,method:'GET'}).reply(404,{}).persist();
await mkdir('.test-history',{recursive:true});await build({entryPoints:['tests/harness.ts'],bundle:true,format:'esm',platform:'browser',target:'es2022',external:['cloudflare:workers','node:*'],outfile:'.test-history/harness.mjs'});
const mf=new Miniflare({modules:true,scriptPath:'.test-history/harness.mjs',compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],bindings:{CREDENTIAL_KEY:Buffer.alloc(32,7).toString('base64'),APP_ORIGIN:'https://test.example.com',FEEDBACK_MAINTAINER_ID:'alice'},fetchMock:mock});
let checks=0;
async function call(a){const r=await mf.dispatchFetch('https://test.example.com',{method:'POST',body:JSON.stringify(a)});return {status:r.status,...await r.json()};}
async function ok(a){const r=await call(a);assert.equal(r.status,200,r.error);checks++;return r.value;}
async function bad(a,pattern){const r=await call(a);assert.equal(r.status,400,JSON.stringify(r));if(pattern)assert.match(r.error,pattern);checks++;return r;}
const history=(installation_id='a0',extra={})=>({action:'operation',owner:'alice',name:'read_history',args:{...args,installation_id,...extra}});
const logbook=(installation_id='a0',extra={})=>({action:'operation',owner:'alice',name:'read_logbook',args:{installation_id,entity_id:'sensor.phone_room',start_time:args.start_time,end_time:args.end_time,...extra}});
try{
 for(const file of ['drizzle/0000_wealthy_doctor_faustus.sql','drizzle/0001_useful_exodus.sql'])for(const sql of (await readFile(file,'utf8')).split('--> statement-breakpoint').filter(s=>s.trim()))await ok({action:'sql',sql});
 for(let n=0;n<5;n++){const id='a'+n;await ok({action:'sql',sql:'INSERT INTO installations (id,owner,name,url,created_at) VALUES (?,?,?,?,?)',bind:[id,'alice','Fixture '+n,'https://home'+n+'.example.com',n]});const secret=await ok({action:'encrypt',owner:'alice',id,value:{access_token:'fixture-'+id}});await ok({action:'sql',sql:'UPDATE installations SET secret=? WHERE id=?',bind:[secret,id]});}
 const first=await ok(history());assert.equal(first.time_zone,'America/Chicago');assert.equal(first.core_version,'2026.9.4');assert.equal(first.query.start_time,'2026-10-04T00:00:00.000Z');assert.equal(first.total,6);assert.deepEqual(first.items.map(r=>r.kind),['initial_state','state_change']);assert.equal(first.items[1].from_state,'bedroom');assert(first.has_more);assert.equal(first.next_offset,2);checks++;
 const second=await ok(history('a0',{offset:2}));assert.deepEqual(second.items.map(r=>r.kind),['attribute_update','state_change']);assert.equal(second.items[0].from_state,null);assert.equal(second.items[1].from_state,'upstairs');checks++;
 const last=await ok(history('a0',{offset:4}));assert.deepEqual(last.items.map(r=>r.state),['upstairs','basement']);assert.equal(last.has_more,false);assert.equal(last.state_matches[0].last_recorded_transition_into_state.recorded_at,'2026-10-04T03:00:00.000Z');assert.equal(first.entity_coverage[1].status,'no_recorded_evidence');assert.equal(first.entity_coverage[0].coverage_complete,false);assert(!JSON.stringify(first).includes('must not be returned'));assert(!JSON.stringify(first).includes('foreign'));checks++;
 const logs=await ok(logbook());assert.deepEqual(logs.items.map(r=>r.when),['2026-10-04T01:00:00.000Z','2026-10-04T03:00:00.000Z']);assert.equal(logs.ignored_records,2);assert(!JSON.stringify(logs).includes('private-user'));assert(!JSON.stringify(logs).includes('lock.front_door'));assert(!JSON.stringify(logs).includes('NOW_not_historical_evidence'));checks++;
 const prior=historyCalls;await bad({...history(),owner:'bob'},/not found|not belong|access/i);await bad({...logbook(),owner:'bob'},/not found|not belong|access/i);assert.equal(historyCalls,prior);checks++;
 await bad(history('a1'),/denied/);const priorLogs=logbookCalls;await bad(logbook('a1'),/403/);assert.equal(logbookCalls,priorLogs);checks++;
 await bad(history('a2'),/loaded recorder/);await bad(logbook('a2'),/loaded recorder/);
 const noData=await ok(history('a3'));assert.equal(noData.total,0);assert(noData.entity_coverage.every(e=>e.status==='no_recorded_evidence'));assert(noData.warnings.some(w=>w.includes('Empty results do not prove')));checks++;
 await bad(logbook('a3'),/missing.*access cannot be verified/);await bad(history('a4'),/unavailable or unsupported/);
 for(const change of [{installation_id:''},{entity_ids:[]},{entity_ids:['sensor.*']},{entity_ids:['sensor.phone_room','sensor.phone_room']},{entity_ids:Array.from({length:11},(_,n)=>'sensor.e'+n)},{start_time:'2026-10-04T00:00:00'},{start_time:'2026-02-30T00:00:00Z'},{start_time:'2026-10-04T24:00:00Z'},{start_time:'2026-10-04T00:00:00+14:01'},{end_time:'2026-10-03T00:00:00Z'},{start_time:'2026-09-01T00:00:00Z'},{end_time:'2099-10-04T00:00:00Z'},{limit:201},{offset:5001}])await bad(history('a0',change));
 await bad({action:'history_normalize',args,ids:args.entity_ids,value:{not:'history'}});
 await bad({action:'history_normalize',args,ids:args.entity_ids,value:[[{entity_id:'sensor.phone_room'}]]});
 await bad({action:'history_normalize',args,ids:args.entity_ids,value:[[...Array(5001).fill({})]]},/Too many/);
 await bad({action:'history_normalize',args,ids:args.entity_ids,value:[[row('bad','invalid')]]},/invalid state or timestamp/);
 assert.equal(await ok({action:'bounded_response',value:'abcd',limit:4}),'abcd');await bad({action:'bounded_response',value:'abcde',limit:4},/Response too large/);await bad({action:'bounded_response',value:'💡',limit:3},/Response too large/);
 const schema=await ok({action:'tools'});for(const name of ['read_history','read_logbook']){const tool=schema.find(t=>t.name===name);assert.equal(tool.annotations.readOnlyHint,true);assert.equal(tool.annotations.destructiveHint,false);assert(tool.inputSchema.required.includes('installation_id'));}checks++;
 assert(methods.every(method=>method==='GET'));checks++;
 console.log('PASS: '+checks+' history/logbook checks; authenticated REST routing, isolation, boundary states, attribute-only updates, sorted transitions, pagination, missing evidence, permissions, timezone and bounds. No live household data used.');
}finally{await mf.dispose();await mock.close();await rm('.test-history',{recursive:true,force:true});}

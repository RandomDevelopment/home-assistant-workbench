import { isIP } from 'node:net';
export class AppError extends Error { constructor(message:string,public status=400){super(message);} }
export async function fetchNoRedirect(url:string|URL,init:RequestInit={},fetcher:typeof fetch=fetch){
 const response=await fetcher(url,{...init,redirect:'manual'});
 if(response.status>=300&&response.status<400)throw new AppError('The endpoint redirected. Use its canonical HTTPS URL.',502);
 return response;
}
export function publicUrl(value:string){
 let u:URL;try{u=new URL(value);}catch{throw new AppError('Enter a valid HTTPS URL.');}
 const h=u.hostname.toLowerCase();
 if(u.protocol!=='https:'||u.username||u.password||u.hash||u.search||(u.port&&u.port!=='443')||isIP(h)||h.includes(':')||!h.includes('.')||h.endsWith('.')||/(^|\.)(localhost|local|internal|lan|home|test|invalid)$/.test(h)||h.endsWith('.chatgpt.site'))throw new AppError('Use a public HTTPS hostname on port 443 without login details, query parameters, or fragments.');
 return u;
}
export function instanceUrl(value:string){const u=publicUrl(value);if(u.pathname!=='/')throw new AppError('Use the base Home Assistant URL without a path.');return u.origin;}
export function publicIP(ip:string){
 if(isIP(ip)===4){const [a,b]=ip.split('.').map(Number);return !(a===0||a===10||a===127||a>=224||(a===100&&b>=64&&b<=127)||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&(b===168||b===0))||(a===198&&(b===18||b===19)));}
 if(isIP(ip)===6){return /^2[0-9a-f]{3}:/i.test(ip)&&!/^2001:(db8|0|2):/i.test(ip);}
 return false;
}
export async function validateDNS(host:string,fetcher:typeof fetch=fetch){
 let results:{Status?:number;TC?:boolean;Answer?:{type:number;data:string}[]}[];
 try{
  results=await Promise.all(['A','AAAA'].map(async type=>{
   const r=await fetchNoRedirect('https://cloudflare-dns.com/dns-query?name='+encodeURIComponent(host)+'&type='+type,{headers:{accept:'application/dns-json'},signal:AbortSignal.timeout(8000)},fetcher);
   if(!r.ok)throw new AppError('The DNS verification service returned HTTP '+r.status+'.',502);
   const data:any=await r.json();
   if(!data||typeof data!=='object'||(data.Status!==undefined&&data.Status!==0)||data.TC===true)throw new AppError('The DNS verification service could not resolve this hostname.',502);
   if(data.Answer!==undefined&&!Array.isArray(data.Answer))throw new AppError('The DNS verification service returned an invalid answer.',502);
   return data;
  }));
 }catch(e){
  if(e instanceof AppError)throw e;
  console.error('dns_verification_failed',{type:e instanceof Error?e.name:'unknown',message:e instanceof Error?e.message:'unknown'});
  throw new AppError('Could not reach the DNS verification service. Please retry later.',502);
 }
 const addresses=results.flatMap(r=>(r.Answer??[]).filter(a=>a.type===1||a.type===28).map(a=>a.data));
 if(!addresses.length||addresses.some(x=>!publicIP(x)))throw new AppError('The hostname must resolve only to public network addresses.');
 return {validated:true,addresses:addresses.length};
}
export function redact(value:unknown):unknown{
 if(Array.isArray(value))return value.map(redact);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,/password|secret|token|api[_-]?key|authorization|cookie|credential|^code$|latitude|longitude/i.test(k)?'[redacted]':redact(v)]));
 if(typeof value==='string')return value.replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,'[redacted token]').replace(/(Bearer\s+)\S+/gi,'$1[redacted]').replace(/((?:password|api[_-]?key|access[_-]?token|refresh[_-]?token|secret)\s*[=:]\s*)[^\s&]+/gi,'$1[redacted]');return value;
}
export function nonempty(v:unknown,label:string,max=200){if(typeof v!=='string'||!v.trim()||v.length>max)throw new AppError(label+' is required (maximum '+max+' characters).');return v.trim();}
export function repository(value:string){if(!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(value))throw new AppError('Repository must be owner/name.');return value;}
export function identifier(value:unknown){const s=nonempty(value,'Identifier',100);if(!/^[a-z0-9_]+$/.test(s))throw new AppError('Invalid identifier.');return s;}

import { env } from 'cloudflare:workers';
import { AppError } from './security';
export function db(){if(!env.DB)throw new AppError('Connection storage is temporarily unavailable.',503);return env.DB;}
export function settings(){return env as unknown as {CREDENTIAL_KEY?:string;APP_ORIGIN?:string;FEEDBACK_MAINTAINER_ID?:string};}
export type Installation={id:string;owner:string;name:string;url:string;secret:string|null;mode:string;notes:string;snapshot:string|null;checked_at:number|null;created_at:number};
export async function owned(owner:string,id:string){const row=await db().prepare('SELECT * FROM installations WHERE owner=? AND id=?').bind(owner,id).first<Installation>();if(!row)throw new AppError('Installation not found.',404);return row;}
export async function list(owner:string){return (await db().prepare('SELECT id,name,url,mode,notes,checked_at,snapshot,secret IS NOT NULL AS connected FROM installations WHERE owner=? ORDER BY created_at').bind(owner).all()).results.map(r=>({...r,snapshot:r.snapshot?JSON.parse(String(r.snapshot)):null}));}
const encode=(b:Uint8Array)=>btoa(String.fromCharCode(...b));
const decode=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function key(){const s=settings().CREDENTIAL_KEY;if(!s)throw new AppError('Secure credential storage is unavailable.',503);return crypto.subtle.importKey('raw',decode(s),'AES-GCM',false,['encrypt','decrypt']);}
export async function encrypt(value:unknown,owner:string,id:string){const iv=crypto.getRandomValues(new Uint8Array(12));const data=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:new TextEncoder().encode(owner+'\0'+id)},await key(),new TextEncoder().encode(JSON.stringify(value)));return encode(iv)+'.'+encode(new Uint8Array(data));}
export async function decrypt(secret:string,owner:string,id:string){const [iv,data]=secret.split('.');return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(iv),additionalData:new TextEncoder().encode(owner+'\0'+id)},await key(),decode(data))));}
export async function saveSecret(owner:string,id:string,value:unknown){const encrypted=await encrypt(value,owner,id);await db().prepare('UPDATE installations SET secret=? WHERE owner=? AND id=?').bind(encrypted,owner,id).run();}
export async function componentList(owner:string,id:string){await owned(owner,id);return (await db().prepare('SELECT id,name,kind,repo,version,docs,notes FROM components WHERE owner=? AND installation=? ORDER BY name').bind(owner,id).all()).results;}

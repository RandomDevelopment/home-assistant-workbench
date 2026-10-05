import { requireUser, sameOrigin, errorResponse, readBody } from '../instances/route';
import { operation } from '../../../lib/ha/operations';
export async function POST(r:Request){try{sameOrigin(r);const owner=await requireUser();const a=await readBody(r);return Response.json(await operation(owner,a.operation,a.args??{}),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}

import { requireUser, sameOrigin, readBody, errorResponse } from '../instances/route';
import { listFeedback, submitFeedback, updateFeedback, deleteFeedback } from '../../../lib/ha/feedback';
export async function GET(r:Request){try{const u=new URL(r.url);return Response.json(await listFeedback(await requireUser(),{offset:Number(u.searchParams.get('offset')??0),status:u.searchParams.get('status')||undefined},u.searchParams.get('review')==='true'),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function POST(r:Request){try{sameOrigin(r);return Response.json(await submitFeedback(await requireUser(),await readBody(r)),{status:201,headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function PATCH(r:Request){try{sameOrigin(r);return Response.json(await updateFeedback(await requireUser(),await readBody(r)),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}

export async function DELETE(r:Request){try{sameOrigin(r);return Response.json(await deleteFeedback(await requireUser(),await readBody(r)),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}

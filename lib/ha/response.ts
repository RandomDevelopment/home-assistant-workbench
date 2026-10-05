import { AppError } from './security';

/** Bound the body while streaming, before allocating or parsing a large HA response. */
export async function boundedText(response:Response, maxBytes=4000000){
 const length=Number(response.headers.get('content-length'));
 if(length>maxBytes){await response.body?.cancel();throw new AppError('Response too large. Use fewer entities or a shorter time range.',413);}
 if(!response.body)return '';
 const reader=response.body.getReader(),decoder=new TextDecoder();let bytes=0,text='';
 try{while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>maxBytes){await reader.cancel();throw new AppError('Response too large. Use fewer entities or a shorter time range.',413);}text+=decoder.decode(part.value,{stream:true});}return text+decoder.decode();}finally{reader.releaseLock();}
}

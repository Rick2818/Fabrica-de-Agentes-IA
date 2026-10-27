// Original implementation. Server-to-server only; no browser CORS or public grants.
const siteId='appgprj_6adbf0c05a0c8191b2ca585b76f5e862';
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
export async function handleCRM(request,config){
 if(request.method!=='POST')return reply({error:'Método no permitido.'},405);
 const key=request.headers.get('x-leo-bridge-key')||'';
 if(!/^[a-f0-9]{64}$/.test(key))return reply({error:'Acceso no permitido.'},401);
 const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 let diff=digest.length^config.keyHash.length;for(let i=0;i<digest.length;i++)diff|=digest.charCodeAt(i)^config.keyHash.charCodeAt(i);
 if(diff)return reply({error:'Acceso no permitido.'},401);
 if(!config.url||!config.serviceKey)return reply({error:'Conexión no disponible.'},503);
 try{
  const raw=await request.text();if(raw.length>16000)return reply({error:'Solicitud demasiado grande.'},413);
  const a=JSON.parse(raw);
  if(a.site_id!==siteId||typeof a.user_id!=='string'||!a.user_id||a.user_id.length>256||typeof a.email!=='string'||a.email.length>254||!['status','list','get_order','create_order'].includes(a.action))return reply({error:'Solicitud inválida.'},400);
  const upstream=await fetch(config.url+'/rest/v1/rpc/crm_leo_site_action',{method:'POST',signal:AbortSignal.timeout(15000),headers:{apikey:config.serviceKey,authorization:'Bearer '+config.serviceKey,'content-type':'application/json'},body:JSON.stringify({p_site_id:siteId,p_user_id:a.user_id,p_email:a.email.toLowerCase(),p_action:a.action,p_data:a.data||{}})});
  const body=await upstream.json();
  if(!upstream.ok){
   const allowed=['PT400','PT401','PT403','PT404','PT409'];
   return reply({error:allowed.includes(body.code)?body.message:'No pude completar la operación del CRM.'},allowed.includes(body.code)?Number(body.code.slice(2)):502);
  }
  return reply(body);
 }catch{return reply({error:'No pude confirmar la respuesta del CRM. Conservá el identificador para reintentar.'},502);}
}

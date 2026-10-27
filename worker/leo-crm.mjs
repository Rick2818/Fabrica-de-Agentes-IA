const crmSiteId='appgprj_6adbf0c05a0c8191b2ca585b76f5e862';
const crmEndpoint='https://udispwzwrebjkanudcoy.supabase.co/functions/v1/leo-crm';
const crmJson=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export async function leoCRM(request,env){
 const user=request.headers.get('oai-authenticated-user-id'),email=request.headers.get('oai-authenticated-user-email');
 if(!user||!email)return crmJson({error:'Iniciá sesión con ChatGPT para usar el CRM.'},401);
 const url=new URL(request.url);
 if(!['GET','POST'].includes(request.method))return crmJson({error:'Método no permitido.'},405);
 if(request.method==='POST'&&request.headers.get('origin')!==url.origin)return crmJson({error:'Origen no permitido.'},403);
 if(!env.LEO_CRM_BRIDGE_KEY)return crmJson({error:'La conexión al CRM todavía no está configurada.'},503);
 let a;
 try{
  if(request.method==='GET')a={action:url.searchParams.get('action')||'status',data:{order_number:url.searchParams.get('order_number')}};
  else {const raw=await request.text();if(raw.length>12000)return crmJson({error:'Solicitud demasiado grande.'},413);a=JSON.parse(raw);}
 }catch{return crmJson({error:'Solicitud inválida.'},400);}
 if(!a||!['status','list','get_order','create_order'].includes(a.action)||request.method==='GET'&&a.action==='create_order')return crmJson({error:'Operación no permitida.'},400);
 // Identity and organization are never accepted from the browser or model.
 if(Object.keys(a).some(k=>!['action','data'].includes(k)))return crmJson({error:'Campos no permitidos.'},400);
 const d=a.data||{};
 if(a.action==='create_order'){
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(d.id||'')||Object.keys(d).some(k=>!['id','customer','email','title','details','total','currency'].includes(k))||['customer','title','details'].some(k=>typeof d[k]!=='string'||!d[k].trim())||!/^\d{1,10}(\.\d{1,2})?$/.test(String(d.total))||!/^[A-Z]{3}$/.test(d.currency||''))return crmJson({error:'Completá los datos del pedido.'},400);
 }
 try{
  const response=await fetch(crmEndpoint,{method:'POST',signal:AbortSignal.timeout(20000),headers:{'content-type':'application/json','x-leo-bridge-key':env.LEO_CRM_BRIDGE_KEY},body:JSON.stringify({site_id:crmSiteId,user_id:user,email,action:a.action,data:d})});
  const body=await response.json();
  if(!response.ok)return crmJson({error:typeof body.error==='string'?body.error:'El CRM no confirmó la operación.'},[400,401,403,404,409,413].includes(response.status)?response.status:502);
  return crmJson(body);
 }catch{return crmJson({error:'No pude confirmar la respuesta. Reintentá con el mismo identificador para evitar duplicados.'},502);}
}

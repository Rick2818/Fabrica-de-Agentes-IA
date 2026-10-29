// Acceso externo de lectura exclusivamente a orígenes preaprobados.
// Cloudflare Workers fetch: https://developers.cloudflare.com/workers/runtime-apis/fetch/
const ORIGINS=new Set(['https://www.iana.org','https://developers.cloudflare.com','https://docs.github.com']);
function bad(msg,status=400){throw Object.assign(new Error(msg),{status})}
function safePage(url){
 let u;try{u=new URL(url)}catch{bad('URL inválida')}
 if(!ORIGINS.has(u.origin)||u.username||u.password||u.port||u.pathname.length>450||u.search.length>250)bad('Origen no autorizado');
 if(/%2f|%5c|\.\./i.test(u.pathname))bad('Ruta no permitida');
 u.hash='';return u.href;
}
export async function leoPublicTool(kind,input,fetcher=fetch){
 let url;
 if(kind==='public_page'){url=safePage(input?.url)}
 else if(kind==='github_repository'){
  const owner=input?.owner,repo=input?.repo;
  if(typeof owner!=='string'||!/^[a-zA-Z0-9-]{1,39}$/.test(owner)||typeof repo!=='string'||!/^[a-zA-Z0-9._-]{1,100}$/.test(repo))bad('Repositorio inválido');
  url='https://api.github.com/repos/'+encodeURIComponent(owner)+'/'+encodeURIComponent(repo);
 }else bad('Herramienta no autorizada');
 const response=await fetcher(url,{method:'GET',redirect:'manual',headers:{'Accept':kind==='github_repository'?'application/vnd.github+json':'text/html','User-Agent':'FabricaDeAgentes-Leo-readonly'},signal:AbortSignal.timeout(8000)});
 if(!response.ok){
  // Preserve only allowlisted, non-secret response metadata. A 403 alone is
  // not evidence of a missing token or a Sites Governance restriction.
  const integerHeader=name=>{const v=response.headers.get(name);return v!=null&&/^\d{1,12}$/.test(v)?Number(v):null;};
  const remaining=integerHeader('x-ratelimit-remaining');
  const reset=integerHeader('x-ratelimit-reset');
  const retry=integerHeader('retry-after');
  const requestId=response.headers.get('x-github-request-id');
  const diagnostics={upstream_status:response.status,origin:new URL(url).origin,classification:kind==='github_repository'&&[403,429].includes(response.status)&&remaining===0?'primary_rate_limit':response.status===429?'rate_limited':'http_error',rate_limit_remaining:remaining,rate_limit_reset_at:reset==null?null:reset*1000,retry_after_seconds:retry,request_id:requestId&&/^[A-Za-z0-9:-]{1,120}$/.test(requestId)?requestId:null};
  const error=Object.assign(new Error('La fuente externa devolvió HTTP '+response.status+'; '+(diagnostics.classification==='primary_rate_limit'?'cuota primaria de GitHub agotada.':'causa no determinada.')),{status:502,public_diagnostics:diagnostics});
  throw error;
 }
 if(response.status>=300&&response.status<400)bad('No se siguen redirecciones externas',502);
 const type=response.headers.get('content-type')||'';
 if(kind==='public_page'&&!type.includes('text/html'))bad('La fuente no devolvió HTML',502);
 if(kind==='github_repository'&&!type.includes('json'))bad('La API no devolvió JSON',502);
 const declared=Number(response.headers.get('content-length')||0);
 if(declared>120000)bad('Respuesta demasiado grande',413);
 const body=await response.text();
 if(body.length>120000)bad('Respuesta demasiado grande',413);
 let output;
 if(kind==='github_repository'){
  const v=JSON.parse(body);output={full_name:v.full_name,description:v.description,html_url:v.html_url,updated_at:v.updated_at,archived:v.archived,visibility:v.visibility};
 }else{
  const title=body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'';
  const plain=body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  output={title:title.trim().slice(0,250),excerpt:plain.slice(0,3500)};
 }
 return {kind,url,output,source:'HTTP GET real (lectura pública), sin permiso de escritura',external_actions:false,verified_http:response.status,at:new Date().toISOString()};
}


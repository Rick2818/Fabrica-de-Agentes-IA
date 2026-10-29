// Factory orchestration is independent of specialist execution. No inherited user context.
export const FACTORY_TEMPLATES=Object.freeze([
 {id:'sales',name:'Leo',specialty:'Ventas',version:1},
 {id:'support',name:'Mila',specialty:'Servicio al cliente',version:1},
 {id:'finance',name:'Vera',specialty:'Finanzas',version:1},
 {id:'pharma',name:'Alma',specialty:'Química y farmacia',version:1},
 {id:'logistics',name:'Nico',specialty:'Logística',version:1},
 {id:'marketing',name:'Lía',specialty:'Mercadeo',version:1}
]);
export const FACTORY_CHECKS=Object.freeze(['scope','permissions','identity_isolation','memory',
 'tools','error_recovery','background_continuity','wake_resume','parallel_work','steering',
 'pause_cancel','notifications','cloud_computer','authorized_integrations']);
const fq=(db,sql,...args)=>db.prepare(sql).bind(...args);
const ferr=(code,status=400)=>Object.assign(new Error(code),{code,status});
const fassert=(condition,code,status=400)=>{if(!condition)throw ferr(code,status)};
const fid=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{8,100}$/.test(v);
const fstr=(v,n)=>typeof v==='string'&&v.trim().length>0&&v.length<=n;
const fplain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const fjson=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
const canonical=v=>Array.isArray(v)?v.map(canonical):fplain(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const fhash=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)))).map(x=>x.toString(16).padStart(2,'0')).join('');
const fevent=(db,id,stage,outcome,detail,now)=>fq(db,'INSERT INTO factory_events VALUES(?,?,?,?,?,?)',crypto.randomUUID(),id,stage,outcome,JSON.stringify(detail),now).run();
const freception=(db,id,hash,status,detail,now)=>fq(db,"INSERT OR IGNORE INTO factory_events SELECT ?,id,'reception',?,?,? FROM factory_orders WHERE id=? AND payload_hash=?",id+':reception:'+hash,status,JSON.stringify(detail),now,id,hash);
export function factoryOperator(request,env){
 const uid=request.headers.get('oai-authenticated-user-id');
 const email=(request.headers.get('oai-authenticated-user-email')||'').toLowerCase();
 return !!uid&&((env.FACTORY_OPERATOR_IDS||'').split(',').map(x=>x.trim()).filter(Boolean).includes(uid)||
 (env.FACTORY_OPERATOR_EMAILS||'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean).includes(email));
}
export async function factorySign(secret,body,timestamp){
 fassert(typeof secret==='string'&&secret.length>=32,'webhook_not_configured',503);
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signed=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`factory-order-v1\n${timestamp}\n${body}`));
 return Array.from(new Uint8Array(signed)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
export function validateFactoryOrder(a){
 fassert(fplain(a)&&fid(a.id)&&fid(a.customer_id),'invalid_order_identity');
 const allowed=['version','id','customer_id','email','template_id','kind','objective','specifications','criteria','actions','permissions','integrations','locale','timezone','limits'];
 fassert(Object.keys(a).every(k=>allowed.includes(k)),'unexpected_order_field');
 const present=k=>Object.hasOwn(a,k);
 const missing=allowed.filter(k=>!present(k));
 // Validate every supplied field, including incomplete orders. Never persist
 // malformed nested data just because another field is absent.
 if(present('version'))fassert(a.version===1,'invalid_contract_version_or_kind');
 if(present('kind'))fassert(['prebuilt','custom'].includes(a.kind),'invalid_contract_version_or_kind');
 if(present('template_id'))fassert(FACTORY_TEMPLATES.some(t=>t.id===a.template_id),'unknown_template');
 if(present('email'))fassert(fstr(a.email,254)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email),'invalid_email');
 for(const [k,max] of [['objective',4000],['specifications',12000]])if(present(k))fassert(fstr(a[k],max),'invalid_specifications');
 if(present('locale'))fassert(['es','en'].includes(a.locale),'invalid_locale');
 if(present('timezone')){
  fassert(fstr(a.timezone,80),'invalid_timezone');
  try{new Intl.DateTimeFormat('en',{timeZone:a.timezone});}catch{throw ferr('invalid_timezone')}
 }
 for(const k of ['criteria','actions','permissions'])if(present(k)){
  fassert(Array.isArray(a[k])&&a[k].length<=40&&a[k].every(x=>fstr(x,500))&&new Set(a[k]).size===a[k].length,'invalid_'+k);
  if(k!=='permissions')fassert(a[k].length>0,'empty_acceptance_criteria');
 }
 if(present('integrations'))fassert(Array.isArray(a.integrations)&&a.integrations.length<=20&&a.integrations.every(x=>fplain(x)&&Object.keys(x).every(k=>['name','authorization_ref'].includes(k))&&fstr(x.name,80)&&fstr(x.authorization_ref,160)),'invalid_integrations');
 if(present('limits'))fassert(fplain(a.limits)&&Object.keys(a.limits).length===2&&Number.isSafeInteger(a.limits.daily_calls)&&a.limits.daily_calls>=1&&a.limits.daily_calls<=20&&Number.isSafeInteger(a.limits.max_repairs)&&a.limits.max_repairs>=1&&a.limits.max_repairs<=5,'invalid_limits');
 return {missing};
}
export async function receiveFactoryOrder(db,envelope,secret,now=Date.now()){
 const {body,timestamp,signature}=envelope;
 fassert(typeof body==='string'&&new TextEncoder().encode(body).length<=32000,'payload_too_large',413);
 fassert(Number.isSafeInteger(timestamp)&&Math.abs(now-timestamp)<=300000,'expired_signature',401);
 const expected=await factorySign(secret,body,timestamp);
 fassert(typeof signature==='string'&&/^[a-f0-9]{64}$/.test(signature),'invalid_signature',401);
 let diff=0;for(let i=0;i<64;i++)diff|=expected.charCodeAt(i)^signature.charCodeAt(i);
 fassert(diff===0,'invalid_signature',401);
 let a;try{a=JSON.parse(body)}catch{throw ferr('invalid_json')}
 const {missing}=validateFactoryOrder(a),payload=JSON.stringify(canonical(a)),hash=await fhash(payload);
 const previous=await fq(db,'SELECT * FROM factory_orders WHERE id=?',a.id).first();
 if(previous){
  fassert(previous.customer_id===a.customer_id,'conflicting_order',409);
  if(previous.payload_hash===hash)return {id:a.id,status:previous.status,duplicate:true};
  // Only missing fields can be supplied later. Existing approved fields are immutable.
  const old=JSON.parse(previous.payload);
  fassert(previous.status==='needs_input'&&Object.keys(old).every(k=>JSON.stringify(canonical(old[k]))===JSON.stringify(canonical(a[k]))),'conflicting_order',409);
  const status=missing.length?'needs_input':'received';
  const [changed]=await db.batch([
   fq(db,'UPDATE factory_orders SET payload=?,payload_hash=?,status=?,max_attempts=?,error_code=?,updated_at=? WHERE id=? AND status=\'needs_input\' AND payload_hash=?',payload,hash,status,1+(a.limits?.max_repairs??3),missing.length?'missing:'+missing.join(','):null,now,a.id,previous.payload_hash),
   freception(db,a.id,hash,status,{missing,completed_missing_fields:true},now)
  ]);
  fassert(changed.meta.changes===1,'conflicting_order',409);
  return {id:a.id,status,missing,duplicate:false};
 }
 const status=missing.length?'needs_input':'received';
 const [inserted]=await db.batch([
  fq(db,'INSERT INTO factory_orders(id,customer_id,payload,payload_hash,status,max_attempts,error_code,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING',a.id,a.customer_id,payload,hash,status,1+(a.limits?.max_repairs??3),missing.length?'missing:'+missing.join(','):null,now,now),
  freception(db,a.id,hash,status,{missing},now)
 ]);
 if(!inserted.meta.changes){const saved=await fq(db,'SELECT * FROM factory_orders WHERE id=?',a.id).first();fassert(saved.payload_hash===hash,'conflicting_order',409);return {id:a.id,status:saved.status,duplicate:true};}
 return {id:a.id,status,missing,duplicate:false,receipt:'factory:'+a.id};
}
function validReport(report,agent,order){
 const names=[...FACTORY_CHECKS,...order.criteria.map((_,i)=>'criterion:'+i)];
 return fplain(report)&&report.agent_id===agent.id&&report.order_id===order.id&&report.revision===agent.revision&&Array.isArray(report.checks)&&
 names.every(name=>report.checks.filter(c=>c.name===name).length===1&&report.checks.some(c=>c.name===name&&c.passed===true&&fstr(c.evidence,2000)));
}
export async function runFactoryOrder(db,id,adapters,now=Date.now()){
 const lease=crypto.randomUUID(),start=Date.now(),clock=()=>now+Date.now()-start;
 const acquired=await fq(db,"UPDATE factory_orders SET lease=?,lease_until=?,updated_at=? WHERE id=? AND lease_until<=? AND next_attempt_at<=? AND status IN ('received','configured','repairing','certified','active','delivery_pending')",lease,now+60000,now,id,now,now).run();
 if(!acquired.meta.changes)return {status:'not_acquired'};
 const saved=await fq(db,'SELECT * FROM factory_orders WHERE id=? AND lease=?',id,lease).first();
 const order=JSON.parse(saved.payload);
 const checkpoint=async(status,field,value,extra={})=>{
  fassert(['agent','report','access','delivery'].includes(field),'invalid_checkpoint');
  const at=clock();
  const result=await fq(db,`UPDATE factory_orders SET status=?,${field}=?,attempt=?,next_attempt_at=?,error_code=?,updated_at=? WHERE id=? AND lease=? AND lease_until>?`,status,JSON.stringify(value),extra.attempt??saved.attempt,extra.next??0,extra.error??null,at,id,lease,at).run();
  fassert(result.meta.changes===1,'lease_lost',409);
 };
 let stage='fabrication';
 try{
  let agent=saved.agent?JSON.parse(saved.agent):null;
  if(!agent||saved.status==='repairing'){
   fassert(typeof adapters?.configure==='function','provisioner_not_configured',503);
   agent=await adapters.configure(order,{previous:agent,report:saved.report?JSON.parse(saved.report):null,idempotencyKey:`${id}:configure:${saved.attempt}`});
   fassert(fplain(agent)&&fid(agent.id)&&agent.customer_id===order.customer_id&&agent.order_id===id&&agent.template_id===order.template_id&&agent.revision===saved.attempt+1&&JSON.stringify(canonical(agent.permissions))===JSON.stringify(canonical(order.permissions)),'invalid_provisioning_identity',409);
   await checkpoint('configured','agent',agent);
   await fevent(db,id,stage,'configured',{agent_id:agent.id,revision:agent.revision},clock());
  }
  let report=saved.report?JSON.parse(saved.report):null;
  if(!validReport(report,agent,order)){
   stage='certification';
   fassert(typeof adapters.test==='function','certifier_not_configured',503);
   report=await adapters.test(agent,order);
   // Retain only bounded, documented diagnostic data from trusted certifiers.
   fassert(fplain(report)&&JSON.stringify(report).length<=40000,'invalid_test_report');
   if(!validReport(report,agent,order)){
    const attempt=saved.attempt+1,exhausted=attempt>=saved.max_attempts;
    await checkpoint(exhausted?'needs_review':'repairing','report',report,{attempt,next:clock()+60000,error:'certification_failed'});
    await fevent(db,id,'adjustments',exhausted?'needs_review':'repairing',{attempt,failed:report.checks?.filter(c=>c.passed!==true).map(c=>c.name)||[]},clock());
    return {id,status:exhausted?'needs_review':'repairing'};
   }
   await checkpoint('certified','report',report);
   await fevent(db,id,stage,'passed',{agent_id:agent.id,revision:agent.revision},clock());
  }
  stage='activation';
  let access=saved.access?JSON.parse(saved.access):null;
  if(!access){
   fassert(typeof adapters.activate==='function','cabin_not_configured',503);
   access=await adapters.activate(agent,order,{idempotencyKey:id+':activate'});
   let u;try{u=new URL(access?.url)}catch{throw ferr('invalid_cabin_url')}
   fassert(u.protocol==='https:'&&u.origin===adapters.customerOrigin&&!u.username&&!u.password&&!u.hash&&access.customer_id===order.customer_id&&access.agent_id===agent.id&&access.order_id===id&&access.verified===true,'invalid_cabin_identity',409);
   await checkpoint('active','access',access);
   await fevent(db,id,stage,'active',{agent_id:agent.id},clock());
  }
  stage='delivery';
  // A checkpoint records pending delivery before any external mail call.
  await checkpoint('delivery_pending','access',access);
  fassert(adapters.mail?.idempotencySupported===true&&typeof adapters.mail.send==='function','mail_not_configured',503);
  const delivery=await adapters.mail.send({to:order.email,order_id:id,agent_id:agent.id,access_url:access.url,locale:order.locale},{idempotencyKey:id+':delivery:v1'});
  fassert(delivery?.status==='accepted'&&fstr(delivery.provider_id,200),'mail_unconfirmed',502);
  await checkpoint('email_accepted','delivery',{status:'accepted',provider_id:delivery.provider_id,at:clock()});
  await fevent(db,id,stage,'email_accepted',{provider_id:delivery.provider_id},clock());
  return {id,status:'email_accepted'};
 }catch(e){
  // Providers may expose credentials in exceptions. Store only an internal allowlisted code.
  const known=['provisioner_not_configured','certifier_not_configured','cabin_not_configured','mail_not_configured','invalid_provisioning_identity','invalid_test_report','invalid_cabin_url','invalid_cabin_identity','mail_unconfirmed','lease_lost'];
  const code=known.includes(e.code)?e.code:'stage_unconfirmed';
  const at=clock();
  const failures=saved.failures+1;
  const configured=code.endsWith('_not_configured');
  const status=configured?'blocked_configuration':failures>=saved.max_attempts?(stage==='delivery'?'delivery_failed':'needs_review'):null;
  const result=await fq(db,"UPDATE factory_orders SET status=COALESCE(?,status),failures=?,error_code=?,next_attempt_at=?,updated_at=? WHERE id=? AND lease=? AND lease_until>?",status,failures,code,at+Math.min(3600000,60000*2**Math.min(failures-1,6)),at,id,lease,at).run();
  if(result.meta.changes)await fevent(db,id,stage,'blocked',{code},at);
  return {id,status:status||'retry_pending',code};
 }finally{await fq(db,'UPDATE factory_orders SET lease=NULL,lease_until=0 WHERE id=? AND lease=?',id,lease).run()}
}
export async function factoryBoard(db,env){
 const orders=(await fq(db,'SELECT id,status,attempt,max_attempts,error_code,created_at,updated_at FROM factory_orders ORDER BY created_at DESC LIMIT 100').all()).results;
 const counts=(await fq(db,'SELECT status,count(*) AS count FROM factory_orders GROUP BY status').all()).results;
 return {orders,counts,templates:FACTORY_TEMPLATES,release:{ready:false,scope:'development',blockers:[
  ...(!env.FACTORY_WEBHOOK_SECRET?['webhook_credentials']:[]),
  'tenant_runtime_certification','cloud_computer_adapter','per_client_cabin_activation','delivery_provider','end_to_end_production_evidence'
 ]}};
}
export async function factoryRoute(request,env){
 const url=new URL(request.url),path=url.pathname;
 try{
  fassert(env.DB,'storage_unavailable',503);
  if(path==='/internal/factory/orders'){
   fassert(env.FACTORY_ENABLED==='true','factory_not_enabled',503);
   fassert(request.method==='POST','method_not_allowed',405);
   fassert(request.headers.get('content-type')?.startsWith('application/json'),'content_type_required',415);
   // Stream limit prevents oversized bodies from exhausting a Worker isolate.
   const reader=request.body?.getReader();fassert(reader,'empty_body');let size=0;const chunks=[];
   for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>32000){await reader.cancel();throw ferr('payload_too_large',413)}chunks.push(value)}
   const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
   const result=await receiveFactoryOrder(env.DB,{body:new TextDecoder().decode(bytes),timestamp:Number(request.headers.get('x-factory-timestamp')),signature:request.headers.get('x-factory-signature')},env.FACTORY_WEBHOOK_SECRET);
   return fjson(result,result.duplicate?200:202);
  }
  fassert(request.headers.get('oai-authenticated-user-id'),'sign_in_required',401);
  if(path==='/api/factory/release'&&request.method==='GET')return fjson({release:'factory-bugfix-20261029',fixes:['partial_order_validation','repair_budget','atomic_order_receipt'],manufacturing_enabled:env.FACTORY_ENABLED==='true',certified:false});
  fassert(factoryOperator(request,env),'operator_required',403);
  if(!['GET','HEAD'].includes(request.method))fassert(request.headers.get('origin')===url.origin,'origin_not_allowed',403);
  if(path==='/api/factory/resume'&&request.method==='POST'){
   const body=await request.text();fassert(body.length<=1000,'payload_too_large',413);
   let a;try{a=JSON.parse(body)}catch{throw ferr('invalid_json')}
   fassert(fplain(a)&&Object.keys(a).length===1&&fid(a.id),'invalid_id');
   const result=await fq(env.DB,"UPDATE factory_orders SET status=CASE WHEN access IS NOT NULL THEN 'delivery_pending' WHEN agent IS NOT NULL THEN 'configured' ELSE 'received' END,error_code=NULL,next_attempt_at=0,updated_at=? WHERE id=? AND status='blocked_configuration' AND lease_until<=?",Date.now(),a.id,Date.now()).run();
   fassert(result.meta.changes===1,'order_not_resumable',409);
   await fevent(env.DB,a.id,'operation','resumed_after_configuration',{},Date.now());
   return fjson({id:a.id,resumed:true});
  }
  if(path==='/api/factory/board'&&request.method==='GET')return fjson(await factoryBoard(env.DB,env));
  if(path==='/api/factory/order'&&request.method==='GET'){
   const id=url.searchParams.get('id');fassert(fid(id),'invalid_id');
   const order=await fq(env.DB,'SELECT id,status,report,error_code,attempt,max_attempts,created_at,updated_at FROM factory_orders WHERE id=?',id).first();
   fassert(order,'order_not_found',404);
   const events=(await fq(env.DB,'SELECT stage,outcome,detail,created_at FROM factory_events WHERE order_id=? ORDER BY created_at,id LIMIT 200',id).all()).results;
   return fjson({order,events});
  }
  return fjson({error:'route_not_found'},404);
 }catch(e){return fjson({error:e.code||'factory_unavailable'},e.status||503)}
}

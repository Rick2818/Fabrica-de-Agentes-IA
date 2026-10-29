// Independent prototype. Not imported by the published Site runtime.
// D1-compatible persistence; adapters must be trusted server implementations.
export const SPECIALTIES = ['sales','support','finance','pharma','logistics','marketing'];
export const REQUIRED_CHECKS = ['scope','identity_isolation','permissions','memory','task_recovery','tool_errors',
 'plan_execute_review','background_continuity','wake_resume','saved_schedules','parallel_work',
 'steering','pause_cancel','progress_notifications','authorized_integrations'];
const fail = message => { throw new Error(message); };
const query = (db, sql, ...args) => db.prepare(sql).bind(...args);
const digest = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');
export const SCHEMA = `CREATE TABLE IF NOT EXISTS factory_bridge_orders (
 id TEXT PRIMARY KEY, merchant TEXT NOT NULL, customer_id TEXT NOT NULL,
 payload TEXT NOT NULL, payload_hash TEXT NOT NULL, status TEXT NOT NULL,
 agent TEXT, report TEXT, delivery TEXT, last_error TEXT, lease TEXT, lease_until INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);`;

export async function signEnvelope(secret, body, timestamp) {
 if(typeof secret!=='string'||secret.length<32) fail('Bridge credential unavailable');
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('factory-order-v1\n'+timestamp+'\n'+body)))).map(x=>x.toString(16).padStart(2,'0')).join('');
}

export async function receiveOrder(db, {body,timestamp,signature}, {secret,merchant}, now=Date.now()) {
 if(typeof merchant!=='string'||!merchant.trim())fail('Merchant identity required');
 if(!Number.isSafeInteger(timestamp)||Math.abs(now-timestamp)>300000||typeof body!=='string'||body.length>12000) fail('Invalid envelope');
 const expected=await signEnvelope(secret,body,timestamp);
 if(typeof signature!=='string'||!/^[a-f0-9]{64}$/.test(signature)) fail('Invalid signature');
 let different=0;for(let i=0;i<64;i++)different|=signature.charCodeAt(i)^expected.charCodeAt(i);
 if(different)fail('Invalid signature');
 const a=JSON.parse(body);
 const fields=['id','customer_id','specialty','objective','email','permissions','integrations'];
 if(!a||Object.keys(a).some(k=>!fields.includes(k))||fields.some(k=>!(k in a)))fail('Invalid order fields');
 if(!/^[a-zA-Z0-9_-]{8,80}$/.test(a.id)||!/^customer_[a-zA-Z0-9_-]{1,80}$/.test(a.customer_id)||!SPECIALTIES.includes(a.specialty)||typeof a.objective!=='string'||a.objective.trim().length<10||a.objective.length>4000||typeof a.email!=='string'||a.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email))fail('Invalid order');
 if(!Array.isArray(a.permissions)||a.permissions.some(x=>!['read_provided_data','draft'].includes(x))||new Set(a.permissions).size!==a.permissions.length)fail('Permission requires separate approval');
 if(!Array.isArray(a.integrations)||a.integrations.some(x=>!['gmail','calendar'].includes(x))||new Set(a.integrations).size!==a.integrations.length)fail('Invalid integrations');
 // Never accept passwords, OAuth tokens, prices, payment states, or tenant IDs.
 const payload=JSON.stringify(Object.fromEntries(fields.map(k=>[k,a[k]]))),hash=await digest(payload);
 await query(db,`INSERT INTO factory_bridge_orders(id,merchant,customer_id,payload,payload_hash,status,created_at,updated_at) VALUES(?,?,?,?,?,'received',?,?) ON CONFLICT(id) DO NOTHING`,a.id,merchant,a.customer_id,payload,hash,now,now).run();
 const saved=await query(db,'SELECT * FROM factory_bridge_orders WHERE id=?',a.id).first();
 if(saved.merchant!==merchant||saved.customer_id!==a.customer_id||saved.payload_hash!==hash)fail('Conflicting order identifier');
 return {id:saved.id,status:saved.status,receipt:'factory:'+saved.id,payload_hash:hash};
}

export async function customerStatus(db,id,principal) {
 if(!principal?.merchant||!principal?.customer_id)fail('Identity required');
 const o=await query(db,'SELECT * FROM factory_bridge_orders WHERE id=? AND merchant=? AND customer_id=?',id,principal.merchant,principal.customer_id).first();
 if(!o)fail('Order not found');
 // Customer view contains no factory URL, internal reports, credentials or email access link.
 return {id:o.id,status:o.status,pending_connections:JSON.parse(o.payload).integrations};
}

function qualityReport(report,agent,order) {
 if(report?.agent_id!==agent.id||report?.order_id!==order.id||!Array.isArray(report.checks))return false;
 return REQUIRED_CHECKS.every(name=>report.checks.filter(c=>c.name===name).length===1&&report.checks.some(c=>c.name===name&&c.passed===true&&typeof c.evidence==='string'&&c.evidence.length>0));
}

export async function runOrder(db,id,adapters,now=Date.now()) {
 const started=Date.now(),clock=()=>now+Date.now()-started;
 const token=crypto.randomUUID();
 const acquired=await query(db,`UPDATE factory_bridge_orders SET lease=?,lease_until=?,updated_at=? WHERE id=? AND lease_until<=? AND status NOT IN ('email_accepted','needs_review')`,token,now+60000,now,id,now).run();
 if(!acquired.meta.changes)return {status:'not_acquired'};
 let order=await query(db,'SELECT * FROM factory_bridge_orders WHERE id=? AND lease=?',id,token).first();
 const payload=JSON.parse(order.payload);
 // Provisioner and sender must implement their own durable idempotency keys.
 // Checkpoints avoid repeating successful stages after process restarts.
 const save=async(status,field,value)=>{
  if(!['agent','report','delivery'].includes(field))fail('Invalid checkpoint');
  const at=clock();
  const r=await query(db,`UPDATE factory_bridge_orders SET status=?,${field}=?,last_error=NULL,updated_at=? WHERE id=? AND lease=? AND lease_until>?`,status,JSON.stringify(value),at,id,token,at).run();
  if(!r.meta.changes)fail('Lease lost');
 };
 try {
  let agent=order.agent?JSON.parse(order.agent):null;
  if(!agent){
   agent=await adapters.configure(payload,{idempotencyKey:id+':configure:v1'});
   if(!agent||typeof agent.id!=='string'||!agent.id||agent.order_id!==id||agent.specialty!==payload.specialty||agent.customer_id!==payload.customer_id||JSON.stringify(agent.permissions)!==JSON.stringify(payload.permissions))fail('Provisioning identity or permissions mismatch');
   await save('configured','agent',agent);
  }
  let report=order.report?JSON.parse(order.report):null;
  if(!qualityReport(report,agent,payload)){
   report=await adapters.test(agent,payload);
   if(!qualityReport(report,agent,payload)){
    await save('needs_review','report',report??{error:'missing_report'});
    return {id,status:'needs_review'};
   }
   await save('tested','report',report);
  }
  // Access is provisioned per customer. Nothing sent until every check passes.
  const access=await adapters.access(agent,payload,{idempotencyKey:id+':access:v1'});
  const u=new URL(access.url);
  if(u.protocol!=='https:'||u.origin!==adapters.customerOrigin||u.username||u.password||access.customer_id!==payload.customer_id||access.order_id!==id)fail('Invalid customer access');
  if(adapters.mail.idempotencySupported!==true)fail('Mail provider requires reconciliation before retry');
  const delivery=await adapters.mail.send({to:payload.email,order_id:id,agent_id:agent.id,access_url:u.href,pending_connections:payload.integrations},{idempotencyKey:id+':delivery:v1'});
  if(!delivery||delivery.status!=='accepted'||typeof delivery.provider_id!=='string'||!delivery.provider_id)fail('Mail acceptance not confirmed');
  await save('email_accepted','delivery',{provider_id:delivery.provider_id,status:'accepted',order_id:id});
  return {id,status:'email_accepted',provider_id:delivery.provider_id};
 } catch(error){
  // No exception content persisted: providers may include secrets or user data.
  await query(db,"UPDATE factory_bridge_orders SET last_error='stage_unconfirmed',updated_at=? WHERE id=? AND lease=?",now,id,token).run();
  throw error;
 } finally {
  await query(db,'UPDATE factory_bridge_orders SET lease=NULL,lease_until=0 WHERE id=? AND lease=?',id,token).run();
 }
}

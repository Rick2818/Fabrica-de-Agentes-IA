import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {SCHEMA,REQUIRED_CHECKS,receiveOrder,signEnvelope,customerStatus,runOrder} from '../bridge/order-pipeline.mjs';
class DB {
 constructor(path){this.db=new DatabaseSync(path);this.db.exec(SCHEMA)}
 prepare(sql){const db=this.db;return{args:[],bind(...args){this.args=args;return this},async first(){return db.prepare(sql).get(...this.args)||null},async run(){const r=db.prepare(sql).run(...this.args);return {meta:{changes:r.changes}}}}}
 close(){this.db.close()}
}
const dir=mkdtempSync(join(tmpdir(),'factory-bridge-')),path=join(dir,'test.db');
let db=new DB(path);const checks=[];
const config={secret:'synthetic-bridge-secret-32-characters-only',merchant:'boltech-test'},now=1793234400000;
const payload={id:'TEST-20261028-0001',customer_id:'customer_test_a',specialty:'sales',objective:'Calificar solicitudes sintéticas y preparar borradores.',email:'client@example.invalid',permissions:['read_provided_data','draft'],integrations:['gmail','calendar']};
async function envelope(a=payload,timestamp=now){const body=JSON.stringify(a);return {body,timestamp,signature:await signEnvelope(config.secret,body,timestamp)}}
async function test(name,fn){await fn();checks.push(name);console.log('OK: '+name)}
const agent={id:'synthetic-agent-1',order_id:payload.id,customer_id:payload.customer_id,specialty:payload.specialty,permissions:payload.permissions};
let configured=0,tests=0,sent=0,failMail=true;const inbox=new Map();
const adapters={customerOrigin:'https://customer.example.invalid',
 async configure(p,options){configured++;assert.equal(options.idempotencyKey,p.id+':configure:v1');return agent},
 async test(a,p){tests++;return {agent_id:a.id,order_id:p.id,checks:REQUIRED_CHECKS.map(name=>({name,passed:true,evidence:'synthetic-harness:'+name}))}},
 async access(a,p){return {url:'https://customer.example.invalid/activate/example-test-only',customer_id:p.customer_id,order_id:p.id}},
 mail:{idempotencySupported:true,async send(message,{idempotencyKey}){sent++;assert.equal(message.order_id,payload.id);assert.equal(message.to,payload.email);assert.deepEqual(message.pending_connections,['gmail','calendar']);if(!inbox.has(idempotencyKey))inbox.set(idempotencyKey,{message,provider_id:'synthetic-mail-1'});if(failMail){failMail=false;throw Error('simulated timeout after provider accepted')}return {status:'accepted',provider_id:inbox.get(idempotencyKey).provider_id}}}
};
try{
 await test('Signed order received with the same management number',async()=>{const r=await receiveOrder(db,await envelope(),config,now);assert.equal(r.id,payload.id);assert.equal(r.status,'received')});
 await test('Retry persists one order; changed content rejected',async()=>{await receiveOrder(db,await envelope(),config,now);assert.equal(db.db.prepare('SELECT count(*) AS n FROM factory_bridge_orders').get().n,1);await assert.rejects(receiveOrder(db,await envelope({...payload,objective:'Un objetivo distinto y conflictivo.'}),config,now),/Conflicting/)});
 await test('Invalid signatures, expired envelopes and secrets in payload rejected',async()=>{await assert.rejects(receiveOrder(db,{...await envelope(),signature:'a'.repeat(64)},config,now),/signature/);await assert.rejects(receiveOrder(db,await envelope(payload,now-300001),config,now),/envelope/);await assert.rejects(receiveOrder(db,await envelope({...payload,oauth_token:'not-allowed'}),config,now),/fields/)});
 await test('Customer cannot retrieve another customer or merchant order',async()=>{await assert.rejects(customerStatus(db,payload.id,{merchant:config.merchant,customer_id:'customer_test_b'}),/not found/);await assert.rejects(customerStatus(db,payload.id,{merchant:'other',customer_id:payload.customer_id}),/not found/)});
 await test('Configuration and quality checks persist before uncertain delivery',async()=>{await assert.rejects(runOrder(db,payload.id,adapters,now+1),/timeout/);const r=db.db.prepare('SELECT * FROM factory_bridge_orders').get();assert.equal(r.status,'tested');assert.equal(r.delivery,null);assert.equal(inbox.size,1);assert.equal(configured,1);assert.equal(tests,1)});
 db.close();db=new DB(path);
 await test('Restart and retry recover one agent and one synthetic email',async()=>{const r=await runOrder(db,payload.id,adapters,now+2);assert.equal(r.status,'email_accepted');assert.equal(configured,1);assert.equal(tests,1);assert.equal(inbox.size,1);assert.equal(sent,2);assert.equal((await runOrder(db,payload.id,adapters,now+3)).status,'not_acquired')});
 await test('Customer recovers status by original management number without factory internals',async()=>{const s=await customerStatus(db,payload.id,{merchant:config.merchant,customer_id:payload.customer_id});assert.deepEqual(s,{id:payload.id,status:'email_accepted',pending_connections:['gmail','calendar']});assert(!JSON.stringify(s).includes('activate'));assert(!JSON.stringify(s).includes('report'))});
 await test('A failed quality check blocks delivery',async()=>{const p={...payload,id:'TEST-20261028-0002'};await receiveOrder(db,await envelope(p),config,now);const r=await runOrder(db,p.id,{...adapters,async configure(){return {...agent,order_id:p.id}},async test(){return {agent_id:agent.id,order_id:p.id,checks:[{name:'scope',passed:false,evidence:'synthetic-failure'}]}}},now+4);assert.equal(r.status,'needs_review');assert.equal(inbox.size,1)});
 await test('No delivery when provisioner expands permissions',async()=>{const p={...payload,id:'TEST-20261028-0003'};await receiveOrder(db,await envelope(p),config,now);await assert.rejects(runOrder(db,p.id,{...adapters,async configure(){return {...agent,order_id:p.id,permissions:['send_email']}}},now+5),/mismatch/);assert.equal(inbox.size,1)});
 const evidence={at:new Date().toISOString(),passed:checks.length,scope:'Integrated local pipeline with real SQLite persistence and synthetic provisioner, quality evaluator, access and mail adapters. No deployed bridge, real agent creation, OAuth consent, email delivery, sale, charge or production change.',management_number:payload.id,synthetic_emails:inbox.size,checks};
 writeFileSync('evidence/order-pipeline-synthetic-20261028.json',JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
}finally{db.close();rmSync(dir,{recursive:true,force:true})}

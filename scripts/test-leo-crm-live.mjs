// Read the bridge credential from hidden PTY stdin. Never write it to disk/output.
import {createInterface} from 'node:readline';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
console.log('Ready for CRM test JSON on stdin (input is hidden).');
const rl=createInterface({input:process.stdin,output:process.stdout,terminal:true});
rl._writeToOutput=()=>{};
const line=await new Promise(resolve=>rl.once('line',resolve));rl.close();
const {key}=JSON.parse(line),checks=[];
const base='https://udispwzwrebjkanudcoy.supabase.co/functions/v1/leo-crm';
async function call(action,data={},who='a',override={}){return fetch(base,{method:'POST',signal:AbortSignal.timeout(25000),headers:{'content-type':'application/json','x-leo-bridge-key':key},body:JSON.stringify({site_id:'appgprj_6adbf0c05a0c8191b2ca585b76f5e862',user_id:'crm-test-'+who+'-20261027',email:'crm-test-'+who+'@example.invalid',action,data,...override})});}
const a=await call('status');assert.equal(a.status,200,await a.clone().text());assert.equal((await a.json()).connected,true);checks.push('live authenticated bridge and scoped membership');
assert.equal((await call('status',{},'unknown')).status,403);checks.push('unapproved identity denied');
assert.equal((await call('status',{},'a',{user_id:'impostor'})).status,403);checks.push('email cannot replace bound identity');
const id=crypto.randomUUID(),data={id,customer:'PRUEBA SINTÉTICA CRM',title:'Pedido de prueba, sin venta',details:'Prueba autorizada de integración; se eliminará.',total:'12.34',currency:'USD'};
const created=await call('create_order',data);assert.equal(created.status,200,await created.clone().text());const order=(await created.json()).order;assert.equal(order.status,'draft');assert.equal(Number(order.total),12.34);checks.push('contact, opportunity, draft order and activity written atomically');
const retry=await call('create_order',data);assert.equal(retry.status,200,await retry.clone().text());const replay=await retry.json();assert.equal(replay.replayed,true);assert.equal(replay.order.order_number,order.order_number);checks.push('retry returns same order number');
assert.equal((await call('create_order',{...data,total:'99'})).status,409);checks.push('changed retry payload rejected');
const found=await call('get_order',{order_number:String(order.order_number)});assert.equal(found.status,200);assert.equal((await found.json()).order.contact.full_name,data.customer);checks.push('order read back with associated contact');
assert.equal((await call('get_order',{order_number:String(order.order_number)},'b')).status,404);const b=await call('list',{},'b');assert.equal((await b.json()).orders.length,0);checks.push('other company cannot list or retrieve order');
assert.equal((await call('create_order',{...data,id:crypto.randomUUID()},'viewer')).status,403);checks.push('read-only member cannot create orders');
const list=await call('list');assert.equal((await list.json()).orders.filter(x=>x.id===id).length,1);checks.push('one persisted order after retry');
const unauthorized=await fetch(base,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'list'})});assert.equal(unauthorized.status,401);checks.push('public unauthenticated function request denied');
const evidence={at:new Date().toISOString(),status:'passed',scope:'Synthetic fixtures only; no messages, sales or payments',order_number:order.order_number,request_id:id,checks,cleanup:'pending'};
writeFileSync('evidence/leo-crm-live-2026-10-27.json',JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));

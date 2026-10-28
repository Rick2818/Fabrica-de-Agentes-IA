import assert from 'node:assert/strict';
import {runCloudQueue,SITE_ORIGIN,REPOSITORY} from './run-cloud-queue.mjs';

const context={provider:'github-actions',repository:REPOSITORY,repository_id:'1432658222',run_id:'123456',run_attempt:'1',event:'schedule',commit_sha:'a'.repeat(40)};
const config={origin:SITE_ORIGIN,bearer:'test-service-bearer',key:'test-runner-key',context};
const response=(status,pending=1,next_at=null,github=context)=>new Response(JSON.stringify({run:{status,...(['done','cancelled'].includes(status)?{id:'job-test'}:{})},receipt:{status,source:'github-actions',github,pending,next_at,started_at:900,completed_at:1000,job_id:['done','cancelled'].includes(status)?'job-test':null}}));
let passed=0;
async function test(name,fn){await fn();passed++;console.log('OK: '+name);}

await test('Destino y contexto inválidos no transmiten credenciales',async()=>{let calls=0;for(const c of [{...config,origin:'https://other.test'},{...config,context:{...context,repository_id:'other'}},{...config,bearer:''}])await assert.rejects(()=>runCloudQueue(c,{fetcher:async()=>{calls++;}}));assert.equal(calls,0);});
await test('Pausa, cuota y fecha futura terminan sin esperar ni repetir',async()=>{for(const status of ['paused','quota','waiting','needs_input','idle']){let calls=0;const r=await runCloudQueue(config,{fetcher:async()=>{calls++;return response(status,2,999999);},sleep:()=>{throw Error('No debe esperar');},now:()=>1000});assert.equal(r.status,status);assert.equal(calls,1);}});
await test('Un ciclo ajeno no se acredita como propio',async()=>{await assert.rejects(()=>runCloudQueue(config,{fetcher:async()=>response('done',0,null,{...context,run_id:'999'})}),/recibo válido/);});
await test('No sigue redirecciones y envía secretos solo al origen autorizado',async()=>{await runCloudQueue(config,{fetcher:async(url,init)=>{assert.equal(url,SITE_ORIGIN+'/internal/runner');assert.equal(init.redirect,'manual');assert.equal(init.headers['OAI-Sites-Authorization'],'Bearer '+config.bearer);assert.equal(init.headers['x-agent-runner-key'],config.key);assert.deepEqual(JSON.parse(init.body),context);return response('idle',0);}});});
await test('HTTP o estados fallidos detienen el ciclo',async()=>{await assert.rejects(()=>runCloudQueue(config,{fetcher:async()=>new Response('',{status:403})}),/HTTP 403/);for(const status of ['failed','error','unconfigured'])await assert.rejects(()=>runCloudQueue(config,{fetcher:async()=>response(status)}),/detenida/);});
await test('Error temporal recupera la cola sin acreditar tarea completada',async()=>{let calls=0,waits=0;const r=await runCloudQueue(config,{fetcher:async()=>{calls++;return calls<3?response('error',6):response('waiting',6,999999)},sleep:async()=>{waits++},now:()=>1000});assert.equal(calls,3);assert.equal(waits,2);assert.equal(r.status,'waiting');assert.equal(r.phases,0);});
await test('Error persistente queda diferido sin declarar éxito funcional',async()=>{let calls=0;const r=await runCloudQueue(config,{fetcher:async()=>{calls++;return response('error',6)},sleep:async()=>{},now:()=>1000});assert.equal(calls,3);assert.equal(r.deferred,true);assert.equal(r.status,'error');assert.equal(r.phases,0);});
await test('Ocho fases o dieciséis llamadas acotan los ciclos',async()=>{let calls=0;let r=await runCloudQueue(config,{fetcher:async()=>{calls++;return response('done');},now:()=>1000});assert.equal(calls,8);assert.equal(r.phases,8);calls=0;r=await runCloudQueue(config,{fetcher:async()=>{calls++;return response('busy');},now:()=>1000});assert.equal(calls,16);assert.equal(r.phases,0);});
await test('Solo espera fechas dentro de treinta segundos y respeta el presupuesto',async()=>{let waits=0,calls=0;await runCloudQueue(config,{fetcher:async()=>{calls++;return response('busy',1,31001);},sleep:async()=>{waits++;},now:()=>1000});assert.equal(calls,1);assert.equal(waits,0);let clock=1000;calls=0;await runCloudQueue(config,{fetcher:async()=>{calls++;return calls===1?response('busy',1,2000):response('idle',0);},sleep:async ms=>{waits++;clock+=ms;},now:()=>clock});assert.equal(calls,2);assert.equal(waits,1);clock=0;calls=0;await runCloudQueue(config,{fetcher:async()=>{calls++;clock=230000;return response('busy',1,240000);},sleep:async()=>{throw Error('Presupuesto agotado');},now:()=>clock});assert.equal(calls,1);});
await test('Herramientas guardadas retoman redacción en el mismo trabajador sin omitir la espera',async()=>{
 let clock=1000,calls=0,waits=0;const r=await runCloudQueue(config,{now:()=>clock,sleep:async ms=>{waits++;clock+=ms},fetcher:async()=>{calls++;return calls===1?Response.json({run:{status:'waiting',reason:'tools_saved'},receipt:{status:'waiting',source:'github-actions',github:context,pending:1,next_at:14000,started_at:900,completed_at:1000}}):response('done',0)}});assert.equal(r.status,'done');assert.equal(r.phases,1);assert.equal(calls,2);assert.equal(waits,1);assert(clock>=14000);
});
await test('Estado desconocido con cola vacía no se acredita como éxito',async()=>{
 await assert.rejects(()=>runCloudQueue(config,{fetcher:async()=>response('invented',0),now:()=>1000}),/recibo válido/);
});
await test('Commit, repositorio, estado y tiempos del recibo deben coincidir',async()=>{
 const base=await response('done',0).json();
 const invalid=[
  {...base,receipt:{...base.receipt,github:{...context,commit_sha:'b'.repeat(40)}}},
  {...base,receipt:{...base.receipt,github:{...context,repository:'another/repo'}}},
  {...base,receipt:{...base.receipt,status:'idle'}},
  {...base,receipt:{...base.receipt,started_at:2000}},
  {...base,receipt:{...base.receipt,completed_at:9999999}},
  {...base,receipt:{...base.receipt,job_id:'another-job'}},
  {...base,receipt:{...base.receipt,next_at:-1}}
 ];
 for(const value of invalid)await assert.rejects(()=>runCloudQueue(config,{fetcher:async()=>Response.json(value),now:()=>1000}),/recibo válido/);
});
console.log(JSON.stringify({passed,scope:'Ejecutor GitHub con HTTP simulado; no acredita una ejecución de GitHub real.'}));

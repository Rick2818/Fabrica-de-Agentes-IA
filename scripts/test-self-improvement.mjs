import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import worker,{runNext,startTrainingPractice,evaluateTraining,trainingPractice} from '../worker/runtime.mjs';
import {configureSelfImprovement,selfImprovementStatus,selfImprovementGuidance,rollbackSelfImprovement} from '../worker/self-improvement.mjs';
class DB{
 constructor(path=':memory:'){this.db=new DatabaseSync(path)}
 prepare(sql){const db=this.db;return {args:[],bind(...args){this.args=args;return this},async all(){return {results:db.prepare(sql).all(...this.args)}},async first(){return db.prepare(sql).get(...this.args)||null},async run(){const r=db.prepare(sql).run(...this.args);return {meta:{changes:r.changes}}}}}
 async batch(items){this.db.exec('BEGIN');try{const r=[];for(const i of items)r.push(await i.run());this.db.exec('COMMIT');return r}catch(e){this.db.exec('ROLLBACK');throw e}}
}
const migration=['0000_agent.sql','0001_objectives.sql','0002_continuity.sql','0003_task_context.sql'].map(p=>readFileSync(new URL('../drizzle/'+p,import.meta.url),'utf8')).join('\n');
const p={id:'rsi-profile-001',name:'Mila',specialty:'Servicio al cliente',mission:'Responder con evidencia y pedir datos faltantes.',knowledge:'Solo datos ficticios.',tools:'Ninguna escritura externa.',scenario:'SIMULACIÓN: falta información del incidente.',criteria:'Pedir datos y distinguir incertidumbre.',answer:'',assessment:'pending',history:[]};
const cases=[{prompt:'SIMULACIÓN: falta el número de solicitud.',include:['faltan datos'],exclude:['enviado']},{prompt:'SIMULACIÓN: estado de revisión desconocido.',include:['no confirmado'],exclude:['resuelto']}];
const env={GOOGLE_GENERATIVE_AI_API_KEY:'test-only',RSI_OPERATOR_IDS:'operator-test'};
const realFetch=globalThis.fetch,checks=[];let time=Date.now(),calls=0,candidatePass=true,proposalSawHoldout=false;
const output=reply=>Response.json({candidates:[{content:{parts:[{text:JSON.stringify({reply,notes:[],tasks:[]})}]}}]});
globalThis.fetch=async(url,options)=>{
 calls++;assert.match(url,/generativelanguage\.googleapis\.com/);
 const a=JSON.parse(options.body),s=JSON.stringify(a.contents);
 if(s.includes('Proponé únicamente')){proposalSawHoldout=s.includes('número de solicitud')||s.includes('estado de revisión desconocido');return output('Pedí datos faltantes y distinguí estados no confirmados.')}
 if(s.includes('Guía adicional de redacción')){
  const candidate=s.includes('Pedí datos faltantes');
  if(candidate&&candidatePass)return output(s.includes('número de solicitud')?'Faltan datos.':'No confirmado.');
  return output('Información insuficiente para responder.');
 }
 return output('Información insuficiente para responder.');
};
const put=(db,key,value)=>db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key,JSON.stringify(value)).run();
async function seed(db,id){db.db.exec(migration);await put(db,'training_profiles_v1',[p]);await configureSelfImprovement(db,p,{enabled:true,cases});const job=await startTrainingPractice(db,p,id);await runNext(db,env,time+=14000);await evaluateTraining(db,p,{job_id:job.id,assessment:'fail',feedback:'Faltan preguntas esenciales y distinción de incertidumbre.'});}
async function drive(db,n=7){for(let i=0;i<n;i++)await runNext(db,env,time+=14000)}
async function test(name,fn){await fn();checks.push(name);console.log('OK: '+name)}
const dir=mkdtempSync(join(tmpdir(),'rsi-test-')),path=join(dir,'db.sqlite');let db=new DB(path);
try{
 await test('Rechaza una evaluación sin casos independientes',async()=>{await assert.rejects(configureSelfImprovement(db,p,{enabled:true,cases:[cases[0],cases[0]]}),/distintos/)});
 await seed(db,'rsi-source-001');
 await test('Evaluación fallida dispara una propuesta usando la cola existente',async()=>{await runNext(db,env,time+=14000);const s=await selfImprovementStatus(db,p);assert.equal(s.cycles.length,1);assert.equal(s.cycles[0].stage,'proposal');assert.equal(db.db.prepare("SELECT count(*) n FROM jobs WHERE id LIKE 'rsi-%-proposal'").get().n,1);assert.equal(proposalSawHoldout,false)});
 db.db.close();db=new DB(path);
 await test('Reinicia desde disco, compara ambos casos y promueve una mejora estricta',async()=>{await drive(db);const s=await selfImprovementStatus(db,p);assert.equal(s.cycles[0].status,'promoted');assert(s.active.instruction.includes('Pedí datos'));assert.equal(s.cycles[0].results.length,4);assert.equal(s.cycles[0].results.filter(r=>r.kind==='baseline'&&r.passed).length,0);assert.equal(s.cycles[0].results.filter(r=>r.kind==='candidate'&&r.passed).length,2)});
 await test('El mismo fallo no genera ciclos duplicados ni llamadas adicionales',async()=>{const before=calls;await drive(db,2);assert.equal(calls,before);assert.equal((await selfImprovementStatus(db,p)).cycles.length,1)});
 await test('La versión nueva se vincula a prácticas sin alterar misión o herramientas',async()=>{const original=JSON.stringify(p);const job=await startTrainingPractice(db,p,'rsi-after-promotion');assert(job.input.includes('Guía adaptativa de entrenamiento'));assert(job.input.includes('Pedí datos faltantes'));assert.equal(JSON.stringify(p),original);assert.equal((await trainingPractice(db,p)).stale,false)});
 await test('Otra ficha y una ficha modificada no heredan la guía',async()=>{assert.equal(await selfImprovementGuidance(db,{...p,id:'rsi-profile-002'}),null);assert.equal(await selfImprovementGuidance(db,{...p,mission:'Una misión distinta'}),null)});
 await test('Rollback conserva el historial y restaura versión previa',async()=>{assert.equal((await rollbackSelfImprovement(db,p)).rolled_back,true);assert.equal(await selfImprovementGuidance(db,p),null);assert.equal((await selfImprovementStatus(db,p)).cycles[0].status,'promoted');assert.equal((await trainingPractice(db,p)).stale,true)});
 await test('Sin mejora medible se rechaza sin activar instrucciones',async()=>{const local=new DB();candidatePass=false;await seed(local,'rsi-source-no-gain');await drive(local);const s=await selfImprovementStatus(local,p);assert.equal(s.cycles[0].status,'rejected');assert.equal(s.active,null);candidatePass=true;local.db.close()});
 await test('Deshabilitar invalida y cancela trabajo pendiente de mejora',async()=>{const local=new DB();await seed(local,'rsi-source-disable');await runNext(local,env,time+=14000);await configureSelfImprovement(local,p,{enabled:false,cases});const before=calls;await runNext(local,env,time+=14000);assert.equal((await selfImprovementStatus(local,p)).cycles[0].status,'invalidated');assert.equal(calls,before);local.db.close()});
 await test('Cuota agotada conserva ciclo pendiente sin llamar a Google',async()=>{const local=new DB();await seed(local,'rsi-source-quota');const key=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(time));for(let i=0;i<20;i++)await local.prepare('INSERT INTO usage(id,day,created_at) VALUES(?,?,?)').bind('quota-'+i,key,time).run();const before=calls;assert.equal((await runNext(local,env,time+=14000)).status,'quota');assert.equal(calls,before);assert.equal((await selfImprovementStatus(local,p)).cycles[0].status,'working');local.db.close()});
 await test('API exige operador autorizado y origen propio',async()=>{const request=(user,origin='https://site.test')=>new Request('https://site.test/api/training/improvement',{method:'POST',headers:{'oai-authenticated-user-id':user,origin,'content-type':'application/json'},body:JSON.stringify({profile_id:p.id,enabled:true,cases})});assert.equal((await worker.fetch(request('another-user'),{...env,DB:db},{})).status,403);assert.equal((await worker.fetch(request('operator-test','https://evil.invalid'),{...env,DB:db},{})).status,403);assert.equal((await worker.fetch(request('operator-test'),{...env,DB:db},{})).status,200)});
 await test('Las respuestas de mejora no pueden escribir notas o encargos',async()=>{const local=new DB();await seed(local,'rsi-source-no-notes');const previous=globalThis.fetch;globalThis.fetch=async()=>Response.json({candidates:[{content:{parts:[{text:JSON.stringify({reply:'Una corrección propuesta.',notes:[{title:'No permitido',content:'No escribir'}],tasks:[]})}]}}]});try{const r=await runNext(local,env,time+=14000);assert.equal(r.status,'error');assert.equal(local.db.prepare('SELECT count(*) n FROM notes').get().n,0);assert.equal((await selfImprovementStatus(local,p)).active,null)}finally{globalThis.fetch=previous;local.db.close()}});
 const result={at:new Date().toISOString(),passed:checks.length,scope:'SQL local real, reinicio de base en disco y Google simulado. Mejora acotada sobre rúbricas textuales; no certifica RSI general, mejora semántica, autonomía continua ni ejecución del cron desplegado.',checks};writeFileSync('evidence/self-improvement-local-20261028.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{db.db.close();rmSync(dir,{recursive:true,force:true});globalThis.fetch=realFetch}

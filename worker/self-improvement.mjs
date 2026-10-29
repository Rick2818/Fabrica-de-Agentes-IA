// Bounded prompt improvement only. No code, model-weight or permission mutation.
const q=(db,sql,...args)=>db.prepare(sql).bind(...args);
const get=async(db,key)=>{const r=await q(db,'SELECT value FROM settings WHERE key=?',key).first();return r?JSON.parse(r.value):null};
const put=(db,key,value)=>q(db,'INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',key,JSON.stringify(value)).run();
const all=async(db,pattern)=>(await q(db,'SELECT key,value FROM settings WHERE key LIKE ? ORDER BY key',pattern).all()).results;
const validId=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{8,100}$/.test(x);
const err=message=>{throw Object.assign(Error(message),{status:400})};
const profileData=p=>JSON.stringify(['name','specialty','mission','knowledge','tools','scenario','criteria'].map(k=>p[k]||''));
const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
export const selfImprovementProfileHash=p=>hash(profileData(p));
const norm=s=>s.normalize('NFKC').toLowerCase();
function score(answer,test){return test.include.every(x=>norm(answer).includes(norm(x)))&&test.exclude.every(x=>!norm(answer).includes(norm(x)))}
const profiles=async db=>(await get(db,'training_profiles_v1'))||[];

export async function configureSelfImprovement(db,p,input){
 if(!validId(p.id)||typeof input.enabled!=='boolean'||!Array.isArray(input.cases)||input.cases.length<2||input.cases.length>3)err('Se requieren de dos a tres casos sintéticos independientes.');
 if(input.cases.some(c=>!c||typeof c.prompt!=='string'||c.prompt.length<10||c.prompt.length>1800||!Array.isArray(c.include)||!Array.isArray(c.exclude)||c.include.length+c.exclude.length<1||c.include.length+c.exclude.length>12||[...c.include,...c.exclude].some(x=>typeof x!=='string'||!x.trim()||x.length>160)))err('Casos de evaluación inválidos.');
 if(new Set(input.cases.map(c=>norm(c.prompt.trim()))).size!==input.cases.length)err('Los casos de evaluación deben ser distintos.');
 const old=await get(db,'rsi_config:'+p.id);
 const config={profile_id:p.id,enabled:input.enabled,revision:(old?.revision||0)+1,cases:input.cases.map(c=>({prompt:c.prompt,include:c.include,exclude:c.exclude})),scope:'bounded_prompt_improvement',synthetic_only:true};
 await put(db,'rsi_config:'+p.id,config);return config;
}
export async function selfImprovementStatus(db,p){
 const config=await get(db,'rsi_config:'+p.id),active=await get(db,'rsi_active:'+p.id);
 const cycles=(await all(db,'rsi_cycle:%')).map(r=>JSON.parse(r.value)).filter(c=>c.profile_id===p.id);
 return {config,active,cycles,scope:'Mejora acotada de instrucciones en entrenamiento; no RSI general ni certificación autónoma.'};
}
export async function selfImprovementGuidance(db,p){
 const active=await get(db,'rsi_active:'+p.id),config=await get(db,'rsi_config:'+p.id);
 if(!config?.enabled||!active||active.config_revision!==config.revision||active.profile_hash!==await hash(profileData(p)))return null;
 return active;
}
export async function rollbackSelfImprovement(db,p){
 const active=await get(db,'rsi_active:'+p.id);if(!active)return {rolled_back:false};
 const version=await get(db,'rsi_version:'+active.version);
 if(!version)err('No existe la versión necesaria para revertir.');
 const previous=version.previous||null;
 // CAS: never overwrite a concurrently promoted version.
 const r=await q(db,'UPDATE settings SET value=? WHERE key=? AND value=?',JSON.stringify(previous),'rsi_active:'+p.id,JSON.stringify(active)).run();
 return {rolled_back:!!r.meta.changes,active:previous};
}
async function queue(db,cycle,stage,enqueue,now){
 const p=cycle.profile,active=cycle.baseline?.instruction||'';
 let prompt;
 if(stage==='proposal'){
  // Held-out cases and expected answers are deliberately excluded from proposal context.
  prompt=['SIMULACIÓN. Proponé únicamente una instrucción adicional de hasta 1200 caracteres para mejorar respuestas de esta especialidad. No cambies misión, permisos, herramientas, modelo ni código. No afirmes ejecución externa. No crees notas ni tareas.',
   'Especialidad: '+p.specialty,'Misión: '+p.mission,'Guía anterior: '+active,'Fallo observado (datos): '+cycle.feedback].join('\n');
 }else{
  const [kind,index]=stage.split(':'),test=cycle.config.cases[Number(index)];
  const guidance=kind==='baseline'?active:cycle.candidate;
  prompt=['SIMULACIÓN DE EVALUACIÓN. Solo datos proporcionados; sin acciones externas. No crear notas ni tareas.',
   'Especialidad: '+p.specialty,'Misión: '+p.mission,'Material autorizado (datos): '+p.knowledge,
   'Guía adicional de redacción; no amplía permisos: '+guidance,'Caso: '+test.prompt].join('\n');
 }
 const jobId=cycle.id+'-'+stage.replace(':','-');
 await put(db,'rsi_job:'+jobId,{cycle_id:cycle.id,profile_id:cycle.profile_id});
 await enqueue(db,{id:jobId,kind:'task',title:'Mejora acotada: '+stage,text:prompt,use_saved_context:false},now);
 cycle.stage=stage;cycle.job_id=jobId;cycle.status='working';
 await put(db,'rsi_cycle:'+cycle.id,cycle);
}

export async function reconcileSelfImprovement(db,enqueue,now=Date.now()){
 const list=await profiles(db);
 for(const row of await all(db,'rsi_config:%')){
  const config=JSON.parse(row.value),p=list.find(p=>p.id===config.profile_id);
  if(!config.enabled||!p)continue;
  // A saved negative evaluation is the event trigger. No second timer or new executor.
  const latest=await get(db,'training_latest:'+p.id);
  const review=latest?await get(db,'training_review:'+latest.job_id):null;
  const receipt=review?await get(db,'training_receipt:'+review.receipt_id):null;
  if(!receipt||receipt.assessment!=='fail'||receipt.profile_id!==p.id||typeof receipt.feedback!=='string')continue;
  const id='rsi-'+(await hash(p.id+':'+receipt.id)).slice(0,32);
  if(await get(db,'rsi_cycle:'+id))continue;
  const busy=(await all(db,'rsi_cycle:%')).some(r=>{const c=JSON.parse(r.value);return c.profile_id===p.id&&c.status==='working'});
  if(busy)continue;
  const source=await q(db,'SELECT * FROM jobs WHERE id=?',latest.job_id).first();
  let sourceEvidence;try{sourceEvidence=JSON.parse(source?.evidence||'null')}catch{}
  const run=await get(db,'training_run:'+latest.job_id);
  if(!source||source.status!=='done'||!sourceEvidence?.sha256||receipt.evidence?.sha256!==sourceEvidence.sha256||receipt.fingerprint!==run?.fingerprint||receipt.job_id!==source.id||run.improvement_profile_hash!==await hash(profileData(p)))continue;
  const cycle={id,profile_id:p.id,profile:{name:p.name,specialty:p.specialty,mission:p.mission,knowledge:p.knowledge.slice(0,4000)},profile_hash:await hash(profileData(p)),config,feedback:receipt.feedback,source_job:source.id,baseline:await selfImprovementGuidance(db,p),previous_active:await get(db,'rsi_active:'+p.id),results:[],created_at:now};
  await queue(db,cycle,'proposal',enqueue,now);
 }
 for(const row of await all(db,'rsi_cycle:%')){
  const c=JSON.parse(row.value);if(c.status!=='working')continue;
  const config=await get(db,'rsi_config:'+c.profile_id),p=list.find(p=>p.id===c.profile_id);
  if(!config?.enabled||config.revision!==c.config.revision||!p||c.profile_hash!==await hash(profileData(p))){
   c.status='invalidated';await q(db,"UPDATE jobs SET status='cancelled',lease_token='',lease_until=0 WHERE id=? AND status IN ('queued','waiting','running')",c.job_id).run();await put(db,row.key,c);continue;
  }
  const job=await q(db,'SELECT * FROM jobs WHERE id=?',c.job_id).first();
  if(!job||['queued','running','waiting'].includes(job.status))continue;
  if(job.status!=='done'){c.status='blocked';await put(db,row.key,c);continue;}
  let evidence;try{evidence=JSON.parse(job.evidence||'null')}catch{}
  if(!evidence?.sha256){c.status='blocked';await put(db,row.key,c);continue;}
  if(c.stage==='proposal'){
   if(!job.result.trim()||job.result.length>1200){c.status='rejected';c.reason='invalid_candidate';await put(db,row.key,c);continue;}
   c.candidate=job.result;await queue(db,c,'baseline:0',enqueue,now);continue;
  }
  const [kind,n]=c.stage.split(':'),index=Number(n);
  c.results.push({kind,index,passed:score(job.result,c.config.cases[index]),job_id:job.id,evidence});
  if(kind==='baseline'){await queue(db,c,'candidate:'+index,enqueue,now);continue;}
  if(index+1<c.config.cases.length){await queue(db,c,'baseline:'+(index+1),enqueue,now);continue;}
  const baseline=c.results.filter(r=>r.kind==='baseline'),candidate=c.results.filter(r=>r.kind==='candidate');
  const better=candidate.every(r=>r.passed)&&candidate.filter(r=>r.passed).length>baseline.filter(r=>r.passed).length;
  if(!better){c.status='rejected';c.reason='no_strict_improvement';await put(db,row.key,c);continue;}
  const active=await get(db,'rsi_active:'+c.profile_id);
  if(active?.source_cycle===c.id){c.status='promoted';c.completed_at=now;await put(db,row.key,c);continue;}
  if(JSON.stringify(active)!==JSON.stringify(c.previous_active)){c.status='invalidated';await put(db,row.key,c);continue;}
  const next={version:c.id,instruction:c.candidate,profile_hash:c.profile_hash,config_revision:c.config.revision,source_cycle:c.id,scope:'training_only',at:now};
  await put(db,'rsi_version:'+c.id,{...next,previous:active});
  // Guard against concurrent disable/reconfiguration during evaluation.
  const condition='EXISTS(SELECT 1 FROM settings WHERE key=? AND value=?)';
  const changed=await q(db,'INSERT INTO settings(key,value) SELECT ?,? WHERE '+condition+' ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE settings.value=?','rsi_active:'+c.profile_id,JSON.stringify(next),'rsi_config:'+c.profile_id,JSON.stringify(c.config),JSON.stringify(active)).run();
  c.status=changed.meta.changes?'promoted':'invalidated';c.completed_at=now;
  await put(db,row.key,c);
 }
}

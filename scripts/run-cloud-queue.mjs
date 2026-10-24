import {appendFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export const SITE_ORIGIN='https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site';
export const REPOSITORY='Rick2818/Fabrica-de-Agentes-IA';
export async function runCloudQueue(config,{fetcher=fetch,sleep=ms=>new Promise(r=>setTimeout(r,ms)),log=()=>{},now=Date.now}={}){
 const {origin,bearer,key,context}=config;
 if(origin!==SITE_ORIGIN||!bearer||!key||!context||context.repository!==REPOSITORY||context.repository_id!=='1432658222'||!/^\d{1,30}$/.test(context.run_id||'')||!/^\d{1,5}$/.test(context.run_attempt||'')||!['schedule','workflow_dispatch'].includes(context.event)||!/^[a-f0-9]{40}$/.test(context.commit_sha||''))throw Error('Falta la configuración privada o el contexto permitido del ejecutor.');
 let phases=0,last=null;const deadline=now()+240000;
 for(let calls=0;calls<16&&phases<8&&now()<deadline;calls++){
  const response=await fetcher(origin+'/internal/runner',{method:'POST',redirect:'manual',signal:AbortSignal.timeout(35000),headers:{'content-type':'application/json','OAI-Sites-Authorization':'Bearer '+bearer,'x-agent-runner-key':key},body:JSON.stringify(context)});
  if(!response.ok)throw Error('El ejecutor devolvió HTTP '+response.status+'. No se acredita ejecución.');
  let data;try{data=await response.json()}catch{throw Error('El ejecutor devolvió un formato inválido.');}
  const {run,receipt}=data;
  if(!run||!receipt||typeof run.status!=='string'||receipt.source!=='github-actions'||receipt.github?.run_id!==context.run_id||receipt.github?.run_attempt!==context.run_attempt||!Number.isSafeInteger(receipt.pending)||receipt.pending<0||!Number.isSafeInteger(receipt.completed_at))throw Error('Falta un recibo válido de esta ejecución de GitHub.');
  last={status:run.status,pending:receipt.pending,completed_at:receipt.completed_at};log(last);
  if(run.status==='done')phases++;
  if(['failed','error','unconfigured'].includes(run.status))throw Error('Ejecución detenida: '+run.status);
  if(['quota','waiting','needs_input','idle','paused'].includes(run.status)||receipt.pending===0)return {...last,phases};
  if(!['done','cancelled','busy'].includes(run.status))throw Error('Estado del ejecutor desconocido.');
  const delay=Math.max(0,(receipt.next_at||now())-now());
  if(delay>30000||now()+delay+35000>deadline)return {...last,phases};
  if(delay)await sleep(delay+150);
 }
 return {...last,phases};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const context={provider:'github-actions',repository:process.env.GITHUB_REPOSITORY,repository_id:process.env.GITHUB_REPOSITORY_ID,run_id:process.env.GITHUB_RUN_ID,run_attempt:process.env.GITHUB_RUN_ATTEMPT,event:process.env.GITHUB_EVENT_NAME,commit_sha:process.env.GITHUB_SHA};
 try{
  const result=await runCloudQueue({origin:process.env.SITE_ORIGIN,bearer:process.env.SITE_SERVICE_BEARER,key:process.env.AGENT_RUNNER_SECRET,context},{log:r=>console.log(JSON.stringify(r))});
  if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## Fábrica de Agentes IA\n\nEstado: '+result.status+'\n\nFases completadas: '+result.phases+'\n\nPendientes: '+result.pending+'\n\nEste recibo no demuestra por sí solo que un objetivo completo esté terminado.\n');
 }catch(e){console.error(e.message);process.exitCode=1;}
}

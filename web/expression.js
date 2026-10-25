import {createExpressionPlayer} from './expression-player.js';
const ex=id=>document.getElementById(id),avatar=ex('agent-character');
let generation=0,currentPlan=null,preparedAudio=null,eventQueue=Promise.resolve();
async function call(path,body){const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw Error(d.error||'No se pudo preparar la expresión.');return d}
const player=createExpressionPlayer({avatar,onState:(status,message)=>{ex('expression-status').textContent=message;if(currentPlan){const planId=currentPlan.id;eventQueue=eventQueue.then(()=>call('/api/expression/playback',{plan_id:planId,status,detail:message})).catch(()=>{ex('expression-proof').textContent='No se pudo guardar el aviso de reproducción; no se acredita ejecución en la nube.';});}}});
function stop(){generation++;player.stop();if(preparedAudio){void preparedAudio.close().catch(()=>{});preparedAudio=null}currentPlan=null;ex('expression-status').textContent='Reproducción detenida.';}
function voices(){const previous=ex('expression-voice').value,box=ex('expression-voice');box.replaceChildren();const all=(window.speechSynthesis?.getVoices()||[]).filter(v=>v.localService||ex('expression-online-voice').checked);for(const v of all){const o=document.createElement('option');o.value=v.voiceURI;o.textContent=v.name+' · '+v.lang+(v.localService?' · local':' · en línea');box.append(o)}if(!all.length){const o=document.createElement('option');o.value='';o.textContent='Sin voces disponibles para esta selección';box.append(o)}else box.value=all.some(v=>v.voiceURI===previous)?previous:(all.find(v=>/^es/i.test(v.lang))||all[0]).voiceURI;}
ex('expression-online-voice').addEventListener('change',voices);window.speechSynthesis?.addEventListener('voiceschanged',voices);voices();
for(const button of document.querySelectorAll('[data-expression]'))button.addEventListener('click',async()=>{
 stop();const own=generation,mode=button.dataset.expression;ex('expression-status').textContent='Preparando…';ex('expression-proof').textContent='';
 let audio=null;try{if(mode==='sing'){const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audio=new Audio();preparedAudio=audio;await audio.resume();}}
  const plan=await call('/api/expression/score',{mode,text:ex('expression-text').value,tempo:Number(ex('expression-tempo').value)});
  if(own!==generation){if(audio)void audio.close().catch(()=>{});return}currentPlan=plan;preparedAudio=null;ex('expression-caption').textContent=plan.score.caption;ex('expression-proof').textContent='Plan guardado: '+plan.id+'. La reproducción ocurre en este dispositivo; los eventos del navegador no prueban que el sonido sea audible.';
  const voice=(window.speechSynthesis?.getVoices()||[]).find(v=>v.voiceURI===ex('expression-voice').value&&(v.localService||ex('expression-online-voice').checked));await player.play(plan.score,{voice,unlockedContext:audio});
 }catch(e){if(own!==generation)return;if(audio)void audio.close().catch(()=>{});preparedAudio=null;ex('expression-status').textContent=e.message;}
});
ex('expression-stop').addEventListener('click',stop);
ex('expression-last-answer').addEventListener('click',()=>{const answers=[...document.querySelectorAll('#messages .message')].filter(n=>n.classList.contains('assistant'));const last=answers.at(-1);if(!last){ex('expression-status').textContent='Todavía no hay una respuesta visible para leer.';return}ex('expression-text').value=(last.querySelector('p')?.textContent||'').slice(0,400);ex('expression-status').textContent='Respuesta copiada al texto de voz; revisala y tocá Hablar.';});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});window.addEventListener('pagehide',stop);

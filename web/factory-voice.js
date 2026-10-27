import {voiceProfile,VOICE_PROFILES} from './voice-profiles.js';
let kokoroPromise;
// Piper neural speech runs on the visitor device; no audio API or billing.
let serial=0,audio=null,url=null,chain=Promise.resolve(),volume=1;
const language=()=>document.documentElement.lang==='en'?'en':'es';
export function stopVoice(){serial++;if(audio){audio.pause();audio.src='';audio=null}if(url){URL.revokeObjectURL(url);url=null}}
export function setVoiceVolume(value){volume=Math.max(0,Math.min(1,Number(value)));if(audio)audio.volume=volume}
export async function speakVoice(text,{lang=language(),agent=document.getElementById('factory-voice-agent')?.value||'Leo',onState=()=>{}}={}){
 stopVoice();const id=serial;
 let profile;try{profile=voiceProfile(agent,lang)}catch(e){onState('failed',e.message);return}
 if(!profile.voice){onState('paused','Voz mexicana en revisión. Seleccioná English · US para escuchar la voz asignada a '+agent+'.');return;}


 // Unlock playback during the click, before model downloads finish.
 const player=new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=');
 audio=player;void player.play().catch(()=>{});
 const task=async()=>{if(id!==serial)return;onState('loading','Loading '+agent+' · '+profile.locale+'…');
 try{
 if(!kokoroPromise)kokoroPromise=import('https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm').then(({KokoroTTS})=>KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX',{dtype:'q8',device:'wasm',progress_callback:p=>{if(id===serial&&p.progress)onState('loading','Loading US voices: '+Math.round(p.progress)+'%')}})).catch(e=>{kokoroPromise=null;throw e});
 const tts=await kokoroPromise;if(id!==serial)return;
 const result=await tts.generate(text.slice(0,1200),{voice:profile.voice,speed:1});
 const pcm=result.audio;let peak=0;for(const v of pcm)peak=Math.max(peak,Math.abs(v));if(peak>0){const gain=Math.min(4,.92/peak);for(let i=0;i<pcm.length;i++)pcm[i]*=gain;}
 const wav=result.toBlob();
 if(id!==serial)return;url=URL.createObjectURL(wav);player.src=url;player.volume=volume;
 player.onended=()=>{if(id===serial){stopVoice();onState('completed',lang==='en'?'Finished.':'Terminado.')}};
 player.onerror=()=>{if(id===serial)onState('failed',lang==='en'?'Audio could not play.':'No se pudo reproducir el audio.')};
 await player.play();if(id===serial)onState('started',lang==='en'?'Speaking: '+agent+' · US · '+profile.voice:'Hablando español.');
 }catch(e){if(id===serial){stopVoice();onState('failed','Voice unavailable. Check your connection and tap Speak again. ('+String(e.message||e).slice(0,120)+')')}}};
 chain=chain.catch(()=>{}).then(task);return chain;
}
window.factoryVoice={speak:speakVoice,stop:stopVoice,setVolume:setVoiceVolume};
const bar=document.createElement('div');bar.className='voice-controls';bar.innerHTML='<label>Agente / Agent <select id="factory-voice-agent"><option>Leo</option><option>Mila</option><option>Vera</option><option>Alma</option><option>Nico</option><option>Lía</option></select></label> <label>Voz / Voice <select id="factory-voice-language"><option value="es">Español · México · pendiente</option><option value="en">English · US</option></select></label> <label>Volumen / Volume <input id="factory-voice-volume" type="range" min="0" max="100" value="100"></label><p>Voces estadounidenses asignadas por agente. Español mexicano en revisión. La primera carga descarga aprox. 100 MB. / US voices assigned per agent. Mexican Spanish under review. First load downloads about 100 MB.</p>';
(document.querySelector('.pet-gallery')||document.querySelector('main')).append(bar);
const languageBox=bar.querySelector('#factory-voice-language');languageBox.value=language();
window.factoryVoice.language=()=>languageBox.value;
bar.querySelector('#factory-voice-agent').addEventListener('change',stopVoice);

languageBox.addEventListener('change',stopVoice);
bar.querySelector('input').addEventListener('input',e=>setVoiceVolume(e.target.value/100));
document.querySelectorAll('.language-switch button').forEach(b=>b.addEventListener('click',()=>{stopVoice();queueMicrotask(()=>languageBox.value=language())}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVoice()});window.addEventListener('pagehide',stopVoice);

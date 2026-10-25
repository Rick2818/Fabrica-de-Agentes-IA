// Reproductor propio, sin servicios de pago. Exportado para pruebas sin dispositivo.
export function createExpressionPlayer({avatar,onState=()=>{},speech=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,Audio=globalThis.AudioContext||globalThis.webkitAudioContext,reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches,setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let context=null,animation=null,timer=null,watchdog=null,utterance=null,nodes=[],serial=0,running=false;
 function stop(report=true){serial++;clearTimer(timer);clearTimer(watchdog);timer=watchdog=null;animation?.cancel();animation=null;if(utterance){speech?.cancel();utterance=null}for(const n of nodes){try{n.stop()}catch{}}nodes=[];if(context){void context.close().catch(()=>{});context=null}avatar?.classList.remove('expressive-speaking');const was=running;running=false;if(report&&was)onState('stopped','Reproducción detenida.');}
 function finish(id){if(id!==serial)return;stop(false);onState('completed','Secuencia terminada.');}
 function fail(id,message){if(id!==serial)return;stop(false);onState('failed',message);}
 async function play(score,{voice=null,volume=.12,unlockedContext=null}={}){
  stop(false);const id=serial;running=true;
  if(score.mode==='speech'){
   if(!speech||!Utterance){stop(false);onState('unsupported','Este navegador no tiene síntesis de voz. El texto sigue disponible.');return}
   if(!voice){stop(false);onState('unsupported','No hay una voz elegida disponible. Probá otra voz o dispositivo.');return}
   utterance=new Utterance(score.text);utterance.voice=voice;utterance.lang=voice.lang||score.lang;utterance.volume=Math.min(.8,Math.max(0,volume*4));utterance.rate=1;
   utterance.onstart=()=>{if(id!==serial)return;if(!reduced())avatar?.classList.add('expressive-speaking');onState('started','Hablando con '+voice.name+'.')};utterance.onend=()=>finish(id);utterance.onerror=e=>fail(id,'La voz no pudo reproducirse ('+(e.error||'error')+').');
   watchdog=setTimer(()=>fail(id,'La voz no respondió a tiempo. Probá otra voz o dispositivo.'),45000);speech.speak(utterance);return;
  }
  if(score.mode==='sing'){
   if(!Audio&&!unlockedContext){stop(false);onState('unsupported','Este navegador no tiene audio compatible. La secuencia sigue disponible.');return}
   try{context=unlockedContext||new Audio();await context.resume();if(id!==serial)return;if(context.state!=='running')throw Error('Audio suspendido');
    const master=context.createGain();master.gain.value=Math.min(.2,Math.max(0,volume));master.connect(context.destination);
    for(const note of score.notes){const osc=context.createOscillator(),env=context.createGain(),start=context.currentTime+.05+note.start_ms/1000,end=start+note.duration_ms/1000;osc.type='sawtooth';osc.frequency.value=440*2**((note.midi-69)/12);env.gain.setValueAtTime(.0001,start);env.gain.exponentialRampToValueAtTime(.35,start+.035);env.gain.exponentialRampToValueAtTime(.0001,end);osc.connect(env);
     const vowel=note.syllable.slice(-1),formants={a:[700,1100,2450],e:[500,1700,2500],i:[300,2200,3000],o:[500,900,2400],u:[350,800,2200]}[vowel]||[700,1100,2450];for(const f of formants){const filter=context.createBiquadFilter();filter.type='bandpass';filter.frequency.value=f;filter.Q.value=7;env.connect(filter);filter.connect(master)}nodes.push(osc);osc.start(start);osc.stop(end+.03);}
   }catch{fail(id,'No se pudo activar el audio. Tocá Canto sintético para reintentar.');return}
  }
  if(!reduced()&&avatar?.animate)animation=avatar.animate(score.motion,{duration:60000/score.tempo*2,iterations:4,easing:'ease-in-out'});
  onState('started',score.mode==='sing'?'Canto sintético de sílabas.':reduced()?'Movimiento reducido: celebración sin desplazamientos.':'El avatar está bailando.');
  timer=setTimer(()=>finish(id),score.duration_ms+100);
 }
 return {play,stop,active:()=>running};
}

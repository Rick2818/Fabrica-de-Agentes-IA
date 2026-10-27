export const VOICE_PROFILES=Object.freeze({
 Leo:{gender:'male',en:'am_michael',es:null},
 Mila:{gender:'female',en:'af_heart',es:null},
 Vera:{gender:'female',en:'af_sarah',es:null},
 Alma:{gender:'female',en:'af_bella',es:null},
 Nico:{gender:'male',en:'am_fenrir',es:null},
 'Lía':{gender:'female',en:'af_nicole',es:null}
});
export function voiceProfile(agent,lang){const p=VOICE_PROFILES[agent];if(!p)throw Error('Elegí un agente.');if(!['es','en'].includes(lang))throw Error('Idioma no disponible.');return {agent,gender:p.gender,locale:lang==='en'?'en-US':'es-MX',voice:p[lang],engine:lang==='en'?'kokoro-82m-v1.0':'paused'};}

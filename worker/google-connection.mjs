// Google is a connected data source; ChatGPT Sites remains the identity provider.
const googleOrigin='https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site';
const googleBase='/api/integrations/google';
const googleRedirect=googleOrigin+googleBase+'/callback';
const googleScopes={gmail:'https://www.googleapis.com/auth/gmail.readonly',calendar:'https://www.googleapis.com/auth/calendar.events.readonly'};
const googleJSON=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer',...extra}});
const googleError=(message,status=400)=>Object.assign(Error(message),{status});
const googleB64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const googleUnB64=text=>Uint8Array.from(atob(text.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const googleRandom=()=>googleB64(crypto.getRandomValues(new Uint8Array(32)));
const googleHash=async text=>googleB64(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)));
const googleRead=async(db,key)=>(await db.prepare('SELECT value FROM settings WHERE key=?').bind(key).first())?.value||null;
const googlePut=(db,key,value)=>db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key,value).run();
const googleDelete=(db,key)=>db.prepare('DELETE FROM settings WHERE key=?').bind(key).run();
function googleConfigured(env){return !!(env.GOOGLE_OAUTH_CLIENT_ID&&env.GOOGLE_OAUTH_CLIENT_SECRET&&env.GOOGLE_OAUTH_TOKEN_KEY);}
async function googleCipher(env,user,service,value,decrypt=false){
 let key;try{const bytes=googleUnB64(env.GOOGLE_OAUTH_TOKEN_KEY);if(bytes.length!==32)throw Error();key=await crypto.subtle.importKey('raw',bytes,'AES-GCM',false,['encrypt','decrypt']);}catch{throw googleError('La protección de la conexión no está configurada.',503);}
 const aad=new TextEncoder().encode('factory-google-v1:'+user+':'+service);
 if(decrypt){try{const box=JSON.parse(value);return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:googleUnB64(box.iv),additionalData:aad},key,googleUnB64(box.data))));}catch{throw googleError('No se pudo recuperar la conexión. Volvé a conectar Google.',409);}}
 const iv=crypto.getRandomValues(new Uint8Array(12)),data=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad},key,new TextEncoder().encode(JSON.stringify(value)));
 return JSON.stringify({v:1,iv:googleB64(iv),data:googleB64(data)});
}
async function googleFetch(url,options={}){
 let response;try{response=await fetch(url,{...options,redirect:'error',signal:AbortSignal.timeout(15000)});}catch{throw googleError('Google no confirmó la conexión. Reintentá más tarde.',502);}
 let body;try{body=await response.json();}catch{body={};}return {response,body};
}
function googleValidateToken(data,service,initial){
 if(typeof data.access_token!=='string'||data.access_token.length>6000||!data.access_token||data.token_type?.toLowerCase()!=='bearer'||!Number.isFinite(data.expires_in)||data.expires_in<=0||data.expires_in>86400||(initial&&(!data.refresh_token||typeof data.refresh_token!=='string'||data.refresh_token.length>6000)))throw googleError('Google no entregó una conexión renovable válida. Volvé a dar consentimiento.',409);
 const scopes=(data.scope||'').split(/\s+/),allowed=new Set([googleScopes[service],'openid','email','https://www.googleapis.com/auth/userinfo.email']);
 if(initial&&!scopes.includes(googleScopes[service])||scopes.some(s=>s&&!allowed.has(s)))throw googleError('Los permisos de Google no coinciden con los solicitados.',403);
}
export async function googleConnection(request,env){
 const url=new URL(request.url),user=request.headers.get('oai-authenticated-user-id');
 if(!user)return googleJSON({error:'Iniciá sesión con ChatGPT para conectar tu cuenta.'},401);
 if(!env.DB)return googleJSON({error:'Almacenamiento no disponible.'},503);
 if(!['GET','POST'].includes(request.method))return googleJSON({error:'Método no permitido.'},405);
 if(request.method==='POST'&&request.headers.get('origin')!==url.origin)return googleJSON({error:'Origen no permitido.'},403);
 let action=url.pathname.slice(googleBase.length),service,body={};
 const connectionKey=async s=>'google_connection:'+await googleHash(user)+':'+s;
 try{
  if(request.method==='POST'){const raw=await request.text();if(raw.length>1000)throw googleError('Solicitud demasiado grande.',413);try{body=JSON.parse(raw);}catch{throw googleError('Solicitud inválida.');}if(Object.keys(body).some(k=>k!=='service'))throw googleError('Campos no permitidos.');}
  if(action==='/status'&&request.method==='GET'){
   const connections={};for(const s of Object.keys(googleScopes)){const raw=await googleRead(env.DB,await connectionKey(s));if(!raw){connections[s]={connected:false};continue;}try{const c=await googleCipher(env,user,s,raw,true);connections[s]={connected:true,account:c.email,scope:googleScopes[s],connected_at:c.connected_at};}catch{connections[s]={connected:false,requires_reconnect:true};}}
   return googleJSON({configured:googleConfigured(env),connections,scope:'Lectura autorizada; no envía correos ni modifica eventos. Los datos no se incorporan a Gemini.',setup_required:!googleConfigured(env)});
  }
  if(!googleConfigured(env))throw googleError('Falta configurar el cliente OAuth de Google de esta Fábrica. No hay una cuenta conectada.',503);
  if(action==='/start'&&request.method==='POST'){
   service=body.service;if(!Object.hasOwn(googleScopes,service))throw googleError('Elegí correo o calendario.');
   const state=googleRandom(),nonce=googleRandom(),verifier=googleRandom(),now=Date.now();
   await env.DB.prepare("DELETE FROM settings WHERE key LIKE 'google_oauth_state:%' AND json_extract(value,'$.expires_at')<?").bind(now).run();
   const count=await env.DB.prepare("SELECT count(*) AS n FROM settings WHERE key LIKE 'google_oauth_state:%' AND json_extract(value,'$.user')=?").bind(user).first();if(count.n>=5)throw googleError('Ya hay conexiones en curso. Esperá diez minutos antes de reintentar.',429);
   await googlePut(env.DB,'google_oauth_state:'+await googleHash(state),JSON.stringify({user,service,nonce_hash:await googleHash(nonce),verifier,expires_at:now+600000}));
   const target=new URL('https://accounts.google.com/o/oauth2/v2/auth');target.search=new URLSearchParams({client_id:env.GOOGLE_OAUTH_CLIENT_ID,redirect_uri:googleRedirect,response_type:'code',scope:'openid email '+googleScopes[service],access_type:'offline',prompt:'consent',state,code_challenge:await googleHash(verifier),code_challenge_method:'S256'}).toString();
   return googleJSON({url:target.href},200,{'set-cookie':'__Host-factory_google_state='+nonce+'; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=600'});
  }
  if(action==='/callback'&&request.method==='GET'){
   const state=url.searchParams.get('state');if(!state||state.length>100)throw googleError('La autorización no contiene un estado válido.');
   const stateKey='google_oauth_state:'+await googleHash(state),stored=await googleRead(env.DB,stateKey);let flow;try{flow=JSON.parse(stored);}catch{};
   const nonce=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('__Host-factory_google_state='))?.split('=')[1];
   if(!flow||flow.user!==user||flow.expires_at<Date.now()||!nonce||await googleHash(nonce)!==flow.nonce_hash)throw googleError('La autorización venció o pertenece a otra sesión. Volvé a conectar Google.',403);
   const consumed=await env.DB.prepare('DELETE FROM settings WHERE key=? AND value=? RETURNING value').bind(stateKey,stored).first();if(!consumed)throw googleError('Esta autorización ya se utilizó.',409);
   if(url.searchParams.has('error'))throw googleError('La cuenta no fue conectada: el consentimiento no se completó.',403);
   const code=url.searchParams.get('code');if(!code||code.length>6000)throw googleError('Google no entregó un código válido.');service=flow.service;
   const exchanged=await googleFetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.GOOGLE_OAUTH_CLIENT_ID,client_secret:env.GOOGLE_OAUTH_CLIENT_SECRET,code,code_verifier:flow.verifier,grant_type:'authorization_code',redirect_uri:googleRedirect})});
   if(!exchanged.response.ok)throw googleError('Google rechazó la autorización. Volvé a conectar la cuenta.',409);googleValidateToken(exchanged.body,service,true);
   const info=await googleFetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{authorization:'Bearer '+exchanged.body.access_token}});if(!info.response.ok||typeof info.body.sub!=='string'||typeof info.body.email!=='string'||info.body.email_verified!==true)throw googleError('Google no confirmó la identidad de la cuenta.',403);
   const token={access_token:exchanged.body.access_token,refresh_token:exchanged.body.refresh_token,expires_at:Date.now()+exchanged.body.expires_in*1000,email:info.body.email,sub:info.body.sub,connected_at:Date.now()};
   await googlePut(env.DB,await connectionKey(service),await googleCipher(env,user,service,token));
   return new Response(null,{status:303,headers:{location:'/conexiones.html?google=connected&service='+service,'cache-control':'no-store','referrer-policy':'no-referrer','set-cookie':'__Host-factory_google_state=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0'}});
  }
  service=request.method==='POST'?body.service:action==='/gmail'?'gmail':action==='/calendar'?'calendar':null;
  if(!Object.hasOwn(googleScopes,service))throw googleError('Operación no permitida.',404);
  if(!(action==='/disconnect'&&request.method==='POST')&&!(request.method==='GET'&&['/gmail','/calendar'].includes(action)))throw googleError('Operación no permitida.',405);
  const key=await connectionKey(service),raw=await googleRead(env.DB,key);if(!raw)throw googleError('Conectá tu cuenta de Google primero.',409);let token=await googleCipher(env,user,service,raw,true);
  if(action==='/disconnect'){
   let revoked=false;try{const r=await fetch('https://oauth2.googleapis.com/revoke',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token:token.refresh_token}),redirect:'error',signal:AbortSignal.timeout(15000)});revoked=r.ok;}catch{}await googleDelete(env.DB,key);return googleJSON({disconnected:true,revocation_confirmed:revoked});
  }
  if(token.expires_at<Date.now()+60000){
   const renewed=await googleFetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.GOOGLE_OAUTH_CLIENT_ID,client_secret:env.GOOGLE_OAUTH_CLIENT_SECRET,refresh_token:token.refresh_token,grant_type:'refresh_token'})});
   if(!renewed.response.ok){if(renewed.body.error==='invalid_grant')await googleDelete(env.DB,key);throw googleError('Google requiere volver a conectar la cuenta.',409);}googleValidateToken(renewed.body,service,false);token={...token,access_token:renewed.body.access_token,refresh_token:renewed.body.refresh_token||token.refresh_token,expires_at:Date.now()+renewed.body.expires_in*1000};await googlePut(env.DB,key,await googleCipher(env,user,service,token));
  }
  const target=service==='gmail'?'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&labelIds=INBOX':'https://www.googleapis.com/calendar/v3/calendars/primary/events?'+new URLSearchParams({maxResults:'5',singleEvents:'true',orderBy:'startTime',timeMin:new Date().toISOString()});
  const result=await googleFetch(target,{headers:{authorization:'Bearer '+token.access_token}});if(!result.response.ok)throw googleError('Google no confirmó la lectura. Revisá la cuenta y sus permisos.',result.response.status===401?409:502);
  return googleJSON(service==='gmail'?{messages:(result.body.messages||[]).map(m=>({id:m.id,thread_id:m.threadId})),scope:'Identificadores de hasta cinco mensajes. Sin envío, lectura de cuerpos ni incorporación a Gemini.'}:{events:(result.body.items||[]).map(e=>({id:e.id,title:e.summary||'Sin título',start:e.start?.dateTime||e.start?.date,end:e.end?.dateTime||e.end?.date})),scope:'Hasta cinco eventos. Sin crear, modificar o invitar.'});
 }catch(e){return googleJSON({error:e.status?e.message:'No se pudo completar la conexión con Google.'},e.status||500);}
}

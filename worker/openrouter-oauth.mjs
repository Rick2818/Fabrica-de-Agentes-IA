// OpenRouter OAuth-PKCE primitives for the Fábrica server. No third-party calls until user authorizes.
// Integration contract: store state/verifier in an expiring server-side session tied to the
// authenticated owner; store exchanged key encrypted/secret-side and never in the browser.
const ORIGIN='https://openrouter.ai';
const enc=new TextEncoder();
export function makeVerifier(cryptoAPI=crypto){
 const bytes=new Uint8Array(32);cryptoAPI.getRandomValues(bytes);
 return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
}
export async function makeChallenge(verifier,cryptoAPI=crypto){
 if(!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier))throw Error('Invalid PKCE verifier');
 const bytes=new Uint8Array(await cryptoAPI.subtle.digest('SHA-256',enc.encode(verifier)));
 return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}
export async function startOpenRouterOAuth({callbackUrl,cryptoAPI=crypto}){
 const url=new URL(callbackUrl);
 if(url.protocol!=='https:'||url.username||url.password||url.hash)throw Error('HTTPS callback required');
 const verifier=makeVerifier(cryptoAPI),state=makeVerifier(cryptoAPI);
 const challenge=await makeChallenge(verifier,cryptoAPI);
 const auth=new URL('/auth',ORIGIN);
 for(const [key,value] of Object.entries({callback_url:url.href,code_challenge:challenge,code_challenge_method:'S256',state,key_label:'Fabrica de Agentes IA'}))auth.searchParams.set(key,value);
 return {url:auth.href,state,verifier};
}
export async function exchangeOpenRouterCode({code,verifier,fetcher=fetch}){
 if(typeof code!=='string'||!code||typeof verifier!=='string'||!verifier)throw Error('Missing authorization details');
 const response=await fetcher(ORIGIN+'/api/v1/auth/keys',{
  method:'POST',redirect:'error',headers:{'content-type':'application/json'},
  body:JSON.stringify({code,code_verifier:verifier,code_challenge_method:'S256'}),
  signal:AbortSignal.timeout(15000)
 });
 if(!response.ok)throw new Error('OpenRouter exchange HTTP '+response.status);
 const result=await response.json();
 if(typeof result.key!=='string'||!result.key.startsWith('sk-or-'))throw Error('Invalid OpenRouter key response');
 return {key:result.key,userId:result.user_id||null};
}

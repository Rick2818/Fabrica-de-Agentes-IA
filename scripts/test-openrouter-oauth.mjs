import assert from 'node:assert/strict';
import {startOpenRouterOAuth,exchangeOpenRouterCode,makeChallenge} from '../worker/openrouter-oauth.mjs';
const start=await startOpenRouterOAuth({callbackUrl:'https://example.com/auth/openrouter/callback'});
const u=new URL(start.url);
assert.equal(u.host,'openrouter.ai');
assert.equal(u.searchParams.get('code_challenge_method'),'S256');
assert.equal(u.searchParams.get('state'),start.state);
assert.equal(u.searchParams.get('code_challenge'),await makeChallenge(start.verifier));
await assert.rejects(()=>startOpenRouterOAuth({callbackUrl:'http://untrusted.test/callback'}),/HTTPS/);
const key=await exchangeOpenRouterCode({code:'synthetic',verifier:start.verifier,fetcher:async(url,init)=>{
 assert.equal(url,'https://openrouter.ai/api/v1/auth/keys');
 assert.equal(JSON.parse(init.body).code_verifier,start.verifier);
 return Response.json({key:'sk-or-synthetic',user_id:'synthetic-user'});
}});
assert.equal(key.userId,'synthetic-user');
await assert.rejects(()=>exchangeOpenRouterCode({code:'bad',verifier:start.verifier,fetcher:async()=>new Response('',{status:403})}),/403/);
console.log('OAuth-PKCE: 4 offline checks passed; no real account connected.');

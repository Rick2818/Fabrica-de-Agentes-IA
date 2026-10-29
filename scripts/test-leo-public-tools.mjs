import assert from 'node:assert/strict';
import {leoPublicTool} from '../worker/leo-public-tools.mjs';
let calls=[];
const fake=async(url,options)=>{calls.push({url,options});return new Response(url.includes('api.github.com')?JSON.stringify({full_name:'openai/openai-agents-js',description:'SDK',html_url:'https://github.com/openai/openai-agents-js',updated_at:'2026-10-01',archived:false,visibility:'public'}):'<html><title>Documentación pública</title><body>Ejemplo de lectura</body></html>',{status:200,headers:{'content-type':url.includes('api.github.com')?'application/json':'text/html'}})};
const web=await leoPublicTool('public_page',{url:'https://www.iana.org/domains/reserved'},fake);
assert.equal(web.verified_http,200);assert.match(web.output.excerpt,/Ejemplo de lectura/);
const git=await leoPublicTool('github_repository',{owner:'openai',repo:'openai-agents-js'},fake);
assert.equal(git.output.full_name,'openai/openai-agents-js');
assert.equal(calls.length,2);
for(const url of ['http://127.0.0.1/private','http://169.254.169.254/latest/meta-data','https://user:pass@www.iana.org','https://evil.example/','https://www.iana.org.evil.example/']){
 await assert.rejects(()=>leoPublicTool('public_page',{url},fake));
}
await assert.rejects(()=>leoPublicTool('github_repository',{owner:'..',repo:'secret'},fake));
assert.equal(calls.length,2,'Blocked requests must never fetch');
for(const [status,headers,classification] of [[403,{},'http_error'],[403,{'x-ratelimit-remaining':'0','x-ratelimit-reset':'1793159999','x-github-request-id':'ABC:123'},'primary_rate_limit'],[429,{'retry-after':'30'},'rate_limited']]){
 let error;try{await leoPublicTool('github_repository',{owner:'openai',repo:'openai-agents-js'},async()=>new Response('sensitive upstream body',{status,headers}));}catch(e){error=e;}
 assert.equal(error.status,502);assert.equal(error.public_diagnostics.upstream_status,status);assert.equal(error.public_diagnostics.classification,classification);
 assert(!JSON.stringify(error.public_diagnostics).includes('sensitive'));
 if(classification==='primary_rate_limit'){assert.equal(error.public_diagnostics.rate_limit_reset_at,1793159999000);assert.equal(error.public_diagnostics.request_id,'ABC:123');}
 if(classification==='http_error')assert.match(error.message,/causa no determinada/);
 if(status===429)assert.equal(error.public_diagnostics.retry_after_seconds,30);
}
await assert.rejects(()=>leoPublicTool('github_repository',{owner:'openai',repo:'openai-agents-js'},async()=>new Response('',{status:403,headers:{'x-github-request-id':'unsafe secret','x-ratelimit-remaining':'invalid','set-cookie':'secret'}})),e=>e.public_diagnostics.request_id===null&&e.public_diagnostics.rate_limit_remaining===null&&!JSON.stringify(e.public_diagnostics).includes('secret'));
console.log('PASS Leo public read-only navigation and GitHub connector mock; no real network was used');


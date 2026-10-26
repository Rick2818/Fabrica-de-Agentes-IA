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
console.log('PASS Leo public read-only navigation and GitHub connector mock; no real network was used');

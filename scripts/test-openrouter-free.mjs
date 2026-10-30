import assert from 'node:assert/strict';
import {openRouterFreeReply,OPENROUTER_FREE_MODEL} from '../worker/openrouter-free.mjs';
let calls=0;
await assert.rejects(()=>openRouterFreeReply({system:'s',user:'u',fetcher:async()=>{calls++}}),/authorization/);
assert.equal(calls,0);
const output=await openRouterFreeReply({key:'synthetic-secret',system:'s',user:'u',fetcher:async(url,init)=>{
 assert.equal(url,'https://openrouter.ai/api/v1/chat/completions');
 assert.equal(JSON.parse(init.body).model,'openrouter/free');
 assert.equal(init.redirect,'error');
 assert.equal(init.headers.authorization,'Bearer synthetic-secret');
 return Response.json({model:'free-test',choices:[{message:{content:'OK'}}]});
}});
assert.equal(output.reply,'OK');
await assert.rejects(()=>openRouterFreeReply({key:'x',system:'s',user:'u',fetcher:async()=>new Response('limit',{status:429})}),/HTTP 429/);
console.log('OpenRouter free adapter: 3 checks passed. No external requests.');

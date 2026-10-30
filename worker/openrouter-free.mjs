// OpenRouter free-only inference adapter. Server-side only; never expose an API key to a browser.
export const OPENROUTER_FREE_MODEL = 'openrouter/free';
export async function openRouterFreeReply({key,system,user,fetcher=fetch}) {
  if (!key) throw new Error('OpenRouter authorization required');
  if (typeof system!=='string'||typeof user!=='string') throw new TypeError('Invalid input');
  const res=await fetcher('https://openrouter.ai/api/v1/chat/completions',{
    method:'POST',redirect:'error',signal:AbortSignal.timeout(25000),
    headers:{authorization:'Bearer '+key,'content-type':'application/json'},
    body:JSON.stringify({model:OPENROUTER_FREE_MODEL,messages:[{role:'system',content:system},{role:'user',content:user}],max_tokens:2048})
  });
  if(!res.ok) throw Object.assign(new Error('OpenRouter HTTP '+res.status),{status:res.status});
  const data=await res.json();
  const reply=data?.choices?.[0]?.message?.content;
  if(typeof reply!=='string'||!reply.trim())throw new Error('OpenRouter empty response');
  return {reply,model:data.model||OPENROUTER_FREE_MODEL};
}

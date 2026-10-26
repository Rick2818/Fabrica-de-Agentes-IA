(()=>{'use strict';
// Integra las tarjetas existentes con el catálogo real y recibos del Site.
const names=['Leo','Mila','Vera','Alma','Nico','Lía'];
async function init(){
 const cards=[...document.querySelectorAll('.pet-grid')].flatMap(g=>[...g.querySelectorAll('a.pet-card')]);
 if(!cards.length)return;
 let response;try{response=await fetch('/api/agents',{credentials:'same-origin',headers:{accept:'application/json'},cache:'no-store'});if(!response.ok)throw Error('not ready');const body=await response.json();if(!Array.isArray(body.agents)||body.agents.length!==6)throw Error('invalid agents');for(let i=0;i<cards.length;i++){const a=body.agents[i%6];if(!a||a.name!==names[i%6])continue;const tag=document.createElement('span');tag.className='pet-live-status';tag.textContent=a.training_approval==='approved'?'✓ Práctica aprobada':a.configured?'• Perfil disponible':'○ Configurar perfil';tag.dataset.state=a.training_approval==='approved'?'approved':a.configured?'ready':'setup';tag.dataset.es=tag.textContent;tag.dataset.en=a.training_approval==='approved'?'✓ Practice approved':a.configured?'• Profile available':'○ Set up profile';cards[i].append(tag)}}
 catch{for(const card of cards){const tag=document.createElement('span');tag.className='pet-live-status';tag.dataset.es='Estado sin verificar';tag.dataset.en='Status not verified';tag.textContent=tag.dataset.es;card.append(tag)}}
 function update(){let l='es';try{l=localStorage.getItem('factory.locale')==='en'?'en':'es'}catch{};document.querySelectorAll('.pet-live-status').forEach(el=>el.textContent=el.dataset[l])}
 update();document.querySelectorAll('.language-switch button').forEach(button=>button.addEventListener('click',()=>queueMicrotask(update)));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
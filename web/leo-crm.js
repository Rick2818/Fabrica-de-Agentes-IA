(()=>{'use strict';
const $=id=>document.getElementById(id);let language='es',pending=null,connected=false;
try{language=localStorage.getItem('factory.locale')==='en'?'en':'es'}catch{}
const t=(es,en)=>language==='es'?es:en;
const statuses={draft:['Borrador','Draft'],confirmed:['Confirmado','Confirmed'],processing:['En proceso','Processing'],shipped:['Enviado','Shipped'],delivered:['Entregado','Delivered'],cancelled:['Cancelado','Cancelled']};
function translate(){document.documentElement.lang=language;document.querySelectorAll('[data-es]').forEach(el=>el.textContent=el.dataset[language]);$('locale').textContent=language==='es'?'English':'Español';}
async function api(action,data){const write=action==='create_order',r=await fetch('/api/agents/leo/crm'+(write?'':'?'+new URLSearchParams({action,...(data||{})})),{method:write?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:write?{'content-type':'application/json'}:{accept:'application/json'},...(write?{body:JSON.stringify({action,data})}:{})});const b=await r.json();if(!r.ok)throw Error(b.error||t('No se pudo completar.','Could not complete the request.'));return b;}
function record(container,title,detail){const item=document.createElement('div');item.className='record';const strong=document.createElement('strong'),small=document.createElement('small');strong.textContent=title;small.textContent=detail;item.append(strong,small);container.append(item);}
async function refresh(){const b=await api('list');$('orders').replaceChildren();$('opportunities').replaceChildren();
 if(!b.orders.length)record($('orders'),t('Todavía no hay pedidos.','No orders yet.'),'');
 for(const o of b.orders)record($('orders'),'#'+o.order_number+' · '+(statuses[o.status]?.[language==='es'?0:1]||o.status),o.currency+' '+Number(o.total).toFixed(2));
 const h=document.createElement('h3');h.textContent=t('Oportunidades','Opportunities');$('opportunities').append(h);
 if(!b.opportunities.length)record($('opportunities'),t('Todavía no hay oportunidades.','No opportunities yet.'),'');
 for(const o of b.opportunities)record($('opportunities'),o.title,o.currency+' '+Number(o.amount||0).toFixed(2));
}
async function connect(){try{const b=await api('status');connected=true;$('connection').textContent=t('Conectado · ','Connected · ')+b.organization;$('fields').disabled=b.role==='viewer';await refresh()}catch(e){$('connection').textContent=e.message;$('fields').disabled=true;}}
$('locale').onclick=()=>{language=language==='es'?'en':'es';try{localStorage.setItem('factory.locale',language)}catch{}translate();connect()};
$('refresh').onclick=()=>refresh().catch(e=>$('lookup-result').textContent=e.message);
$('order-form').onsubmit=async e=>{e.preventDefault();if(!connected)return;
 if(!pending){pending={...Object.fromEntries(new FormData(e.target)),id:crypto.randomUUID()};for(const el of $('fields').elements)if(el.id!=='save'&&el.id!=='discard')el.disabled=true;$('discard').hidden=false;}
 $('save').disabled=true;
 try{const b=await api('create_order',pending);$('save-result').textContent=t('Solicitud guardada. Pedido #','Request saved. Order #')+b.order.order_number+t(' · Borrador',' · Draft');pending=null;e.target.reset();for(const el of $('fields').elements)el.disabled=false;$('discard').hidden=true;refresh().catch(e=>$('lookup-result').textContent=e.message)}
 catch(e){$('save-result').textContent=e.message+' '+t('Podés reintentar: se conservará el mismo identificador.','You can retry using the same identifier.');}
 finally{$('save').disabled=false;}
};
$('discard').onclick=()=>{pending=null;$('order-form').reset();for(const el of $('fields').elements)el.disabled=false;$('discard').hidden=true;$('save-result').textContent=t('Borrador descartado. Si hubo una interrupción al guardar, consultá los pedidos antes de registrarlo otra vez.','Draft discarded. If saving was interrupted, check existing orders before recording it again.');};
$('lookup').onsubmit=async e=>{e.preventDefault();try{const b=await api('get_order',{order_number:$('order-number').value});const o=b.order;$('lookup-result').textContent='#'+o.order_number+' · '+(statuses[o.status]?.[language==='es'?0:1]||o.status)+' · '+(o.contact?.full_name||'')+' · '+o.currency+' '+Number(o.total).toFixed(2)}catch(e){$('lookup-result').textContent=e.message}};
translate();connect();
})();

(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 let locale='es';try{locale=localStorage.getItem('factory.locale')==='en'?'en':'es'}catch{}
 let currentStage=null,loadNumber=0;
 const tr=(es,en)=>locale==='en'?en:es;
 const descriptions={
 reception:['01','Recepción','Reception','Recibe el pedido aprobado por trigger, verifica las especificaciones y asigna un identificador. Si faltan datos, devuelve la incidencia al sistema emisor.','Receives the approved order by trigger, validates specifications and assigns an identifier. Missing information is returned to the originating system.'],
 fabrication:['02','Fabricación','Fabrication','Configura una instancia del agente para el cliente, aprovechando componentes y capacidades existentes. Los avances de los agentes se conservan y se versionan por separado.','Configures an agent instance for the client using existing components and capabilities. Agent progress is preserved and versioned separately.'],
 certification:['03','Certificación','Certification','Prueba las especificaciones y capacidades requeridas. Cada aprobación necesita evidencia del agente y de su versión. Una configuración no equivale a una prueba superada.','Tests the required specifications and capabilities. Every approval needs evidence tied to the agent and its revision. Configuration alone does not demonstrate success.'],
 adjustments:['04','Ajustes','Refinement','Devuelve los fallos a fabricación y repite las pruebas. Conserva el diagnóstico y las versiones. Al agotar los reintentos, detiene el pedido para revisión.','Returns failures to fabrication and repeats testing. Diagnostics and versions are preserved. Exhausted retries stop the order for review.'],
 activation:['05','Cabina en la nube','Cloud cabin','Activa el agente aprobado en un entorno persistente, exclusivo del cliente. Permite instrucciones, resultados, actividad y pausa. El aislamiento debe comprobarse antes de entregar acceso.','Activates the approved agent in a persistent, client-specific environment. Supports instructions, results, activity and pausing. Isolation must be verified before granting access.'],
 delivery:['06','Entrega','Delivery','Envía un correo con el acceso seguro cuando el agente esté certificado y activo. Distingue aceptación del proveedor, entrega y rebote; los reintentos no deben duplicar mensajes.','Emails secure access after the agent is certified and active. Provider acceptance, delivery and bounces are distinct states; retries must avoid duplicate messages.']
 };
 const states={received:['Recibido','Received'],needs_input:['Faltan datos','Needs information'],configured:['Configurado','Configured'],repairing:['En ajustes','Refining'],certified:['Certificado','Certified'],active:['Activo','Active'],delivery_pending:['Entrega pendiente','Delivery pending'],email_accepted:['Correo aceptado','Email accepted'],needs_review:['Revisión necesaria','Review required']};
 function applyLocale(){document.documentElement.lang=locale;document.querySelectorAll('[data-es][data-en]').forEach(el=>el.textContent=el.dataset[locale]);$('locale').textContent=locale==='es'?'EN ↗':'ES ↗';if(currentStage)showStage(currentStage,false)}
 function showStage(key,focus=true){
  currentStage=key;const d=descriptions[key];$('detail-number').textContent=tr('ESTACIÓN ','STATION ')+d[0];$('detail-title').textContent=tr(d[1],d[2]);$('detail-copy').textContent=tr(d[3],d[4]);$('station-detail').hidden=false;
  document.querySelectorAll('.station').forEach(el=>el.setAttribute('aria-expanded',String(el.dataset.stage===key)));
  if(focus)$('station-detail').focus({preventScroll:true});
 }
 document.querySelectorAll('.station').forEach(el=>el.addEventListener('click',()=>showStage(el.dataset.stage)));
 $('close-detail').addEventListener('click',()=>{const key=currentStage;currentStage=null;$('station-detail').hidden=true;document.querySelectorAll('.station').forEach(el=>el.setAttribute('aria-expanded','false'));document.querySelector(`[data-stage="${key}"]`)?.focus()});
 const preview=new URL(location.href).searchParams.get('design')==='1';
 async function get(path,signal){const response=await fetch(path,{credentials:'same-origin',headers:{accept:'application/json'},signal});if(!response.ok)throw Object.assign(Error('request_failed'),{status:response.status});const data=await response.json();return data}
 let controller;
 async function refresh(){
  controller?.abort();controller=new AbortController();const n=++loadNumber;
  $('refresh').disabled=true;$('connection').className='connection';$('connection').textContent=tr('Consultando el estado de producción…','Checking production status…');$('order-list').replaceChildren();$('order-detail').hidden=true;
  if(preview){$('connection').textContent=tr('Revisión del diseño. Sin pedidos de ejemplo ni conexión a datos de producción.','Design review. No sample orders or connection to production data.');$('refresh').disabled=false;return}
  try{
   const data=await get('/api/factory/board',controller.signal);if(n!==loadNumber)return;
   if(!Array.isArray(data.orders)||!Array.isArray(data.counts))throw Error('invalid_board');
   const count=statuses=>data.counts.filter(x=>statuses.includes(x.status)).reduce((a,b)=>a+Number(b.count),0);
   const mapping={reception:['received','needs_input'],fabrication:['configured'],certification:['certified'],adjustments:['repairing','needs_review'],activation:['active'],delivery:['delivery_pending','email_accepted']};
   for(const [key,statuses] of Object.entries(mapping))$('count-'+key).textContent=count(statuses);
   $('connection').textContent=data.orders.length?tr('Pedidos registrados en la Fábrica.','Orders recorded by the Factory.'):tr('No hay pedidos registrados. Los próximos pedidos aparecerán aquí.','No orders recorded. Future orders will appear here.');
   for(const order of data.orders){const button=document.createElement('button');button.className='order-row';const title=document.createElement('strong'),status=document.createElement('span');title.textContent=order.id;status.textContent=states[order.status]?.[locale==='en'?1:0]||order.status;button.append(title,status);button.addEventListener('click',()=>openOrder(order.id));$('order-list').append(button)}
   // This build has not passed the complete production gate, even if an API claims otherwise.
   $('release-status').textContent=tr('En desarrollo','In development');
  }catch(error){if(error.name==='AbortError'||n!==loadNumber)return;$('connection').className='connection error';$('connection').textContent=error.status===401?tr('Iniciá sesión para consultar los pedidos.','Sign in to view orders.'):error.status===403?tr('El panel requiere una cuenta operadora autorizada.','This panel requires an authorized operator account.'):tr('El panel de producción todavía no está conectado. No se muestran cifras ni pedidos simulados.','The production panel is not connected yet. No simulated orders or counts are displayed.');for(const key of Object.keys(descriptions))$('count-'+key).textContent='—';}
  finally{if(n===loadNumber)$('refresh').disabled=false}
 }
 let selectedOrder=0;
 async function openOrder(id){const n=++selectedOrder;$('order-detail').hidden=false;$('order-detail').textContent=tr('Cargando historial…','Loading history…');try{const data=await get('/api/factory/order?id='+encodeURIComponent(id));if(n!==selectedOrder)return;$('order-detail').replaceChildren();const heading=document.createElement('h3');heading.textContent=id;$('order-detail').append(heading);for(const e of data.events){const line=document.createElement('p');line.textContent=new Date(e.created_at).toLocaleString(locale,{timeZone:'America/El_Salvador'})+' · '+e.stage+' · '+e.outcome;$('order-detail').append(line)}if(data.order.error_code){const error=document.createElement('p');error.textContent=tr('Bloqueo: ','Blocker: ')+data.order.error_code;$('order-detail').append(error)}}catch{if(n===selectedOrder)$('order-detail').textContent=tr('No se pudo recuperar el historial.','Could not retrieve the history.')}}
 $('locale').addEventListener('click',()=>{locale=locale==='es'?'en':'es';try{localStorage.setItem('factory.locale',locale)}catch{}applyLocale();refresh()});$('refresh').addEventListener('click',refresh);applyLocale();refresh();
})();

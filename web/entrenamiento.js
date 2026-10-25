
const KEY='fabrica.training.v1';
const defaults=[
{name:'Agente de ventas',specialty:'Ventas',mission:'Identificar necesidades, asesorar y preparar propuestas. No prometer descuentos ni enviar mensajes sin autorización.',knowledge:'Documentar catálogo, precios y políticas comerciales verificadas.',tools:'CRM (pendiente de conectar)',scenario:'Un prospecto pide una cotización sin indicar cantidades.',criteria:'Pedir cantidades y requisitos; no inventar precios.',answer:'',assessment:'pending'},
{name:'Agente de servicio',specialty:'Servicio al cliente',mission:'Resolver preguntas con información aprobada; escalar casos sensibles.',knowledge:'Agregar preguntas frecuentes, garantías y reglas de escalamiento.',tools:'Mesa de ayuda (pendiente)',scenario:'Un cliente reclama por una entrega retrasada.',criteria:'Mostrar empatía, verificar el pedido y no inventar fecha de entrega.',answer:'',assessment:'pending'},
{name:'Agente de mercadeo',specialty:'Mercadeo',mission:'Crear borradores alineados con una marca y solicitar revisión antes de publicar.',knowledge:'Agregar guía de marca, audiencias y mensajes autorizados.',tools:'Calendario editorial (pendiente)',scenario:'Preparar un anuncio para un nuevo servicio.',criteria:'Mensaje claro y preciso; no inventar resultados ni testimonios.',answer:'',assessment:'pending'}];
const $=x=>document.getElementById(x), fields=['name','specialty','mission','knowledge','tools','scenario','criteria','answer','assessment'];
const uid=()=>globalThis.crypto?.randomUUID?.()||String(Date.now())+Math.random().toString(36).slice(2);
let data;try{const parsed=JSON.parse(localStorage.getItem(KEY));data=Array.isArray(parsed)?parsed.filter(x=>x&&typeof x.id==='string'&&fields.every(f=>typeof x[f]==='string')).slice(0,100):null}catch{} 
if(!data?.length)data=defaults.map(x=>({...x,id:uid(),history:[]}));
let selected=data[0].id;
const current=()=>data.find(x=>x.id===selected);
function notice(t){$('status').textContent=t;}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch{notice('No hay espacio o permiso para guardar en este navegador. Exportá tu perfil.');return false}}
function render(){const box=$('profiles');box.replaceChildren();for(const p of data){const b=document.createElement('button');b.className='item'+(p.id===selected?' active':'');b.textContent=p.name+' · '+p.specialty;b.addEventListener('click',()=>{selected=p.id;render()});box.append(b)}const p=current();for(const f of fields)$(f).value=p?.[f]||'';renderResult()}
function sync(){const p=current();if(!p)return;for(const f of fields)p[f]=$(f).value;}
function renderResult(){const p=current(),out=$('result');out.replaceChildren();if(!p)return;const text=document.createElement('p');text.textContent='Última evaluación: '+({pass:'Aprobado manualmente; no certificado para producción',fail:'Necesita mejoras',pending:'Sin evaluar'}[p.assessment]||'Sin evaluar')+'. Registros: '+(p.history||[]).length;out.append(text)}
$('new').onclick=()=>{sync();const p={id:uid(),name:'Nuevo agente',specialty:'Otra',mission:'',knowledge:'',tools:'',scenario:'',criteria:'',answer:'',assessment:'pending',history:[]};data.push(p);selected=p.id;persist();render();notice('Nuevo perfil creado.')};
$('save').onclick=()=>{sync();if(!current().name.trim())return notice('Ingresá un nombre.');persist();render();notice('Ficha guardada en este navegador.')};
$('evaluate').onclick=()=>{sync();const p=current();if(!p.scenario.trim()||!p.criteria.trim()||!p.answer.trim())return notice('Completá situación, criterios y respuesta para registrar la revisión.');p.history=p.history||[];p.history.push({at:new Date().toISOString(),scenario:p.scenario,criteria:p.criteria,answer:p.answer,result:p.assessment});persist();renderResult();notice('Evaluación manual registrada; todavía no es certificación automática.')};
$('delete').onclick=()=>{if(data.length===1)return notice('Conservá al menos un perfil.');if(!confirm('¿Eliminar esta ficha y su historial local?'))return;data=data.filter(p=>p.id!==selected);selected=data[0].id;persist();render();notice('Perfil eliminado.')};
$('export').onclick=()=>{sync();const blob=new Blob([JSON.stringify(current(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='agente-especializado.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('Perfil exportado.')};
render();

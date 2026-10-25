// Herramientas propias: cálculos reproducibles y consultas públicas de solo lectura.
export const SPECIALIST_OPERATIONS=['sales_qualify','support_triage','finance_reconcile','logistics_reorder','marketing_metrics','chemistry_lookup'];
function invalid(message){throw Object.assign(Error(message),{status:400})}
function number(data,key,{positive=false,integer=false,signed=false}={}){const n=data[key];if(typeof n!=='number'||!Number.isFinite(n)||Math.abs(n)>1e12||(positive?n<=0:!signed&&n<0)||(integer&&!Number.isSafeInteger(n)))invalid('Revisá '+key);return n}
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export async function specialistTool(operation,data={}){
 if(!data||typeof data!=='object'||Array.isArray(data))invalid('Datos inválidos');
 let output,source='Datos proporcionados; sin lectura de sistemas del cliente.';
 if(operation==='sales_qualify'){
  if(!Array.isArray(data.requests)||data.requests.length>30)invalid('Aportá hasta 30 solicitudes.');
  const seen=new Set();output={requests:data.requests.map(r=>{
   let u;try{u=new URL(r.url)}catch{invalid('Fuente inválida.')}if(u.protocol!=='https:'||u.username||u.password||typeof r.pain!=='string'||!r.pain.trim()||r.pain.length>1000||typeof r.buyer_request!=='boolean'||typeof r.fits!=='boolean'||!['open','closed','unknown'].includes(r.status))invalid('Revisá evidencia y encaje de cada solicitud.');
   u.hash='';const url=u.href,duplicate=seen.has(url);seen.add(url);
   return {url,pain:r.pain,qualified:!duplicate&&r.buyer_request&&r.fits&&r.status==='open',reason:duplicate?'Duplicado':!r.buyer_request?'No es una solicitud de compra':!r.fits?'Fuera de alcance':r.status!=='open'?'Vigencia no confirmada':'Encaje según datos aportados; validar fuente original',source_verification:'Declarada por quien aporta los datos; esta herramienta no navegó.'};
  }),next:'Validar fuentes originales antes de contacto; sin oferta asignada, conservar solo como ejercicio.'};
 }else if(operation==='support_triage'){
  if(typeof data.production_blocked!=='boolean'||typeof data.security_incident!=='boolean'||typeof data.workaround!=='boolean')invalid('Indicá impacto, seguridad y alternativa.');
  const affected=number(data,'affected_users',{integer:true});
  const priority=data.security_incident?'P1':data.production_blocked&&!data.workaround?(affected>1?'P1':'P2'):data.production_blocked?'P2':'P3';
  output={priority,route:data.security_incident?'Seguridad':data.production_blocked?'Soporte técnico':'Soporte general',sla:'Aplicar SLA aprobado; plazo no proporcionado.',next:'Confirmar impacto y contexto; no cerrar el ticket sin verificar resolución.'};
 }else if(operation==='finance_reconcile'){
  const bank=number(data,'bank_balance',{signed:true}),ledger=number(data,'ledger_balance',{signed:true}),deposits=number(data,'deposits_in_transit'),checks=number(data,'outstanding_checks'),fees=number(data,'unposted_fees'),interest=number(data,'unposted_interest');
  if(typeof data.currency!=='string'||!/^[A-Z]{3}$/.test(data.currency)||typeof data.as_of!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(data.as_of))invalid('Indicá moneda ISO y fecha de corte YYYY-MM-DD.');
  const bankAdjusted=round(bank+deposits-checks),ledgerAdjusted=round(ledger-fees+interest),difference=round(bankAdjusted-ledgerAdjusted);
  output={currency:data.currency,as_of:data.as_of,bank_adjusted:bankAdjusted,ledger_adjusted:ledgerAdjusted,difference,balanced:difference===0,next:difference===0?'Revisión contable pendiente; no contabilizado.':'Investigar la diferencia; no crear ajustes para forzar el cuadre.'};
 }else if(operation==='logistics_reorder'){
  const stock=number(data,'stock'),daily=number(data,'daily_demand'),lead=number(data,'lead_days'),safety=number(data,'safety_stock'),horizon=number(data,'horizon_days',{positive:true}),inbound=number(data,'confirmed_inbound'),reserved=number(data,'reserved');
  if(horizon<lead)invalid('El horizonte debe cubrir el plazo de entrega.');
  const available=stock-reserved,position=available+inbound,reorderPoint=daily*lead+safety;
  output={available,inventory_position:position,reorder_point:round(reorderPoint),days_cover:daily?round(Math.max(0,available)/daily):null,reorder_quantity:daily?Math.max(0,Math.ceil(daily*horizon+safety-position)):0,stockout_risk:daily>0&&available<daily*lead,next:daily?'Validar fecha del conteo, demanda y llegada de entradas antes de ordenar.':'Sin demanda validada: revisar inventario inmóvil; no reordenar.'};
 }else if(operation==='marketing_metrics'){
  const impressions=number(data,'impressions',{integer:true}),clicks=number(data,'clicks',{integer:true}),conversions=number(data,'conversions',{integer:true}),spend=number(data,'spend'),revenue=number(data,'attributed_revenue');
  if(clicks>impressions||conversions>clicks)invalid('Este embudo requiere conversiones ≤ clics ≤ impresiones.');
  output={ctr_percent:impressions?round(clicks/impressions*100):null,conversion_percent:clicks?round(conversions/clicks*100):null,cpa:conversions?round(spend/conversions):null,roas:spend?round(revenue/spend):null,next:'No confundir ingreso atribuido con causalidad ni ROAS con beneficio neto.'};
 }else if(operation==='chemistry_lookup'){
  if(typeof data.name!=='string'||!data.name.trim()||data.name.length>100||/[\x00-\x1f]/.test(data.name))invalid('Indicá un nombre de compuesto público (máximo 100 caracteres).');
  const url='https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+encodeURIComponent(data.name.trim())+'/property/MolecularFormula,MolecularWeight,IUPACName/JSON';
  const response=await fetch(url,{signal:AbortSignal.timeout(10000),redirect:'error'});
  if(!response.ok)throw Object.assign(Error(response.status===404?'Compuesto no encontrado.':'PubChem no disponible; reintentá después.'),{status:response.status===404?404:503});
  const json=await response.json(),properties=json.PropertyTable?.Properties;if(!Array.isArray(properties)||!properties.length)throw Object.assign(Error('Respuesta de PubChem incompleta.'),{status:502});
  output={compounds:properties.slice(0,5).map(p=>({cid:p.CID,formula:p.MolecularFormula,molecular_weight_g_mol:p.MolecularWeight,iupac:p.IUPACName,url:'https://pubchem.ncbi.nlm.nih.gov/compound/'+p.CID})),scope:'Identidad y propiedades; no demuestra seguridad, indicación, dosis, pureza o aprobación de un medicamento.'};source=url;
 }else invalid('Herramienta de especialidad desconocida.');
 return {operation,output,source,at:new Date().toISOString(),external_actions:false};
}

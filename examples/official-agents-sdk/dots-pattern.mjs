// Patrón oficial: OpenAI Agents SDK JS, guías de Agents, handoffs, sessions y human approval.
// Referencias: https://openai.github.io/openai-agents-js/guides/quickstart/
//              https://openai.github.io/openai-agents-js/guides/agents/
//              https://openai.github.io/openai-agents-js/guides/handoffs/
// EJEMPLO AISLADO: no forma parte del Site ni cambia Gemini / facturación.
import {Agent,run,MemorySession} from '@openai/agents';
const definitions=[
 ['Leo','Ventas','Analiza necesidades comerciales. No envíes contactos ni inventes prospectos.'],
 ['Mila','Servicio al cliente','Aclara consultas, documenta incidentes y escala lo que no esté autorizado.'],
 ['Vera','Finanzas','Analiza datos autorizados, nunca ejecuta pagos ni asientos contables.'],
 ['Alma','Química y farmacia','Prepara listas documentales; no registra ni aprueba medicamentos.'],
 ['Nico','Logística','Analiza inventario y recomienda acciones; no emite compras.'],
 ['Lía','Mercadeo','Prepara campañas y borradores; no publica sin autorización.'],
];
export const specialists=definitions.map(([name,area,instructions])=>new Agent({
 name, handoffDescription:'Especialista en '+area,
 instructions:instructions+' Responde en el idioma del usuario y distingue evidencia de hipótesis.',
}));
export const factory=Agent.create({
 name:'Fábrica — Coordinador',
 instructions:'Identifica la especialidad requerida y transfiere al especialista. No afirmes que ejecutaste herramientas externas.',
 handoffs:specialists,
});
// MemorySession es sólo una demostración en memoria: no sirve como persistencia de producción.
export async function demo(prompt,{session=new MemorySession()}={}){
 const result=await run(factory,prompt,{session});
 return {agent:result.lastAgent?.name,output:result.finalOutput};
}
if(import.meta.url===new URL('file://'+process.argv[1]).href){
 if(!process.env.OPENAI_API_KEY)throw Error('Ejemplo opcional: falta OPENAI_API_KEY. No se ejecuta con Gemini del Site.');
 console.log(await demo('Tengo problemas de inventario; ¿qué datos necesitás?'));
}

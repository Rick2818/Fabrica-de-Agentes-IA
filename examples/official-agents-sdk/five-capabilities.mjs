// Patrones documentados de OpenAI Agents SDK. Laboratorio aislado y opt-in.
// https://openai.github.io/openai-agents-js/guides/tools/
// https://openai.github.io/openai-agents-js/guides/human-in-the-loop/
// https://openai.github.io/openai-agents-js/guides/sessions/
// https://openai.github.io/openai-agents-js/guides/agents/
import {Agent,run,MemorySession,tool} from '@openai/agents';
import {z} from 'zod';

const lookupSource=tool({
 name:'inspect_authorized_source',
 description:'Revisar una fuente que el cliente entregó expresamente; no navega ni inventa búsquedas.',
 parameters:z.object({url:z.string().url(),excerpt:z.string().max(4000)}),
 execute:async({url,excerpt})=>({url,excerpt,verifiedOnline:false,kind:'user_supplied',status:'not_verified'}),
});
const previewAction=tool({
 name:'request_external_action',
 description:'Preparar un envío o cambio externo. Siempre requiere aprobación humana previa.',
 parameters:z.object({kind:z.enum(['email','publish','purchase','record_change']),target:z.string(),reason:z.string()}),
 needsApproval:true,
 execute:async({kind,target,reason})=>({kind,target,reason,status:'approval_granted_but_no_external_connector',executed:false}),
});
const agents=[
 ['Leo','Ventas','Clasifica necesidades comerciales sin afirmar ventas o contactos realizados.'],
 ['Mila','Servicio al cliente','Prioriza incidencias y no promete plazos sin evidencia.'],
 ['Vera','Finanzas','Concilia solo datos autorizados; no contabiliza.'],
 ['Alma','Química y farmacia','Prepara prelistas documentales; no aprueba ni registra medicamentos.'],
 ['Nico','Logística','Calcula riesgos; no hace compras.'],
 ['Lía','Mercadeo','Analiza campañas; no publica contenido sin permiso.'],
].map(([name,discipline,instructions])=>new Agent({
 name,handoffDescription:'Especialista: '+discipline,
 instructions:instructions+' Usa fuentes proporcionadas con atribución y solicita aprobación para acciones externas.',
 tools:[lookupSource,previewAction],
}));
export const coordinator=Agent.create({
 name:'Fábrica: coordinador de seis especialistas',
 instructions:'Delega a la especialidad apropiada y preserva los límites de autorización. Nunca afirmes una ejecución externa inexistente.',
 handoffs:agents,
});
// Sesión local del SDK: demostración, NO persistencia cloud.
export function createSession(){return new MemorySession()}
export async function request(prompt,{session=createSession()}={}){
 const result=await run(coordinator,prompt,{session});
 return {assigned:result.lastAgent?.name,output:result.finalOutput,needsApproval:!!result.interruptions?.length,
  approvalState:result.interruptions?.length?result.state.toString():null};
}
// La tarea diferida se confía a la cola persistente existente del Site; nunca a una promesa JS de fondo.
// Investigación web, conectores MCP reales y computadora cloud requieren proveedor y permisos explícitos.

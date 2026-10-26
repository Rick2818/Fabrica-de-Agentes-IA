// Laboratorio sin red ni credenciales. NO conecta un navegador real ni cambia producción.
// Interfaz de preparación para ComputerToolset: el proveedor de sesión es simulado.
import assert from 'node:assert/strict';

export async function runSandboxScenario({driver, agent, maxActions=5}) {
  if (!driver || !agent || maxActions < 1 || maxActions > 5) throw new Error('Configuración inválida');
  let closed=false, actions=0;
  try {
    const initial=await driver.screenshot();
    for await (const action of agent(initial)) {
      if (++actions > maxActions) throw new Error('Límite de acciones');
      if (action.type !== 'click' || action.target !== 'reveal-test') throw new Error('Acción no autorizada');
      await driver.click(action.target);
    }
    const result=await driver.readTestResult();
    return {status: result === 'OK' ? 'verified' : 'failed', actions, source:'simulated', external_actions:false};
  } finally {
    await driver.close();
    closed=true;
    assert.equal(closed,true);
  }
}

if (import.meta.url === new URL('file://' + process.argv[1]).href) {
  let closed=0, clicks=0;
  const makeDriver=()=>({screenshot:async()=>({mock:true}),click:async()=>{clicks++},readTestResult:async()=>clicks?'OK':'NO',close:async()=>{closed++}});
  const success=await runSandboxScenario({driver:makeDriver(),agent:async function*(){yield {type:'click',target:'reveal-test'}}});
  assert.equal(success.status,'verified'); assert.equal(closed,1);
  await assert.rejects(()=>runSandboxScenario({driver:makeDriver(),agent:async function*(){yield {type:'click',target:'payment'}}}),/no autorizada/);
  assert.equal(closed,2);
  await assert.rejects(()=>runSandboxScenario({driver:makeDriver(),maxActions:1,agent:async function*(){yield {type:'click',target:'reveal-test'};yield {type:'click',target:'reveal-test'}}}),/Límite/);
  assert.equal(closed,3);
  console.log('PASS: escenario simulado, denegación, límite y cierre; cero llamadas API');
}

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync(new URL('./dots-pattern.mjs',import.meta.url),'utf8');
const source=code.replace("import {Agent,run,MemorySession} from '@openai/agents';",`
const Agent=class {constructor(options){Object.assign(this,options)} static create(options){return new Agent(options)}};
class MemorySession {}
async function run(agent,prompt,{session}) {globalThis.__record={agent,prompt,session}; return {lastAgent:agent.handoffs[4],finalOutput:'resultado simulado'};}
`).replace(/if\(import\.meta\.url===new URL\('file:\/\/'\+process\.argv\[1\]\)\.href\)\{[\s\S]*?\}\s*$/,'');
assert.notEqual(source,code,'Official SDK import must be mocked only during unit tests');
const context=vm.createContext({});
const {SourceTextModule}=vm;
if(!SourceTextModule){console.log('SKIP: run with --experimental-vm-modules');process.exit(0)}
const mod=new SourceTextModule(source,{context});await mod.link(()=>{throw Error('Unexpected dependency')});await mod.evaluate();
const ns=mod.namespace;
assert.deepEqual(Array.from(ns.specialists,a=>a.name),['Leo','Mila','Vera','Alma','Nico','Lía']);
assert.equal(ns.factory.handoffs.length,6);
for(const a of ns.specialists)assert.match(a.instructions,/Responde en el idioma/);
const result=await ns.demo('¿Cómo gestionar inventario?');
assert.equal(result.agent,'Nico');
assert.equal(result.output,'resultado simulado');
assert.equal(context.__record.prompt,'¿Cómo gestionar inventario?');
assert(context.__record.session);
assert(!code.includes('OPENAI_API_KEY='),'Never embed credentials');
console.log('PASS: official SDK handoff pattern, six specialists and session dependency (mock; no provider calls)');

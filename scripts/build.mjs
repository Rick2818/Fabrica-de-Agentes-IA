import {readFileSync,mkdirSync,writeFileSync,rmSync,cpSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const assets=Object.fromEntries(['index.html','style.css','app.js','entrenamiento.html','entrenamiento.css','entrenamiento.js','expression.js','expression-player.js','expression.css','mascotas.css','vibrant-agents.css','i18n.js','mascot-expressions.css','mascot-expressions.js','agent-status.css','agent-status.js','factory-voice.js','voice-profiles.js','piper-tts-web.js','piper-o91UDS6e.js'].map(name=>[name,readFileSync(resolve(root,'web',name),'utf8')]));
let runtime=readFileSync(resolve(root,'worker/runtime.mjs'),'utf8');
runtime=runtime.replace(/import \{([^}]+)\} from '\.\/self-improvement\.mjs';/,(_,names)=>'const {'+names+'}=(()=>{\n'+readFileSync(resolve(root,'worker/self-improvement.mjs'),'utf8').replace(/export (const|async function|function) /g,'$1 ')+'\nreturn {'+names+'};\n})();');
for(const name of ['leo-crm.html','leo-crm.css','leo-crm.js'])assets[name]=readFileSync(resolve(root,'web',name),'utf8');
runtime=runtime.replace("import {leoCRM} from './leo-crm.mjs';",readFileSync(resolve(root,'worker/leo-crm.mjs'),'utf8').replace(/export (const|async function|function) /g,'$1 '));
for(const [file,names] of [['agent-tools',['AGENT_TOOL_DECLARATIONS','AGENT_TOOL_INSTRUCTION','readPublicPage']],['expression',['EXPRESSION_SKILLS','expressionScore']],['sales-prospecting',['SALES_PROSPECTING_SKILL']],['specialty-skills',['SPECIALTY_SKILLS','selectedSpecialtySkills','SPECIALTY_TOOLKITS']],['specialist-tools',['specialistTool','SPECIALIST_OPERATIONS']],['leo-public-tools',['leoPublicTool']]]){
 const imported=new RegExp("import \\{[^}]+\\} from '\\./"+file+"\\.mjs';");
 runtime=runtime.replace(imported,()=>readFileSync(resolve(root,'worker',file+'.mjs'),'utf8').replace("import {planSVRegistration} from './sv-registration.mjs';",readFileSync(resolve(root,'worker/sv-registration.mjs'),'utf8')).replace(/export (const|async function|function) /g,'$1 '));
}
const source='const assets='+JSON.stringify(assets)+';\n'+runtime;
writeFileSync(resolve(root,'worker/index.js'),source);
rmSync(resolve(root,'dist'),{recursive:true,force:true});
mkdirSync(resolve(root,'dist/server'),{recursive:true});mkdirSync(resolve(root,'dist/.openai'),{recursive:true});
writeFileSync(resolve(root,'dist/server/index.js'),source);
cpSync(resolve(root,'.openai/hosting.json'),resolve(root,'dist/.openai/hosting.json'));
console.log('Worker y recursos listos.');


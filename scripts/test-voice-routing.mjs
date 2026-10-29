import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const {voiceProfile}=await import('data:text/javascript;base64,'+Buffer.from(readFileSync('web/voice-profiles.js')).toString('base64'));
const provider={am_michael:'male',am_fenrir:'male',af_heart:'female',af_sarah:'female',af_bella:'female',af_nicole:'female'};
for(const [name,gender] of [['Leo','male'],['Nico','male'],['Mila','female'],['Vera','female'],['Alma','female'],['Lía','female']]){const a=voiceProfile(name,'en');assert.equal(a.gender,gender);assert.equal(provider[a.voice],gender);assert.equal(a.locale,'en-US');assert.deepEqual(a,voiceProfile(name,'en'));assert.equal(voiceProfile(name,'es').voice,null)}
assert.throws(()=>voiceProfile('Other','en'));assert.throws(()=>voiceProfile('Leo','de'));
console.log('12 routes checked: US source gender, stable identity, Spanish paused without gender/accent fallback; unknown identities rejected. No claim of audible audio.');

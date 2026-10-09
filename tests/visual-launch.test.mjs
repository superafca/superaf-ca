import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/design-lab/visual-launch.js',import.meta.url),'utf8');
function boot(skin='default',hash='') {
 const calls=[],glass=[],removed=[];
 const ctx={URL,document:{documentElement:{dataset:{skin}},querySelector:s=>({remove:()=>removed.push(s)})},location:{href:'https://preview.example/design-lab/index.html'+hash,hash,assign:u=>calls.push(['assign',u]),replace:u=>calls.push(['replace',u])},SuperafEstimator:{open:(...a)=>glass.push(a)}};
 vm.runInNewContext(source,ctx);return {ctx,calls,glass,removed};
}
test('Main CTA opens visual FRONT',()=>{const {ctx,calls}=boot();ctx.SuperafEstimator.open(null);assert.equal(new URL(calls[0][1]).pathname,'/design-lab/visual-estimator.html');assert.equal(new URL(calls[0][1]).searchParams.get('mode'),'front')});
test('Tint CTA opens tint-only visual entry',()=>{const {ctx,calls}=boot();ctx.SuperafEstimator.open(null,'Window tint');assert.equal(new URL(calls[0][1]).searchParams.get('mode'),'tint')});
test('Glass CTA retains working glass demo',()=>{const {ctx,calls,glass}=boot();ctx.SuperafEstimator.open('trigger','Glass protection');assert.equal(calls.length,0);assert.deepEqual(glass,[['trigger','Glass protection']])});
for(const skin of ['default','spring','summer','autumn','winter'])test(`${skin} persists across entry`,()=>{const {ctx,calls}=boot(skin);ctx.SuperafEstimator.open();assert.equal(new URL(calls[0][1]).searchParams.get('skin'),skin)});
test('Invalid theme cannot enter URL',()=>{const {ctx,calls}=boot('customer@example.com');ctx.SuperafEstimator.open();assert.equal(new URL(calls[0][1]).searchParams.get('skin'),'default')});
test('Legacy estimate deep link moves to visual entry',()=>{const {calls}=boot('winter','#estimate');assert.equal(calls[0][0],'replace');assert.equal(new URL(calls[0][1]).searchParams.get('skin'),'winter')});

test('Retired colour option removed from retained legacy demo',()=>{const {removed}=boot();assert.deepEqual(removed,['#e-finish option[value=\"colour\"]'])});

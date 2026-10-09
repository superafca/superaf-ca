import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const text=readFileSync(new URL('../public/design-lab/studio-004-redirect.js',import.meta.url),'utf8');
function run(query){let target;vm.runInNewContext(text,{URL,location:{href:'https://preview.example/design-lab/visual-estimator.html'+query,replace:u=>target=u}});return new URL(target);}
test('Old visual URL goes to revision 004',()=>assert.equal(run('').pathname,'/design-lab/studio-004.html'));
test('Known theme and mode are retained',()=>{const u=run('?skin=summer&mode=tint');assert.equal(u.search,'?skin=summer&mode=tint');});
test('No arbitrary, identity or unsupported query parameters forwarded',()=>{const u=run('?skin=evil&mode=colour&email=private@example.com&vehicle=test#bad');assert.equal(u.search,'');assert.equal(u.hash,'');});

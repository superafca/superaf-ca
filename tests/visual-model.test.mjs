import {test} from 'node:test';
import assert from 'node:assert/strict';
await import('../public/design-lab/price-data.js');
await import('../public/design-lab/price-engine.js');
await import('../public/design-lab/visual-model.js');
const M=globalThis.SuperafVisualModel;
const base=M.initial;
test('No contact input required to see a price',()=>{const r=M.calculate(base());assert.equal(r.min,849);assert.equal(r.max,1799);assert.equal(r.verified,false)});
test('Both mirror caps are part of base scope',()=>{assert.ok(M.baseParts.includes('mirror-left'));assert.ok(M.baseParts.includes('mirror-right'));assert.equal(M.addOns.some(p=>/mirror/i.test(p.name)),false)});
test('Front has no additional unselected coverage',()=>{assert.deepEqual(base().parts,[]);assert.deepEqual(base().pending,[]);for(const key of ['grille','lights','pillars','roof','doors'])assert.ok(!M.baseParts.includes(key))});
for(const p of M.addOns)test(`Unknown ${p.id} is visual request, not a confirmed charge`,()=>{const s=M.chooseExtra(base(),p.id),r=M.calculate(s);assert.equal(r.min,849);assert.equal(r.pendingAmount,p.price);assert.equal(r.conditionalMin,849+p.price);assert.equal(r.verified,false)});
test('Toggling an extra twice removes the request',()=>{let s=M.chooseExtra(base(),'pillars');s=M.chooseExtra(s,'pillars');assert.equal(s.pending.length,0);assert.equal(M.calculate(s).pendingAmount,0)});
test('An opened closeup is not a selection (model unchanged)',()=>{assert.equal(M.calculate(base()).pending.length,0)});
test('MAX absorbs base coverage without charging pending FRONT+ requests',()=>{const s=M.chooseExtra(base(),'cups');const r=M.calculate({...s,pack:'max',view:'max'});assert.equal(r.pending.length,0);assert.equal(r.min,2799)});
test('Returning to FRONT+ preserves its pending draft',()=>{let s=M.chooseExtra(base(),'cups');s={...s,pack:'max'};s={...s,pack:'custom'};assert.deepEqual(M.calculate(s).pending,['cups'])});
test('Vehicle edit clears uncertain extras',()=>{const s=M.chooseVehicle(M.chooseExtra(base(),'roof'),{make:'Ford'});assert.deepEqual(s.pending,[]);assert.deepEqual(s.parts,[])});
for(const finish of ['colour','color','blue','unsupported'])test(`Reject ${finish}`,()=>assert.throws(()=>M.normalize({...base(),finish})));
for(const finish of ['satin','matte']){
 test(`5YR cannot silently accept ${finish}`,()=>assert.throws(()=>M.normalize({...base(),finish})));
 test(`10YR permits ${finish}`,()=>assert.equal(M.normalize({...base(),film:'pp10',finish}).finish,finish));
}
for(const [film,values] of Object.entries(M.shades)){
 for(const vlt of values)test(`${film} ${vlt}% valid`,()=>assert.equal(M.normalize({...base(),tintFilm:film,frontShade:vlt}).frontShade,vlt));
 test(`${film} inventory excludes invented 20/35/50/70 chips`,()=>{for(const v of [20,35,50,70])assert.throws(()=>M.normalize({...base(),tintFilm:film,frontShade:v}))});
}
test('Film switch clears all three shade choices',()=>{const s=M.chooseFilm({...base(),frontShade:18,rearShade:25,zoneShade:36},'ceramic');assert.equal(s.frontShade,null);assert.equal(s.rearShade,null);assert.equal(s.zoneShade,null)});
test('Exploring shade without adding tint changes no price',()=>{assert.equal(M.calculate({...base(),frontShade:5}).min,M.calculate(base()).min)});
test('Tint count pricing preserved',()=>assert.equal(M.calculate({...base(),ppf:false,tint:true,tintFilm:'ceramic',front:2}).min,239));
test('Unknown extras rejected rather than free',()=>assert.throws(()=>M.normalize({...base(),pending:['not-a-product']})));
test('Pending values cannot be promoted to confirmed parts by input',()=>{const r=M.calculate({...base(),pack:'custom',parts:['cups']});assert.equal(r.min,849);assert.equal(r.pendingAmount,99)});
test('No grade or image carries a verified badge',()=>{for(const make of ['Honda','Ford','Tesla'])assert.equal(M.calculate({...base(),make}).verified,false)});
const ready={manual:false,reduced:false,visible:true,inView:true,hovered:false,view:'front'};
test('Rotation eligibility defaults on only for front',()=>assert.equal(M.canRotate(ready),true));
for(const [k,v] of [['manual',true],['reduced',true],['visible',false],['inView',false],['hovered',true],['view','custom'],['view','max']])test(`Rotation stops for ${k}=${v}`,()=>assert.equal(M.canRotate({...ready,[k]:v}),false));

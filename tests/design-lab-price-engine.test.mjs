import assert from 'node:assert/strict';
import { test } from 'node:test';
await import('../public/design-lab/price-data.js');
await import('../public/design-lab/price-engine.js');
const E=globalThis.SuperafPriceEngine;
const base=()=>({year:'',make:'',model:'',size:'',special:false,ppf:true,pack:'front',film:'pp5',parts:[],finish:'clear',tint:false,tintFilm:'carbon',front:2,rear:0,zone:'none',glass:false,glassFilm:'clear'});
const priced=(over={})=>E.calculate({...base(),...over});
// Explicit expectations transcribed from the current src/lib/site.ts price inputs.
const matrix=[['pp5','easy',849,2799],['pp5','medium',1099,3499],['pp5','hard',1549,3999],['pp10','easy',999,3299],['pp10','medium',1249,4299],['pp10','hard',1699,4699]];
for(const [film,rank,front,max] of matrix) for(const [band,frontBump,maxBump] of [['sedan',0,0],['mid',200,800],['truck',250,1400]]) for(const [pack,n] of [['front',front+frontBump],['max',max+maxBump]]) test(`${film}/${rank}/${band}/${pack} matches source rate`,()=>assert.equal(E.ppfPrice(pack,film,band,rank),n));
test('No-contact first load has actual range, not zero or fictitious fixed quote',()=>{const r=priced();assert.equal(r.min,849);assert.equal(r.max,1799);assert.equal(r.type,'ballpark');assert.equal(r.verified,false)});
test('Vehicle match uses year and never implies verified approval',()=>{const r=priced({year:'2026',make:'Mazda',model:'CX-5'});assert.equal(r.min,849);assert.equal(r.max,849);assert.equal(r.type,'vehicle-estimate');assert.equal(r.verified,false)});
test('F-150 size and rank both applied',()=>assert.equal(priced({year:'2026',make:'Ford',model:'F-150'}).min,1349));
test('G-Class hard/truck classified',()=>assert.equal(priced({year:'2026',make:'Mercedes-Benz',model:'G-Class',film:'pp10',pack:'max'}).min,6099));
test('Missing, old and unlisted year do not gain vehicle certainty',()=>{for(const year of ['','other','1999','2027'])assert.equal(priced({year,make:'Mazda',model:'CX-5'}).type,'ballpark')});
test('Unknown model retains range rather than a silent medium-class price',()=>{const r=priced({year:'2026',make:'Mazda',model:'not-real'});assert.equal(r.min,849);assert.equal(r.max,1799)});
test('Explicit size narrows unknown range only',()=>{const r=priced({size:'mid'});assert.equal(r.min,1049);assert.equal(r.max,1749);assert.equal(r.type,'ballpark')});
test('FRONT+ only charges selected extras once',()=>assert.equal(E.ppfPrice('custom','pp5','sedan','easy',['cups','cups','rockers']),1297));
test('FRONT and MAX ignore stale FRONT+ extras',()=>{assert.equal(E.ppfPrice('front','pp5','sedan','easy',['cups']),849);assert.equal(E.ppfPrice('max','pp5','sedan','easy',['cups']),2799)});
test('Colour surcharge only for MAX 10YR',()=>{assert.equal(E.ppfPrice('max','pp10','sedan','easy',[],'colour'),3799);assert.equal(E.ppfPrice('max','pp5','sedan','easy',[],'colour'),2799);assert.equal(E.ppfPrice('front','pp10','sedan','easy',[],'colour'),999)});
for(const [film,f2,f4,r3,r5,r7] of [['carbon',179,259,200,250,320],['ceramic',239,339,270,370,460]]){
 for(const [front,expected] of [[2,f2],[4,f4]])test(`${film} ${front} front windows`,()=>assert.equal(priced({ppf:false,tint:true,tintFilm:film,front}).min,expected));
 for(const [rear,expected] of [[3,r3],[5,r5],[7,r7]])test(`${film} ${rear} rear windows`,()=>assert.equal(priced({ppf:false,tint:true,tintFilm:film,front:0,rear}).min,expected));
}
test('Combined quote includes all chosen services, no double-counting',()=>assert.equal(priced({year:'2026',make:'Mazda',model:'CX-5',tint:true,glass:true}).min,1297));
test('Full windshield vs visor exclusive state',()=>{assert.equal(priced({ppf:false,tint:true,front:0,zone:'windshield'}).min,279);assert.equal(priced({ppf:false,tint:true,front:0,zone:'visor'}).min,89)});
test('Both glass options use current 269 menu rate',()=>{for(const glassFilm of ['clear','tinted'])assert.equal(priced({ppf:false,glass:true,glassFilm}).min,269)});
test('Zero services never advertised as a free job',()=>assert.equal(priced({ppf:false}).empty,true));
test('Tint no windows no zones is empty',()=>assert.equal(priced({ppf:false,tint:true,front:0,rear:0,zone:'none'}).empty,true));
test('Modified panels and special-fitment models never treated as verified',()=>{for(const over of [{year:'2026',make:'Mazda',model:'CX-5',special:true},{year:'2026',make:'Tesla',model:'Cybertruck'}]){const r=priced(over);assert.equal(r.special,true);assert.equal(r.verified,false);assert.equal(r.type,'ballpark')}});
test('Invalid choices fail instead of silently underpricing',()=>{assert.throws(()=>E.ppfPrice('bad','pp5','sedan','easy'));assert.throws(()=>priced({tint:true,front:999}));assert.throws(()=>priced({glass:true,glassFilm:'free'}));assert.throws(()=>E.ppfPrice('custom','pp5','sedan','easy',['unknown']))});

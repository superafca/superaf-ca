/** Run from the repository: node --experimental-strip-types scripts/build-design-lab-prices.mjs
 * Reads existing pricing functions; changes no business rates or production integrations.
 */
import * as site from '../src/lib/site.ts';
import { MAKES } from '../src/lib/vehicles.ts';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
function blob(path) { const b=readFileSync(new URL(path,root)); return createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'); }
const films=['pp5','pp10'], ranks=['easy','medium','hard'], bands=['sedan','mid','truck'];
const filmBases=Object.fromEntries(films.map(f=>[f,Object.fromEntries(ranks.map(r=>[r,{front:site.filmFromPrice('front','sedan',f,r).from,max:site.filmFromPrice('max','sedan',f,r).from}]))]));
const sizeBumps=Object.fromEntries(bands.map(b=>[b,{front:site.filmFromPrice('front',b,'pp5','easy').from-filmBases.pp5.easy.front,max:site.filmFromPrice('max',b,'pp5','easy').from-filmBases.pp5.easy.max}]));
const tintTable=(counts,fn)=>Object.fromEntries(counts.map(n=>[n,{carbon:fn(n,'carbon'),ceramic:fn(n,'ceramic')}]));
const data={schema:1,source:{repository:'superafca/superaf-ca',ratePath:'src/lib/site.ts',rateBlob:blob('src/lib/site.ts'),vehiclePath:'src/lib/vehicles.ts',vehicleBlob:blob('src/lib/vehicles.ts')},currency:'CAD',taxMode:'not-calculated',verifiedPriceRecords:[],filmBases,sizeBumps,colourUpcharge:site.COLOUR_UPCHARGE,parts:site.customParts.map(({id,name,price})=>({id,name,price})),tintFront:tintTable([2,4],site.tintFrontPrice),tintRear:tintTable([3,5,7],site.tintRearPrice),tintWindshield:{carbon:site.tintWindshieldPrice('carbon'),ceramic:site.tintWindshieldPrice('ceramic')},tintVisor:{carbon:site.tintVisorPrice('carbon'),ceramic:site.tintVisorPrice('ceramic')},glass:{clear:site.glassPrice('clear'),tinted:site.glassPrice('tinted')},vehicles:MAKES.map(({name,models})=>({name,models:models.map(({name,from,to,rank,band})=>({name,from,to,rank,band}))}))};
const output='/* Review snapshot. Regenerate with scripts/build-design-lab-prices.mjs; do not edit prices here. */\nglobalThis.SUPERAF_PRICE_DATA = '+JSON.stringify(data)+';\n';
writeFileSync(new URL('public/design-lab/price-data.js',root),output);
console.log(`Refreshed ${data.vehicles.length} makes from the repository pricing source.`);

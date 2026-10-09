/* Visual estimator rules. No customer data, network, or approval inference. */
(() => {
'use strict';
const D=globalThis.SUPERAF_PRICE_DATA, E=globalThis.SuperafPriceEngine;
const shades={carbon:[5,18,25,36],ceramic:[5,14,21,32,45,65]};
const finishIds=['clear','satin','matte'];
const baseParts=['hood','fender-left','fender-right','bumper','mirror-left','mirror-right'];
const paths={
hood:'M60 182 C100 147 159 145 200 141 L480 146 L477 158 Q478 162 467 165 C430 171 401 180 383 193 L292 205 L88 203 Q66 194 60 182Z',
'fender-left':'',
'fender-right':'M480 145 L499 147 L521 154 Q530 213 540 281 L543 330 L536 335 C538 290 525 248 507 227 C493 209 480 205 463 212 Q452 218 445 232 L420 212 Q427 201 430 186 L398 191 Q432 169 476 164Z',
bumper:'M52 198 L89 205 L288 207 L431 185 L447 239 C430 266 422 305 419 345 L393 352 L54 345 L30 333 L34 260 L45 219Z M79 210 L297 215 L275 277 Q266 286 254 285 L107 282 Q88 276 79 248Z M286 209 L430 185 Q427 209 414 215 L302 238Z M54 198 L86 206 L90 221 L55 217Z M354 282 L367 282 L389 340 L369 342Z M60 306 L282 307 L292 352 L51 337Z',
'mirror-left':'M196 121 L211 115 L205 133 L197 129Z',
'mirror-right':'M552 123 Q570 108 589 113 Q607 113 614 123 L614 132 L553 141Z',
pillars:'M489 145 L526 66 Q537 48 556 43 L563 45 Q548 51 539 68 L502 149Z',
roof:'M341 38 Q361 32 402 32 L535 30 L547 36 L538 43 L390 43 L321 48Z',
lights:'M303 206 L426 187 L423 204 Q381 223 301 232Z M51 193 L77 204 L87 206 L86 220 L59 213Z',
doors:'M540 274 L632 253 L640 297 L550 323Z M641 252 L701 240 L701 294 L650 300Z',
cups:'M624 158 Q632 151 641 158 L643 170 L622 174Z M711 152 Q720 145 728 151 L730 162 L710 167Z',
rockers:'M550 316 L643 295 L699 285 L700 310 L551 343Z',
flares:'M408 310 Q422 220 462 205 Q493 188 517 228 Q536 267 541 321 L530 321 Q525 255 503 229 Q485 211 466 220 Q438 235 419 316Z',
grille:'M83 211 L286 214 L267 271 L107 269Z',
body:'M517 155 L613 151 L634 243 L643 305 L549 327 L542 260Z M620 152 L702 141 L715 210 L704 301 L649 305Z M708 141 L765 126 L784 154 L792 214 L782 240 Q765 183 744 197 Q721 204 710 252Z',
paintRoof:'M314 40 Q363 17 532 24 L549 35 L495 45 L351 45Z M561 28 L598 26 L684 42 L691 49 L605 39 L554 41Z',
frontGlass:'M532 140 L558 63 Q565 50 580 50 L597 50 L614 115 C586 104 566 111 553 124 L552 139 L539 143Z',
rearGlass:'M616 51 L666 56 Q693 58 711 73 L738 110 Q736 120 720 130 L630 139Z',
windshield:'M212 138 L304 63 Q327 48 352 46 L533 47 L491 145Z',
visor:'M299 63 Q327 48 352 46 L533 47 L525 65 L327 63 L279 79Z'
};
const addOns=D.parts.map(p=>({...p,visible:p.id!=='cups',applicability:'unknown',why:p.id==='grille'?'Only suitable painted grille pieces; not mesh, openings or textured plastic.':p.id==='flares'?'Only compatible painted flares. Textured arch trim is not implied.':'Fitment and exact scope need confirmation for the selected vehicle.'}));
function initial(){return {year:'',make:'',model:'',size:'',special:false,ppf:true,pack:'front',film:'pp5',finish:'clear',parts:[],pending:[],tint:false,tintFilm:'carbon',front:2,rear:0,zone:'none',frontShade:null,rearShade:null,zoneShade:null,glass:false,glassFilm:'clear',view:'front',compare:false};}
function normalize(s){
 const n={...initial(),...s};
 if(!finishIds.includes(n.finish))throw Error('Unsupported finish');
 if(n.film==='pp5'&&n.finish!=='clear')throw Error('Satin and Matte require the 10YR film');
 if(!['pp5','pp10'].includes(n.film))throw Error('Unknown PPF film');
 if(!Object.hasOwn(shades,n.tintFilm))throw Error('Unknown tint film');
 for(const key of ['frontShade','rearShade','zoneShade'])if(n[key]!==null&&!shades[n.tintFilm].includes(n[key]))throw Error('Shade not offered in selected film');
 if([...n.parts,...n.pending].some(id=>!D.parts.some(p=>p.id===id)))throw Error('Unknown add-on');
 n.parts=[...new Set(n.parts)];
 n.pending=[...new Set(n.pending)].filter(id=>D.parts.some(p=>p.id===id));
 return n;
}
function chooseExtra(s,id){
 const p=addOns.find(x=>x.id===id);if(!p||p.applicability==='unavailable')return normalize(s);
 const n={...s,pack:'custom',view:'custom',ppf:true};
 const key=p.applicability==='confirmed'?'parts':'pending';
 n[key]=s[key].includes(id)?s[key].filter(x=>x!==id):[...s[key],id];return normalize(n);
}
function chooseFilm(s,film){return normalize({...s,tintFilm:film,frontShade:null,rearShade:null,zoneShade:null});}
function chooseVehicle(s,patch){return normalize({...s,...patch,parts:[],pending:[]});}
function calculate(s){
 const n=normalize(s);
 const valid=n.parts.filter(id=>addOns.find(p=>p.id===id)?.applicability==='confirmed');
 const pending=n.pack==='custom'?[...new Set([...n.pending,...n.parts.filter(id=>!valid.includes(id))])]:[];
 const r=E.calculate({...n,parts:valid});
 const pendingAmount=pending.reduce((a,id)=>a+D.parts.find(p=>p.id===id).price,0);
 return {...r,pending,pendingAmount,conditionalMin:r.min+pendingAmount,conditionalMax:r.max+pendingAmount,verified:false};
}
function canRotate({manual,reduced,visible,inView,hovered,view}){return !manual&&!reduced&&visible&&inView&&!hovered&&view==='front';}
globalThis.SuperafVisualModel=Object.freeze({initial,normalize,calculate,chooseExtra,chooseFilm,chooseVehicle,canRotate,shades,paths,addOns,baseParts,finishIds});
})();

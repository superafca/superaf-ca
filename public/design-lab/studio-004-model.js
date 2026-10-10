/* Pricing and interaction state. No transport, contact identifiers or live tracking. */
(()=>{'use strict';
const D=globalThis.SUPERAF_PRICE_DATA,E=globalThis.SuperafPriceEngine;
const SHADES={carbon:[5,18,25,36],ceramic:[5,14,21,32,45,65]};
const FINISHES=['clear','satin','matte'];
const LIBRARY=[['f150','Ford','F-150','truck'],['crv','Honda','CR-V','compact-suv'],['model-y','Tesla','Model Y','ev-suv'],['rav4','Toyota','RAV4','compact-suv'],['tahoe','Chevrolet','Tahoe','full-suv'],['model-3','Tesla','Model 3','sedan'],['tucson','Hyundai','Tucson','compact-suv'],['mx5','Mazda','MX-5','sports']].map(([id,make,model,body])=>({id,make,model,body,assetReady:id==='crv'}));
function initial(){return {year:'',make:'',model:'',size:'',special:false,ppf:true,pack:'front',film:'pp5',parts:[],pending:[],finish:'clear',tint:false,tintFilm:'carbon',front:2,rear:0,zone:'none',frontShade:null,rearShade:null,zoneShade:null,glass:false,glassFilm:'clear',mode:'front',original:false,windowView:'side',selectedZone:'front'};}
function validate(s){const n={...initial(),...s};
 if(!['front','custom','max'].includes(n.pack)||!['front','custom','max','tint'].includes(n.mode))throw Error('Unsupported package');
 if(!['pp5','pp10'].includes(n.film)||!FINISHES.includes(n.finish))throw Error('Unsupported film or finish');
 if(n.film==='pp5'&&n.finish!=='clear')throw Error('Satin and Matte require 10YR');
 if(!Object.hasOwn(SHADES,n.tintFilm))throw Error('Unsupported tint film');
 if(![0,2,4].includes(n.front)||![0,3,5,7].includes(n.rear)||!['none','visor','windshield'].includes(n.zone))throw Error('Unsupported glass count or zone');
 for(const k of ['frontShade','rearShade','zoneShade'])if(n[k]!==null&&!SHADES[n.tintFilm].includes(n[k]))throw Error('Unavailable tint shade');
 if(!Array.isArray(n.pending)||n.pending.some(id=>!D.parts.some(p=>p.id===id)))throw Error('Unknown extra');
 n.pending=[...new Set(n.pending)];n.parts=[];return n;
}
function price(s){const n=validate(s),r=E.calculate(n);const pending=n.ppf&&n.pack==='custom'?n.pending:[];const extra=pending.reduce((sum,id)=>sum+D.parts.find(p=>p.id===id).price,0);return {...r,pending,extra,conditionalMin:r.min+extra,conditionalMax:r.max+extra,verified:false,version:'existing-tariff-004'};}
function toggleExtra(s,id){if(!D.parts.some(p=>p.id===id))throw Error('Unknown extra');return validate({...s,ppf:true,pack:'custom',mode:'custom',pending:s.pending.includes(id)?s.pending.filter(x=>x!==id):[...s.pending,id]});}
function selectShade(s,film,shade){const next={...s,tintFilm:film,original:false};if(film!==s.tintFilm)next.frontShade=next.rearShade=next.zoneShade=null;next[s.selectedZone+'Shade']=shade;return validate(next);}
function setVehicle(s,v){const match=D.vehicles.find(m=>m.name===v.make)?.models.find(m=>m.name===v.model);if(!match||!/^\d{4}$/.test(String(v.year))||Number(v.year)<2017||Number(v.year)>2027)throw Error('Choose an available year, make and model.');return validate({...s,...v,pending:[],parts:[]});}
function chooseRepresentative(s){const exact=LIBRARY.find(v=>v.make===s.make&&v.model===s.model);if(exact)return {...exact,exactName:true,exactModelYear:false};const matched=E.matchVehicle(s.year,s.make,s.model);const body=matched?.band==='truck'?'full-suv':matched?.band==='mid'?'compact-suv':'compact-suv';return {...LIBRARY.find(v=>v.body===body),exactName:false,exactModelYear:false};}
function createLocalLog(){let consent=false,events=[],sequence=0,last=new Map();const allowed=new Set(['quote_vehicle_selected','estimate_price_viewed','configuration_changed','estimate_continue_clicked']);return {
 setConsent(value){consent=value===true;if(!consent){events=[];sequence=0;last.clear();}},
 record(type,s){if(!consent||!allowed.has(type))return false;const r=price(s),vehicle=D.vehicles.find(m=>m.name===s.make)?.models.some(m=>m.name===s.model)&&/^\d{4}$/.test(String(s.year))?{year:s.year,make:s.make,model:s.model}:null;
 const config={vehicle,ppf:s.ppf,package:s.pack,film:s.film,finish:s.finish,pending:[...s.pending].sort(),tint:s.tint,tintFilm:s.tintFilm,front:s.front,rear:s.rear,zone:s.zone,frontShade:s.frontShade,rearShade:s.rearShade,zoneShade:s.zoneShade};
 const key=JSON.stringify(config);if(last.get(type)===key)return false;last.set(type,key);events.push({sequence:++sequence,type,configuration:config,displayed:{min:r.min,max:r.max,conditionalMin:r.conditionalMin,conditionalMax:r.conditionalMax,status:'estimate',priceVersion:r.version},scope:'sandbox-memory-only'});if(events.length>200)events.shift();return true;},
 count(){return events.length;},snapshot(){return JSON.parse(JSON.stringify(events));}
};}
globalThis.SuperafStudioModel=Object.freeze({initial,validate,price,toggleExtra,selectShade,setVehicle,chooseRepresentative,createLocalLog,SHADES,FINISHES,LIBRARY});})();

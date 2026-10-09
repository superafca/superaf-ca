/* CR-V visual implementation slice. Native DOM/SVG; all business calls remain disconnected. */
(() => {
'use strict';
const M=globalThis.SuperafVisualModel,D=globalThis.SUPERAF_PRICE_DATA;
if(!M||!D)throw Error('Price model unavailable');
const $=id=>document.getElementById(id),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:2,minimumFractionDigits:0}).format(n);
const themeNames={default:'Core',spring:'Valentine',summer:'Summer',autumn:'Autumn',winter:'Christmas'};
let returnFocus=null;
let state=M.initial(),zone='front',detailTrigger=null,confirmAction=null,summaryOpen=false,assetFailed=false;
const finishName=id=>({clear:'Gloss',satin:'Satin',matte:'Matte'})[id];
const pinInfo={pillars:[521,84,'A-pillars'],roof:[419,30,'Roof strip'],cups:[635,164,'Door cups'],lights:[354,211,'Headlights / fog'],doors:[604,277,'Lower doors'],grille:[181,242,'Grille'],rockers:[617,328,'Rockers'],flares:[462,217,'Fender flares']};
const detailViews={hood:'40 126 460 86',mirrors:'543 101 82 48',pillars:'477 28 94 133',roof:'282 0 280 67',cups:'607 138 52 50',lights:'285 174 159 71',doors:'527 232 185 123',grille:'60 193 253 103',rockers:'527 280 197 84',flares:'403 185 145 176'};
function applyTheme(t){const v=Object.hasOwn(themeNames,t)?t:'default';document.documentElement.dataset.skin=v;document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===v)));try{localStorage.setItem('superaf-design-lab-v2',v)}catch{}return v;}
let saved;try{saved=localStorage.getItem('superaf-design-lab-v2')}catch{}applyTheme(new URL(location.href).searchParams.get('skin')||saved);
document.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>{applyTheme(b.dataset.theme);$('v-live').textContent=themeNames[b.dataset.theme]+' selected. Price unchanged.';}));
function path(id,cl='',extra=''){return `<path d="${M.paths[id]}" data-panel="${id}" class="${cl}" fill-rule="evenodd" clip-rule="evenodd" ${extra}/>`;}
function svg({detail=null,prefix='stage'}={}){
 const front=state.ppf&&state.view!=='tint'&&state.view!=='max';
 const paintIds=[...M.baseParts,'body','paintRoof'];
 const paintShapes=paintIds.map(id=>path(id)).join('');
 const clipId=prefix+'-silhouette',paintId=prefix+'-paint',gradId=prefix+'-reflection';
 const visibleBase=front?M.baseParts.map(id=>path(id,'paint-mask')).join(''):'';
 const pending=state.pack==='custom'&&state.view==='custom'?state.pending:[];
 const extras=pending.filter(id=>M.addOns.find(p=>p.id===id)?.visible).map(id=>path(id,'pending-mask')).join('');
 const finish=state.view==='max'?`<g clip-path="url(#${paintId})" data-material-finish="${state.finish}"><rect width="800" height="446" fill="#e8ebef" opacity="${state.finish==='matte'?'.37':state.finish==='satin'?'.17':'0'}"/><path d="M-60 181 L784 104 L812 126 L-36 211Z" fill="url(#${gradId})" opacity="${state.finish==='clear'?'.68':state.finish==='satin'?'.22':'.04'}"/></g>`:'';
 function tintGlass(id,value,on){return on&&value!==null?path(id,'tint-mask',`fill="#031322" opacity="${(1-value/100)*.9}" data-vlt="${value}"`):'';}
 const tint=state.view==='tint'&&!state.compare?[tintGlass('frontGlass',state.frontShade,state.front>0),tintGlass('rearGlass',state.rearShade,state.rear>0),tintGlass(state.zone==='visor'?'visor':'windshield',state.zoneShade,state.zone!=='none')].join(''):'';
 const pins=state.view==='custom'&&!detail?Object.entries(pinInfo).map(([id,[x,y,label]],i)=>`<g class="pin" role="button" tabindex="0" aria-label="${esc(label)}: ${state.pending.includes(id)?'remove preview':'preview and request fitment check'}" aria-pressed="${state.pending.includes(id)}" data-pin="${id}" data-focus="pin-${id}" transform="translate(${x},${y})"><circle r="12"/><text y="3.5">${D.parts.findIndex(p=>p.id===id)+1}</text></g>`).join(''):'';
 const capLabel=front&&!detail?`<g aria-hidden="true"><path d="M587 110 L632 70 L717 70" fill="none" stroke="#183f80" stroke-width="1.4"/><rect x="625" y="46" width="145" height="24" rx="4" fill="white" stroke="#bdcde2"/><text x="634" y="62" fill="#183f80" font-family="Arial" font-size="11">Mirror caps included ✓</text></g>`:'';
 const selectedDetail=detail&&!['hood','mirrors'].includes(detail)&&M.paths[detail]?path(detail,'pending-mask'):'';
 const hiddenLabel=state.view==='custom'&&pending.includes('cups')&&!detail?`<g aria-hidden="true"><path d="M639 171 L690 171 L741 186" stroke="#183f80" fill="none"/><rect x="631" y="186" width="148" height="27" rx="4" fill="white" stroke="#bdcde2"/><text x="639" y="203" fill="#183f80" font-family="Arial" font-size="10">Door cups · view close-up ↗</text></g>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${detail?detailViews[detail]||'0 0 800 446':'0 0 800 446'}" class="${detail?'v-detail-svg':''}" role="${!detail&&state.view==='custom'?'group':'img'}" aria-label="${esc(detail?'Close-up of '+(pinInfo[detail]?.[2]||detail):state.view==='tint'?'Representative CR-V tint comparison':state.view==='max'?'Representative CR-V '+finishName(state.finish)+' finish study':'Representative CR-V coverage including mirror caps')}"><defs><clipPath id="${clipId}"><path d="M0 153 L187 139 L196 113 L283 54 L356 13 L598 8 L696 30 L726 62 L745 111 L786 143 L800 220 L800 446 L0 446Z"/></clipPath><clipPath id="${paintId}">${paintShapes}</clipPath><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="white" stop-opacity="0"/><stop offset=".5" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs><image href="${globalThis.SUPERAF_CRV_IMAGE||'crv-reference.webp'}" width="800" height="446" clip-path="url(#${clipId})" data-crv-image="true"/>${assetFailed?'':visibleBase+extras+finish+tint+selectedDetail+pins+capLabel+hiddenLabel}</svg>`;
}
const sceneSvg=svg;
function filmButtons(){return `<div class="v-line-title">Choose your film <small>HARD PP®</small></div><div class="v-film-grid" role="group" aria-label="PPF film">${[['pp5','5YR','Gloss'],['pp10','10YR','Gloss · Satin · Matte on MAX']].map(([id,title,copy])=>`<button type="button" data-film="${id}" data-focus="film-${id}" aria-pressed="${state.film===id}"><span>${title}<small>${copy}</small></span><span>${state.film===id?'SELECTED':'COMPARE ↗'}</span></button>`).join('')}</div>`;}
function stage(){
 const isTint=state.view==='tint',isMax=state.view==='max';
 $('v-stage').innerHTML=`<div class="v-stage-head"><div><strong>Honda CR-V</strong><small>REPRESENTATIVE VIEW · ${isTint?'SHADE STUDY':isMax?'FINISH STUDY':'COVERAGE STUDY'}</small></div>${isTint?`<button type="button" id="v-compare" data-focus="compare" aria-pressed="${state.compare}">${state.compare?'SHOW SELECTED':'COMPARE ORIGINAL'}</button>`:isMax?`<button type="button" id="v-finish-detail" data-focus="finish-detail">${finishName(state.finish)} · inspect finish ↗</button>`:'<button type="button" id="v-cap-detail" data-focus="cap-detail">MIRROR CAPS INCLUDED ↗</button>'}</div><div class="v-scene">${sceneSvg()}<span class="v-surface-label">${isTint?'SHADE IS ILLUSTRATIVE, NOT MEASURED VLT':isMax?'SAME PAINT. DIFFERENT LIGHT RESPONSE.':'HIGHLIGHT = COVERAGE, NOT COLOURED FILM'}</span>${isMax?`<div class="v-finish-crop">${sceneSvg({detail:'hood',prefix:'finish-inset'})}<span>${finishName(state.finish).toUpperCase()} / HOOD DETAIL</span></div>`:''}</div><div class="v-caption"><span><i></i>${isTint?'Only selected glass changes':isMax?'Illustrative finish comparison':'Included FRONT coverage'}</span><span>${state.view==='custom'?'Dashed areas = requested extras awaiting fitment check':isTint?'Original glass and lighting affect the result.':isMax?'Finish previews are not a physical finish guarantee.':'Both fenders and both mirror caps included.'}</span></div>${assetFailed?'<p class="v-mini-note">Image unavailable. Coverage, controls and prices remain usable.</p>':''}`;
 $('v-cap-detail')?.addEventListener('click',()=>openDetail('mirrors'));
 $('v-finish-detail')?.addEventListener('click',()=>openDetail('hood'));
 $('v-compare')?.addEventListener('click',()=>{state.compare=!state.compare;render();});
 document.querySelectorAll('[data-pin]').forEach(p=>{const act=()=>{state=M.chooseExtra(state,p.dataset.pin);render();};p.addEventListener('click',act);p.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();act();}});});
 document.querySelectorAll('[data-crv-image]').forEach(im=>im.addEventListener('error',()=>{if(!assetFailed){assetFailed=true;render();}}));
}
function controls(){
 let content='';
 if(state.view==='tint'){
  content=`<div class="v-line-title">Visual shade preview <label><input type="checkbox" id="v-builder-tint" ${state.tint?'checked':''}> Include tint in total</label></div><p class="v-mini-note">Choose a window group, then tap a shade. Each tap chooses the film and shade together.</p><div class="v-zone-tabs" role="group" aria-label="Window group">${[['front','Front'],['rear','Rear'],['zone','Windshield / visor']].map(([id,t])=>`<button type="button" data-zone="${id}" data-focus="zone-${id}" aria-pressed="${zone===id}">${t}</button>`).join('')}</div><div class="v-shades" role="group" aria-label="Film and shade">${Object.entries(M.shades).map(([film,values])=>`<div class="v-shade-row"><span>${film==='carbon'?'Carbon':'Ceramic'}</span>${values.map(v=>`<button type="button" style="--shade:${1-v/100}" data-shade="${v}" data-tint-film="${film}" data-focus="shade-${film}-${v}" aria-label="${film} ${v}% for ${zone} windows" aria-pressed="${state.tintFilm===film&&state[zone+'Shade']===v}">${v}%</button>`).join('')}</div>`).join('')}</div><div class="v-counts"><label>Front glass pieces<select id="v-front" data-focus="front-count">${[0,2,4].map(n=>`<option value="${n}" ${n===state.front?'selected':''}>${n||'None'}</option>`).join('')}</select></label><label>Rear glass pieces<select id="v-rear" data-focus="rear-count">${[0,3,5,7].map(n=>`<option value="${n}" ${n===state.rear?'selected':''}>${n||'None'}</option>`).join('')}</select></label><label>Extra glass zone<select id="v-tint-zone" data-focus="tint-zone">${[['none','None'],['visor','Visor strip'],['windshield','Windshield']].map(([id,t])=>`<option value="${id}" ${state.zone===id?'selected':''}>${t}</option>`).join('')}</select></label></div><p class="v-pending-note">${state.tintFilm==='carbon'?'Carbon':'Ceramic'} · Front: ${state.frontShade===null?'choose shade':state.frontShade+'%'} · Rear: ${state.rearShade===null?'choose shade':state.rearShade+'%'}. Switching film clears incompatible shades. Choosing a shade never silently adds glass pieces.</p><p class="v-mini-note">Illustrative appearance, not a measurement of installed VLT or confirmation of permitted use. Actual glass and lighting affect the result. Price follows the selected film and glass count.</p>`;
 }else{
  content=`<div class="v-inclusions">${['Full hood','Both front fenders','Front bumper','Mirror caps'].map(t=>`<span><b>✓</b>${t}</span>`).join('')}</div>`;
  if(state.view==='front')content+=`<p class="v-mini-note">The essentials, precisely defined. Grille, lights and additional trim are not included. Mirror caps are already in your base price.</p>${filmButtons()}`;
  if(state.view==='custom')content+=`<div class="v-line-title">Point. Pick. Protect. <small>${state.pending.length} extra${state.pending.length===1?'':'s'} requested</small></div><div class="v-extra-grid">${M.addOns.map((p,i)=>`<article class="v-extra" aria-selected="${state.pending.includes(p.id)}"><button type="button" data-extra="${p.id}" data-focus="extra-${p.id}" aria-pressed="${state.pending.includes(p.id)}"><span class="v-extra-top"><span>${String(i+1).padStart(2,'0')} / +${money(p.price)}</span><span class="v-check">✓</span></span><b>${esc(p.name)}</b><small>Menu reference · fitment check</small></button><button type="button" class="v-zoom" data-detail="${p.id}" data-focus="detail-${p.id}">SEE THE AREA ↗</button></article>`).join('')}</div><p class="v-pending-note">${state.pending.length?'Requested extras are shown with dashed outlines or callouts.':'Nothing extra selected. FRONT+ currently matches FRONT.'} Until suitability is confirmed, their menu prices appear separately—not inside the base subtotal.</p>${filmButtons()}`;
  if(state.view==='max')content=`<p class="v-mini-note">Every eligible painted exterior panel, including mirror caps. Glass, wheels, tyres and unpainted trim are not included.</p><div class="v-line-title">Same car. Choose your finish. <small>No colour-change option</small></div><div class="v-finish-tabs" role="group" aria-label="Full-body finish">${[['clear','Gloss','Sharp reflections'],['satin','Satin','A softer sheen · 10YR'],['matte','Matte','Diffuse reflections · 10YR']].map(([id,t,copy])=>`<button type="button" data-finish="${id}" data-focus="finish-${id}" aria-pressed="${state.finish===id}"><span class="v-material ${id}" aria-hidden="true"></span><strong>${t}</strong><small>${copy}</small></button>`).join('')}</div><p class="v-pending-note">Gloss, Satin and Matte are material studies on the same paint colour. The full vehicle stays fixed; only the paint reflection treatment changes.</p>${filmButtons()}`;
 }
 $('v-controls').innerHTML=content;
 document.querySelectorAll('[data-extra]').forEach(b=>b.addEventListener('click',()=>{state=M.chooseExtra(state,b.dataset.extra);render();}));
 document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>openDetail(b.dataset.detail)));
 document.querySelectorAll('[data-film]').forEach(b=>b.addEventListener('click',()=>{
  const film=b.dataset.film;
  if(film==='pp5'&&state.finish!=='clear'){confirm('Switch to 5YR Gloss?','The 5YR film is offered in Gloss. This changes the finish as well as the price.',()=>{state=M.normalize({...state,film,finish:'clear'});render();});return;}
  state=M.normalize({...state,film});render();
 }));
 document.querySelectorAll('[data-finish]').forEach(b=>b.addEventListener('click',()=>{
  const finish=b.dataset.finish;if(finish!=='clear'&&state.film==='pp5'){
   const old=M.calculate(state),next=M.calculate({...state,film:'pp10',finish});
   confirm('Use 10YR '+finishName(finish)+'?',`Satin and Matte require 10YR film. Your displayed estimate changes from ${money(old.min)}${old.hasRange?' and up':''} to ${money(next.min)}${next.hasRange?' and up':''}. Nothing changes until you confirm.`,()=>{state=M.normalize({...state,film:'pp10',finish});render();});
  }else{state=M.normalize({...state,finish});render();}
 }));
 document.querySelectorAll('[data-zone]').forEach(b=>b.addEventListener('click',()=>{zone=b.dataset.zone;render();}));
 document.querySelectorAll('[data-shade]').forEach(b=>b.addEventListener('click',()=>{
  const film=b.dataset.tintFilm;let n=state.tintFilm!==film?M.chooseFilm(state,film):{...state};
  n[zone+'Shade']=Number(b.dataset.shade);state=M.normalize(n);render();
 }));
 for(const id of ['front','rear'])$('v-'+id)?.addEventListener('change',e=>{state={...state,[id]:Number(e.target.value)};render();});
 $('v-builder-tint')?.addEventListener('change',e=>{state={...state,tint:e.target.checked};render();});
 $('v-tint-zone')?.addEventListener('change',e=>{state={...state,zone:e.target.value,zoneShade:null};render();});
}
function summary(){
 const r=M.calculate(state),vehicle=[state.year,state.make,state.model].filter(Boolean).join(' ');
 const models=D.vehicles.find(v=>v.name===state.make)?.models.filter(v=>!state.year||Number(state.year)>=v.from&&Number(state.year)<=v.to)||[];
 $('v-summary').innerHTML=`<div class="v-status-row"><span>${r.empty?'CHOOSE A SERVICE':r.hasRange?'BALLPARK':'ESTIMATE'}</span><span>YOUR PRICE</span></div><p class="v-quote-car">${esc(vehicle||'Browse first. Vehicle details are optional.')}</p><p class="v-price"><small>${r.hasRange?'Starting from':r.empty?'No services selected':'Selected services'}</small>${r.empty?'—':money(r.min)}</p><p class="v-tax">CAD · subtotal · tax not calculated<br>Extra preparation/removal work is not included.</p>${r.hasRange?`<div class="v-range"><b>${money(r.min)}–${money(r.max)}</b> across the priced vehicle categories. Select your vehicle to narrow the estimate.</div>`:''}<details class="v-vehicle" id="v-vehicle" ${summaryOpen?'open':''}><summary>Refine for my vehicle ↗</summary><div class="v-fields"><label>Year<select id="v-year" data-focus="year"><option value="">Any</option>${Array.from({length:10},(_,i)=>2026-i).map(y=>`<option ${String(y)===state.year?'selected':''}>${y}</option>`).join('')}</select></label><label>Make<select id="v-make" data-focus="make"><option value="">Choose</option>${D.vehicles.map(v=>`<option ${v.name===state.make?'selected':''}>${esc(v.name)}</option>`).join('')}</select></label><label>Model<select id="v-model" data-focus="model" ${!state.make?'disabled':''}><option value="">Choose</option>${models.map(v=>`<option ${v.name===state.model?'selected':''}>${esc(v.name)}</option>`).join('')}</select></label></div><p class="v-summary-note">The CR-V illustration is representative; it does not change to impersonate your selected vehicle. Changing the actual vehicle clears unconfirmed extra requests.</p></details><div class="v-price-lines">${r.lines.map(l=>`<div><span>${esc(l.label)}${l.id==='ppf'&&state.pack==='max'?'<br><small>'+finishName(state.finish)+'</small>':''}</span><strong>${l.min!==l.max?'from ':''}${money(l.min)}</strong></div>`).join('')}</div>${r.pending.length?`<div class="v-conditional"><b>REQUESTED · NOT IN SUBTOTAL</b><ul>${r.pending.map(id=>{const p=D.parts.find(p=>p.id===id);return `<li>${esc(p.name)}: menu reference +${money(p.price)}</li>`;}).join('')}</ul><span>With these extras, if suitable:</span><strong>${r.hasRange?'From ':''}${money(r.conditionalMin)}</strong>Illustrative combined estimate, not confirmed fitment or a verified quote.</div>`:''}<div class="v-counts"><label><input type="checkbox" id="v-include-ppf" ${state.ppf?'checked':''}> Include PPF</label><label><input type="checkbox" id="v-include-tint" ${state.tint?'checked':''}> Include tint</label></div><button class="btn" id="v-continue" data-focus="continue" ${r.empty?'disabled':''}>CONTINUE WITH THIS ESTIMATE ↗</button><button class="v-save" id="v-save" data-focus="save" ${r.empty?'disabled':''}>SAVE MY BREAKDOWN ↓</button><p class="v-summary-note">No request is sent from this preview. Browsing is not tracked. This revision uses the existing tariff estimates; the recovered LOW/HIGH review is held separately until film mapping is confirmed.</p>`;
 $('v-vehicle').addEventListener('toggle',e=>{if(e.target.isConnected)summaryOpen=e.target.open;});
 $('v-year').addEventListener('change',e=>{state=M.chooseVehicle(state,{year:e.target.value,model:''});render();});
 $('v-make').addEventListener('change',e=>{state=M.chooseVehicle(state,{make:e.target.value,model:''});render();});
 $('v-model').addEventListener('change',e=>{state=M.chooseVehicle(state,{model:e.target.value});render();});
 for(const k of ['ppf','tint'])$('v-include-'+k).addEventListener('change',e=>{state={...state,[k]:e.target.checked};render();});
 $('v-continue').addEventListener('click',()=>confirm('Your choices come with you.','This is where the live journey will carry your vehicle, package, finish, requested extras and tint shades into the contact step. No enquiry or booking has been sent in this sandbox.',null,'KEEP EXPLORING'));
 $('v-save').addEventListener('click',save);
 $('v-mobile-total').innerHTML=`<div><small>${r.hasRange?'BALLPARK':'ESTIMATE'} · CAD · TAX NOT CALCULATED</small><strong>${r.empty?'Choose a service':(r.hasRange?'From ':'')+money(r.min)}</strong></div><button type="button" id="v-see-breakdown">VIEW BREAKDOWN ↑</button>`;
 $('v-see-breakdown').addEventListener('click',()=>{$('v-summary').scrollIntoView({block:'start'});$('v-continue').focus({preventScroll:true});});
}
function render(){
 if($('v-vehicle'))summaryOpen=$('v-vehicle').open;
 const focus=document.activeElement?.getAttribute('data-focus');
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(state.view===b.dataset.mode)));
 stage();controls();summary();
 if(focus)document.querySelector(`[data-focus="${CSS.escape(focus)}"]`)?.focus({preventScroll:true});
}
function confirm(title,text,action,button='CONFIRM CHANGE'){
 detailTrigger=document.activeElement;returnFocus=detailTrigger?.getAttribute('data-focus');confirmAction=action;
 const d=$('v-confirm');d.innerHTML=`<h2 id="v-confirm-title">${esc(title)}</h2><p>${esc(text)}</p><div class="v-dialog-actions">${action?'<button type="button" id="v-cancel">KEEP CURRENT</button>':''}<button type="button" id="v-accept">${button}</button></div>`;
 $('v-cancel')?.addEventListener('click',()=>d.close());$('v-accept').addEventListener('click',()=>{const fn=confirmAction;d.close();fn?.();});d.showModal();
}
$('v-confirm').addEventListener('close',()=>{confirmAction=null;(returnFocus?document.querySelector(`[data-focus="${CSS.escape(returnFocus)}"]`):detailTrigger)?.focus();});
function openDetail(id){
 detailTrigger=document.activeElement;returnFocus=detailTrigger?.getAttribute('data-focus');const p=M.addOns.find(p=>p.id===id),d=$('v-detail');
 d.innerHTML=`<h2 id="v-detail-title">${esc(id==='mirrors'?'Mirror caps are included.':id==='hood'?finishName(state.finish)+' finish detail':p?.name||id)}</h2>${sceneSvg({detail:id,prefix:'detail'})}<p>${esc(id==='mirrors'?'Both cap shells are part of FRONT and FRONT+. Mirror glass, indicator lenses and stalks are not highlighted.':id==='hood'?'Same paint colour and camera. This is an illustrative reflection study, not a photograph of an installed finish.':p?.why||'Representative coverage area.')}</p>${p?'<p>Menu reference: '+money(p.price)+'. Opening this close-up does not select or charge for the item.</p>':''}<div class="v-dialog-actions"><button type="button" id="v-detail-close">BACK TO MY BUILD</button></div>`;
 $('v-detail-close').addEventListener('click',()=>d.close());d.showModal();
}
$('v-detail').addEventListener('close',()=>{(returnFocus?document.querySelector(`[data-focus="${CSS.escape(returnFocus)}"]`):detailTrigger)?.focus();});
function save(){
 const r=M.calculate(state),text=['SUPERAF.CA — VISUAL ESTIMATE PREVIEW',new Date().toISOString().slice(0,10),[state.year,state.make,state.model].filter(Boolean).join(' ')||'Vehicle not selected',
 'FRONT scope: full hood, both full front fenders, front bumper and both mirror caps.',...r.lines.map(l=>`${l.label}: ${money(l.min)}${l.min!==l.max?'–'+money(l.max):''}`),state.pack==='max'?'Finish: '+finishName(state.finish):'',
 ...r.pending.map(id=>{const p=D.parts.find(p=>p.id===id);return `REQUESTED ONLY, NOT IN SUBTOTAL: ${p.name}, menu reference +${money(p.price)}`;}),
 `Tint: ${state.tintFilm}; front ${state.frontShade??'not selected'}%; rear ${state.rearShade??'not selected'}%; ${state.zone} ${state.zoneShade??'not selected'}%.`,
 `Subtotal ${money(r.min)}${r.hasRange?'–'+money(r.max):''} CAD. Tax/extra preparation/removal not calculated. Not a verified quote.`,
 'Sandbox: nothing submitted, booked or charged.'].filter(Boolean).join('\n');
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='SUPERAF-visual-estimate.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{
 const view=b.dataset.mode;state={...state,view,compare:false};if(view!=='tint'){state.pack=view;state.ppf=true;}
 render();
}));
const mode=new URL(location.href).searchParams.get('mode');if(['front','custom','max','tint'].includes(mode)){state.view=mode;if(mode==='tint'){state.ppf=false;state.tint=true;}else state.pack=mode;}
render();
})();

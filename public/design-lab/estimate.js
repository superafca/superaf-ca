/* Isolated preview: prices first, contact last. No requests or customer records. */
(() => {
  'use strict';
  const D = globalThis.SUPERAF_PRICE_DATA, E = globalThis.SuperafPriceEngine;
  const dialog = document.getElementById('quote-dialog');
  if (!D || !E || !dialog) throw new Error('Estimate preview dependencies missing');
  dialog.classList.add('estimator');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => '$' + Number(n).toLocaleString('en-CA', {maximumFractionDigits:0});
  const start = () => ({year:'',make:'',model:'',size:'',special:false,ppf:true,pack:'front',film:'pp5',parts:[],finish:'clear',tint:false,tintFilm:'carbon',front:2,rear:0,zone:'none',glass:false,glassFilm:'clear'});
  let state = start(), active = 'ppf', trigger = null, opened = false, latest;
  const packText = {
    front:'Full hood, full fenders, front bumper, mirror caps, wrapped and tucked edges.',
    custom:'Everything in FRONT, plus only the extras you choose below.',
    max:'Every painted exterior panel. No FRONT+ extras charged separately.'
  };
  dialog.innerHTML = `<div class="e-scroll" id="e-scroll"><header class="e-head"><div class="e-head-top"><div class="e-brand">SUPER<em>AF.</em>CA</div><span class="e-lab">PRICE LAB / PREVIEW</span><button class="dialog-close" id="close-dialog" type="button" aria-label="Close estimate">×</button></div><h2 id="dialog-title">See the price.<br><em>Then decide.</em></h2><p>Your current options. A clearer starting point.<span class="e-no-contact">✓ No contact details needed</span></p><div class="e-tabs" role="group" aria-label="Configure a service"><button type="button" data-e-tab="ppf" aria-pressed="true">Paint protection <i class="e-tab-added" aria-hidden="true"></i></button><button type="button" data-e-tab="tint" aria-pressed="false">Window tint <i class="e-tab-added" aria-hidden="true" hidden></i></button><button type="button" data-e-tab="glass" aria-pressed="false">Glass protection <i class="e-tab-added" aria-hidden="true" hidden></i></button></div></header>
  <div class="e-layout"><div class="e-builder"><details class="e-vehicle" id="e-vehicle"><summary>Fine-tune for your vehicle <span>optional · prices already visible</span></summary><div class="e-car-fields"><label class="e-field">Year<select id="e-year"><option value="">Choose year</option>${Array.from({length:10},(_,i)=>2026-i).map(y=>`<option>${y}</option>`).join('')}<option value="other">Other year</option></select></label><label class="e-field">Make<select id="e-make"><option value="">Choose make</option>${D.vehicles.map(v=>`<option>${esc(v.name)}</option>`).join('')}<option value="other">Not listed</option></select></label><label class="e-field">Model<select id="e-model" disabled><option value="">Choose make first</option></select></label></div><div class="e-other-size" id="e-other-size" hidden><label class="e-field">Size for a ballpark<select id="e-size"><option value="">All sizes</option><option value="sedan">Sedan / crossover</option><option value="mid">Midsize SUV / truck</option><option value="truck">Truck / full-size SUV</option></select></label></div><p class="e-vehicle-note" id="e-vehicle-note">Year, make and model refine the estimate. You can skip this and keep browsing.</p><label class="e-special"><input type="checkbox" id="e-special">Existing film, damaged paint or modified panels? Extra work is not included in these base prices.</label></details>
  <section id="e-panel-ppf" class="e-panel" aria-label="Paint protection options"><p class="e-step">01 / CHOOSE YOUR COVERAGE</p><div class="e-section-title"><h3>Paint protection.</h3><label class="e-include"><input type="checkbox" id="e-ppf" checked>Include PPF</label></div><p class="e-off-note" id="e-ppf-off" hidden>PPF is not in your total. Choose a package to add it.</p><div class="e-packages" role="group" aria-label="Paint protection package">${[['front','FRONT','The full front.'],['custom','FRONT+','FRONT + your extras.'],['max','MAX','Every painted panel.']].map(([id,title,copy])=>`<button type="button" class="e-package" data-package="${id}" aria-pressed="${id==='front'}"><span class="e-check" aria-hidden="true">✓</span><span class="e-coverage-icon" aria-hidden="true"><i></i></span><strong>${title}</strong><small>${copy}</small><span class="e-card-price" id="e-card-${id}"></span></button>`).join('')}</div><p class="e-coverage-copy"><b>INCLUDED</b><span id="e-coverage-copy"></span></p><div class="e-film-label"><span>02 / Choose your film</span><span class="kicker">HARD PP</span></div><div class="e-films" role="group" aria-label="PPF film"><label class="e-film"><input type="radio" name="e-film" value="pp5" checked><span>5YR<small>Clear · lower entry price</small></span></label><label class="e-film"><input type="radio" name="e-film" value="pp10"><span>10YR<small>More finish options on MAX</small></span><span class="e-delta" id="e-film-delta"></span></label></div><div id="e-extra-section" hidden><p class="e-extra-title">Pick your extras. Watch the price.</p><div class="e-extras">${D.parts.map(p=>`<label class="e-extra"><input type="checkbox" data-extra="${p.id}">${esc(p.name)}<span>+${money(p.price)}</span></label>`).join('')}</div><p class="e-extras-empty" id="e-extras-note"></p></div><div class="e-finish" id="e-finish-section" hidden><label class="e-field">MAX finish<select id="e-finish"><option value="clear">Clear</option><option value="matte">Matte · 10YR only</option><option value="satin">Satin · 10YR only</option><option value="colour">Colour · 10YR +$500</option></select></label></div></section>
  <section id="e-panel-tint" class="e-panel" aria-label="Window tint options" hidden><p class="e-step">01 / CHOOSE YOUR TINT</p><div class="e-section-title"><h3>Window tint.</h3><label class="e-include"><input type="checkbox" id="e-tint">Include tint</label></div><p class="e-off-note" id="e-tint-off">Tint is not in your total. Select Include tint to add these windows.</p><div class="e-films" role="group" aria-label="Tint film"><label class="e-film"><input type="radio" name="e-tint-film" value="carbon" checked><span>Carbon<small>The lower-price option</small></span></label><label class="e-film"><input type="radio" name="e-tint-film" value="ceramic"><span>Ceramic<small>Compare the upgrade</small></span></label></div><div class="e-tint-counts"><label class="e-field">Front windows<select id="e-front"><option value="0">None</option><option value="2" selected>2 front windows</option><option value="4">4 front windows</option></select></label><label class="e-field">Rear windows<select id="e-rear"><option value="0">None</option><option value="3">3 rear windows</option><option value="5">5 rear windows</option><option value="7">7 rear windows</option></select></label></div><fieldset class="e-tint-options"><legend>Windshield / visor — optional</legend>${[['none','No extra zone'],['windshield','Full windshield tint'],['visor','Visor strip only']].map(([id,label])=>`<label class="e-option"><input type="radio" name="e-zone" value="${id}" ${id==='none'?'checked':''}>${label}<span id="e-zone-${id}"></span></label>`).join('')}</fieldset><p class="e-panel-note">Choose the number of glass pieces, including small quarter windows. Shade can be chosen later; it does not change this menu price. Pricing is not confirmation of suitability or permitted use.</p></section>
  <section id="e-panel-glass" class="e-panel" aria-label="Glass protection options" hidden><p class="e-step">01 / PROTECT YOUR WINDSHIELD</p><div class="e-section-title"><h3>Glass protection.</h3><label class="e-include"><input type="checkbox" id="e-glass">Include glass</label></div><p class="e-off-note" id="e-glass-off">Glass protection is not in your total. Select Include glass to add it.</p><div class="e-glass-visual" aria-hidden="true"><div class="glass-sample"></div></div><fieldset class="e-tint-options"><legend>Choose your film</legend><label class="e-option"><input type="radio" name="e-glass-film" value="clear" checked>Clear protection<span>${money(D.glass.clear)}</span></label><label class="e-option"><input type="radio" name="e-glass-film" value="tinted">Tinted protection<span>${money(D.glass.tinted)}</span></label></fieldset><p class="e-panel-note">Glass protection is a separate protective film, not the same service as window tint. Fitment and appropriate use must be confirmed before installation.</p></section>
  <p class="e-preview-note">Same FRONT / FRONT+ / MAX structure and rate inputs as the current site. Sandbox only: changing options sends no requests.</p></div>
  <aside class="e-summary" id="e-summary" aria-label="Your price breakdown"><div class="e-price-label"><span><i></i><span id="e-status">BALLPARK</span></span><span>YOUR PRICE</span></div><div class="e-selected-car" id="e-selected-car"></div><div class="e-price-main" id="e-price" aria-live="polite" aria-atomic="true"></div><p class="e-currency">CAD · displayed subtotal · tax not calculated</p><div class="e-range" id="e-range"></div><p class="e-price-context" id="e-context"></p><button type="button" class="e-refine" id="e-refine">Refine for my car ↗</button><div class="e-lines" id="e-lines"></div><button type="button" class="btn" id="e-next">CONTINUE WITH THIS ESTIMATE <span aria-hidden="true">↗</span></button><button type="button" class="e-save" id="e-save">SAVE PRICE BREAKDOWN ↓</button><span class="e-no-contact">Browse freely. Contact comes after the price.</span><div class="e-next" id="e-next-info" tabindex="-1" hidden><p><b>Your price stays visible.</b>This is the handoff point in the live journey: carry these selections into the contact step. Booking is not connected in this sandbox; no request has been sent.</p></div><details class="e-source"><summary>How this price is calculated</summary><p>Uses a review snapshot of the current site's package rates, vehicle classifications and add-on prices. A vehicle match is an estimate, not a guaranteed quote. No verified-price approvals are loaded. Taxes and any extra preparation/removal work are not calculated here.</p></details></aside></div></div>
  <div class="e-mobile-total"><div><small id="e-mobile-status">BALLPARK · CAD</small><strong id="e-mobile-price"></strong></div><button type="button" id="e-breakdown">VIEW BREAKDOWN ↑</button></div>`;
  const $ = id => document.getElementById(id);
  function updateModels() {
    const select=$('e-model'), old=state.model;
    const group=D.vehicles.find(v=>v.name===state.make);
    const models=(group?.models||[]).filter(v=>!/^\d{4}$/.test(state.year)||Number(state.year)>=v.from&&Number(state.year)<=v.to);
    select.replaceChildren(new Option(group?'Choose model':'Choose make first',''));
    models.forEach(v=>select.add(new Option(v.name,v.name)));
    if (state.make) select.add(new Option('Not listed','other'));
    select.disabled=!state.make;
    state.model=models.some(v=>v.name===old)?old:state.make==='other'?'other':'';
    select.value=state.model;
  }
  function packagePrice(pack) {
    return E.calculate({...state,ppf:true,pack,tint:false,glass:false});
  }
  function render() {
    latest=E.calculate(state);
    dialog.querySelectorAll('[data-e-tab]').forEach(b=>{
      const id=b.dataset.eTab;
      b.setAttribute('aria-pressed',String(active===id));
      b.querySelector('i').hidden=!state[id];
      b.setAttribute('aria-label',`${id==='ppf'?'Paint protection':id==='tint'?'Window tint':'Glass protection'}${state[id]?', included in estimate':', not included'}`);
      $('e-panel-'+id).hidden=active!==id;
      $('e-'+id).checked=state[id];
      $('e-'+id+'-off').hidden=state[id];
    });
    dialog.querySelectorAll('[data-package]').forEach(b=>{
      const p=packagePrice(b.dataset.package);
      b.setAttribute('aria-pressed',String(state.ppf&&state.pack===b.dataset.package));
      $('e-card-'+b.dataset.package).innerHTML=(p.hasRange?'<b>From</b>':'')+money(p.min);
    });
    $('e-coverage-copy').textContent=packText[state.pack];
    $('e-extra-section').hidden=state.pack!=='custom';
    $('e-extras-note').textContent=state.parts.length?'Only checked extras are included.':'No extras yet: the coverage and price currently match FRONT.';
    $('e-finish-section').hidden=state.pack!=='max';
    Array.from($('e-finish').options).forEach(o=>o.disabled=state.film==='pp5'&&o.value!=='clear');
    $('e-finish').value=state.finish;
    const base5=E.calculate({...state,ppf:true,film:'pp5',finish:'clear',tint:false,glass:false});
    const base10=E.calculate({...state,ppf:true,film:'pp10',finish:'clear',tint:false,glass:false});
    const diffLow=base10.min-base5.min,diffHigh=base10.max-base5.max;
    $('e-film-delta').textContent=diffLow===diffHigh?'+'+money(diffLow):'from +'+money(Math.min(diffLow,diffHigh));
    $('e-zone-none').textContent='';
    $('e-zone-windshield').textContent='+'+money(D.tintWindshield[state.tintFilm]);
    $('e-zone-visor').textContent='+'+money(D.tintVisor[state.tintFilm]);
    $('e-other-size').hidden=!(state.year==='other'||state.make==='other'||state.model==='other');
    $('e-vehicle-note').textContent=latest.matched?'Model found in the current price catalog. Trim, condition and fitment still need confirmation.':'Unlisted or incomplete vehicles keep a ballpark instead of a false precise price.';
    const status=latest.empty?'CHOOSE A SERVICE':latest.special&&state.ppf?'BASE ESTIMATE':latest.type==='vehicle-estimate'?'VEHICLE ESTIMATE':latest.type==='menu-estimate'?'MENU ESTIMATE':'BALLPARK';
    $('e-status').textContent=status;
    $('e-selected-car').textContent=latest.matched?[state.year,state.make,state.model].join(' '):state.ppf?'No vehicle details required to browse.':'Based on your selected service and window count.';
    $('e-price').innerHTML=latest.empty?'<span class="e-empty-price">Pick your protection.</span>':(latest.hasRange?'<span class="e-from">Starting from</span>':'')+money(latest.min);
    $('e-range').hidden=!latest.hasRange;
    $('e-range').innerHTML=`<strong>${money(latest.min)} – ${money(latest.max)}</strong>Guide across priced vehicle sizes and installation categories. Extra work is not included.`;
    $('e-context').textContent=latest.empty?'Add at least one service to see a price.':latest.special&&state.ppf?'Base pricing only. Modified panels, condition, special fitment or film removal need a separate check; these are not priced here.':latest.type==='vehicle-estimate'?'Calculated using the current website rates for this model. This is not yet a guaranteed or verified quote.':latest.type==='menu-estimate'?'Calculated from the current menu for your selection. Confirm the window count and fitment before booking.':'Pick a year, make and model to narrow the guide. No name, phone or email is needed.';
    $('e-refine').hidden=!state.ppf||Boolean(latest.matched);
    $('e-lines').innerHTML=latest.lines.map(l=>`<div class="e-line"><span>${esc(l.label)}</span><span>${l.min!==l.max?'from ':''}${money(l.min)}</span></div>${l.id==='ppf'&&state.pack==='custom'?'<div class="e-line-detail">'+(state.parts.length?state.parts.map(id=>{const p=D.parts.find(p=>p.id===id);return esc(p.name)+' +'+money(p.price)}).join(' · '):'No extras selected')+'</div>':''}${l.id==='ppf'&&state.pack==='max'?'<div class="e-line-detail">'+esc(state.finish)+' finish'+(state.film==='pp10'&&state.finish==='colour'?' · $500 colour upgrade included':'')+'</div>':''}`).join('');
    $('e-next').disabled=latest.empty;$('e-save').disabled=latest.empty;
    $('e-mobile-status').textContent=status+' · CAD';
    $('e-mobile-price').textContent=latest.empty?'Choose a service':(latest.hasRange?'From ':'')+money(latest.min);
    $('e-next-info').hidden=true;
  }
  function syncControls() {
    for(const k of ['year','make','size','finish','front','rear']) $('e-'+k).value=String(state[k]);
    $('e-special').checked=state.special;
    for(const [name,key] of [['e-film','film'],['e-tint-film','tintFilm'],['e-zone','zone'],['e-glass-film','glassFilm']]) dialog.querySelectorAll(`input[name="${name}"]`).forEach(i=>i.checked=i.value===state[key]);
    dialog.querySelectorAll('[data-extra]').forEach(i=>i.checked=state.parts.includes(i.dataset.extra));
    updateModels();
  }
  dialog.querySelectorAll('[data-e-tab]').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.eTab;render()}));
  dialog.querySelectorAll('[data-package]').forEach(b=>b.addEventListener('click',()=>{state.pack=b.dataset.package;state.ppf=true;if(state.pack!=='max')state.finish='clear';render()}));
  for(const k of ['ppf','tint','glass','special']) $('e-'+k).addEventListener('change',e=>{state[k]=e.target.checked;render()});
  for(const k of ['year','make']) $('e-'+k).addEventListener('change',e=>{state[k]=e.target.value;if(k==='make')state.model='';updateModels();render()});
  for(const k of ['model','size','finish']) $('e-'+k).addEventListener('change',e=>{state[k]=e.target.value;render()});
  for(const k of ['front','rear']) $('e-'+k).addEventListener('change',e=>{state[k]=Number(e.target.value);render()});
  for(const [name,key] of [['e-film','film'],['e-tint-film','tintFilm'],['e-zone','zone'],['e-glass-film','glassFilm']]) dialog.querySelectorAll(`input[name="${name}"]`).forEach(i=>i.addEventListener('change',()=>{state[key]=i.value;if(key==='film'&&state.film==='pp5')state.finish='clear';render()}));
  dialog.querySelectorAll('[data-extra]').forEach(i=>i.addEventListener('change',()=>{state.parts=[...dialog.querySelectorAll('[data-extra]:checked')].map(x=>x.dataset.extra);render()}));
  $('e-refine').addEventListener('click',()=>{$('e-vehicle').open=true;$('e-year').focus();$('e-vehicle').scrollIntoView({block:'nearest'})});
  $('e-breakdown').addEventListener('click',()=>{$('e-summary').scrollIntoView({block:'start'});$('e-next').focus({preventScroll:true})});
  $('e-next').addEventListener('click',()=>{$('e-next-info').hidden=false;$('e-next-info').focus({preventScroll:true});$('e-next-info').scrollIntoView({block:'nearest'})});
  $('e-save').addEventListener('click',()=>{
    const text=['SUPERAF.CA — ESTIMATE PREVIEW',new Date().toISOString().slice(0,10),$('e-selected-car').textContent,
      ...latest.lines.map(l=>`${l.label}: ${money(l.min)}${l.min!==l.max?'–'+money(l.max):''}`),
      state.ppf&&state.pack==='custom'?'Included extras: '+state.parts.join(', '):'',
      `Subtotal: ${money(latest.min)}${latest.hasRange?'–'+money(latest.max):''} CAD`,
      'Tax not calculated. Extra preparation/removal work not included. Not a guaranteed or verified quote.',
      'Sandbox: nothing booked, sent or charged.'].filter(Boolean).join('\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='SUPERAF-estimate-preview.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}});
  function open(button, service) {
    trigger=button||null;
    const serviceId={'Paint protection film':'ppf','Window tint':'tint','Glass protection':'glass'}[service];
    if(serviceId){state={...start(),ppf:false,tint:false,glass:false,[serviceId]:true};active=serviceId;syncControls();}
    render();if(!dialog.open)dialog.showModal();if(!opened){$('e-scroll').scrollTop=0;opened=true;}
    $('close-dialog').focus({preventScroll:true});
  }
  globalThis.SuperafEstimator=Object.freeze({open});
  syncControls();render();
})();

(()=>{'use strict';
const names={default:'Core / Red, white & blue',spring:'Spring / Valentine',summer:'Summer / Sun, clouds & water',autumn:'Autumn / Copper',winter:'Winter / Christmas'};
const themes=Object.keys(names),key='superaf-design-lab-v2',root=document.documentElement,pills=[...document.querySelectorAll('[data-theme]')];
function safeRead(){try{return localStorage.getItem(key)}catch{return null}}
function applyTheme(value,announce=false){const theme=themes.includes(value)?value:'default';root.dataset.skin=theme;pills.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)));document.getElementById('edition-label').textContent=names[theme].toUpperCase();document.querySelector('meta[name="theme-color"]').content=getComputedStyle(root).getPropertyValue('--ink').trim();if(announce)document.getElementById('theme-announcement').textContent=names[theme]+' selected.';return theme}
function persistTheme(value){try{localStorage.setItem(key,value)}catch{}try{const url=new URL(location.href);url.searchParams.set('skin',value);history.replaceState(null,'',url)}catch{}}
const urlTheme=new URL(location.href).searchParams.get('skin');applyTheme(themes.includes(urlTheme)?urlTheme:safeRead());
pills.forEach(b=>b.addEventListener('click',()=>persistTheme(applyTheme(b.dataset.theme,true))));
let toastTimer;function toast(text){const el=document.getElementById('toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true},5000)}
document.getElementById('share').addEventListener('click',async()=>{const theme=root.dataset.skin;if(location.protocol==='file:'){toast('This is the offline copy. Current theme: '+names[theme]);return}try{const url=new URL(location.href);url.searchParams.set('skin',theme);await navigator.clipboard.writeText(url.href);toast('Link copied: '+names[theme])}catch{toast('Current theme is saved in the address bar. Copy the page address to share.')}});
const dialog=document.getElementById('quote-dialog'),result=document.getElementById('selection-result');let trigger=null;
function openQuote(button,service){trigger=button;result.hidden=true;result.textContent='';if(service)document.querySelectorAll('input[name=service]').forEach(r=>{r.checked=r.value===service});dialog.showModal()}
document.querySelectorAll('[data-quote]').forEach(b=>b.addEventListener('click',()=>openQuote(b)));
document.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',()=>openQuote(b,b.dataset.service)));
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{if(trigger)trigger.focus()});
document.getElementById('preview-selection').addEventListener('click',()=>{const selected=document.querySelector('input[name=service]:checked');result.textContent=(selected?selected.value:'No service')+' selected. Demo only — no estimate request has been sent.';result.hidden=false});
})();

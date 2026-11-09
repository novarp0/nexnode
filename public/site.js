const h=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=u=>/^(https?:\/\/|\/|#|mailto:|assets\/|[a-z0-9-]+\.html)/i.test(u||'')?h(u):'#';
const money=p=>{const n=parseFloat(String(p).replace(',','.'));return isNaN(n)?h(p):'€ '+n.toFixed(2).replace('.',',')};
const br=s=>h(s).replace(/\n/g,'<br>');
async function load(){
  for(const u of ['/api/content','content.default.json']){try{const r=await fetch(u,{cache:'no-store'});if(r.ok)return await r.json()}catch(e){}}
  throw new Error('Geen content');
}
function chrome(c){
  const s=c.settings;document.title=s.brand+' | Hosting';
  document.querySelector('#hdr').innerHTML=(s.promo?`<a class="promo" href="${url(s.promoLink)}">${h(s.promo)}</a>`:'')+
  `<nav><div class="w"><a class="logo" href="index.html"><img src="${url(s.logoImage)}" alt="">${h(s.brand)}</a>
  <div class="links"><a href="index.html#products">Producten</a><a href="index.html#locations">Locaties</a><a href="index.html#reviews">Reviews</a><a href="${url(s.discord)}">Discord</a></div>
  <a class="btn p" href="${url(s.panelUrl)}">Klantenpaneel</a></div></nav>`;
  document.querySelector('#ftr').innerHTML=`<footer><div class="w"><div class="cols">
  <div><div class="logo" style="margin-bottom:10px"><img src="${url(s.logoImage)}" alt="">${h(s.brand)}</div><p>${br(s.companyInfo)}</p></div>
  <div><h4>Categorieën</h4><ul>${c.categories.map(x=>`<li><a href="index.html#products">${h(x.icon)} ${h(x.name)}</a></li>`).join('')}</ul></div>
  <div><h4>Info</h4><ul>${c.pages.map(p=>`<li><a href="page.html?p=${encodeURIComponent(p.slug)}">${h(p.title)}</a></li>`).join('')}</ul></div>
  <div><h4>Contact</h4><ul><li><a href="mailto:${h(s.email)}">${h(s.email)}</a></li><li><a href="${url(s.discord)}">Discord</a></li></ul></div></div><p>${h(s.footerText)}</p></div></footer>`;
}
function home(c){
  const s=c.settings;let cat='all';
  const prods=()=>c.products.filter(p=>p.active!==false&&(cat==='all'||p.cat===cat));
  const draw=()=>{
    document.querySelector('#tabs').innerHTML=`<button class="tab ${cat==='all'?'on':''}" data-c="all">Alles</button>`+c.categories.map(x=>`<button class="tab ${cat===x.id?'on':''}" data-c="${h(x.id)}">${h(x.icon)} ${h(x.name)}</button>`).join('');
    const l=prods();
    document.querySelector('#plist').innerHTML=l.length?l.map(p=>`<div class="card">${p.badge?`<span class="badge">${h(p.badge)}</span>`:''}<h3>${h(p.name)}</h3><div class="d">${h(p.desc)}</div><div class="price">${money(p.price)} <small>/ ${h(p.period)}</small></div><ul>${String(p.features||'').split('\n').filter(Boolean).map(f=>`<li>${h(f)}</li>`).join('')}</ul><a class="btn p" style="display:block;text-align:center" href="${url(p.url)}">Bestellen</a></div>`).join(''):'<p class="empty">Nog geen producten in deze categorie.</p>';
  };
  document.querySelector('#app').innerHTML=`
  <header class="hero"><div class="w"><div><span class="pill">${h(s.tagline)}</span><h1>${h(s.heroTitle)}</h1><p>${h(s.heroText)}</p><a class="btn p" href="#products">${h(s.ctaText)}</a></div>
  <div class="art"><img src="${url(s.logoImage)}" alt="${h(s.brand)}"></div></div>
  <div class="w banner"><img src="${url(s.bannerImage)}" alt="${h(s.brand)} hosting"></div></header>
  <section id="products"><div class="w"><h2>${h(s.productsTitle)}</h2><div id="tabs" class="tabs"></div><div id="plist" class="grid"></div></div></section>
  <section><div class="w"><h2>${h(s.featuresTitle)}</h2><div class="grid" style="margin-top:20px">${c.features.map(f=>`<div class="card"><div class="ic">${h(f.icon)}</div><h3>${h(f.title)}</h3><div class="d">${h(f.text)}</div></div>`).join('')}</div></div></section>
  <section id="locations"><div class="w"><h2>${h(s.locationsTitle)}</h2><div class="grid" style="margin-top:20px;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">${c.locations.map(l=>`<div class="card loc"><span>${h(l.flag)}</span><div><b>${h(l.city)}</b><br><small>${h(l.country)}</small></div></div>`).join('')}</div></div></section>
  <section id="reviews"><div class="w"><h2>${h(s.reviewsTitle)}</h2><div class="grid" style="margin-top:20px">${c.reviews.map(r=>`<div class="card"><div class="stars">${'★'.repeat(Math.min(5,Math.max(0,parseInt(r.stars)||5)))}</div><p>${h(r.text)}</p><small style="color:var(--mute)">— ${h(r.name)}</small></div>`).join('')}</div></div></section>`;
  draw();
  document.querySelector('#tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(b){cat=b.dataset.c;draw()}});
}
function page(c){
  const slug=new URLSearchParams(location.search).get('p');const p=c.pages.find(x=>x.slug===slug);
  const el=document.querySelector('#app');
  if(!p){el.innerHTML='<div class="w pg"><h1>Pagina niet gevonden</h1><a class="btn" href="index.html">Terug</a></div>';return}
  document.title=p.title+' | '+c.settings.brand;
  el.innerHTML=`<div class="w pg"><h1>${h(p.title)}</h1>`+String(p.body).split(/\n\s*\n/).map(b=>b.split('\n').map(l=>l.startsWith('# ')?`<h2>${h(l.slice(2))}</h2>`:l.trim()?`<p>${h(l)}</p>`:'').join('')).join('')+'</div>';
}
load().then(c=>{chrome(c);(window.PAGE==='page'?page:home)(c)}).catch(()=>{document.querySelector('#app').innerHTML='<div class="w pg"><p>Kon de website niet laden.</p></div>'});

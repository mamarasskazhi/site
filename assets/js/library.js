(async()=>{
  const menuBtn=document.querySelector('.menu-toggle'),mobileNav=document.getElementById('mobile-menu');
  menuBtn?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open?'true':'false')});
  mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

  const all=(await MRData.loadStories()).filter(x=>x.published!==false);
  const grid=document.getElementById('story-grid'),count=document.getElementById('result-count'),search=document.getElementById('story-search'),theme=document.getElementById('theme-filter');
  let age='all',duration='all';
  function updateThemeOptions(){
    const current=theme.value||'all';
    const source=age==='all'?all:all.filter(x=>x.ageKey===age);
    const themes=[...new Set(source.map(x=>x.theme).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
    theme.innerHTML='<option value="all">Все темы</option>'+themes.map(t=>`<option value="${t.replace(/"/g,'&quot;')}">${t}</option>`).join('');
    if(themes.includes(current))theme.value=current;
  }
  updateThemeOptions();
  function clean(s){return String(s||'').toLocaleLowerCase('ru').replace(/ё/g,'е').trim()}
  function attachFallbacks(){grid.querySelectorAll('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{const fb=img.dataset.fallback;if(fb&&img.getAttribute('src')!==fb)img.src=fb},{once:true}))}
  function render(){
    const q=clean(search.value),th=theme.value;
    const items=all.filter(s=>
      (age==='all'||s.ageKey===age)&&
      (duration==='all'||s.duration===duration)&&
      (th==='all'||s.theme===th||clean(s.additionalThemes).includes(clean(th)))&&
      (!q||clean(`${s.title} ${s.theme} ${s.additionalThemes||''} ${s.teaser||''}`).includes(q))
    );
    count.textContent=`Найдено: ${items.length}`;
    if(!items.length){grid.innerHTML='<div class="empty-state" style="grid-column:1/-1"><strong>По этим фильтрам ничего не нашлось.</strong><br><span class="small">Попробуйте выбрать другой возраст, тему или время чтения.</span></div>';return}
    grid.innerHTML=items.map(s=>{
      const href=MRData.storyHref(s),fb=MRData.fallbackImage(s.ageKey),version=s.version==='Длинная'?'Большая':'Короткая';
      return `<article class="story-card"><a class="story-thumb" href="${href}" aria-label="Читать ${s.title}"><img loading="lazy" src="${s.image}" data-fallback="${fb}" alt="Иллюстрация к сказке ${s.title}"></a><div class="story-card-body"><div class="story-meta"><span class="meta-chip">${s.age}</span><span class="meta-chip">${s.duration}</span></div><h3><a href="${href}">${s.title}</a></h3><p>${s.teaser}</p><div class="story-meta"><span class="meta-chip">${s.theme}</span><span class="meta-chip">${version}</span></div><a class="story-card-link" href="${href}">Читать сказку →</a></div></article>`;
    }).join('');attachFallbacks();
  }
  document.querySelectorAll('#age-filters .filter-chip').forEach(btn=>btn.addEventListener('click',()=>{age=btn.dataset.age;document.querySelectorAll('#age-filters .filter-chip').forEach(x=>x.classList.toggle('active',x===btn));updateThemeOptions();render()}));
  document.querySelectorAll('#duration-filters .filter-chip').forEach(btn=>btn.addEventListener('click',()=>{duration=btn.dataset.duration;document.querySelectorAll('#duration-filters .filter-chip').forEach(x=>x.classList.toggle('active',x===btn));render()}));
  search.addEventListener('input',render);theme.addEventListener('change',render);
  document.getElementById('clear-filters').addEventListener('click',()=>{age='all';duration='all';search.value='';theme.value='all';updateThemeOptions();document.querySelectorAll('#age-filters .filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.age==='all'));document.querySelectorAll('#duration-filters .filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.duration==='all'));render();search.focus()});
  render();
})();

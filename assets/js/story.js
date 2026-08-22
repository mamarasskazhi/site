(async()=>{
  const menuBtn=document.querySelector('.menu-toggle'),mobileNav=document.getElementById('mobile-menu');
  menuBtn?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open?'true':'false')});
  mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));

  const param=new URLSearchParams(location.search).get('slug');
  const slug=document.body.dataset.storySlug||param;
  const stories=await MRData.loadStories();
  const story=stories.find(s=>s.slug===slug);
  const root=document.getElementById('story-root');
  if(!story){root.innerHTML='<div class="reading-header"><a class="back-link" href="skazki.html">← Все сказки</a><h1 class="story-title">Сказка не найдена</h1><p class="story-teaser-text">Возможно, ссылка изменилась или история пока не опубликована.</p><a class="btn btn-primary" href="skazki.html">Открыть библиотеку</a></div>';return}

  document.title=`${story.title} — Мама, расскажи`;
  const desc=document.querySelector('meta[name="description"]'); if(desc)desc.content=story.teaser||'Бесплатная детская сказка Мама, расскажи.';
  const fb=MRData.fallbackImage(story.ageKey);
  const paragraphs=String(story.text||'').split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
  const audio=story.audio?`<div class="audio-box visible"><strong>▶ Слушать сказку</strong><audio controls preload="none" src="${story.audio}"></audio></div>`:'';
  root.innerHTML=`
    <div class="reading-header">
      <a class="back-link" href="skazki.html">← Все сказки</a>
      <div class="story-meta"><span class="meta-chip">${story.age}</span><span class="meta-chip">${story.theme}</span><span class="meta-chip">${story.duration}</span></div>
      <h1 class="story-title">${story.title}</h1>
      <p class="story-teaser-text">${story.teaser}</p>
    </div>
    <div class="story-hero-image"><img id="story-image" src="${story.image}" data-fallback="${fb}" alt="Иллюстрация к сказке ${story.title}"></div>
    ${audio}
    <article class="story-text">${paragraphs.map(p=>`<p></p>`).join('')}</article>
    <section class="talk-box"><span class="kicker">Поговорите после сказки</span><p></p></section>
    <section class="upsell">
      <span class="kicker">Следующий уровень истории</span>
      <h2>Понравилась сказка? Сделайте следующую историей именно вашего ребёнка ✨</h2>
      <p>В книгах «Мама, расскажи» ваш ребёнок становится главным героем: со своим именем, внешностью и персональным персонажем на иллюстрациях. Это не просто сказка — это история, созданная специально для него.</p>
      <div class="upsell-covers" aria-label="Примеры персонализированных книг"><img src="assets/images/books/gorod-pochti.webp" alt="Город Почти"><img src="assets/images/books/okean-idey.webp" alt="Океан идей"><img src="assets/images/books/gorod-velikanov.webp" alt="Город великанов"></div>
      <a class="btn" href="https://t.me/mama_rasskazhi_bot" target="_blank" rel="noopener">Создать книгу для моего ребёнка</a>
    </section>`;
  root.querySelectorAll('.story-text p').forEach((el,i)=>el.textContent=paragraphs[i]);
  root.querySelector('.talk-box p').textContent=story.question||'А что тебе запомнилось больше всего в этой истории?';
  const img=document.getElementById('story-image');img.addEventListener('error',()=>{if(img.getAttribute('src')!==fb)img.src=fb},{once:true});
})();

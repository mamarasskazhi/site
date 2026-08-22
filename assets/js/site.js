(() => {
  const BOT = 'https://t.me/mama_rasskazhi_bot';
  const SALE_END = Date.parse('2026-09-30T18:59:59Z'); // 30 сентября 23:59 по Ташкенту
  const saleActive = Date.now() <= SALE_END;
  const prices = saleActive ? {print:280000,digital:160000} : {print:350000,digital:200000};

  const BOOKS = [
    {id:'shapes',title:'Изучаем формы',age:'1-3',family:'one',gender:'universal',status:'soon',description:'Для малышей, которые только начинают знакомиться с формами, цветами и окружающими предметами. Подойдёт для развития внимания, первых понятий и словарного запаса.'},
    {id:'voices',title:'Кто как говорит?',age:'1-3',family:'one',gender:'universal',cover:'assets/images/books/kto-kak-govorit.webp',preview:'assets/images/previews/kto-kak-govorit.webp',description:'Для малышей, которые учатся повторять звуки, говорить первые слова и узнавать животных. Особенно подойдёт, если хочется больше вовлекать ребёнка в речь через игру и звукоподражание.'},
    {id:'ocean',title:'Океан идей',age:'3-7',family:'one',gender:'girl',cover:'assets/images/books/okean-idey.webp',preview:'assets/images/previews/okean-idey.webp',description:'Если ребёнок часто говорит «я не умею», копирует других или боится сделать что-то по-своему. История помогает развивать фантазию и увереннее выражать собственные идеи.'},
    {id:'almost',title:'Город Почти',age:'3-7',family:'one',gender:'universal',cover:'assets/images/books/gorod-pochti.webp',preview:'assets/images/previews/gorod-pochti.webp',description:'Если ребёнок быстро загорается новой идеей, но бросает дело на полпути или сдаётся, когда сразу не получается. Сказка мягко поддерживает усидчивость, терпение и привычку доводить начатое до конца.'},
    {id:'sunny',title:'Солнечный город',age:'3-7',family:'one',gender:'universal',cover:'assets/images/books/solnechnyy-gorod.webp',preview:'assets/images/previews/solnechnyy-gorod.webp',description:'Если ребёнок часто хочет то, что есть у других, быстро теряет интерес к своим игрушкам или ему кажется, что «у другого лучше». История помогает замечать ценность того, что уже есть.'},
    {id:'giants',title:'Город великанов',age:'3-7',family:'one',gender:'boy',cover:'assets/images/books/gorod-velikanov.webp',preview:'assets/images/previews/gorod-velikanov.webp',description:'Для детей, которые сравнивают себя с другими, переживают, что у них что-то получается хуже, или пока не замечают собственных сильных сторон. История показывает: каждый силён по-своему.'},
    {id:'lighthouses',title:'Три маяка',age:'3-7',family:'two',gender:'universal',cover:'assets/images/books/tri-mayaka.webp',preview:'assets/images/previews/tri-mayaka.webp',description:'Если старшему ребёнку трудно принять младшего, он ревнует, злится, что малыш «мешает», или пока не понимает его ценность. Сказка мягко помогает по-другому увидеть младшего ребёнка.'},
    {id:'kingdom',title:'Королевство напополам',age:'3-7',family:'two',gender:'universal',cover:'assets/images/books/korolevstvo-napopolam.webp',preview:'assets/images/previews/korolevstvo-napopolam.webp',description:'Если дети часто делят игрушки, территорию или внимание родителей, спорят «это моё» и не хотят уступать. История помогает говорить о ссорах, границах, компромиссах и умении договариваться.'}
  ];

  const money = n => n.toLocaleString('ru-RU') + ' сум';
  function applySaleState(){
    if(!saleActive){
      document.querySelectorAll('.js-sale-badge').forEach(el=>el.remove());
      document.querySelectorAll('.js-print-price').forEach(el=>{el.innerHTML='<strong>'+money(350000)+'</strong>'});
      document.querySelectorAll('.js-digital-price').forEach(el=>{el.textContent=money(200000)});
      document.querySelectorAll('.js-order-print').forEach(el=>el.textContent='350 000');
      document.querySelectorAll('.js-order-digital').forEach(el=>el.textContent='200 000');
    }
  }
  applySaleState();

  // Mobile menu
  const menuBtn=document.querySelector('.menu-toggle');
  const mobileNav=document.getElementById('mobile-menu');
  if(menuBtn&&mobileNav){
    menuBtn.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open?'true':'false')});
    mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));
  }

  // Reveal
  const reveals=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.07});
    reveals.forEach(el=>io.observe(el));
  } else reveals.forEach(el=>el.classList.add('visible'));

  // Catalog
  let currentAge='1-3',currentFamily='one',currentGender='all';
  const grid=document.getElementById('book-grid');
  const controls=document.getElementById('catalog-controls');
  const intro=document.getElementById('catalog-intro');
  const genderChips=document.getElementById('gender-chips');

  const genderLabel=g=>g==='girl'?'Для девочки':g==='boy'?'Для мальчика':'Универсальная';
  function cardMarkup(b){
    if(b.status==='soon') return `<article class="book-card soon-card"><div><div class="soon-icon">✦</div><h3>${b.title}</h3><p>${b.description}</p><span class="tag">Скоро в наличии</span></div></article>`;
    const context=b.family==='two'?'Для двоих детей':genderLabel(b.gender);
    const priceMarkup=saleActive?`<del>350 000</del><strong>280 000 сум</strong>`:`<strong>350 000 сум</strong>`;
    return `<article class="book-card">
      <div class="book-cover"><img loading="lazy" src="${b.cover}" alt="Обложка книги ${b.title}"><div class="book-tags"><span class="tag">${b.age.replace('-', '–')} лет</span>${b.age==='3-7'?`<span class="tag">${context}</span>`:''}</div></div>
      <div class="book-body"><h3>${b.title}</h3><p>${b.description}</p><div class="book-price">${priceMarkup}</div>
      <div class="book-actions"><button class="btn btn-secondary js-preview" type="button" data-id="${b.id}">Фрагмент</button><button class="btn btn-primary js-order" type="button" data-book="${b.title}" data-id="${b.id}">Заказать</button></div></div>
    </article>`;
  }
  function renderBooks(){
    if(!grid)return;
    if(currentAge==='7-9'){
      controls.hidden=true;
      intro.textContent='Готовим отдельную линейку персонализированных книг для школьного возраста.';
      grid.innerHTML='<article class="book-card soon-card" style="grid-column:1/-1"><div><div class="soon-icon">✦</div><h3>Книги для 7–9 лет в разработке</h3><p>В этом возрасте темы становятся тоньше, поэтому мы не спешим и готовим отдельные истории про уверенность, ошибки, отношения со сверстниками и самостоятельность.</p><span class="tag">Скоро</span></div></article>';
      return;
    }
    controls.hidden=currentAge!=='3-7';
    if(currentAge==='1-3') intro.textContent='Короткие понятные истории для первых слов, внимания и знакомства с миром.';
    else if(currentFamily==='two') intro.textContent='Истории для семей с двумя детьми: про ревность к младшему, делёж, границы и примирение.';
    else intro.textContent='Для одного ребёнка. Большинство историй универсальны; «Океан идей» и «Город великанов» имеют отдельное тематическое настроение.';
    let items=BOOKS.filter(b=>b.age===currentAge);
    if(currentAge==='3-7'){
      items=items.filter(b=>b.family===currentFamily);
      if(currentFamily==='one'&&currentGender!=='all')items=items.filter(b=>b.gender===currentGender);
    }
    grid.innerHTML=items.map(cardMarkup).join('');
    bindDynamicButtons();
  }
  document.querySelectorAll('.age-tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.age-tab').forEach(x=>{x.classList.toggle('active',x===btn);x.setAttribute('aria-selected',x===btn?'true':'false')});
    currentAge=btn.dataset.age;currentFamily='one';currentGender='all';
    controls?.querySelectorAll('[data-family]').forEach(x=>x.classList.toggle('active',x.dataset.family==='one'));
    genderChips?.querySelectorAll('[data-gender]').forEach(x=>x.classList.toggle('active',x.dataset.gender==='all'));
    if(genderChips)genderChips.hidden=false;
    renderBooks();
  }));
  controls?.querySelectorAll('[data-family]').forEach(btn=>btn.addEventListener('click',()=>{
    currentFamily=btn.dataset.family;controls.querySelectorAll('[data-family]').forEach(x=>x.classList.toggle('active',x===btn));
    currentGender='all';genderChips.querySelectorAll('[data-gender]').forEach(x=>x.classList.toggle('active',x.dataset.gender==='all'));genderChips.hidden=currentFamily==='two';renderBooks();
  }));
  genderChips?.querySelectorAll('[data-gender]').forEach(btn=>btn.addEventListener('click',()=>{currentGender=btn.dataset.gender;genderChips.querySelectorAll('[data-gender]').forEach(x=>x.classList.toggle('active',x===btn));renderBooks()}));

  // Modals
  const previewModal=document.getElementById('preview-modal');
  const orderModal=document.getElementById('order-modal');
  let selectedBook=null;
  function openModal(modal){if(!modal)return;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')}
  function closeModal(modal){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('modal-open')}
  document.querySelectorAll('.modal').forEach(m=>m.addEventListener('mousedown',e=>{if(e.target===m)closeModal(m)}));
  document.querySelectorAll('.modal-close').forEach(b=>b.addEventListener('click',()=>closeModal(b.closest('.modal'))));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal.open').forEach(closeModal)});

  function openPreview(id){
    const b=BOOKS.find(x=>x.id===id);if(!b||!b.preview)return;selectedBook=b;
    document.getElementById('preview-title').textContent=b.title;
    const img=document.getElementById('preview-image');img.src=b.preview;img.alt=`Фрагмент книги ${b.title}`;
    document.getElementById('preview-open').href=b.preview;openModal(previewModal);
  }
  function openOrder(book,id,forcedFormat){
    selectedBook=BOOKS.find(x=>x.id===id)||null;
    document.getElementById('order-book-name').textContent=book||'Любая книга';
    const radio=document.querySelector(`input[name="order-format"][value="${forcedFormat||'print'}"]`)||document.querySelector('input[name="order-format"][value="print"]');radio.checked=true;updateOrder(book,id);openModal(orderModal);
  }
  function updateOrder(book,id){
    const format=document.querySelector('input[name="order-format"]:checked')?.value||'print';
    document.getElementById('order-total').textContent=money(prices[format]);
    document.getElementById('order-gift').style.display=format==='print'?'block':'none';
    const bookSlug=(id||selectedBook?.id||'book').replace(/[^a-z0-9_-]/gi,'');
    document.getElementById('telegram-order').href=`${BOT}?start=order_${bookSlug}_${format}`;
  }
  document.querySelectorAll('input[name="order-format"]').forEach(r=>r.addEventListener('change',()=>updateOrder()));
  document.getElementById('preview-order')?.addEventListener('click',()=>{closeModal(previewModal);openOrder(selectedBook?.title,selectedBook?.id,'print')});

  function bindDynamicButtons(){
    document.querySelectorAll('.js-preview').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.addEventListener('click',()=>openPreview(btn.dataset.id))});
    document.querySelectorAll('.js-order').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.addEventListener('click',()=>openOrder(btn.dataset.book,btn.dataset.id,btn.dataset.format))});
  }
  bindDynamicButtons();
  renderBooks();

  // Story of the day
  async function renderStoryDay(){
    const host=document.getElementById('story-day');if(!host||!window.MRData)return;
    const stories=(await MRData.loadStories()).filter(x=>x.published!==false);
    if(!stories.length){host.innerHTML='<div class="story-day-copy"><h3>Библиотека готовится</h3><p>Скоро здесь появится первая бесплатная сказка.</p></div>';return}
    const now=new Date();const key=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);const story=stories[((key%stories.length)+stories.length)%stories.length];
    const fallback=MRData.fallbackImage(story.ageKey);const href=MRData.storyHref(story);
    host.innerHTML=`<div class="story-day-media"><img src="${story.image}" data-fallback="${fallback}" alt="Иллюстрация к сказке ${story.title}"></div><div class="story-day-copy"><span class="kicker">Сказка дня</span><div class="story-meta"><span class="meta-chip">${story.age}</span><span class="meta-chip">${story.duration}</span><span class="meta-chip">${story.theme}</span></div><h3>${story.title}</h3><p>${story.teaser}</p><a class="btn btn-primary" href="${href}">Читать сказку</a></div>`;
    const img=host.querySelector('img');img.addEventListener('error',()=>{if(img.src.endsWith(fallback))return;img.src=fallback},{once:true});
  }
  renderStoryDay();
})();

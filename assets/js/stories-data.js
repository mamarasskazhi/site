(function(){
  const ageKeyFrom = v => {
    const s=String(v||'').replace(/-/g,'–');
    if(s.includes('1–3')||s.includes('1–3')) return '1-3';
    if(s.includes('3–7')) return '3-7';
    return '7-9';
  };
  const ruMap={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
  function slugify(text){return String(text||'').toLowerCase().split('').map(c=>ruMap[c]??c).join('').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function parseCSV(text){
    const rows=[];let row=[],field='',q=false;
    for(let i=0;i<text.length;i++){
      const c=text[i],n=text[i+1];
      if(q){if(c==='"'&&n==='"'){field+='"';i++;}else if(c==='"'){q=false;}else field+=c;}
      else if(c==='"')q=true;
      else if(c===','){row.push(field);field='';}
      else if(c==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}
      else field+=c;
    }
    if(field.length||row.length){row.push(field);rows.push(row)}
    return rows;
  }
  function normHeader(h){return String(h||'').trim().toLocaleLowerCase('ru').replace(/ё/g,'е')}
  function remoteRows(csv){
    const rows=parseCSV(csv); if(rows.length<2)return [];
    const headers=rows[0].map(normHeader);
    const get=(r,names)=>{for(const name of names){const i=headers.indexOf(normHeader(name));if(i>=0)return r[i]||''}return ''};
    return rows.slice(1).map((r,idx)=>{
      const title=get(r,['Название']); if(!title)return null;
      const age=get(r,['Возраст'])||`${get(r,['Минимальный возраст'])}–${get(r,['Максимальный возраст'])} лет`;
      const version=get(r,['Версия'])||(/10/.test(get(r,['Продолжительность','Время чтения']))?'Длинная':'Короткая');
      const duration=get(r,['Продолжительность','Время чтения']);
      const topicId=get(r,['ID','ID темы'])||`remote-${idx+1}`;
      const slugBase=get(r,['Slug'])||slugify(title);
      const versionSlug=version.toLocaleLowerCase('ru').startsWith('кор')?'korotkaya':'dlinnaya';
      const published=get(r,['Опубликовано','Опубликовано: да/нет']);
      return {
        id:`${topicId}-${versionSlug}`,topicId,slug:`${slugBase}-${versionSlug}`,
        age,ageKey:ageKeyFrom(age),theme:get(r,['Тема']),additionalThemes:get(r,['Дополнительные темы']),version,duration,
        title,hero:get(r,['Герой']),teaser:get(r,['Краткое описание','Короткий анонс']),text:get(r,['Полный текст сказки','Текст сказки']),
        question:get(r,['Вопрос после сказки','Поговорите после сказки']),image:get(r,['URL изображения'])||`assets/images/stories/${slugBase}-${versionSlug}.webp`,
        audio:get(r,['URL аудио']),recommendedBook:get(r,['Рекомендуемая персонализированная книга']),
        published:!published||/^(да|yes|true|1)$/i.test(published.trim()),publicationDate:get(r,['Дата публикации']),source:'remote'
      };
    }).filter(Boolean).filter(x=>x.published);
  }
  async function loadStories(){
    const local=(window.MR_LOCAL_STORIES||[]).map(x=>({...x,source:'local'}));
    const url=window.MR_CONFIG&&window.MR_CONFIG.googleSheetCsvUrl;
    if(!url)return local;
    try{
      const res=await fetch(url,{cache:'no-store'}); if(!res.ok)throw new Error('CSV '+res.status);
      const remote=remoteRows(await res.text()); return remote.length?remote:local;
    }catch(e){console.warn('Не удалось загрузить Google Sheets, используется локальная библиотека.',e);return local}
  }
  function storyHref(story){return story.source==='remote'?`story.html?slug=${encodeURIComponent(story.slug)}`:`skazki/${story.slug}/`}
  function fallbackImage(ageKey){return `assets/images/stories/default-${ageKey||'3-7'}.webp`}
  window.MRData={loadStories,storyHref,fallbackImage,slugify};
})();

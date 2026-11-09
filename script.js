// Pick lightweight responsive photos from the maintained community photo bank.
async function loadHero(){
  const image=document.querySelector('#heroImage');
  if(!image)return;
  try{
    const response=await fetch('data/heroes.json',{cache:'no-store'});
    if(!response.ok)return;
    const photos=await response.json();
    const valid=Array.isArray(photos)?photos.filter(src=>typeof src==='string'&&/^images\/(?:optimized\/)?hero-\d+(?:-1200)?\.(jpe?g|png|webp)$/i.test(src)):[];
    if(!valid.length)return;
    const index=Math.floor(Math.random()*valid.length);
    const companion=document.querySelector('#heroCompanion');
    for(const [target,src] of [[image,valid[index]],[companion,valid[(index+2)%valid.length]]]){
      if(!target||target.getAttribute('srcset')?.includes(src))continue;
      const candidate=new Image();
      candidate.decoding='async';
      candidate.sizes=target.sizes;
      const srcset=src.includes('/optimized/')?`${src.replace('-1200.webp','-640.webp')} 640w, ${src} 1200w`:'';
      candidate.onload=()=>{target.srcset=srcset;target.src=src};
      if(srcset)candidate.srcset=srcset;
      candidate.src=src;
    }
  }catch(_){/* Keep the optimized fallback photos. */}
}
loadHero();

const eventList=document.querySelector('#eventList');
const countdown=document.querySelector('#countdown');
document.querySelector('#year').textContent=new Date().getFullYear();

const menu=document.querySelector('#mobileMenu');
const menuButton=document.querySelector('#menuButton');
const menuClose=document.querySelector('#menuClose');
let lastFocused;
function openMenu(){lastFocused=document.activeElement;menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Close menu');document.body.style.overflow='hidden';document.querySelector('main').inert=true;document.querySelector('footer').inert=true;menu.querySelector('a').focus()}
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');document.body.style.overflow='';document.querySelector('main').inert=false;document.querySelector('footer').inert=false;lastFocused?.focus()}
menuButton.addEventListener('click',()=>menu.hidden?openMenu():closeMenu());
menuClose.addEventListener('click',closeMenu);
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{
  if(menu.hidden)return;
  if(event.key==='Escape')closeMenu();
  if(event.key==='Tab'){
    const items=[...menu.querySelectorAll('button,a[href]')];
    const first=items[0],last=items[items.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
});
addEventListener('resize',()=>{if(innerWidth>700&&!menu.hidden)closeMenu()});
addEventListener('scroll',()=>document.querySelector('#navbar').classList.toggle('scrolled',scrollY>30),{passive:true});

const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function parseDescription(html=''){
  const holder=document.createElement('div');
  holder.innerHTML=html.replace(/<\/(?:p|div|li)>|<br\s*\/?>/gi,' ');
  const candidates=[...holder.querySelectorAll('a[href]')].map(node=>node.getAttribute('href'));
  candidates.push(...(holder.textContent.match(/https?:\/\/[^\s<>]+/gi)||[]));
  const links=candidates.map(value=>OnPurposeEvents.safeURL(value)).filter(Boolean);
  const link=links.find(OnPurposeEvents.isRegistrationURL)||links[0]||null;
  holder.querySelectorAll('a').forEach(node=>node.remove());
  const plain=holder.textContent.replace(/https?:\/\/[^\s]+/gi,'').replace(/(?:website|more info|learn more)\s*:\s*/gi,'').replace(/\s+/g,' ').trim();
  return {description:plain,link};
}
function startOfDay(date){const d=new Date(date);d.setHours(0,0,0,0);return d}
function formatDateRange(event,start){if(event.start.dateTime)return start.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})+' · '+start.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});const end=new Date(event.end.date+'T00:00:00');end.setDate(end.getDate()-1);const startLabel=start.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});if(end.getTime()===start.getTime())return startLabel+' · All day';return `${startLabel} – ${end.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}`}
function eventSchema(event,description,link){
  const schema={'@context':'https://schema.org','@type':'Event',name:event.summary,startDate:event.start.dateTime||event.start.date,endDate:event.end.dateTime||event.end.date,eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',description:description||event.summary,url:link||event.htmlLink,organizer:{'@type':'Organization',name:'On Purpose Young Adults',url:'https://onpurposeya.com'}};
  if(event.location){const place=OnPurposeEvents.locationDetails(event.location);schema.location={'@type':'Place',name:place.label,address:place.address}}
  return schema;
}
function descriptionPreview(description,limit=200){
  if(description.length<=limit)return description;
  const cut=description.slice(0,limit);
  const sentences=[...cut.matchAll(/[.!?](?=\s|$)/g)];
  const sentenceEnd=sentences.at(-1)?.index;
  if(sentenceEnd>limit*.65)return cut.slice(0,sentenceEnd+1);
  const lastSpace=cut.lastIndexOf(' ');
  return cut.slice(0,lastSpace>limit*.7?lastSpace:limit).trimEnd()+'…';
}
function renderEvent(event,index,featured=false){
  const {description,link}=parseDescription(event.description);
  const destination=link||event.htmlLink;
  const detailsId=`event-details-${index}`;
  const preview=descriptionPreview(description,featured?130:200);
  const more=preview!==description;
  const details=description?`<p class="event-description" id="${detailsId}" data-preview="${escapeHTML(preview)}" data-full="${escapeHTML(description)}">${escapeHTML(preview)}</p>${more?`<button class="event-read-more" type="button" aria-expanded="false" aria-controls="${detailsId}" aria-label="Read more about ${escapeHTML(event.summary)}">Read more</button>`:''}`:'';
  const label=link&&OnPurposeEvents.isRegistrationURL(link)?'RSVP':'More info';
  const action=`<a class="button event-button" href="${escapeHTML(destination)}" target="_blank" rel="noopener" aria-label="${label} for ${escapeHTML(event.summary)}">${label}</a>`;
  const place=OnPurposeEvents.locationDetails(event.location);
  const location=place.address?`<a class="event-location" href="https://maps.google.com/?q=${encodeURIComponent(place.address)}" target="_blank" rel="noopener" aria-label="Get directions to ${escapeHTML(place.address)}">${escapeHTML(place.label)}</a>`:`<p class="event-location">${escapeHTML(place.label)}</p>`;
  const heading=featured?'h2':'h3';
  const date=featured?'':`<div class="date-tile" aria-hidden="true"><span class="month">${event.startObject.toLocaleDateString('en-US',{month:'short'})}</span><span class="day">${event.startObject.getDate()}</span></div>`;
  return `<article class="event-card${featured?' event-featured':''}">${date}<div class="event-copy"><p class="event-meta">${escapeHTML(formatDateRange(event,event.startObject))}</p><${heading}>${escapeHTML(event.summary)}</${heading}>${location}${details}</div><div class="event-actions">${action}</div></article>`;
}
async function loadEvents(){
  const featured=document.querySelector('#featuredEvent');
  const moreSection=document.querySelector('#events');
  const fallback=document.querySelector('#subscriptionFallback');
  try{
    const response=await fetch('data/events.json',{cache:'no-store'});
    if(!response.ok)throw new Error('events unavailable');
    const data=await response.json();
    const now=new Date();
    const events=OnPurposeEvents.upcomingEvents(data.items,now);
    if(!events.length){
      const message='<p class="loading">No events are currently scheduled. Follow us on Instagram for the latest updates.</p>';
      if(featured)featured.innerHTML=message;else eventList.innerHTML=message;
      if(moreSection)moreSection.hidden=true;
      if(fallback)fallback.hidden=false;
      return;
    }
    const dayCount=Math.max(0,Math.ceil((startOfDay(events[0].startObject)-startOfDay(now))/86400000));
    countdown.textContent=dayCount===0?'Our next event is today':`Next event in ${dayCount} day${dayCount===1?'':'s'}`;
    if(featured){
      featured.innerHTML=renderEvent(events[0],'featured',true);
      eventList.innerHTML=events.map((event,i)=>renderEvent(event,i)).join('');
      if(moreSection)moreSection.hidden=false;
      if(fallback)fallback.hidden=true;
    }else eventList.innerHTML=events.map((event,i)=>renderEvent(event,i)).join('');
    const schema=document.createElement('script');
    schema.type='application/ld+json';
    schema.textContent=JSON.stringify(events.map(event=>{const parsed=parseDescription(event.description);return eventSchema(event,parsed.description,parsed.link)}));
    document.head.append(schema);
  }catch(error){
    const message='<p class="loading">We couldn’t load the calendar right now. <a href="https://instagram.com/onpurpose.ya">Check Instagram for the latest events.</a></p>';
    if(featured){featured.innerHTML=message;if(moreSection)moreSection.hidden=true;if(fallback)fallback.hidden=false}
    else eventList.innerHTML=message;
  }
}
document.addEventListener('click',event=>{
  const button=event.target.closest('.event-read-more');
  if(!button)return;
  const details=document.getElementById(button.getAttribute('aria-controls'));
  const isOpen=button.getAttribute('aria-expanded')==='true';
  button.setAttribute('aria-expanded',String(!isOpen));
  button.textContent=isOpen?'Read more':'Read less';
  button.setAttribute('aria-label',`${isOpen?'Read more':'Read less'} about ${button.closest('article').querySelector('h2,h3').textContent}`);
  details.textContent=isOpen?details.dataset.preview:details.dataset.full;
});
async function loadInstagram(){
  const grid=document.querySelector('#instagramGrid');
  try{
    const response=await fetch('data/instagram.json',{cache:'no-store'});
    if(!response.ok)throw new Error('gallery unavailable');
    const data=await response.json();
    grid.innerHTML=data.data.slice(0,4).map(post=>{
      const caption=(post.caption||'').split('\n').find(line=>line.trim())||'';
      const clean=caption.replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0E\uFE0F\u200D]/gu,'').trim();
      const short=clean.length>100?clean.slice(0,clean.lastIndexOf(' ',100))+'…':clean;
      return `<a class="gallery-item" href="${escapeHTML(post.permalink)}" target="_blank" rel="noopener" aria-label="Instagram post: ${escapeHTML(clean||'On Purpose community')}"><figure><img src="${escapeHTML(post.media_url)}" alt="${escapeHTML(clean||'On Purpose community')}" width="720" height="720" loading="lazy" decoding="async">${short?`<figcaption>${escapeHTML(short)}</figcaption>`:''}</figure></a>`;
    }).join('');
  }catch(error){grid.innerHTML='<p>Follow <a href="https://instagram.com/onpurpose.ya">@onpurpose.ya</a> to see life in our community.</p>'}
}
loadEvents();loadInstagram();

async function loadStudy(){
  const container=document.querySelector('#currentStudy');
  try{
    const response=await fetch('data/studies.json');
    if(!response.ok)return;
    const study=OnPurposeStudies.activeStudy(await response.json());
    if(!study)return;
    const link=OnPurposeStudies.safeURL(study.material_url);
    container.innerHTML=`<h3>${escapeHTML(study.title)}</h3>${study.description?`<p>${escapeHTML(study.description)}</p>`:''}${link?`<a class="quiet-link" href="${escapeHTML(link)}" target="_blank" rel="noopener">Study material</a>`:''}`;
    container.hidden=false;
  }catch(_){/* The weekly Sabbath School invitation remains available. */}
}
loadStudy();

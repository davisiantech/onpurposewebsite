// Pick from the maintained community photo bank on each visit.
async function loadHero(){
  const image=document.querySelector('#heroImage');
  if(!image)return;
  try{
    const response=await fetch('data/heroes.json');
    if(!response.ok)return;
    const photos=await response.json();
    const valid=Array.isArray(photos)?photos.filter(src=>typeof src==='string'&&/^images\/hero-[^/]+\.(jpe?g|png|webp)$/i.test(src)):[];
    if(valid.length){
      const candidate=new Image();
      candidate.onload=()=>{image.src=candidate.src};
      candidate.src=valid[Math.floor(Math.random()*valid.length)];
    }
  }catch(_){/* Keep the fallback group photo. */}
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
function parseDescription(html=''){const holder=document.createElement('div');holder.innerHTML=html;const anchor=holder.querySelector('a[href]');const link=anchor?.href||holder.textContent.match(/https?:\/\/[^\s]+/)?.[0]||null;holder.querySelectorAll('a').forEach(node=>node.remove());const plain=holder.textContent.replace(/https?:\/\/[^\s]+/gi,'').replace(/(?:website|more info|learn more)\s*:\s*/gi,'').replace(/\s+/g,' ').trim();return{description:plain,link}}
function startOfDay(date){const d=new Date(date);d.setHours(0,0,0,0);return d}
function formatDateRange(event,start){if(event.start.dateTime)return start.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})+' · '+start.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});const end=new Date(event.end.date+'T00:00:00');end.setDate(end.getDate()-1);const startLabel=start.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});if(end.getTime()===start.getTime())return startLabel+' · All day';return `${startLabel} – ${end.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}`}
function locationLabel(location=''){return location.replace(/,?\s*(USA|United States|US)\b/gi,'').trim()||'Calhoun, GA'}
function eventSchema(event,description,link){const location=locationLabel(event.location);return{'@context':'https://schema.org','@type':'Event',name:event.summary,startDate:event.start.dateTime||event.start.date,endDate:event.end.dateTime||event.end.date,eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',location:{'@type':'Place',name:location,address:location},description:description||event.summary,url:link||event.htmlLink,organizer:{'@type':'Organization',name:'On Purpose Young Adults',url:'https://onpurposeya.com'}}}
async function loadEvents(){try{const response=await fetch('data/events.json');if(!response.ok)throw new Error('events unavailable');const data=await response.json();const now=new Date();const events=(data.items||[]).map(event=>({...event,startObject:new Date(event.start.dateTime||event.start.date+'T00:00:00')})).filter(event=>event.startObject>=startOfDay(now)).sort((a,b)=>a.startObject-b.startObject).slice(0,4);if(!events.length){eventList.innerHTML='<p class="loading">No events are currently scheduled. Follow us on Instagram for the latest updates.</p>';return}const dayCount=Math.max(0,Math.ceil((startOfDay(events[0].startObject)-startOfDay(now))/86400000));countdown.textContent=dayCount===0?'Our next event is today':`Next event in ${dayCount} day${dayCount===1?'':'s'}`;eventList.innerHTML=events.map((event,index)=>{const {description,link}=parseDescription(event.description);const destination=link||event.htmlLink;const detailsId=`event-details-${index}`;const action=link?`<a class="button button-clay event-button" href="${escapeHTML(destination)}" target="_blank" rel="noopener">RSVP / details</a>`:`<a class="calendar-arrow" href="${escapeHTML(destination)}" target="_blank" rel="noopener" aria-label="View ${escapeHTML(event.summary)} in Google Calendar">View in calendar</a>`;const details=description?`<p class="event-description" id="${detailsId}" hidden>${escapeHTML(description)}</p>${description?`<button class="event-read-more" type="button" aria-expanded="false" aria-controls="${detailsId}">Event details</button>`:''}`:'';return `<article class="event-card reveal"><div class="date-tile" aria-hidden="true"><span class="month">${event.startObject.toLocaleDateString('en-US',{month:'short'})}</span><span class="day">${event.startObject.getDate()}</span></div><div class="event-copy"><p class="event-meta">${escapeHTML(formatDateRange(event,event.startObject))} · ${escapeHTML(locationLabel(event.location))}</p><h3>${escapeHTML(event.summary)}</h3>${details}</div><div class="event-actions">${action}</div></article>`}).join('');const schema=document.createElement('script');schema.type='application/ld+json';schema.textContent=JSON.stringify(events.map(event=>{const parsed=parseDescription(event.description);return eventSchema(event,parsed.description,parsed.link)}));document.head.append(schema)}catch(error){eventList.innerHTML='<p class="loading">We couldn’t load the calendar right now. <a href="https://instagram.com/onpurpose.ya">Check Instagram for the latest events.</a></p>'}}

eventList.addEventListener('click',event=>{const button=event.target.closest('.event-read-more');if(!button)return;const details=document.querySelector(`#${button.getAttribute('aria-controls')}`);const isOpen=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!isOpen));button.textContent=isOpen?'Event details':'Hide details';details.hidden=isOpen;details.classList.toggle('expanded',!isOpen)});
async function loadInstagram(){const grid=document.querySelector('#instagramGrid');try{const response=await fetch('data/instagram.json');if(!response.ok)throw new Error('gallery unavailable');const data=await response.json();grid.innerHTML=data.data.slice(0,4).map((post,index)=>{const caption=(post.caption||'On Purpose community').split('\n')[0];return `<a class="gallery-item reveal" href="${escapeHTML(post.permalink)}" target="_blank" rel="noopener" aria-label="View Instagram post: ${escapeHTML(caption)}"><img src="${escapeHTML(post.media_url)}" alt="${escapeHTML(caption)}" width="720" height="720" loading="lazy" decoding="async"></a>`}).join('')}catch(error){grid.innerHTML='<p>Follow <a href="https://instagram.com/onpurpose.ya">@onpurpose.ya</a> to see life in our community.</p>'}}
loadEvents();loadInstagram();

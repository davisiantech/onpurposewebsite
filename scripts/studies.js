// Used by the hourly sync and homepage; no third-party dependencies.
(function(root){
  function parseCSV(text){
    const rows=[];let row=[],value='',quoted=false;
    for(let i=0;i<text.length;i++){
      const ch=text[i];
      if(ch==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++}else quoted=!quoted}
      else if(ch===','&&!quoted){row.push(value);value=''}
      else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(value);rows.push(row);row=[];value=''}
      else value+=ch;
    }
    if(quoted)throw new Error('Incomplete CSV');
    if(value||row.length){row.push(value);rows.push(row)}
    return rows;
  }
  function normalizeDate(value){
    const s=String(value||'').trim();
    const iso=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const us=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if(!iso&&!us)return null;
    const [year,month,day]=iso?iso.slice(1).map(Number):[Number(us[3]),Number(us[1]),Number(us[2])];
    const d=new Date(Date.UTC(year,month-1,day));
    if(d.getUTCFullYear()!==year||d.getUTCMonth()+1!==month||d.getUTCDate()!==day)return null;
    return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
  function safeURL(value){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:''}catch(_){return ''}}
  function fromCSV(text){
    const rows=parseCSV(text.replace(/^\uFEFF/,''));
    const headers=(rows.shift()||[]).map(h=>h.trim().toLowerCase());
    if(!['start_date','end_date','title'].every(h=>headers.includes(h)))throw new Error('Study Sheet is missing required columns');
    const studies=[];let attempted=0;
    for(const row of rows){
      const item=Object.fromEntries(headers.map((h,i)=>[h,(row[i]||'').trim()]));
      if(!item.title&&!item.start_date&&!item.end_date){
        if(item.description&&studies.length)studies[studies.length-1].description+=' '+item.description;
        continue;
      }
      attempted++;
      const start=normalizeDate(item.start_date),end=normalizeDate(item.end_date);
      if(!item.title||!start||!end||end<start)continue;
      studies.push({start_date:start,end_date:end,title:item.title,description:item.description||'',material_url:safeURL(item.material_url),quarter:item.quarter||'',year:item.year||''});
    }
    if(attempted&&!studies.length)throw new Error('No valid study date ranges; keeping previous snapshot');
    return studies.sort((a,b)=>a.start_date.localeCompare(b.start_date));
  }
  function activeStudy(studies,now=new Date()){
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const part=type=>parts.find(p=>p.type===type).value;
    const today=`${part('year')}-${part('month')}-${part('day')}`;
    return (Array.isArray(studies)?studies:[]).filter(s=>s&&typeof s.title==='string'&&s.title.trim()&&normalizeDate(s.start_date)&&normalizeDate(s.end_date)&&s.start_date<=today&&s.end_date>=today).sort((a,b)=>b.start_date.localeCompare(a.start_date))[0]||null;
  }
  const api={parseCSV,normalizeDate,safeURL,fromCSV,activeStudy};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.OnPurposeStudies=api;
})(typeof globalThis!=='undefined'?globalThis:this);

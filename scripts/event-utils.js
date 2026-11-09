(function(root){
  function locationDetails(value=''){
    const address=String(value).replace(/,?\s*(?:USA|United States|US)\s*$/i,'').replace(/\s+/g,' ').trim();
    if(!address)return {label:'Location details coming soon',address:''};
    const parts=address.split(',').map(s=>s.trim()).filter(Boolean);
    const street=parts.findIndex(part=>/^\d+\s/.test(part));
    if(street!==-1){
      const venue=parts.slice(0,street).join(', ');
      const area=parts.slice(street+1).map(part=>part.replace(/\s+\d{5}(?:-\d{4})?$/,'')).join(', ');
      return {label:[venue,area].filter(Boolean).join(' · ')||address,address};
    }
    return {label:address.replace(/\s+\d{5}(?:-\d{4})?$/,''),address};
  }
  function safeURL(value){try{const url=new URL(value);return /^https?:$/.test(url.protocol)?url.href:null}catch(_){return null}}
  function isRegistrationURL(value){
    try{
      const url=new URL(value);
      const host=url.hostname.toLowerCase();
      if(!/^https?:$/.test(url.protocol))return false;
      return host==='forms.gle'||host==='forms.google.com'||(host==='docs.google.com'&&url.pathname.startsWith('/forms/'))||host==='forms.office.com'||host==='forms.microsoft.com'||/(^|\.)(eventbrite\.[a-z.]+|rsvpify.com|ultracamp.com|jotform.com|typeform.com)$/.test(host)||/(?:^|[\/_-])(register|registration|rsvp|tickets?|sign-?up|sessiondetail)(?:[\/_?.-]|$)/i.test(url.pathname);
    }catch(_){return false}
  }
  function upcomingEvents(items,now=new Date()){
    const day=new Date(now);day.setHours(0,0,0,0);
    return (Array.isArray(items)?items:[]).filter(event=>event.status!=='cancelled'&&event.start&&event.end).map(event=>({...event,startObject:new Date(event.start.dateTime||event.start.date+'T00:00:00')})).filter(event=>event.startObject>=day).sort((a,b)=>a.startObject-b.startObject);
  }
  const api={locationDetails,safeURL,isRegistrationURL,upcomingEvents};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.OnPurposeEvents=api;
})(typeof globalThis!=='undefined'?globalThis:this);

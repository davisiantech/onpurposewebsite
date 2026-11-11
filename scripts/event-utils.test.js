const {test}=require('node:test');
const assert=require('node:assert/strict');
const {locationDetails,isRegistrationURL,safeURL,upcomingEvents}=require('./event-utils');

test('locations keep venue and city but omit street and postal code from the label',()=>{
  const value='Salt Palace Convention Center, 100 S W Temple St, Salt Lake City, UT 84101, USA';
  const result=locationDetails(value);
  assert.equal(result.label,'Salt Palace Convention Center · Salt Lake City, UT');
  assert.ok(result.address.includes('100 S W Temple St'));
  assert.equal(locationDetails('Calhoun, GA').label,'Calhoun, GA');
});
test('missing locations are never invented',()=>{
  assert.deepEqual(locationDetails(),{label:'',address:''});
});
test('forms and registration pages get RSVP while general event pages do not',()=>{
  for(const url of ['https://forms.gle/abcd','https://docs.google.com/forms/d/e/example/viewform','https://gycweb.org/register-now/','https://www.ultracamp.com/info/sessiondetail.aspx?idCamp=331'])assert.ok(isRegistrationURL(url),url);
  for(const url of ['https://ayp.me/convention/ignite','https://calendar.google.com/calendar/event?eid=123','https://example.com/events','javascript:alert(1)'])assert.equal(isRegistrationURL(url),false,url);
  assert.equal(safeURL('javascript:alert(1)'),null);
});
test('the calendar keeps every upcoming event and orders the next one first',()=>{
  const events=Array.from({length:7},(_,i)=>({summary:`Event ${i}`,start:{date:`2027-01-${String(i+1).padStart(2,'0')}`},end:{date:`2027-01-${String(i+2).padStart(2,'0')}`}})).reverse();
  const results=upcomingEvents(events,new Date('2027-01-01T00:00:00'));
  assert.equal(results.length,7);
  assert.equal(results[0].summary,'Event 0');
  assert.equal(results.at(-1).summary,'Event 6');
  assert.equal(upcomingEvents([{...events[0],status:'cancelled'}],new Date('2027-01-01T00:00:00')).length,0);
});

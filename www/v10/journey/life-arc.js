/* A single honest destination map. "Overview" stages use V8's documented,
   shorter life reader until individual cinematic acts are researched. */
(() => {
  'use strict';
  const root=document.getElementById('lifeArc');
  if(!root)return;
  const acts=[
    ['I','1921–1939','The Boy','/v10/journey/','CINEMATIC ACT'],
    ['II','1940–1943','The Artist','/v10/journey/act2/','CINEMATIC ACT'],
    ['III','1943–1951','The Dream','/v10/journey/act3/','CINEMATIC ACT'],
    ['IV','1952–1955','The First Film','/v10/journey/act4/','CINEMATIC ACT'],
    ['V','1956–1969','Finding His Voice','/v10/journey/act5/','CINEMATIC ACT'],
    ['VI','1970–1983','The Wider World','/v10/journey/act6/','CINEMATIC ACT'],
    ['VII','1984–1992','The Final Years','/v10/journey/act7/','CINEMATIC ACT'],
    ['VIII','1992 onward','The Legacy','/v10/journey/act8/','CINEMATIC ACT']
  ];
  const current=location.pathname.includes('/act8/')?7:location.pathname.includes('/act7/')?6:location.pathname.includes('/act6/')?5:location.pathname.includes('/act5/')?4:location.pathname.includes('/act4/')?3:location.pathname.includes('/act3/')?2:location.pathname.includes('/act2/')?1:0;
  const heading=document.createElement('h3');heading.textContent='His complete life · 1921–1992';
  const detail=document.createElement('p');detail.textContent='All eight narrative acts are now playable cinematic pilots. Their archival imagery and final production review remain in development.';
  const list=document.createElement('div');list.className='life-arc-grid';
  acts.forEach(([n,years,title,href,status],i)=>{
    const a=document.createElement('a');a.href=href;a.className='life-arc-link'+(i===current?' life-arc-current':'');
    const badge=document.createElement('span');badge.className='life-arc-number';badge.textContent=n;
    const middle=document.createElement('span');middle.className='life-arc-meta';
    const strong=document.createElement('strong');strong.textContent=title;
    const date=document.createElement('small');date.textContent=years;
    middle.append(strong,date);
    const state=document.createElement('span');state.className='life-arc-state';state.textContent=i===current?'YOU ARE HERE':status;
    a.append(badge,middle,state);
    if(i===current)a.setAttribute('aria-current','page');
    list.append(a);
  });
  root.append(heading,detail,list);
})();
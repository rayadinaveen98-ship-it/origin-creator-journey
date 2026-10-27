/* A single honest destination map. "Overview" stages use V8's documented,
   shorter life reader until individual cinematic acts are researched. */
(() => {
  'use strict';
  const root=document.getElementById('lifeArc');
  if(!root)return;
  const acts=[
    ['I','1921–1939','The Boy','/v10/journey/','CINEMATIC ACT'],
    ['II','1940–1943','The Artist','/v10/journey/act2/','CINEMATIC ACT'],
    ['III','1943–1951','The Dream','/life/#moment-7','RESEARCHED OVERVIEW'],
    ['IV','1952–1955','The First Film','/life/#moment-10','RESEARCHED OVERVIEW'],
    ['V','1956–1969','Finding His Voice','/life/#moment-11','RESEARCHED OVERVIEW'],
    ['VI','1970–1983','The Wider World','/life/#moment-12','RESEARCHED OVERVIEW'],
    ['VII','1984–1992','The Final Years','/life/#moment-14','RESEARCHED OVERVIEW'],
    ['VIII','1992 onward','The Legacy','/life/#moment-15','RESEARCHED OVERVIEW']
  ];
  const current=location.pathname.includes('/act2/')?1:0;
  const heading=document.createElement('h3');heading.textContent='His complete life · 1921–1992';
  const detail=document.createElement('p');detail.textContent='The first two acts are cinematic chapters. Later periods have shorter historical overviews while their narrative chapters are developed.';
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
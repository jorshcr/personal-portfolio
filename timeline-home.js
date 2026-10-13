(() => {
 const approvedDraft={"leadership": [{"id": "4e516c27-73e3-44c2-940c-ad0b0eae594c", "x": 18.5, "y": 122, "items": [{"title": "Became Outreach Director for FTC robotics club", "text": ""}]}, {"id": "8ac27f78-96ee-48c4-a0b1-8ff832bbcf9b", "x": 47, "y": 123, "items": [{"title": "Started an Engineering Education program ", "text": ""}]}, {"id": "fd22b5fa-d248-48f1-90cd-694b8e7abb0e", "x": 79.5, "y": 123, "items": [{"title": "Became Programming Chair for Theta Tau. Also started Robotics Club at USC.", "text": ""}]}, {"id": "3cbde0e5-50b7-4e48-b71b-c002feb81f27", "x": 91.5, "y": 227, "items": [{"title": "Still Leading Terra Labs as Director of Technology", "text": ""}]}], "technical": [{"id": "b69c5323-ed46-4601-b8a2-abd20d133f1b", "x": 42.5, "y": 121, "items": [{"title": "Test Engineering  Intern @ Space Vector Corporation", "text": ""}]}, {"id": "687914a4-c3e7-4dd3-ae8b-57e33c013148", "x": 67, "y": 121, "items": [{"title": "Interned for Test again @ Space Vector Corporation", "text": ""}]}, {"id": "e9e4b737-5373-4d2d-a43b-1dd51caea04a", "x": 88, "y": 123, "items": [{"title": "EE Intern @", "text": "Northrop Grumman"}]}]};
 window.destroyHomeTimeline=()=>{};
 window.initHomeTimeline=()=>{
  const root=document.querySelector('.selected-experiences');if(!root)return;
  const target=root.querySelector('.milestone-highlights');
  const buttons=[...root.querySelectorAll('[data-milestone-filter]')];
  target.classList.add('fixed-year-timeline');
  target.replaceChildren();
  const endpointLabel=document.createElement('span');
  endpointLabel.className='timeline-endpoint-label';
  endpointLabel.textContent='Current';
  target.append(endpointLabel);
  const ns='http://www.w3.org/2000/svg';
  const axis=document.createElementNS(ns,'svg');
  axis.classList.add('calendar-axis');axis.setAttribute('viewBox','0 0 800 52');axis.setAttribute('aria-hidden','true');
  const path=document.createElementNS(ns,'path');
  path.setAttribute('d','M1 1 V47 M1 24 H798 M790 16 L798 24 L790 32 '+[94,188,282,376,470,564,658,752].map(x=>`M${x} 13 V35`).join(' '));
  axis.append(path);target.append(axis);
  // Calendar anchors and shared life milestone never change with the filter.
  const branches=[];
  for(const year of [2023,2024,2025,2026]){
   const column=document.createElement('section');column.className='year-column';
   const heading=document.createElement('h2');heading.className='fixed-year';heading.textContent=year;
   const anchor=document.createElement('div');anchor.className='shared-milestone';
   const list=document.createElement('div');list.className='year-branches';list.setAttribute('aria-label',year+' experiences');
   column.append(heading,anchor,list);target.append(column);branches.push({year,list});
  }
  const otherMilestones=document.createElement('div');
  otherMilestones.className='other-milestones';
  const personalEvents=[
   {x:47,depth:48,text:'Joined student run company: DMS Solutions'},
   {x:235,depth:102,text:'Became Woodshop department manager'},
   {x:423,depth:48,text:'Started first business: AP Chem Tutoring'},
   {x:705,depth:48,text:'Co-founded first startup: UNIT Fitness'}
  ];
  target.append(otherMilestones);
  function show(category){
   target.classList.add('show-other');
   otherMilestones.hidden=false;
   otherMilestones.replaceChildren();
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.milestoneFilter===category)));
   const events=category==='other'?personalEvents.map(e=>({x:e.x/8,depth:e.depth,lines:[e.text]})):
    approvedDraft[category].map(e=>({x:e.x,depth:e.y-72,lines:e.items.flatMap(item=>[item.title,item.text]).filter(Boolean)}));
   events.forEach(event=>{
    const milestone=document.createElement('article');milestone.className='other-milestone';
    milestone.style.left=event.x+'%';milestone.style.setProperty('--stem-height',event.depth+'px');
    const text=document.createElement('p');
    event.lines.forEach((line,i)=>{if(i)text.append(document.createElement('br'));text.append(document.createTextNode(line));});
    milestone.append(text);otherMilestones.append(milestone);
   });
  }
  buttons.forEach(b=>b.onclick=()=>show(b.dataset.milestoneFilter));show('leadership');
 };
 window.initHomeTimeline();
})();

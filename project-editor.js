(() => {
// Editing tools are local-only; published visitors see the portfolio normally.
if(!['localhost','127.0.0.1'].includes(location.hostname))return;
const key='portfolio-project-drafts-v1';let drafts={};try{drafts=JSON.parse(localStorage.getItem(key))||{}}catch{}
// Preserve captions attached to the original media when reversing this gallery.
const scramblerDraft=drafts['Scrambler Humanoid Robot'];
if(scramblerDraft && !scramblerDraft.captionOrderReversed){
  const previous={...scramblerDraft};
  for(let i=0;i<4;i++){delete scramblerDraft['caption'+i];if(previous['caption'+(3-i)]!==undefined)scramblerDraft['caption'+i]=previous['caption'+(3-i)];}
  scramblerDraft.captionOrderReversed=true;
  try{localStorage.setItem(key,JSON.stringify(drafts))}catch{}
}

const fields=[['title','Project title'],['skills','Skills (comma separated)'],['overview','Short description'],['problem','Problem / Inspiration'],['contributions','Contributions'],['outcomes','Results / Outcomes'],['links','Links (one per line: Label | https://...)']];
function init(){document.querySelectorAll('.portfolio-project:not([data-editor])').forEach((card,i)=>{
card.dataset.editor='true';const id=card.querySelector('[data-gallery]')?.dataset.gallery||'project-'+i;
const paragraphs=[...card.querySelectorAll('.project-expanded-content p')];
const base={captionOrderReversed:true,title:card.querySelector('h2').textContent,skills:[...card.querySelectorAll('.project-skills span')].map(e=>e.textContent).join(', '),overview:card.querySelector('.project-overview').textContent,links:[...card.querySelectorAll('.project-links a')].map(a=>a.textContent+' | '+a.href).join('\n')};
['problem','contributions','outcomes'].forEach((k,j)=>{base[k]=paragraphs[j].textContent.slice(paragraphs[j].querySelector('strong').textContent.length).trim()});
const gallerySlides=window.projectGallerySlides?.[id] || [];
base.links=[...card.querySelectorAll('.project-links a')].map(a=>a.textContent+' | '+a.href).join('\n');
const captionFields=gallerySlides.map((slide,i)=>['caption'+i,'Image '+(i+1)+' caption']);
captionFields.forEach(([key],i)=>base[key]=gallerySlides[i].caption || '');
const allFields=[...fields,...captionFields];
let value={...base,...drafts[id]};
function apply(){window.setProjectCaptions?.(id,captionFields.map(([key])=>value[key]));card.querySelector('h2').textContent=value.title;card.querySelector('.project-overview').textContent=value.overview;const skills=card.querySelector('.project-skills');skills.replaceChildren();value.skills.split(',').map(t=>t.trim()).filter(Boolean).forEach(t=>{const span=document.createElement('span');span.textContent=t;skills.append(span)});['problem','contributions','outcomes'].forEach((k,j)=>{const label=paragraphs[j].querySelector('strong');paragraphs[j].replaceChildren(label,document.createTextNode(' '+value[k]))});const links=card.querySelector('.project-links');links.replaceChildren();const label=document.createElement('span');label.textContent='Links';links.append(label);let count=0;value.links.split('\n').forEach(line=>{const [name,...parts]=line.split('|');try{const url=new URL((parts.length?parts.join('|'):name).trim());if(!['https:','http:'].includes(url.protocol))return;const a=document.createElement('a');a.textContent=(parts.length?name.trim():'')||url.hostname;a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';links.append(a);count++}catch{}});if(!count){const placeholder=document.createElement('span');placeholder.textContent='Coming soon';links.append(placeholder)}}
apply();const button=document.createElement('button');button.className='edit-project-button';button.textContent='Edit project';card.append(button);
button.onclick=()=>{const panel=document.createElement('aside');panel.className='project-editor-panel';panel.setAttribute('aria-label','Project text editor');const heading=document.createElement('h2');heading.textContent='Edit project';panel.append(heading);const status=document.createElement('p');status.setAttribute('aria-live','polite');status.textContent='Live preview · drafts save in this browser.';panel.append(status);
function save(){drafts[id]={...value};try{localStorage.setItem(key,JSON.stringify(drafts));status.textContent='Draft saved in this browser.'}catch{status.textContent='Storage unavailable. Export to save your draft.'}}
allFields.forEach(([k,label])=>{const row=document.createElement('label');row.textContent=label;const input=document.createElement(k==='title'||k==='skills'?'input':'textarea');input.value=value[k];input.oninput=()=>{value[k]=input.value;apply();save()};row.append(input);panel.append(row)});
const actions=document.createElement('div');const close=document.createElement('button');close.textContent='Done';close.onclick=()=>{panel.remove();button.focus()};const exp=document.createElement('button');exp.textContent='Export all drafts';exp.onclick=()=>{save();const url=URL.createObjectURL(new Blob([JSON.stringify(drafts,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='project-text-drafts.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};const reset=document.createElement('button');reset.textContent='Reset project';reset.onclick=()=>{value={...base};apply();save();panel.querySelectorAll('input,textarea').forEach((e,j)=>e.value=value[allFields[j][0]])};actions.append(close,exp,reset);panel.append(actions);document.querySelector('.project-editor-panel')?.remove();document.body.append(panel);panel.querySelector('input').focus();panel.onkeydown=e=>{if(e.key==='Escape')close.click()};};
})}
init();new MutationObserver(init).observe(document.body,{childList:true});
})();

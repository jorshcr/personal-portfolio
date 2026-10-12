gsap.registerPlugin(ScrollTrigger);
const scroller=document.querySelector('#scroller'),scene=document.querySelector('.scene'),articles=gsap.utils.toArray('.stories article'),dots=gsap.utils.toArray('.dot');
const descriptions={dots:'A fine line with simple dots. Only academic stages are labeled.',chapters:'A single pastel blue band groups the timeline, with subtle school chapter labels.',segments:'A thicker, divided ribbon gives each stage its own section. Bolder progress feedback with the same compact story.'};
const positions=[0,0.25,0.5,0.75,1];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let context;
function setup(design){
 context?.revert();scroller.scrollTop=0;scene.className='scene '+design;
 document.querySelector('#description').textContent=descriptions[design];
 document.querySelectorAll('[data-design]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.design===design));
 context=gsap.context(()=>{
  gsap.set(articles,{autoAlpha:0,y:reduced?0:16});gsap.set(articles[0],{autoAlpha:1,y:0});
  gsap.set(dots,{scale:1,backgroundColor:'#ffffff',borderColor:'#cccccc',boxShadow:'0 0 0 0px rgba(190,221,242,0)'});
  const lit={scale:reduced?1:1.3,backgroundColor:'#beddf2',borderColor:'#8eafc5',boxShadow:'0 0 0 4px rgba(190,221,242,0.3)'};
  gsap.set(dots[0],lit);
  const axis='scaleX';gsap.set('.fill',{scaleX:1,scaleY:1,[axis]:0});
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#runway',scroller,start:'top top',end:()=>'+='+(scroller.scrollHeight-scroller.clientHeight),scrub:reduced?true:0.18,invalidateOnRefresh:true,onUpdate:self=>{let active=positions.reduce((active,position,i)=>self.progress+0.001>=position?i:active,0);articles.forEach((a,i)=>a.setAttribute('aria-hidden',i!==active));dots.forEach((d,i)=>d.setAttribute('aria-current',i===active?'step':'false'))}}});
  tl.to('.fill',{[axis]:1,duration:8},0);
  for(let i=1;i<positions.length;i++){
   const at=positions[i]*8;
   tl.to(articles[i-1],{autoAlpha:0,y:reduced?0:-14,duration:0.18},at-0.23)
     .to(articles[i],{autoAlpha:1,y:0,duration:0.2},at-0.2)
     .to(dots[i-1],{scale:1,boxShadow:'0 0 0 0px rgba(190,221,242,0)',duration:0.16},at-0.16)
     .to(dots[i],{...lit,duration:0.12},at-0.12);
  }
 });ScrollTrigger.refresh();history.replaceState(null,'','#'+design);
}
document.querySelectorAll('[data-design]').forEach(b=>b.onclick=()=>setup(b.dataset.design));
dots.forEach((d,i)=>d.onclick=()=>scroller.scrollTo({top:(scroller.scrollHeight-scroller.clientHeight)*positions[i],behavior:reduced?'instant':'smooth'}));
document.querySelector('#restart').onclick=()=>scroller.scrollTo({top:0,behavior:reduced?'instant':'smooth'});
setup(['dots','chapters','segments'].includes(location.hash.slice(1))?location.hash.slice(1):'segments');

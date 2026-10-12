gsap.registerPlugin(ScrollTrigger);
const scroller=document.querySelector('#scroller'),scene=document.querySelector('.scene'),articles=gsap.utils.toArray('.stories article'),dots=gsap.utils.toArray('.dot');
const descriptions={rail:'A minimal horizontal rail with a single story beneath. Closest to your original reference.',vertical:'A vertical spine on the left, with each story appearing on the right. Clear, editorial, and easy to scan.',card:'A soft pastel panel with a low horizontal rail. More visual emphasis while keeping the rest of Home quiet.'};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let context;
function setup(design){
 context?.revert();scroller.scrollTop=0;scene.className='scene '+design;
 document.querySelector('#description').textContent=descriptions[design];
 document.querySelectorAll('[data-design]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.design===design));
 context=gsap.context(()=>{
  gsap.set(articles,{autoAlpha:0,y:reduced?0:16});gsap.set(articles[0],{autoAlpha:1,y:0});
  gsap.set(dots,{scale:1,backgroundColor:'#ffffff',borderColor:'#aaaaaa',boxShadow:'0 0 0 0px rgba(190,221,242,0)'});
  const lit={scale:reduced?1:1.3,backgroundColor:'#beddf2',borderColor:'#111111',boxShadow:'0 0 0 7px rgba(190,221,242,0.35)'};
  gsap.set(dots[0],lit);
  const axis=design==='vertical'?'scaleY':'scaleX';gsap.set('.fill',{scaleX:1,scaleY:1,[axis]:0});
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#runway',scroller,start:'top top',end:()=>'+='+(scroller.scrollHeight-scroller.clientHeight),scrub:reduced?true:0.18,invalidateOnRefresh:true,onUpdate:self=>{let active=Math.min(3,Math.floor(self.progress*3+0.05));articles.forEach((a,i)=>a.setAttribute('aria-hidden',i!==active));dots.forEach((d,i)=>d.setAttribute('aria-current',i===active?'step':'false'))}}});
  tl.to('.fill',{[axis]:1,duration:3},0);
  for(let i=1;i<4;i++){
   tl.to(articles[i-1],{autoAlpha:0,y:reduced?0:-14,duration:0.18},i-0.23)
     .to(articles[i],{autoAlpha:1,y:0,duration:0.2},i-0.2)
     .to(dots[i-1],{scale:1,boxShadow:'0 0 0 0px rgba(190,221,242,0)',duration:0.16},i-0.16)
     .to(dots[i],{...lit,duration:0.12},i-0.12);
  }
 });ScrollTrigger.refresh();history.replaceState(null,'','#'+design);
}
document.querySelectorAll('[data-design]').forEach(b=>b.onclick=()=>setup(b.dataset.design));
dots.forEach((d,i)=>d.onclick=()=>scroller.scrollTo({top:(scroller.scrollHeight-scroller.clientHeight)*i/3,behavior:reduced?'instant':'smooth'}));
document.querySelector('#restart').onclick=()=>scroller.scrollTo({top:0,behavior:reduced?'instant':'smooth'});
setup(['rail','vertical','card'].includes(location.hash.slice(1))?location.hash.slice(1):'rail');

(() => {
gsap.registerPlugin(ScrollTrigger);
let context;
let observer;
window.destroyHomeTimeline=()=>{observer?.disconnect();observer=null;context?.revert();context=null;};
window.initHomeTimeline=()=>{
 window.destroyHomeTimeline();
 const root=document.querySelector('.home-timeline');if(!root)return;
 const scroller=root.querySelector('#scroller'),articles=[...root.querySelectorAll('article')],dots=[...root.querySelectorAll('.dot')];
 const resize=()=>root.style.setProperty('--timeline-height',scroller.clientHeight+'px');
 resize();observer=new ResizeObserver(()=>{resize();ScrollTrigger.refresh();});observer.observe(scroller);
 const positions=[0,0.25,0.5,0.75,1];
 articles.forEach(article=>{
  if(!article.querySelector('.story-content')){
   const content=document.createElement('div');content.className='story-content';
   while(article.firstChild)content.appendChild(article.firstChild);
   article.appendChild(content);
  }
 });
 // Reserve extra scroll distance with the full story visible before fading out.
 const readingPause=0.65;
 const starts=positions.map((position,i)=>position*8+i*readingPause);
 const total=9+positions.length*readingPause;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 articles.forEach((a,i)=>a.setAttribute('aria-hidden',i!==0));
 context=gsap.context(()=>{
  gsap.set(articles,{autoAlpha:0,y:reduced?0:16});gsap.set(articles[0],{autoAlpha:1,y:0});
  gsap.set(dots,{scale:1,backgroundColor:'#ffffff',borderColor:'#cccccc',boxShadow:'0 0 0 0px rgba(190,221,242,0)'});
  const lit={scale:reduced?1:1.3,backgroundColor:'#beddf2',borderColor:'#8eafc5',boxShadow:'0 0 0 4px rgba(190,221,242,0.3)'};
  gsap.set(dots[0],lit);
  const axis='scaleX';gsap.set('.fill',{scaleX:1,scaleY:1,[axis]:0});
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:root.querySelector('#runway'),scroller,start:'top top',end:()=>'+='+(scroller.scrollHeight-scroller.clientHeight),scrub:reduced?true:0.18,invalidateOnRefresh:true,onUpdate:self=>{let active=starts.reduce((active,start,i)=>self.progress*total+0.001>=start?i:active,0);articles.forEach((a,i)=>a.setAttribute('aria-hidden',i!==active));dots.forEach((d,i)=>d.setAttribute('aria-current',i===active?'step':'false'))}}});
  for(let i=1;i<positions.length;i++){
   tl.to('.fill',{[axis]:positions[i],duration:starts[i]-starts[i-1]},starts[i-1]);
  }
  articles.forEach((article,i)=>{
   const content=article.querySelector('.story-content');
   const start=starts[i];
   const end=i<positions.length-1?starts[i+1]:total;
   tl.fromTo(content,{y:0},{y:()=>-Math.max(0,content.offsetHeight-article.clientHeight),duration:end-start-readingPause-0.45,ease:'none'},start+0.15);
  });
  tl.to({}, {duration:total-starts[positions.length-1]},starts[positions.length-1]);
  for(let i=1;i<positions.length;i++){
   const at=starts[i];
   tl.to(articles[i-1],{autoAlpha:0,y:reduced?0:-14,duration:0.18},at-0.23)
     .to(articles[i],{autoAlpha:1,y:0,duration:0.2},at-0.2)
     .to(dots[i-1],{scale:1,boxShadow:'0 0 0 0px rgba(190,221,242,0)',duration:0.16},at-0.16)
     .to(dots[i],{...lit,duration:0.12},at-0.12);
  }
 },root);ScrollTrigger.refresh();
 dots.forEach((dot,i)=>dot.onclick=()=>scroller.scrollTo({top:(scroller.scrollHeight-scroller.clientHeight)*starts[i]/total,behavior:reduced?'instant':'smooth'}));
};
window.initHomeTimeline();
})();

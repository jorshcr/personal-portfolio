(() => {
 gsap.registerPlugin(ScrollTrigger);
 let context,observer;
 const sources=new WeakMap();
 window.destroyHomeTimeline=()=>{observer?.disconnect();context?.revert();observer=null;context=null;};
 window.initHomeTimeline=()=>{
  window.destroyHomeTimeline();
  const root=document.querySelector('.home-timeline');if(!root)return;
  const scroller=root.querySelector('#scroller'),stories=root.querySelector('.stories'),dots=[...root.querySelectorAll('.dot')];
  if(!sources.has(root))sources.set(root,[...stories.children].map(a=>a.cloneNode(true)));
  const slides=[],stages=[],starts=[];
  sources.get(root).forEach((source,stage)=>{
   starts.push(slides.length);
   const entries=[...source.querySelectorAll('.experience-entry')];
   const continuing=source.querySelector('.continuing-roles');
   const items=entries.length?[...entries]:[];
   if(continuing)items.push(continuing);
   if(!items.length){const note=source.querySelector('.experience-description');if(note)items.push(note);}
   items.forEach(item=>{
    const article=document.createElement('article');
    article.append(source.querySelector('.checkpoint-time').cloneNode(true),item.cloneNode(true));
    slides.push(article);stages.push(stage);
   });
  });
  stories.replaceChildren(...slides);
  const total=slides.length;
  root.querySelector('#runway').style.height=(scroller.clientHeight+total*380)+'px';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  context=gsap.context(()=>{
   gsap.set(slides,{autoAlpha:0,y:0});gsap.set(slides[0],{autoAlpha:1});
   gsap.set(dots,{scale:1,backgroundColor:'#fff',borderColor:'#ccc',boxShadow:'none'});
   const lit={scale:reduced?1:1.3,backgroundColor:'#beddf2',borderColor:'#8eafc5'};
   gsap.set(dots[0],lit);gsap.set('.fill',{scaleX:0,transformOrigin:'left'});
   const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:root.querySelector('#runway'),scroller,start:'top top',end:()=>'+='+(scroller.scrollHeight-scroller.clientHeight),scrub:reduced?true:.25,invalidateOnRefresh:true,onUpdate:self=>{
    const active=Math.min(total-1,Math.floor(self.progress*total+.001));
    slides.forEach((s,i)=>s.setAttribute('aria-hidden',i!==active));
    dots.forEach((d,i)=>d.setAttribute('aria-current',i===stages[active]?'step':'false'));
   }}});
   for(let i=1;i<total;i++){
    tl.to(slides[i-1],{autoAlpha:0,duration:.14},i-.28)
      .to(slides[i],{autoAlpha:1,duration:.14},i-.14);
   }
   for(let i=1;i<dots.length;i++){
    tl.to('.fill',{scaleX:i/(dots.length-1),duration:starts[i]-starts[i-1]},starts[i-1])
      .to(dots[i-1],{scale:1,duration:.15},starts[i]-.15)
      .to(dots[i],{...lit,duration:.15},starts[i]-.15);
   }
   tl.to({},{duration:1},total-1);
  },root);
  observer=new ResizeObserver(()=>{root.querySelector('#runway').style.height=(scroller.clientHeight+total*380)+'px';ScrollTrigger.refresh();});observer.observe(scroller);
  ScrollTrigger.refresh();
  dots.forEach((d,i)=>d.onclick=()=>scroller.scrollTo({top:(scroller.scrollHeight-scroller.clientHeight)*starts[i]/total,behavior:reduced?'instant':'smooth'}));
 };
 window.initHomeTimeline();
})();

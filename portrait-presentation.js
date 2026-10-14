// Fixed portrait presentation for the public portfolio.
(() => {
 function init() {
  const photo=document.querySelector('.home-page .portrait');if(!photo)return;
  const img=photo.querySelector('img');const width=224,height=180,zoom=1.33,x=32,y=78;
  photo.style.setProperty('width',width+'px','important');photo.style.setProperty('height',height+'px','important');
  const scale=Math.max(width/5184,height/3456)*zoom,w=5184*scale,h=3456*scale;
  Object.assign(img.style,{width:w+'px',height:h+'px',left:((width-w)*x/100)+'px',top:((height-h)*y/100)+'px'});
 }
 window.initPortraitPresentation=init;init();new MutationObserver(init).observe(document.body,{childList:true});
})();

(() => {
 function apply(){const heading=document.querySelector('[aria-label="FPGA Camera Vision Accelerator image gallery"]')?.closest('article')?.querySelector('h2');if(!heading)return;heading.classList.add('recent-project-title');heading.style.setProperty('--recent-star','url("assets/custom-star-gold.svg")');heading.title='Most recent project';}
 window.initRecentStar=apply;document.addEventListener('DOMContentLoaded',apply);apply();new MutationObserver(apply).observe(document.body,{childList:true});
})();

// One gallery implementation and image list for cards and dedicated pages.
(() => {
  function icon(button,path){button.textContent='';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const line=document.createElementNS(svg.namespaceURI,'path');line.setAttribute('d',path);svg.append(line);button.append(svg);}
  const images = {
    'FPGA Camera Vision Accelerator': [1, 2, 3].map(i => ({
      src: `assets/fpga-demo-${i}.svg`,
      alt: `FPGA gallery demo ${i} â€” illustrative placeholder, not actual project hardware`
    }))
  };
  function openExpanded(name, slides, initial, onChange, trigger) {
    const dialog=document.createElement('dialog');dialog.className='expanded-gallery';
    dialog.setAttribute('aria-label',name+' expanded gallery');
    const header=document.createElement('div');header.className='expanded-gallery-header';
    const title=document.createElement('span');title.textContent=name;
    const close=document.createElement('button');close.textContent='×';close.setAttribute('aria-label','Close gallery');
    header.append(close);
    const stage=document.createElement('div');stage.className='expanded-gallery-stage';
    const media=document.createElement('div');media.className='expanded-gallery-media';
    const prev=document.createElement('button'),next=document.createElement('button');
    prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Previous expanded image');next.setAttribute('aria-label','Next expanded image');

    icon(prev,'M15 5 L8 12 L15 19');icon(next,'M9 5 L16 12 L9 19');icon(close,'M6 6 L18 18 M18 6 L6 18');
    stage.append(prev,media,next);
    const counter=document.createElement('p');counter.className='expanded-gallery-counter';counter.setAttribute('aria-live','polite');
    dialog.append(header,stage,counter);document.body.append(dialog);
    let current=initial;
    function show(){const slide=slides[current];media.replaceChildren();if(slide.src){const img=document.createElement('img');img.src=slide.src;img.alt=slide.alt;media.append(img)}else{const text=document.createElement('p');text.textContent=slide.alt;media.append(text)}prev.disabled=current===0;next.disabled=current===slides.length-1;counter.textContent=`${current+1} / ${slides.length}`;onChange(current);}
    prev.onclick=()=>{if(current>0){current--;show()}};next.onclick=()=>{if(current<slides.length-1){current++;show()}};
    close.onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}};
    dialog.onkeydown=e=>{if(e.key==='ArrowLeft'){e.preventDefault();prev.click()}if(e.key==='ArrowRight'){e.preventDefault();next.click()}};
    const oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
    dialog.onclose=()=>{document.documentElement.style.overflow=oldOverflow;dialog.remove();trigger.focus({preventScroll:true})};
    show();dialog.showModal();close.focus();
  }
  const positions = new Map();
  const copyObserver=new ResizeObserver(entries=>{
    entries.forEach(({target})=>{
      const row=target.closest('.portfolio-project');
      row.style.setProperty('--project-image-height',Math.ceil((target.querySelector('.project-expansion summary') || target.querySelector('.project-overview')).getBoundingClientRect().bottom-target.getBoundingClientRect().top+16)+'px');
    });
  });
  window.initProjectGalleries = () => {
    copyObserver.disconnect();
    document.querySelectorAll('.projects-main .project-copy').forEach(copy=>copyObserver.observe(copy));
    document.querySelectorAll('.project-image-placeholder:not([data-gallery])').forEach(gallery => {
      const name = gallery.getAttribute('aria-label').replace(' image to be added', '');
      const slides = images[name] || [{ alt: `${name} â€” image to be added` }];
      gallery.dataset.gallery = name;
      gallery.classList.add('project-gallery');
      gallery.setAttribute('role', 'region');
      gallery.setAttribute('aria-label', `${name} image gallery`);
      const track = document.createElement('div');
      track.className = 'gallery-track';
      track.tabIndex = 0;
      track.setAttribute('aria-label', 'Project images. Use left and right arrow keys to browse.');
      slides.forEach((slide, i) => {
        const item = document.createElement('div');
        item.className = 'gallery-slide';
        if (slide.src) {
          const img = document.createElement('img');
          img.src = slide.src; img.alt = slide.alt; img.draggable = false;
          item.append(img);
        } else {
          item.setAttribute('role', 'img'); item.setAttribute('aria-label', slide.alt);
        }
        track.append(item);
      });
      const previous = document.createElement('button');
      const next = document.createElement('button');
      previous.className = 'gallery-arrow gallery-previous';
      next.className = 'gallery-arrow gallery-next';
      icon(previous,'M15 5 L8 12 L15 19'); icon(next,'M9 5 L16 12 L9 19');
      previous.setAttribute('aria-label', 'Previous image');
      next.setAttribute('aria-label', 'Next image');
      previous.type = next.type = 'button';
      const count = document.createElement('span');
      count.className = 'gallery-count'; count.setAttribute('aria-live', 'polite');
      gallery.replaceChildren(track, previous, next, count);
      let index = Math.min(positions.get(name) || 0, slides.length - 1);
      function update() {
        previous.disabled = index === 0;
        next.disabled = index === slides.length - 1;
        count.textContent = `${index + 1} / ${slides.length}`;
        positions.set(name, index);
      }
      function go(step) {
        index = Math.max(0, Math.min(slides.length - 1, index + step));
        track.scrollTo({ left: index * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
      previous.onclick = () => go(-1); next.onclick = () => go(1);
      const expand=()=>openExpanded(name,slides,index,newIndex=>{index=newIndex;track.scrollLeft=index*track.clientWidth;update()},track);
      track.setAttribute('role','button');
      track.setAttribute('aria-label','Open '+name+' enlarged gallery. Use arrow keys to browse.');
      let pointerStart;
      track.onpointerdown=e=>{pointerStart={x:e.clientX,y:e.clientY}};
      track.onclick=e=>{if(!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)<8)expand();pointerStart=null};
      track.onkeydown = event => {
        if(event.key==='Enter'||event.key===' '){event.preventDefault();expand();return;}
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault(); go(event.key === 'ArrowLeft' ? -1 : 1);
        }
      };
      track.onscroll = () => { index = Math.round(track.scrollLeft / track.clientWidth); update(); };
      track.scrollLeft = index * track.clientWidth;
      update();
    });
  };
  window.initProjectGalleries();
})();

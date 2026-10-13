// One gallery implementation and image list for cards and dedicated pages.
(() => {
  function icon(button,path){button.textContent='';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const line=document.createElementNS(svg.namespaceURI,'path');line.setAttribute('d',path);svg.append(line);button.append(svg);}
  function createMedia(slide, expanded = false) {
    const media = document.createElement(slide.video ? 'video' : 'img');
    media.src = slide.src;
    if (slide.video) {
      media.controls = expanded;
      media.defaultPlaybackRate = slide.playbackRate || 1;
      media.playbackRate = slide.playbackRate || 1;
      if(slide.poster) media.poster=slide.poster;
      media.playsInline = true;
      media.preload = 'metadata';
      media.setAttribute('aria-label', slide.alt);
    } else {
      media.alt = slide.alt;
      media.draggable = false;
    }
    if (slide.contain) { media.style.objectFit = 'contain'; media.style.background = slide.src.includes('scrambler-') ? '#111' : '#fff';  }
    return media;
  }
  const images = {
    'Star Wars Hand Scanner': [{src:'assets/star-wars-hand-scanner.gif',alt:'Star Wars hand scanner demonstration animation',caption:'Hand scanner demonstration',contain:true}],
    'ID 0: agentic hardware robot': [
      {src:'assets/id-0-robot.jpg',alt:'Blue and white tracked robot beside a rose and fiducial markers',caption:'',contain:true},
      {src:'assets/id-0-team.jpg',alt:'Five team members behind a Y Combinator sign',caption:'',contain:true},
      {src:'assets/id-0-demo.mp4',poster:'assets/id-0-demo-poster.jpg',alt:'ID 0 robot demonstration video',caption:'',video:true,contain:true}
    ],
    'Glyph Robotics Demo': [
      {src:'assets/glyph-photo-2.webp',alt:'Glyph quadruped robot with its red LED matrix illuminated at the demo',caption:'Glyph at demo day',contain:true},
      {src:'assets/glyph-photo-3.webp',alt:'Front view of Glyph with its illuminated LED matrix and drink dispenser',caption:'Drink dispenser and LED display',contain:true},
      {src:'assets/glyph-photo-4.webp',alt:'Glyph robot on a workbench with its custom enclosure and LED matrix',caption:'Custom enclosure and LED matrix',contain:true},
      {src:'assets/glyph-photo-1.webp',alt:'Overhead view of Glyph showing internal tubing and drink-dispensing hardware',caption:'Inside the drink-dispensing system',contain:true}
    ],
    'UNIT Fitness': [
      {src:'assets/unit-prototype.webp',alt:'UNIT Fitness prototype with four load cells mounted in a black enclosure on a workbench',caption:'Load-cell hardware prototype',contain:true},
      {src:'assets/unit-matched-demo.mp4',poster:'assets/unit-matched-poster.jpg',alt:'UNIT Fitness gym demonstration alongside app workout tracking, velocity graphs, and set logging',caption:'Gym and app walkthrough · 30-second demo',video:true,contain:true},
      {src:'assets/unit-system-diagram.svg',alt:'UNIT Fitness system architecture: BLE motion and weight sensing, mobile signal processing, and workout metrics',caption:'System architecture · sensing, processing, and workout metrics',contain:true},
      {src:'assets/unit-data-pipeline.svg',alt:'Arduino VBT precursor: IMU motion, velocity estimation, rep features, and random-forest RIR prediction',caption:'Arduino VBT precursor · RIR estimation',contain:true}
    ],
    'Scrambler Humanoid Robot': [
      {src:'assets/scrambler-team.webp',alt:'Scrambler team celebrating second place at Himalaya Hacks',contain:true},
      {src:'assets/scrambler-grip-tracking.png',alt:'FlexSense grip interface tracking compliant finger deformation with ArUco markers',contain:true},
      {src:'assets/scrambler-hardware.webp',alt:'Scrambler robotic hands and rocky terrain test setup',contain:true},
      {src:'assets/scrambler-demo-trimmed.mp4',poster:'assets/scrambler-demo-poster.jpg',alt:'Scrambler project demonstration video',video:true,contain:true}
    ],
    'FPGA Camera Vision Accelerator': [{src:'assets/fpga-live-sobel.gif',alt:'FPGA camera accelerator - live Sobel edge detection demo',contain:true},{src:'assets/fpga-live-grayscale.gif',alt:'FPGA camera accelerator - live grayscale demo',contain:true},{src:'assets/camera-architecture.svg',alt:'FPGA camera accelerator - Top Level Overview',contain:true},{src:'assets/orb-processing-timeline.svg',alt:'FPGA camera accelerator - Frame Processing Timeline',contain:true}]
  };
  const defaultCaptions = ['Live Sobel edge detection', 'Live grayscale camera feed', 'Top-level system architecture', 'ORB frame processing timeline'];
  images['FPGA Camera Vision Accelerator'].forEach((slide,i)=>slide.caption=defaultCaptions[i]);
  ['Second place at Himalaya Hacks', 'ArUco grip tracking', 'Robotic hands and terrain setup', 'Introducing SCRAMBLER: an integrated robotics system'].forEach((caption,i)=>images['Scrambler Humanoid Robot'][i].caption=caption);
  images['Scrambler Humanoid Robot'].reverse();
  images['FPGA Camera Vision Accelerator'].splice(2,0,{src:'assets/fpga-mode-switch.gif',alt:'FPGA camera display changing from grayscale to edge detection',caption:'Grayscale to edge-detection transition',contain:true});
  images['Glyph Robotics Demo'].splice(1,0,{src:'assets/glyph-fluid-sloshing.gif',alt:'Glyph LED fluid simulation sloshing as the robot moves',caption:'LED fluid simulation in motion',contain:true});
  const savedCaptions = {"FPGA Camera Vision Accelerator": ["Live Sobel edge detection", "Live grayscale camera feed", "Switch from grayscale to sobel, and live threshold control", "Top-level system architecture", "ORB frame processing timeline"], "Scrambler Humanoid Robot": ["Project video!", "Robotic hand follower + leader setup in demo environment", "ArUco grip tracking from wrist cam", "Terra labs team pic!"], "ID 0: agentic hardware robot": ["ID0 Robot with end effectors and printed vase (from demo vid)", "Terra Labs team in front of YC sign", "Demo video submitted to judges"], "Glyph Robotics Demo": ["Glyph at demo day", "LED fluid simulation in motion", "Demo day again, side angle", "Custom enclosure during build phase, initial layup of LEDs", "Top view of enclosure & soda system before final build "], "UNIT Fitness": ["Load-cell hardware prototype", "Gym and app walkthrough · 30-second demo", "System architecture · sensing, processing, and workout metrics", "Arduino VBT precursor · RIR estimation"], "Star Wars Hand Scanner": ["Hand scanner demonstration"]};
  Object.entries(savedCaptions).forEach(([name,captions])=>captions.forEach((caption,i)=>{if(images[name]?.[i])images[name][i].caption=caption}));
  window.projectGallerySlides = images;
  window.setProjectCaptions = (name, captions) => {
    (images[name] || []).forEach((slide,i)=>{slide.caption=captions[i] ?? slide.caption});
    document.dispatchEvent(new CustomEvent('gallery-captions-changed'));
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
    const caption=document.createElement('p');caption.className='expanded-gallery-caption';
    dialog.append(header,stage,caption,counter);document.body.append(dialog);
    let current=initial;
    function show(){const slide=slides[current];caption.textContent=slide.caption || '';media.replaceChildren();if(slide.src){media.append(createMedia(slide,true))}else{const text=document.createElement('p');text.textContent=slide.alt;media.append(text)}prev.disabled=current===0;next.disabled=current===slides.length-1;counter.textContent=`${current+1} / ${slides.length}`;onChange(current);}
    prev.onclick=()=>{if(current>0){current--;show()}};next.onclick=()=>{if(current<slides.length-1){current++;show()}};
    close.onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}};
    dialog.onkeydown=e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowLeft'){e.preventDefault();prev.click()}if(e.key==='ArrowRight'){e.preventDefault();next.click()}};
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
          item.append(createMedia(slide));
          if(slide.video){const label=document.createElement('span');label.className='gallery-video-label';label.setAttribute('aria-hidden','true');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 16 16');const triangle=document.createElementNS(svg.namespaceURI,'path');triangle.setAttribute('d','M3 1 L14 8 L3 15 Z');svg.append(triangle);label.append(svg);item.append(label);}
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
      const caption=document.createElement('p');caption.className='gallery-caption';
      const count = document.createElement('span');
      count.className = 'gallery-count'; count.setAttribute('aria-live', 'polite');
      gallery.replaceChildren(track, previous, next, count, caption);
      let index = Math.min(positions.get(name) || 0, slides.length - 1);
      function update() {
        caption.textContent=slides[index]?.caption || '';
        previous.disabled = index === 0;
        next.disabled = index === slides.length - 1;
        count.textContent = `${index + 1} / ${slides.length}`;
        positions.set(name, index);
      }
      document.addEventListener('gallery-captions-changed',()=>{if(gallery.isConnected)update()});
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

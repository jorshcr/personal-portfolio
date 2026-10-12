// One gallery implementation and image list for cards and dedicated pages.
(() => {
  const images = {
    'FPGA Camera Vision Accelerator': [1, 2, 3].map(i => ({
      src: `assets/fpga-demo-${i}.svg`,
      alt: `FPGA gallery demo ${i} — illustrative placeholder, not actual project hardware`
    }))
  };
  const positions = new Map();
  window.initProjectGalleries = () => {
    document.querySelectorAll('.project-image-placeholder:not([data-gallery])').forEach(gallery => {
      const name = gallery.getAttribute('aria-label').replace(' image to be added', '');
      const slides = images[name] || [{ alt: `${name} — image to be added` }];
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
      previous.textContent = '‹'; next.textContent = '›';
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
      track.onkeydown = event => {
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

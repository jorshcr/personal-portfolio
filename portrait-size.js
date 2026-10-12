// Match the portrait to the biography without changing the text column width.
(() => {
  let observer;
  window.sizeHomePortrait = () => {
    observer?.disconnect();
    const bio = document.querySelector('.home-page .bio');
    const photo = document.querySelector('.home-page .portrait');
    if (!bio || !photo) return;
    const resize = () => {
      const height = bio.getBoundingClientRect().height;
      photo.style.height = `${height}px`;
      photo.style.width = `${height * 0.8}px`;
    };
    observer = new ResizeObserver(resize);
    observer.observe(bio);
    resize();
  };
  window.sizeHomePortrait();
})();

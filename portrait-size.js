// Clear previous inline sizing; the shared stylesheet controls the portrait.
(() => {
  window.sizeHomePortrait = () => {
    const photo = document.querySelector('.home-page .portrait');
    if (!photo) return;
    photo.style.removeProperty('width');
    photo.style.removeProperty('height');
  };
  window.sizeHomePortrait();
})();

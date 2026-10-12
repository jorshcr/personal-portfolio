// Keep the header and loaded fonts in place while changing page content.
(() => {
  let pending;
  async function navigate(url, addHistory) {
    pending?.abort();
    const request = new AbortController();
    pending = request;
    try {
      const response = await fetch(url, { signal: request.signal });
      if (!response.ok) throw new Error('Page unavailable');
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const main = doc.querySelector('main');
      if (!main) throw new Error('Missing page content');
      if (request.signal.aborted) return;
      window.destroyHomeTimeline?.();
      document.querySelector('main').replaceWith(main);
      document.body.className = doc.body.className;
      window.initProjectGalleries?.();
      window.sizeHomePortrait?.();
      window.initHomeTimeline?.();
      document.title = doc.title;
      document.querySelector('meta[name="description"]').content = doc.querySelector('meta[name="description"]').content;
      document.querySelectorAll('header nav a').forEach(link => {
        const active = [...doc.querySelectorAll('header nav a')].some(a => a.getAttribute('href') === link.getAttribute('href') && a.hasAttribute('aria-current'));
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      if (addHistory) history.pushState(null, '', url);
      main.tabIndex = -1;
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    } catch (error) {
      if (error.name !== 'AbortError') location.assign(url);
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('header a, a[data-page-link]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || location.protocol === 'file:') return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    if (url.pathname !== location.pathname) navigate(url, true);
  });
  window.addEventListener('popstate', () => navigate(new URL(location.href), false));
})();

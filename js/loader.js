(function () {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;

  var MIN_DISPLAY_MS = 1800;  // let the bar animation actually play out
  var MAX_WAIT_MS = 6000;     // safety net if 'load' is ever delayed/blocked
  var startTime = Date.now();
  var hidden = false;

  function hideLoader() {
    if (hidden) return;
    hidden = true;

    var elapsed = Date.now() - startTime;
    var remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);

    setTimeout(function () {
      document.body.classList.remove('is-loading');
      document.documentElement.classList.add('hero-in');
      loader.classList.add('loader-hidden');
      loader.addEventListener('transitionend', function () {
        loader.remove();
      }, { once: true });
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  // Fallback in case 'load' never fires (e.g. a hung request)
  setTimeout(hideLoader, MAX_WAIT_MS);
})();

window.addEventListener('load', function () {
  var loader = document.getElementById('pageLoader');
  document.body.classList.remove('is-loading');
  if (loader) {
    loader.classList.add('loader-hidden');
    loader.addEventListener('transitionend', function () {
      loader.remove();
    }, { once: true });
  }
});

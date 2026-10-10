/* Sandbox navigation only. Existing glass demo stays available. */
(() => {
  'use strict';
  const previous = globalThis.SuperafEstimator;
  // Remove the retired offering from the retained glass-dialog controls too.
  document.querySelector('#e-finish option[value="colour"]')?.remove();
  const skins = ['default','spring','summer','autumn','winter'];
  function destination(service) {
    const url = new URL('studio-004.html', location.href);
    const theme = document.documentElement.dataset.skin;
    url.searchParams.set('skin', skins.includes(theme) ? theme : 'default');
    url.searchParams.set('mode', service === 'Window tint' ? 'tint' : 'front');
    return url.href;
  }
  globalThis.SuperafEstimator = Object.freeze({
    open(button, service) {
      if (service === 'Glass protection' && previous) return previous.open(button, service);
      location.assign(destination(service));
    }
  });
  if (location.hash === '#estimate') location.replace(destination());
})();

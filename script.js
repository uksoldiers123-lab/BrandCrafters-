// script.js
(function () {
  const body = document.body;
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.menu-close');
  const backdrop = document.querySelector('.drawer-backdrop');

  function openDrawer() {
    body.classList.add('drawer-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (drawer) drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    body.classList.remove('drawer-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (body.classList.contains('drawer-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close drawer on link click
  document.querySelectorAll('.mobile-drawer a.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
})();

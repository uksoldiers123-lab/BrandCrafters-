// Mobile drawer toggle
const body = document.body;
const toggle = document.querySelector('.menu-toggle');
const drawer = document.querySelector('.mobile-drawer');
const backdrop = document.querySelector('.drawer-backdrop');
const closeBtn = document.querySelector('.menu-close');

function openDrawer() {
  body.classList.add('drawer-open');
  toggle.setAttribute('aria-expanded', 'true');
  drawer.setAttribute('aria-hidden', 'false');
}
function closeDrawer() {
  body.classList.remove('drawer-open');
  toggle.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
}
toggle?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeDrawer(); });

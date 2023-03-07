// grab everything we need
const btn = document.querySelector('button.mobile-menu-button');
const menu = document.querySelector('.mobile-menu');
const menuLinks = document.querySelector('.mobile-nav-item');

// add event listeners
btn.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

menuLinks.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

// Theme Toggle: Switch between dark and light themes
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggleBtn && themeIcon) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeIcon.textContent = document.body.classList.contains('light-theme') ? '🌙' : '🌞';
  });
}

// Accordion (Collapsible Panels) functionality
const accordions = document.querySelectorAll('.accordion');
accordions.forEach(acc => {
  acc.addEventListener('click', () => {
    acc.classList.toggle('active');
    const panel = acc.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

// Automatically open external links in a new tab
document.querySelectorAll('a[href^="http"]').forEach(link => {
  const host = window.location.host;
  if (!link.href.includes(host)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  }
});

// Rotating header logo every 2 seconds
const logoImages = [
  './images/logo01.png',
  './images/logo02.png',
  './images/logo03.png',
  './images/logo04.png'
];

let currentLogoIndex = 0;
const logoElement = document.getElementById('rotating-logo');

if (logoElement) {
  setInterval(() => {
    currentLogoIndex = (currentLogoIndex + 1) % logoImages.length;
    logoElement.src = logoImages[currentLogoIndex];
  }, 2000); // 2 seconds
}

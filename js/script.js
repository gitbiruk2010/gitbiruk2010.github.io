// Script for theme toggle and collapsible sections

// Theme Toggle: Switch between dark and light themes
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggleBtn.addEventListener('click', () => {
  // Toggle the 'light-theme' class on the document body
  document.body.classList.toggle('light-theme');
  // Update the theme icon (sun for light theme, moon for dark theme)
  if (document.body.classList.contains('light-theme')) {
    themeIcon.textContent = '🌙';  // moon symbol when switching to light mode
  } else {
    themeIcon.textContent = '🌞';  // sun symbol for dark mode
  }
});

// Accordion (Collapsible Panels) functionality
const accordions = document.querySelectorAll('.accordion');
accordions.forEach(acc => {
  acc.addEventListener('click', () => {
    // Toggle active state for accordion button
    acc.classList.toggle('active');
    // Expand or collapse the associated panel
    const panel = acc.nextElementSibling;
    if (panel.style.maxHeight) {
      // If panel is open, close it
      panel.style.maxHeight = null;
    } else {
      // If panel is closed, open it to fit its content
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

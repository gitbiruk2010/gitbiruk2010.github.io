// Modern Theme Toggle: Switch between dark and light themes
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggleBtn && themeIcon) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeIcon.textContent = document.body.classList.contains('light-theme') ? '🌙' : '🌞';
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.card, .detail-card, .project-card, .author-info');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});

// Enhanced card hover effects with 3D tilt
document.querySelectorAll('.card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
});

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

// Enhanced rotating header logo with smooth transitions
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
    logoElement.style.opacity = '0.7';
    setTimeout(() => {
      currentLogoIndex = (currentLogoIndex + 1) % logoImages.length;
      logoElement.src = logoImages[currentLogoIndex];
      logoElement.style.opacity = '1';
    }, 300);
  }, 3000); // 3 seconds with fade effect
}

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up
    navbar.style.transform = 'translateY(0)';
  }
  
  lastScrollTop = scrollTop;
});

// Cursor trail effect (optional - modern touch)
let mouseTrail = [];
const trailLength = 6;

document.addEventListener('mousemove', (e) => {
  mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
  
  if (mouseTrail.length > trailLength) {
    mouseTrail.shift();
  }
});

// Typing effect for main title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
  const mainTitle = document.querySelector('.profile-left h1');
  if (mainTitle) {
    const originalText = mainTitle.textContent;
    setTimeout(() => typeWriter(mainTitle, originalText, 80), 500);
  }
});

// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.querySelector('.navbar');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      navbar.classList.toggle('nav-open');
    });

    // Close menu when clicking on a link (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navbar.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navbar.classList.remove('nav-open');
      }
    });
  }
});

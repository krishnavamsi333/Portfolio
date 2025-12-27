// =========================================================
// main.js – Main application script
// =========================================================

// Configuration
const CONFIG = {
  components: [
    { id: 'header-container', file: 'components/header.html' },
    { id: 'nav-container', file: 'components/nav.html' },
    { id: 'about-container', file: 'components/about.html' },
    { id: 'skills-container', file: 'components/skills.html' },
    { id: 'research-container', file: 'components/research.html' },
    { id: 'publications-container', file: 'components/publications.html' },
    { id: 'projects-container', file: 'components/projects.html' },
    { id: 'achievements-container', file: 'components/achievements.html' },
    { id: 'contact-container', file: 'components/contact.html' },
    { id: 'footer-container', file: 'components/footer.html' }
  ],
  particleCount: 15,
  skillBarDelay: 100,
  observerThreshold: 0.5
};

// =========================================================
// Component Loader
// =========================================================

class ComponentLoader {
  constructor(components) {
    this.components = components;
    this.loadedCount = 0;
    this.totalComponents = components.length;
  }

  async loadAll() {
    const loadPromises = this.components.map(component => 
      this.loadComponent(component)
    );

    try {
      await Promise.all(loadPromises);
      console.log('✓ All components loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading components:', error);
      return false;
    }
  }

  async loadComponent(component) {
    try {
      const response = await fetch(component.file);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      const container = document.getElementById(component.id);
      
      if (container) {
        container.innerHTML = data;
        
        // Initialize component-specific features
        if (component.id === 'skills-container') {
          await this.initSkillBars();
        }
        if (component.id === 'nav-container') {
          initNavigation();
        }
      } else {
        console.warn(`Container not found: ${component.id}`);
      }
    } catch (error) {
      console.error(`Failed to load ${component.file}:`, error);
      throw error;
    }
  }

  async initSkillBars() {
    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 50));
    initSkillBarsAnimation();
  }
}

// =========================================================
// Main Initialization
// =========================================================

document.addEventListener('DOMContentLoaded', async function() {
  const startTime = performance.now();
  
  // Show loading indicator
  showLoadingState();
  
  // Load all components
  const loader = new ComponentLoader(CONFIG.components);
  const success = await loader.loadAll();
  
  if (success) {
    await initializeApp();
  }
  
  // Hide loading indicator
  hideLoadingState();
  
  // Log performance
  const loadTime = performance.now() - startTime;
  console.log(`✓ Page fully loaded in ${loadTime.toFixed(2)}ms`);
});

// Initialize app after all components are loaded
async function initializeApp() {
  try {
    // Initialize all features
    initAccessibility();
    initTheme();
    initNavigation();
    initScrollEffects();
    initSectionAnimations();
    initParticles();
    initScrollToTop();
    initContactForm();
    
    console.log('✓ App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// =========================================================
// Theme Management
// =========================================================

function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  // Load saved theme or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  applyTheme(initialTheme);
  
  // Theme toggle handler
  themeToggle?.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  console.log('✓ Theme system initialized');
}

function applyTheme(theme) {
  const body = document.body;
  body.setAttribute('data-theme', theme);
  body.classList.toggle('dark-theme', theme === 'dark');
}

// =========================================================
// Navigation
// =========================================================

function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  // Smooth scroll to sections
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const navHeight = nav.offsetHeight;
          const targetPosition = targetSection.offsetTop - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update active state
          updateActiveNavLink(link);
          
          // Close mobile menu
          navList?.classList.remove('active');
        }
      }
    });
  });
  
  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    navList?.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
  
  // Hide/show nav on scroll
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavScroll(nav, lastScrollY);
        lastScrollY = window.scrollY;
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Update active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    updateActiveNavOnScroll(sections, navLinks);
  });
  
  console.log('✓ Navigation initialized');
}

function handleNavScroll(nav, lastScrollY) {
  const currentScrollY = window.scrollY;
  
  // Add shadow when scrolled
  nav?.classList.toggle('scrolled', currentScrollY > 50);
  
  // Hide/show on scroll direction
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    nav?.classList.add('hidden');
  } else {
    nav?.classList.remove('hidden');
  }
}

function updateActiveNavLink(activeLink) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  activeLink.classList.add('active');
}

function updateActiveNavOnScroll(sections, navLinks) {
  const scrollY = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// =========================================================
// Scroll Effects
// =========================================================

function initScrollEffects() {
  initSectionAnimations();
  initScrollToTop();
}

function initSectionAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
  
  console.log('✓ Section animations initialized');
}

function initScrollToTop() {
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  if (!scrollTopBtn) return;
  
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  console.log('✓ Scroll to top initialized');
}

// =========================================================
// Skill Bars Animation
// =========================================================

function initSkillBarsAnimation() {
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

function animateSkillBars(container) {
  const skillBars = container.querySelectorAll('.skill-progress');
  
  skillBars.forEach((bar, index) => {
    const targetWidth = bar.getAttribute('data-width') || bar.style.width;
    bar.style.width = '0';
    
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, CONFIG.skillBarDelay + (index * 50));
  });
}

// =========================================================
// Particles System
// =========================================================

function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < CONFIG.particleCount; i++) {
    const particle = createParticle();
    fragment.appendChild(particle);
  }
  
  particlesContainer.appendChild(fragment);
  console.log('✓ Particles initialized');
}

function createParticle() {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  // Random properties
  const size = Math.random() * 60 + 20;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * 15;
  const duration = Math.random() * 10 + 15;
  
  particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    top: ${top}%;
    animation-delay: ${delay}s;
    animation-duration: ${duration}s;
  `;
  
  return particle;
}

// =========================================================
// Accessibility
// =========================================================

function initAccessibility() {
  // Keyboard navigation detection
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
      window.addEventListener('mousedown', handleMouseDown);
    }
  }
  
  function handleMouseDown() {
    document.documentElement.classList.remove('user-is-tabbing');
    window.removeEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleFirstTab);
  }
  
  window.addEventListener('keydown', handleFirstTab);
  
  // Secure external links
  secureExternalLinks();
  
  // Skip link functionality
  initSkipLink();
  
  console.log('✓ Accessibility features initialized');
}

function secureExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    const rel = link.getAttribute('rel') || '';
    const requiredRels = ['noopener', 'noreferrer'];
    
    requiredRels.forEach(relValue => {
      if (!rel.includes(relValue)) {
        link.setAttribute('rel', `${rel} ${relValue}`.trim());
      }
    });
  });
}

function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  
  skipLink?.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = skipLink.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// =========================================================
// Contact Form
// =========================================================

function initContactForm() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateForm(data)) {
      showFormMessage('Please fill in all required fields', 'error');
      return;
    }
    
    // Submit form (replace with your actual endpoint)
    try {
      showFormMessage('Sending message...', 'info');
      
      // Simulated API call - replace with actual implementation
      await simulateFormSubmit(data);
      
      showFormMessage('Message sent successfully!', 'success');
      form.reset();
    } catch (error) {
      showFormMessage('Failed to send message. Please try again.', 'error');
      console.error('Form submission error:', error);
    }
  });
  
  console.log('✓ Contact form initialized');
}

function validateForm(data) {
  return data.name && data.email && data.message && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
}

function showFormMessage(message, type) {
  // Create or update message element
  let messageEl = document.querySelector('.form-message');
  
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.className = 'form-message';
    document.querySelector('.contact-form').appendChild(messageEl);
  }
  
  messageEl.textContent = message;
  messageEl.className = `form-message form-message-${type}`;
  messageEl.style.display = 'block';
  
  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}

async function simulateFormSubmit(data) {
  return new Promise(resolve => setTimeout(resolve, 1500));
}

// =========================================================
// Loading State
// =========================================================

function showLoadingState() {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.classList.add('active');
  }
}

function hideLoadingState() {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.remove('active');
      loader.classList.add('hidden');
    }, 300);
  }
}

// =========================================================
// Utility Functions
// =========================================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
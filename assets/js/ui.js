// =========================================================
// ui.js – UI interactions and functionality
// =========================================================

// Configuration
const UI_CONFIG = {
  scrollThreshold: 300,
  navOffset: 80,
  headerParallaxLimit: 500,
  debounceDelay: 100,
  throttleDelay: 16
};

// Main UI initialization
function initUI() {
  try {
    initThemeToggle();
    initBackToTop();
    initSmoothScroll();
    initNavbarScroll();
    initParallaxHeader();
    initActiveNavLinks();
    initMobileMenu();
    initFormValidation();
    initTooltips();
    initModals();
    
    console.log('✓ UI initialized');
  } catch (error) {
    console.error('Error initializing UI:', error);
  }
}

// =========================================================
// Theme Toggle
// =========================================================

function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle, #themeToggle');
  if (!themeToggle) return;
  
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Load saved theme or use system preference
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
  
  applyTheme(initialTheme);
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    console.log(`✓ Theme switched to: ${newTheme}`);
  });
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  console.log('✓ Theme toggle initialized');
}

function applyTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');
  document.body.setAttribute('data-theme', theme);
  
  // Update theme toggle icon if it exists
  const themeToggle = document.querySelector('.theme-toggle, #themeToggle');
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
      moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    }
  }
}

// =========================================================
// Back to Top Button
// =========================================================

function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top, .scroll-top');
  if (!backToTopButton) return;
  
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        backToTopButton.classList.toggle('visible', scrollY > UI_CONFIG.scrollThreshold);
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToTop();
  });
  
  console.log('✓ Back to top initialized');
}

function scrollToTop(duration = 600) {
  const start = window.pageYOffset;
  const startTime = performance.now();
  
  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easing = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, start * (1 - easing));
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  
  requestAnimationFrame(animateScroll);
}

// =========================================================
// Smooth Scroll
// =========================================================

function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip if it's just a hash
      if (targetId === '#' || targetId === '') {
        e.preventDefault();
        scrollToTop();
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        scrollToElement(targetElement);
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.nav-list');
        mobileMenu?.classList.remove('active');
      }
    });
  });
  
  console.log('✓ Smooth scroll initialized');
}

function scrollToElement(element, offset = UI_CONFIG.navOffset) {
  const targetPosition = element.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 800;
  const startTime = performance.now();
  
  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-in-out)
    const easing = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition + distance * easing);
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  
  requestAnimationFrame(animateScroll);
}

// =========================================================
// Navbar Scroll Behavior
// =========================================================

function initNavbarScroll() {
  const navbar = document.querySelector('.nav');
  if (!navbar) return;
  
  let lastScrollTop = 0;
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbar(navbar, lastScrollTop);
        lastScrollTop = window.pageYOffset;
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  console.log('✓ Navbar scroll initialized');
}

function updateNavbar(navbar, lastScrollTop) {
  const scrollTop = window.pageYOffset;
  const scrollThreshold = 200;
  
  // Add shadow when scrolled
  navbar.classList.toggle('scrolled', scrollTop > 50);
  
  // Hide on scroll down, show on scroll up
  if (scrollTop > scrollThreshold) {
    if (scrollTop > lastScrollTop) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
  } else {
    navbar.classList.remove('hidden');
  }
}

// =========================================================
// Parallax Header
// =========================================================

function initParallaxHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderParallax(header);
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  console.log('✓ Parallax header initialized');
}

function updateHeaderParallax(header) {
  const scrolled = window.pageYOffset;
  const limit = UI_CONFIG.headerParallaxLimit;
  
  if (scrolled < limit) {
    const translateY = scrolled * 0.5;
    const opacity = 1 - (scrolled / limit);
    
    header.style.transform = `translateY(${translateY}px)`;
    header.style.opacity = Math.max(opacity, 0);
  }
}

// =========================================================
// Active Navigation Links
// =========================================================

function initActiveNavLinks() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink(sections, navLinks);
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  console.log('✓ Active nav links initialized');
}

function updateActiveNavLink(sections, navLinks) {
  const scrollY = window.pageYOffset + 150;
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isActive = href === `#${currentSection}`;
    
    link.classList.toggle('active', isActive);
    
    // Legacy support for inline styles
    if (!link.classList.contains('active')) {
      link.style.color = '';
    }
  });
}

// =========================================================
// Mobile Menu
// =========================================================

function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!menuToggle || !navList) return;
  
  // Toggle menu
  menuToggle.addEventListener('click', () => {
    const isActive = navList.classList.toggle('active');
    menuToggle.classList.toggle('active', isActive);
    menuToggle.setAttribute('aria-expanded', isActive);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
  });
  
  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
      navList.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('active')) {
      navList.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  console.log('✓ Mobile menu initialized');
}

// =========================================================
// Form Validation
// =========================================================

function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(this)) {
        console.log('✓ Form validated successfully');
        // Submit form or handle data
        handleFormSubmit(this);
      }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        // Clear error on input
        if (this.classList.contains('error')) {
          this.classList.remove('error');
          const errorMsg = this.parentElement.querySelector('.error-message');
          errorMsg?.remove();
        }
      });
    });
  });
  
  console.log('✓ Form validation initialized');
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  let isValid = true;
  let errorMessage = '';
  
  // Check if required
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }
  
  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  // Phone validation
  if (type === 'tel' && value) {
    const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
  }
  
  // Min length validation
  const minLength = field.getAttribute('minlength');
  if (minLength && value.length < parseInt(minLength)) {
    isValid = false;
    errorMessage = `Minimum ${minLength} characters required`;
  }
  
  // Show/hide error
  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    clearFieldError(field);
  }
  
  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('error');
  
  // Remove existing error message
  const existingError = field.parentElement.querySelector('.error-message');
  existingError?.remove();
  
  // Add new error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = 'color: var(--color-error); font-size: 0.875rem; margin-top: 0.25rem;';
  
  field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
  field.classList.remove('error');
  const errorMsg = field.parentElement.querySelector('.error-message');
  errorMsg?.remove();
}

function handleFormSubmit(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  console.log('Form data:', data);
  
  // Show success message
  showFormMessage(form, 'Message sent successfully!', 'success');
  
  // Reset form after delay
  setTimeout(() => {
    form.reset();
  }, 1000);
}

function showFormMessage(form, message, type) {
  let messageEl = form.querySelector('.form-message');
  
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.className = 'form-message';
    form.appendChild(messageEl);
  }
  
  messageEl.textContent = message;
  messageEl.className = `form-message form-message-${type}`;
  messageEl.style.cssText = `
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
    background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
    color: white;
    text-align: center;
  `;
  
  if (type === 'success') {
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}

// =========================================================
// Tooltips
// =========================================================

function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      showTooltip(this);
    });
    
    element.addEventListener('mouseleave', function() {
      hideTooltip();
    });
  });
  
  if (tooltipElements.length > 0) {
    console.log('✓ Tooltips initialized');
  }
}

function showTooltip(element) {
  const text = element.getAttribute('data-tooltip');
  const position = element.getAttribute('data-tooltip-position') || 'top';
  
  const tooltip = document.createElement('div');
  tooltip.className = `tooltip tooltip-${position}`;
  tooltip.textContent = text;
  tooltip.style.cssText = `
    position: absolute;
    background: var(--color-primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    white-space: nowrap;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  `;
  
  document.body.appendChild(tooltip);
  
  // Position tooltip
  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  let top, left;
  
  switch(position) {
    case 'top':
      top = rect.top - tooltipRect.height - 8;
      left = rect.left + (rect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = rect.bottom + 8;
      left = rect.left + (rect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = rect.top + (rect.height - tooltipRect.height) / 2;
      left = rect.left - tooltipRect.width - 8;
      break;
    case 'right':
      top = rect.top + (rect.height - tooltipRect.height) / 2;
      left = rect.right + 8;
      break;
  }
  
  tooltip.style.top = `${top + window.scrollY}px`;
  tooltip.style.left = `${left}px`;
  
  // Fade in
  setTimeout(() => {
    tooltip.style.opacity = '1';
  }, 10);
  
  element._tooltip = tooltip;
}

function hideTooltip() {
  const tooltips = document.querySelectorAll('.tooltip');
  tooltips.forEach(tooltip => {
    tooltip.style.opacity = '0';
    setTimeout(() => tooltip.remove(), 200);
  });
}

// =========================================================
// Modals
// =========================================================

function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.getAttribute('data-modal');
      openModal(modalId);
    });
  });
  
  // Close buttons
  const closeButtons = document.querySelectorAll('.modal-close, [data-modal-close]');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close on backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.active');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
  
  if (modalTriggers.length > 0) {
    console.log('✓ Modals initialized');
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// =========================================================
// Utility Functions
// =========================================================

// Debounce function
function debounce(func, wait = UI_CONFIG.debounceDelay) {
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

// Throttle function
function throttle(func, limit = UI_CONFIG.throttleDelay) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

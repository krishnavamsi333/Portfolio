/* =========================================================
   ui.js — Industrial UI Interactions (Complete System)
   ========================================================= */

// Configuration
const UI_CONFIG = {
  navOffset: 80,
  scrollSpyOffset: 150,
  throttleDelay: 16, // ~60fps
  backToTopThreshold: 300,
  loaderDelay: 1500,
  magneticStrength: 0.2, // 0-1, how much elements follow cursor
};

/* =========================================================
   Main Initialization
   ========================================================= */

/**
 * Initialize all UI systems
 */
window.initUI = function() {
  console.log("🎨 Initializing UI systems...");

  try {
    initMatrixLoader();
    initCustomCursor();
    initSmoothScroll();
    initNavbarScroll();
    initScrollSpy();
    initMobileMenu();
    initBackToTop();
    initMagneticElements();
    initCopyButtons();

    console.log("✓ UI systems initialized");
  } catch (error) {
    console.error("❌ UI initialization failed:", error);
  }
};

/* =========================================================
   Matrix Loader (System Initialization)
   ========================================================= */

function initMatrixLoader() {
  const loader = document.getElementById('loader');
  if (!loader) {
    console.log("ℹ️ Matrix loader not found");
    return;
  }

  const minimumLoadTime = UI_CONFIG.loaderDelay;
  const startTime = performance.now();

  window.addEventListener('load', () => {
    const elapsed = performance.now() - startTime;
    const remainingTime = Math.max(0, minimumLoadTime - elapsed);

    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.classList.add('sys-ready');
      
      // Remove loader from DOM after fade
      setTimeout(() => {
        loader.remove();
        console.log("✓ System ready");
      }, 800);
    }, remainingTime);
  });
}

/* =========================================================
   Custom Interactive Cursor
   ========================================================= */

function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  
  if (!cursor) {
    console.log("ℹ️ Custom cursor not found");
    return;
  }

  // Hide on touch devices
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  const speed = 0.15; // Smoothing factor

  // Update mouse position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow using RAF
  function animateCursor() {
    // Lerp (Linear interpolation) for smooth following
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Expand cursor on interactive elements
  const interactiveSelectors = 'a, button, .magnetic-target, .project-card, input, textarea, select';
  
  // Use event delegation for better performance
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(interactiveSelectors) || e.target.closest(interactiveSelectors)) {
      cursor.classList.add('active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(interactiveSelectors) || e.target.closest(interactiveSelectors)) {
      cursor.classList.remove('active');
    }
  });

  console.log("✓ Custom cursor initialized");
}

/* =========================================================
   Magnetic Elements (Tactile Feedback)
   ========================================================= */

function initMagneticElements() {
  const magnets = document.querySelectorAll('.magnetic-target');
  
  if (magnets.length === 0) {
    console.log("ℹ️ No magnetic elements found");
    return;
  }

  magnets.forEach((magnet) => {
    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Apply subtle magnetic effect
      const moveX = x * UI_CONFIG.magneticStrength;
      const moveY = y * UI_CONFIG.magneticStrength;

      magnet.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });

  console.log(`✓ ${magnets.length} magnetic elements initialized`);
}

/* =========================================================
   Smooth Scroll Navigation
   ========================================================= */

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  if (links.length === 0) return;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip empty or just # links
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const offsetTop = target.offsetTop - UI_CONFIG.navOffset;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  console.log("✓ Smooth scroll initialized");
}

/* =========================================================
   Navbar Scroll Effect
   ========================================================= */

function initNavbarScroll() {
  const navbar = document.querySelector('nav');
  
  if (!navbar) {
    console.log("ℹ️ Navbar not found");
    return;
  }

  let lastScroll = 0;
  let ticking = false;

  function updateNavbar() {
    const currentScroll = window.scrollY;

    // Add/remove scrolled class
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar based on scroll direction
    if (currentScroll > lastScroll && currentScroll > 300) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  console.log("✓ Navbar scroll effect initialized");
}

/* =========================================================
   Scroll Spy (Active Navigation)
   ========================================================= */

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) return;

  let ticking = false;

  function updateActiveLink() {
    const scrollY = window.scrollY + UI_CONFIG.scrollSpyOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveLink);
      ticking = true;
    }
  });

  console.log("✓ Scroll spy initialized");
}

/* =========================================================
   Mobile Menu Toggle
   ========================================================= */

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navbar = document.querySelector('nav');
  
  if (!menuToggle || !mobileMenu) {
    console.log("ℹ️ Mobile menu elements not found");
    return;
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    navbar?.classList.toggle('menu-open');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    // Update ARIA
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  console.log("✓ Mobile menu initialized");
}

function closeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navbar = document.querySelector('nav');
  
  if (mobileMenu?.classList.contains('active')) {
    mobileMenu.classList.remove('active');
    menuToggle?.classList.remove('active');
    navbar?.classList.remove('menu-open');
    document.body.style.overflow = '';
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
}

/* =========================================================
   Back to Top Button
   ========================================================= */

function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) {
    console.log("ℹ️ Back to top button not found");
    return;
  }

  let ticking = false;

  function updateBackToTop() {
    const scrollY = window.scrollY;

    if (scrollY > UI_CONFIG.backToTopThreshold) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateBackToTop);
      ticking = true;
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  console.log("✓ Back to top button initialized");
}

/* =========================================================
   Copy to Clipboard Buttons
   ========================================================= */

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-doi, [data-copy]');
  
  if (copyButtons.length === 0) return;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.dataset.doi || btn.dataset.copy;
      
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        
        const originalText = btn.textContent;
        btn.textContent = "COPIED ✓";
        btn.classList.add('copied');
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
        alert("Failed to copy to clipboard");
      }
    });
  });

  console.log(`✓ ${copyButtons.length} copy buttons initialized`);
}

/* =========================================================
   Utility Functions
   ========================================================= */

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in ms
 * @returns {Function}
 */
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  };
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function}
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/* =========================================================
   Export utilities for use in other scripts
   ========================================================= */

window.UI_UTILS = {
  throttle,
  debounce,
  closeMobileMenu,
};

/* =========================================================
   Development Debug
   ========================================================= */

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.UI_DEBUG = {
    config: UI_CONFIG,
    closeMobileMenu,
    throttle,
    debounce,
  };
  console.log("🔧 UI debug mode enabled. Access via window.UI_DEBUG");
}
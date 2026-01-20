/* =========================================================
   effects.js — Scroll Reveal & Animation System
   ========================================================= */

// Configuration
const EFFECTS_CONFIG = {
  threshold: 0.1, // Trigger when 10% visible
  rootMargin: "0px 0px -10% 0px", // Start revealing slightly before element enters viewport
  animationDuration: 800, // ms
  staggerDelay: 100, // ms between staggered animations
};

/* =========================================================
   Intersection Observer for Scroll Reveals
   ========================================================= */

/**
 * Create and configure intersection observer
 * @returns {IntersectionObserver}
 */
function createRevealObserver() {
  const options = {
    threshold: EFFECTS_CONFIG.threshold,
    rootMargin: EFFECTS_CONFIG.rootMargin,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        // Stop observing after reveal (performance optimization)
        // Remove this line if you want elements to re-animate on scroll back
        entry.target.revealObserver?.unobserve(entry.target);
      }
    });
  }, options);
}

/**
 * Reveal an element with animation
 * @param {HTMLElement} element - Element to reveal
 */
function revealElement(element) {
  // Add revealed class
  element.classList.add('revealed', 'scroll-reveal');
  
  // Fade in
  element.style.opacity = "1";
  element.style.transform = "translateY(0)";
  
  console.log(`✓ Revealed: ${element.className}`);
}

/**
 * Prepare element for reveal animation
 * @param {HTMLElement} element - Element to prepare
 */
function prepareElementForReveal(element) {
  // Set initial hidden state
  element.style.opacity = "0";
  element.style.transform = "translateY(40px)";
  
  // Add smooth transition
  element.style.transition = `
    opacity ${EFFECTS_CONFIG.animationDuration}ms var(--ease-apple, cubic-bezier(0.23, 1, 0.32, 1)),
    transform ${EFFECTS_CONFIG.animationDuration}ms var(--ease-apple, cubic-bezier(0.23, 1, 0.32, 1))
  `;
}

/**
 * Apply staggered delays to sibling elements
 * @param {NodeList} elements - Elements to stagger
 */
function applyStaggerEffect(elements) {
  elements.forEach((element, index) => {
    const delay = index * EFFECTS_CONFIG.staggerDelay;
    element.style.transitionDelay = `${delay}ms`;
  });
}

/* =========================================================
   Initialize Scroll Reveal System
   ========================================================= */

/**
 * Initialize all scroll reveal effects
 */
window.initEffects = function() {
  console.log("🎭 Initializing effects system...");

  // Create observer
  const observer = createRevealObserver();

  // Define selectors for elements to reveal
  const revealSelectors = [
    '.bento-item',
    '.skill-module',
    '.timeline-row',
    '.achievement-item',
    '.about-grid',
    '.roadmap-card',
    '.pub-row',
    '.project-card',
    '.experience-card',
    '.contact-item',
    // Add the generic class for any element
    '.scroll-reveal',
  ];

  // Combine all selectors
  const selector = revealSelectors.join(', ');
  const elements = document.querySelectorAll(selector);

  if (elements.length === 0) {
    console.log("ℹ️ No elements found for scroll reveal");
    return;
  }

  console.log(`📦 Found ${elements.length} elements to reveal`);

  // Prepare and observe each element
  elements.forEach((element) => {
    prepareElementForReveal(element);
    observer.observe(element);
    
    // Store observer reference for potential cleanup
    element.revealObserver = observer;
  });

  // Apply stagger effect to grouped elements
  applyStaggerToGroups();

  console.log("✓ Effects system initialized");
};

/**
 * Apply stagger effect to grouped elements (siblings)
 */
function applyStaggerToGroups() {
  // Find parent containers with multiple children to stagger
  const staggerContainers = [
    '.bento-grid',
    '.skills-grid',
    '.timeline',
    '.achievements-grid',
    '.projects-grid',
  ];

  staggerContainers.forEach((selector) => {
    const container = document.querySelector(selector);
    if (!container) return;

    const children = container.querySelectorAll('.scroll-reveal, .bento-item, .skill-module, .timeline-row, .achievement-item, .project-card');
    if (children.length > 1) {
      applyStaggerEffect(children);
    }
  });
}

/* =========================================================
   Additional Animation Utilities
   ========================================================= */

/**
 * Animate counter numbers (for stats, achievements, etc.)
 * @param {HTMLElement} element - Element containing number
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(updateCounter);
}

/**
 * Initialize counter animations for visible stat elements
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter, 10);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

/**
 * Parallax scroll effect for hero elements
 */
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

/* =========================================================
   Auto-initialize additional effects
   ========================================================= */

// Auto-initialize when initEffects is called
const originalInitEffects = window.initEffects;
window.initEffects = function() {
  // Call original scroll reveal init
  originalInitEffects();
  
  // Initialize additional effects
  initCounterAnimations();
  initParallaxEffect();
};

/* =========================================================
   Performance Monitoring (Development Only)
   ========================================================= */

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.EFFECTS_DEBUG = {
    config: EFFECTS_CONFIG,
    animateCounter,
    revealElement,
  };
  console.log("🔧 Effects debug mode enabled. Access via window.EFFECTS_DEBUG");
}
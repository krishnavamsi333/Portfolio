// =========================================================
// effects.js – Visual effects and animations
// =========================================================

// Main effects initialization
function initEffects() {
  try {
    initSectionAnimations();
    initCardAnimations();
    initTypingEffect();
    initRippleEffects();
    initAchievementIconEffects();
    initProjectThumbnailEffects();
    initParallaxEffect();
    initCounterAnimations();
    initImageLazyLoading();
    
    console.log('✓ Effects initialized');
  } catch (error) {
    console.error('Error initializing effects:', error);
  }
}

// =========================================================
// Section Animations
// =========================================================

function initSectionAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay based on order
        const delay = parseInt(entry.target.dataset.delay) || 0;
        
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, delay);
        
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach((section, index) => {
    // Add data attribute for stagger effect
    section.dataset.delay = index * 100;
    sectionObserver.observe(section);
  });
}

// =========================================================
// Card Animations
// =========================================================

function initCardAnimations() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCards(entry.target);
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const cardContainers = document.querySelectorAll(
    '.card-grid, .achievements-grid, .projects-grid, .contact-grid'
  );
  
  cardContainers.forEach(container => {
    // Initialize cards with hidden state
    const cards = container.querySelectorAll('.card, .achievement-card, .project-item, .contact-card');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px) scale(0.95)';
      card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    cardObserver.observe(container);
  });
}

function animateCards(container) {
  const cards = container.querySelectorAll('.card, .achievement-card, .project-item, .contact-card');
  
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    }, index * 80);
  });
}

// =========================================================
// Typing Effect
// =========================================================

function initTypingEffect() {
  const elements = document.querySelectorAll('[data-typing]');
  
  elements.forEach(element => {
    const text = element.textContent.trim();
    const speed = parseInt(element.dataset.typingSpeed) || 50;
    const delay = parseInt(element.dataset.typingDelay) || 500;
    const cursor = element.dataset.typingCursor !== 'false';
    
    animateTyping(element, text, speed, delay, cursor);
  });
  
  // Legacy support for header subtitle
  const subtitle = document.querySelector('.header-subtitle:not([data-typing])');
  if (subtitle) {
    const text = subtitle.textContent.trim();
    animateTyping(subtitle, text, 50, 500, true);
  }
}

function animateTyping(element, text, speed, initialDelay, showCursor) {
  element.textContent = '';
  
  if (showCursor) {
    element.style.borderRight = '2px solid currentColor';
    element.style.paddingRight = '5px';
  }
  
  let charIndex = 0;
  
  const typeNextChar = () => {
    if (charIndex < text.length) {
      element.textContent += text.charAt(charIndex);
      charIndex++;
      setTimeout(typeNextChar, speed);
    } else if (showCursor) {
      // Blink cursor a few times, then remove
      let blinkCount = 0;
      const blinkInterval = setInterval(() => {
        element.style.borderRight = 
          element.style.borderRight === 'none' 
            ? '2px solid currentColor' 
            : 'none';
        
        blinkCount++;
        if (blinkCount >= 6) {
          clearInterval(blinkInterval);
          element.style.borderRight = 'none';
          element.style.paddingRight = '0';
        }
      }, 500);
    }
  };
  
  setTimeout(typeNextChar, initialDelay);
}

// =========================================================
// Ripple Effects
// =========================================================

function initRippleEffects() {
  // Inject ripple styles if not present
  injectRippleStyles();
  
  // Add ripple to interactive elements
  const rippleElements = document.querySelectorAll(
    '.btn, .tag, .nav-link, .project-link, .publication-link, .contact-card, [data-ripple]'
  );
  
  rippleElements.forEach(element => {
    // Skip if already initialized
    if (element.dataset.rippleInit) return;
    
    element.dataset.rippleInit = 'true';
    element.style.position = element.style.position || 'relative';
    element.style.overflow = 'hidden';
    
    element.addEventListener('click', handleRippleClick);
  });
}

function injectRippleStyles() {
  if (document.getElementById('ripple-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'ripple-styles';
  style.textContent = `
    @keyframes ripple {
      0% {
        width: 0;
        height: 0;
        opacity: 0.6;
      }
      100% {
        width: 300px;
        height: 300px;
        opacity: 0;
      }
    }
    
    .ripple-element {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: translate(-50%, -50%);
      animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    
    
  `;
  document.head.appendChild(style);
}

function handleRippleClick(e) {
  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const ripple = document.createElement('span');
  ripple.className = 'ripple-element';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  this.appendChild(ripple);
  
  // Remove after animation
  setTimeout(() => ripple.remove(), 600);
}

// =========================================================
// Achievement Icon Effects
// =========================================================

function initAchievementIconEffects() {
  const icons = document.querySelectorAll('.achievement-icon, [data-icon-effect]');
  
  icons.forEach(icon => {
    icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    icon.addEventListener('mouseenter', function() {
      const effects = ['bounce', 'rotate', 'scale', 'shake'];
      const effect = this.dataset.iconEffect || 'rotate';
      
      applyIconEffect(this, effect);
    });
    
    icon.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1) rotate(0deg)';
    });
  });
}

function applyIconEffect(icon, effect) {
  switch(effect) {
    case 'bounce':
      icon.style.transform = 'scale(1.2) translateY(-5px)';
      break;
    case 'rotate':
      const rotations = [15, -15, 20, -20];
      const rotation = rotations[Math.floor(Math.random() * rotations.length)];
      icon.style.transform = `scale(1.2) rotate(${rotation}deg)`;
      break;
    case 'scale':
      icon.style.transform = 'scale(1.3)';
      break;
    case 'shake':
      icon.style.animation = 'shake 0.5s ease';
      setTimeout(() => icon.style.animation = '', 500);
      break;
    default:
      icon.style.transform = 'scale(1.2)';
  }
}

// =========================================================
// Project Thumbnail Effects
// =========================================================

function initProjectThumbnailEffects() {
  const thumbnails = document.querySelectorAll('.project-thumbnail, .project-image, [data-thumbnail]');
  
  thumbnails.forEach(thumbnail => {
    thumbnail.style.transition = 'transform 0.3s ease';
    
    // Hover effect
    thumbnail.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    thumbnail.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
    
    // Optional: Subtle pulse effect when idle
    if (thumbnail.dataset.pulse === 'true') {
      startPulseEffect(thumbnail);
    }
  });
}

function startPulseEffect(element) {
  let isHovered = false;
  
  element.addEventListener('mouseenter', () => isHovered = true);
  element.addEventListener('mouseleave', () => isHovered = false);
  
  const pulse = () => {
    if (!isHovered && document.contains(element)) {
      element.style.transform = 'scale(1.02)';
      
      setTimeout(() => {
        if (!isHovered && document.contains(element)) {
          element.style.transform = 'scale(1)';
        }
      }, 300);
    }
  };
  
  // Pulse every 4 seconds
  const intervalId = setInterval(pulse, 4000);
  
  // Cleanup on element removal
  const observer = new MutationObserver((mutations) => {
    if (!document.contains(element)) {
      clearInterval(intervalId);
      observer.disconnect();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// =========================================================
// Parallax Effect
// =========================================================

function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax(parallaxElements);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function updateParallax(elements) {
  const scrollY = window.scrollY;
  
  elements.forEach(element => {
    const speed = parseFloat(element.dataset.parallax) || 0.5;
    const yPos = -(scrollY * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
}

// =========================================================
// Counter Animations
// =========================================================

function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (counters.length === 0) return;
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.counter);
  const duration = parseInt(element.dataset.counterDuration) || 2000;
  const startValue = 0;
  const increment = target / (duration / 16); // 60fps
  
  let current = startValue;
  
  const updateCounter = () => {
    current += increment;
    
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

// =========================================================
// Lazy Loading Images
// =========================================================

function initImageLazyLoading() {
  const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
  
  if (images.length === 0) return;
  
  const imageObserverOptions = {
    threshold: 0,
    rootMargin: '50px'
  };
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage(entry.target);
        imageObserver.unobserve(entry.target);
      }
    });
  }, imageObserverOptions);
  
  images.forEach(img => {
    // Add loading state
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    imageObserver.observe(img);
  });
}

function loadImage(img) {
  const src = img.dataset.src || img.src;
  
  if (!src) return;
  
  const tempImg = new Image();
  tempImg.onload = () => {
    img.src = src;
    img.style.opacity = '1';
    img.removeAttribute('data-src');
  };
  
  tempImg.onerror = () => {
    console.error(`Failed to load image: ${src}`);
    img.style.opacity = '0.5';
  };
  
  tempImg.src = src;
}

// =========================================================
// Utility: Add shake animation
// =========================================================

function injectShakeAnimation() {
  if (document.getElementById('shake-animation')) return;
  
  const style = document.createElement('style');
  style.id = 'shake-animation';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}

// Inject shake animation on load
injectShakeAnimation();

// =========================================================
// Performance Monitoring
// =========================================================

function monitorAnimationPerformance() {
  if (!window.PerformanceObserver) return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 16) { // More than one frame at 60fps
        console.warn(`Slow animation detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
      }
    }
  });
  
  observer.observe({ entryTypes: ['measure'] });
}

// Enable performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  monitorAnimationPerformance();
}

/* Skill bar animation on scroll */

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("start-animation");
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".animate-on-scroll").forEach((el) => {
  skillObserver.observe(el);
});

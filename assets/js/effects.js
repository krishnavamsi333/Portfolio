// =========================================================
// effects.js – Viewport-based animations & counters
// Uses IntersectionObserver only (no scroll listeners)
// =========================================================

const EFFECTS_CONFIG = {
  threshold: 0.25,
  counterDuration: 2000
};

// =========================================================
// ENTRY
// =========================================================
function initEffects() {
  try {
    initAnimateOnScroll();
    initProgressBars();
    initCounters();

    console.info("✓ Effects initialized");
  } catch (err) {
    console.error("Effects init failed:", err);
  }
}

// =========================================================
// GENERIC ANIMATE-ON-SCROLL
// =========================================================
function initAnimateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: EFFECTS_CONFIG.threshold }
  );

  elements.forEach(el => observer.observe(el));
}

// =========================================================
// PROGRESS BARS (SKILLS / RESEARCH)
// =========================================================
function initProgressBars() {
  const bars = document.querySelectorAll(
    ".skill-bar-fill, .research-bar-fill"
  );
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const bar = entry.target;
        const level = bar.dataset.level;

        if (level) {
          bar.style.width = `${level}%`;
        }

        observer.unobserve(bar);
      });
    },
    { threshold: EFFECTS_CONFIG.threshold }
  );

  bars.forEach(bar => observer.observe(bar));
}

// =========================================================
// COUNTERS
// =========================================================
function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.counter);
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / EFFECTS_CONFIG.counterDuration, 1);
    const value = start + (target - start) * progress;

    el.textContent =
      Number.isInteger(target)
        ? Math.floor(value)
        : value.toFixed(1);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + "+";
    }
  }

  requestAnimationFrame(update);
}

// =========================================================
// EXPORT
// =========================================================
window.initEffects = initEffects;

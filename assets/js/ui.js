// =========================================================
// ui.js – Core UI interactions (FINAL)
// Compatible with app.js + effects.js + footer.js
// =========================================================

const UI_CONFIG = {
  scrollThreshold: 300,
  navOffset: 80,
  headerParallaxLimit: 500,
  throttleDelay: 16
};

// =========================================================
// INIT
// =========================================================
function initUI() {
  try {
    initSmoothScroll();
    initNavbarScroll();
    initActiveNavLinks();
    initMobileMenu();
    initFormValidation();
    initTooltips();
    initModals();

    console.log("✓ UI initialized");
  } catch (err) {
    console.error("UI init failed:", err);
  }
}

// =========================================================
// SMOOTH SCROLL (NAV + FOOTER SAFE)
// =========================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      e.preventDefault();

      const y =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        UI_CONFIG.navOffset;

      window.scrollTo({ top: y, behavior: "smooth" });

      // Close mobile menu
      document.querySelector(".nav-list")?.classList.remove("active");
      document.querySelector(".mobile-toggle")?.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

// =========================================================
// NAVBAR SCROLL BEHAVIOR
// =========================================================
function initNavbarScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    throttle(() => {
      const current = window.pageYOffset;

      // Shadow
      nav.classList.toggle("scrolled", current > 50);

      // Hide / Show
      if (current > 200) {
        current > lastScroll
          ? nav.classList.add("hidden")
          : nav.classList.remove("hidden");
      } else {
        nav.classList.remove("hidden");
      }

      lastScroll = current;
    }),
    { passive: true }
  );
}

// =========================================================
// ACTIVE NAV LINK HIGHLIGHT
// =========================================================
function initActiveNavLinks() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-link");

  if (!sections.length || !links.length) return;

  window.addEventListener(
    "scroll",
    throttle(() => {
      let current = "";
      const scrollY = window.pageYOffset + 150;

      sections.forEach(sec => {
        if (
          scrollY >= sec.offsetTop &&
          scrollY < sec.offsetTop + sec.offsetHeight
        ) {
          current = sec.id;
        }
      });

      links.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${current}`
        );
      });
    }),
    { passive: true }
  );
}

// =========================================================
// MOBILE MENU
// =========================================================
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const menu = document.querySelector(".nav-list");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("active");
    toggle.classList.toggle("active");
    document.body.style.overflow = open ? "hidden" : "";
  });
}

// =========================================================
// FORM VALIDATION (LIGHTWEIGHT)
// =========================================================
function initFormValidation() {
  document.querySelectorAll("form[data-validate]").forEach(form => {
    form.addEventListener("submit", e => {
      let valid = true;

      form.querySelectorAll("[required]").forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });

      if (!valid) e.preventDefault();
    });
  });
}

// =========================================================
// TOOLTIPS (NATIVE FALLBACK)
// =========================================================
function initTooltips() {
  document.querySelectorAll("[data-tooltip]").forEach(el => {
    el.title = el.dataset.tooltip;
  });
}

// =========================================================
// MODALS (BASIC)
// =========================================================
function initModals() {
  document.querySelectorAll("[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById(btn.dataset.modal);
      modal?.classList.add("active");
    });
  });

  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal")?.classList.remove("active");
    });
  });
}

// =========================================================
// THROTTLE UTIL
// =========================================================
function throttle(fn, delay = UI_CONFIG.throttleDelay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}

// =========================================================
// EXPORT
// =========================================================
window.initUI = initUI;

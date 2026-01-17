// =========================================================
// ui.js – Core UI interactions (FINAL)
// Depends on components loaded by app.js
// =========================================================

const UI_CONFIG = {
  navOffset: 80,
  scrollSpyOffset: 150,
  throttleDelay: 16,
  backToTopThreshold: 300
};

// =========================================================
// ENTRY
// =========================================================
function initUI() {
  try {
    initSmoothScroll();
    initNavbarScroll();
    initScrollSpy();
    initMobileMenu();
    initBackToTop();
    initFormValidation();
    initTooltips();
    initModals();

    console.info("✓ UI initialized");
  } catch (err) {
    console.error("UI init failed:", err);
  }
}

// =========================================================
// SMOOTH SCROLL (NAV + FOOTER)
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

      closeMobileMenu();
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

      nav.classList.toggle("scrolled", current > 50);

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
// ACTIVE NAV LINK (SCROLL SPY)
// =========================================================
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-link");

  if (!sections.length || !links.length) return;

  window.addEventListener(
    "scroll",
    throttle(() => {
      let current = "";
      const scrollY = window.pageYOffset + UI_CONFIG.scrollSpyOffset;

      sections.forEach(section => {
        if (
          scrollY >= section.offsetTop &&
          scrollY < section.offsetTop + section.offsetHeight
        ) {
          current = section.id;
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
    toggle.setAttribute("aria-expanded", open);
  });
}

function closeMobileMenu() {
  document.querySelector(".nav-list")?.classList.remove("active");
  document.querySelector(".mobile-toggle")?.classList.remove("active");
  document.body.style.overflow = "";
}

// =========================================================
// BACK TO TOP BUTTON
// =========================================================
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    throttle(() => {
      btn.classList.toggle(
        "visible",
        window.pageYOffset > UI_CONFIG.backToTopThreshold
      );
    }),
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          input.classList.add("error");
          valid = false;
        } else {
          input.classList.remove("error");
        }
      });

      if (!valid) e.preventDefault();
    });
  });
}

// =========================================================
// TOOLTIPS
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
      document
        .getElementById(btn.dataset.modal)
        ?.classList.add("active");
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

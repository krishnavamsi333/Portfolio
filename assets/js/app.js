/* =========================================================
   app.js — Master Loader & Logic Integration
   ========================================================= */

// Configuration
const CONFIG = {
  basePath: window.location.pathname.includes("/Portfolio/") ? "/Portfolio/" : "/",
  emailJsPublicKey: "B8jnclWW0_3oHVtAY",
  emailJsServiceId: "service_lv8s52p",
  emailJsTemplateId: "template_fq0ahsr",
  loadingDelay: 1500, // Minimum loading time for smooth UX
};

// Component manifest
const COMPONENTS = [
  { id: "nav-container", file: "components/nav.html" },
  { id: "header-container", file: "components/header.html" },
  { id: "about-container", file: "components/about.html" },
  { id: "projects-container", file: "components/projects.html" },
  { id: "skills-container", file: "components/skills.html" },
  { id: "experience-container", file: "components/experience.html" },
  { id: "publications-container", file: "components/publications.html" },
  { id: "achievements-container", file: "components/achievements.html" },
  { id: "contact-container", file: "components/contact.html" },
  { id: "footer-container", file: "components/footer.html" },
];

/* =========================================================
   Component Loading System
   ========================================================= */

/**
 * Load a single component and inject into DOM
 * @param {Object} component - Component configuration
 * @returns {Promise<void>}
 */
async function loadComponent({ id, file }) {
  const container = document.getElementById(id);
  
  if (!container) {
    console.warn(`⚠️ Container not found: ${id}`);
    return;
  }

  try {
    const response = await fetch(CONFIG.basePath + file);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    container.innerHTML = html;
    
    console.log(`✓ Loaded: ${file}`);
  } catch (error) {
    console.error(`✗ Failed to load ${file}:`, error.message);
    container.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--color-text-muted);">
        <p>Failed to load content</p>
      </div>
    `;
  }
}

/**
 * Load all components in sequence
 * @returns {Promise<void>}
 */
async function loadAllComponents() {
  const startTime = performance.now();
  
  // Load components sequentially to prevent race conditions
  for (const component of COMPONENTS) {
    await loadComponent(component);
  }
  
  const loadTime = performance.now() - startTime;
  console.log(`✓ All components loaded in ${loadTime.toFixed(2)}ms`);
}

/* =========================================================
   EmailJS Integration
   ========================================================= */

/**
 * Initialize EmailJS and form handlers
 */
function initEmailJS() {
  if (!window.emailjs) {
    console.warn("⚠️ EmailJS not loaded");
    return;
  }

  // Initialize EmailJS with public key
  emailjs.init(CONFIG.emailJsPublicKey);
  console.log("✓ EmailJS initialized");

  // Initialize contact form
  initContactForm();
}

/**
 * Setup contact form submission handler
 */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  
  if (!contactForm) {
    console.log("ℹ️ Contact form not found (may not be on this page)");
    return;
  }

  contactForm.addEventListener("submit", handleContactFormSubmit);
  console.log("✓ Contact form initialized");
}

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
async function handleContactFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitButton = form.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;
  
  // Disable form and update UI
  setFormState(form, submitButton, true, "SENDING...");
  
  try {
    await emailjs.sendForm(
      CONFIG.emailJsServiceId,
      CONFIG.emailJsTemplateId,
      form
    );
    
    showFormMessage("success", "✅ MESSAGE SENT SUCCESSFULLY");
    form.reset();
    
    console.log("✓ Email sent successfully");
  } catch (error) {
    console.error("✗ Email send failed:", error);
    showFormMessage("error", "❌ FAILED TO SEND MESSAGE. PLEASE TRY AGAIN.");
  } finally {
    // Re-enable form
    setTimeout(() => {
      setFormState(form, submitButton, false, originalButtonText);
    }, 1000);
  }
}

/**
 * Set form loading state
 * @param {HTMLFormElement} form - Form element
 * @param {HTMLButtonElement} button - Submit button
 * @param {boolean} isLoading - Loading state
 * @param {string} buttonText - Button text
 */
function setFormState(form, button, isLoading, buttonText) {
  button.disabled = isLoading;
  button.textContent = buttonText;
  form.classList.toggle("form-loading", isLoading);
}

/**
 * Show form feedback message
 * @param {string} type - Message type (success/error)
 * @param {string} message - Message text
 */
function showFormMessage(type, message) {
  // Check if custom toast notification exists
  if (typeof window.showToast === 'function') {
    window.showToast(type, message);
    return;
  }
  
  // Fallback to alert
  alert(message);
}

/* =========================================================
   Application Initialization
   ========================================================= */

/**
 * Initialize application
 */
async function initApp() {
  console.log("🚀 Initializing application...");
  
  try {
    // Load all HTML components
    await loadAllComponents();
    
    // Initialize EmailJS
    initEmailJS();
    
    // Initialize UI effects (defined in ui.js)
    if (typeof window.initUI === 'function') {
      window.initUI();
    } else {
      console.warn("⚠️ initUI function not found");
    }
    
    // Initialize scroll effects (defined in effects.js)
    if (typeof window.initEffects === 'function') {
      window.initEffects();
    } else {
      console.warn("⚠️ initEffects function not found");
    }
    
    console.log("✅ Application initialized successfully");
  } catch (error) {
    console.error("❌ Application initialization failed:", error);
  }
}

/* =========================================================
   Event Listeners
   ========================================================= */

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already loaded
  initApp();
}

// Expose for debugging in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.APP_DEBUG = {
    config: CONFIG,
    components: COMPONENTS,
    reload: initApp,
  };
  console.log("🔧 Debug mode enabled. Access via window.APP_DEBUG");
}
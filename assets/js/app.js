// =========================================================
// app.js – GitHub Pages safe component loader + init
// =========================================================

const BASE_PATH = window.location.pathname.includes("/Portfolio/")
  ? "/Portfolio/"
  : "/";

const COMPONENTS = [
  { id: "header-container", file: "components/header.html" },
  { id: "nav-container", file: "components/nav.html" },
  { id: "about-container", file: "components/about.html" },
  { id: "skills-container", file: "components/skills.html" },
  { id: "research-container", file: "components/research.html" },
  { id: "publications-container", file: "components/publications.html" },
  { id: "projects-container", file: "components/projects.html" },
  { id: "achievements-container", file: "components/achievements.html" },
  { id: "contact-container", file: "components/contact.html" },
  { id: "footer-container", file: "components/footer.html" }
];

// -----------------------------
// Loader helpers
// -----------------------------

function showLoadingState() {
  document.querySelector(".page-loader")?.classList.add("active");
}

function hideLoadingState() {
  const loader = document.querySelector(".page-loader");
  if (!loader) return;
  setTimeout(() => {
    loader.classList.remove("active");
    loader.classList.add("hidden");
  }, 300);
}

async function loadComponent({ id, file }) {
  const container = document.getElementById(id);
  if (!container) return;

  const url = `${BASE_PATH}${file}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to load ${url}`);
  }

  container.innerHTML = await res.text();
}

// =========================================================
// EmailJS Init (PUBLIC KEY ONLY)
// =========================================================

function initEmailJS() {
  if (typeof emailjs !== "undefined") {
    emailjs.init("B8jnclWW0_3oHVtAY"); // ✅ PUBLIC KEY
    console.log("✓ EmailJS initialized");
  } else {
    console.warn("EmailJS not loaded");
  }
}

// =========================================================
// Newsletter logic (AFTER footer loads)
// =========================================================

function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) {
    console.warn("Newsletter form not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = form.querySelector("input[type='email']");
    const email = emailInput.value.trim();
    if (!email) return;

    emailjs
      .send(
        "service_lv8s52p",
        "template_fq0ahsr",
        { subscriber_email: email }
      )
      .then(() => {
        alert("✅ Subscription successful! Email received.");
        form.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("❌ Failed to send email. Try again.");
      });
  });

  console.log("✓ Newsletter initialized");
}

// =========================================================
// Main boot
// =========================================================

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Base path:", BASE_PATH);
  showLoadingState();

  try {
    for (const component of COMPONENTS) {
      await loadComponent(component);
    }

    // Init global UI
    if (typeof initUI === "function") initUI();
    if (typeof initEffects === "function") initEffects();

    // Init Email + Newsletter AFTER footer exists
    initEmailJS();
    initNewsletter();

    console.log("✓ All components loaded & initialized");
  } catch (err) {
    console.error("Component loading failed:", err);
  } finally {
    hideLoadingState();
  }
});

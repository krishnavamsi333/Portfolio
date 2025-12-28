// =========================================================
// app.js – GitHub Pages safe component loader + init
// =========================================================

// -----------------------------
// Base path (GitHub Pages safe)
// -----------------------------
const BASE_PATH = window.location.pathname.includes("/Portfolio/")
  ? "/Portfolio/"
  : "/";

// -----------------------------
// Components to load
// -----------------------------
const COMPONENTS = [
  { id: "header-container", file: "components/header.html" },
  { id: "nav-container", file: "components/nav.html" },
  { id: "about-container", file: "components/about.html" },
  { id: "skills-container", file: "components/skills.html" },
  { id: "research-container", file: "components/research.html" },
  { id: "publications-container", file: "components/publications.html" },
  { id: "projects-container", file: "components/projects.html" },
  // { id: "achievements-container", file: "components/achievements.html" },
  { id: "experience-container", file: "components/experience.html" },
  { id: "learning-container", file: "components/learning.html" },
  { id: "contact-container", file: "components/contact.html" },
  { id: "footer-container", file: "components/footer.html" }
];

// =========================================================
// Loader helpers
// =========================================================
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
  if (!res.ok) throw new Error(`Failed to load ${url}`);

  container.innerHTML = await res.text();
}

// =========================================================
// EmailJS Init (PUBLIC KEY ONLY)
// =========================================================
function initEmailJS() {
  if (!window.emailjs) {
    console.error("❌ EmailJS not loaded");
    return;
  }
  emailjs.init("B8jnclWW0_3oHVtAY");
  console.log("✓ EmailJS initialized");
}

// =========================================================
// Newsletter logic (uses CONTACT template safely)
// =========================================================
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) {
    console.warn("Newsletter form not found");
    return;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const emailInput = form.querySelector("input[type='email']");
    const email = emailInput?.value.trim();
    if (!email) return;

    // Use Contact template in a SAFE way
    emailjs
      .send(
        "service_lv8s52p",
        "template_fq0ahsr",
        {
          from_name: "Newsletter Subscriber",
          from_email: email,
          subject: "New Newsletter Subscription",
          message: `New subscriber email: ${email}`
        }
      )
      .then(() => {
        alert("✅ Subscription successful!");
        form.reset();
      })
      .catch(err => {
        console.error("Newsletter EmailJS error:", err);
        alert("❌ Subscription failed. Try again.");
      });
  });

  console.log("✓ Newsletter initialized");
}

// =========================================================
// Contact Form logic + Auto-Reply
// =========================================================
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    e.stopPropagation();

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn.disabled) return;

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    const params = {
      from_name: form.name.value,
      from_email: form.email.value,
      subject: form.subject.value,
      message: form.message.value
    };

    // 1️⃣ Send message to YOU
    emailjs
      .send("service_lv8s52p", "template_fq0ahsr", params)
      .then(() => {
        // 2️⃣ Auto-reply to USER
        return emailjs.send(
          "service_lv8s52p",
          "template_f2xtf3k",
          {
            to_email: params.from_email,
            from_name: params.from_name
          }
        );
      })
      .then(() => {
        alert("✅ Message sent successfully!");
        form.reset();
      })
      .catch(err => {
        console.error("Contact EmailJS error:", err);
        alert("❌ Failed to send message");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send Message";
      });
  });
}

// =========================================================
// Main boot
// =========================================================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Base path:", BASE_PATH);
  showLoadingState();

  try {
    // Load all components sequentially
    for (const component of COMPONENTS) {
      await loadComponent(component);
    }

    // Global UI hooks
    if (typeof initUI === "function") initUI();
    if (typeof initEffects === "function") initEffects();

    // Email + forms (AFTER components exist)
    initEmailJS();
    initContactForm();
    initNewsletter();

    console.log("✓ All components loaded & initialized");
  } catch (err) {
    console.error("Component loading failed:", err);
  } finally {
    hideLoadingState();
  }
});

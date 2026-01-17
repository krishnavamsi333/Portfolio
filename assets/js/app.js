// =========================================================
// app.js – Component loader + global init
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
  { id: "experience-container", file: "components/experience.html" },
  { id: "learning-container", file: "components/learning.html" },
  { id: "contact-container", file: "components/contact.html" },
  { id: "footer-container", file: "components/footer.html" }
];

async function loadComponent({ id, file }) {
  const container = document.getElementById(id);
  if (!container) return;

  const res = await fetch(`${BASE_PATH}${file}`);
  if (!res.ok) throw new Error(`Failed to load ${file}`);

  container.innerHTML = await res.text();
}

// =========================================================
// EMAILJS INIT (PUBLIC KEY ONLY)
// =========================================================
function initEmailJS() {
  if (!window.emailjs) return;
  emailjs.init("B8jnclWW0_3oHVtAY");
}

// =========================================================
// NEWSLETTER
// =========================================================
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form || !window.emailjs) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const email = form.querySelector("input[type='email']").value.trim();
    if (!email) return;

    emailjs.send(
      "service_lv8s52p",
      "template_fq0ahsr",
      {
        from_name: "Newsletter",
        from_email: email,
        subject: "Newsletter Subscription",
        message: `New subscriber: ${email}`
      }
    ).then(() => {
      alert("✅ Subscribed successfully!");
      form.reset();
    }).catch(() => {
      alert("❌ Subscription failed");
    });
  });
}

// =========================================================
// BOOTSTRAP
// =========================================================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    for (const c of COMPONENTS) {
      await loadComponent(c);
    }

    initEmailJS();
    initNewsletter();

    window.initUI?.();
    window.initEffects?.();

    console.info("✓ App ready");
  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
});

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
  if (!container) {
    console.warn(`Container not found: #${id}`);
    return;
  }

  const url = `${BASE_PATH}${file}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${url}`);
  }

  container.innerHTML = await res.text();
}

// -----------------------------
// Main boot
// -----------------------------

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Base path:", BASE_PATH);
  showLoadingState();

  try {
    for (const component of COMPONENTS) {
      await loadComponent(component);
    }

    // Init after components exist
    if (typeof initUI === "function") initUI();
    if (typeof initEffects === "function") initEffects();

    console.log("✓ All components loaded");
  } catch (err) {
    console.error("Component loading failed:", err);
  } finally {
    hideLoadingState();
  }
});

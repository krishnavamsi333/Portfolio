// =====================================================
// footer.js – Footer interactions (FINAL)
// =====================================================

function initFooter() {

  /* ---------------------------------
     BACK TO TOP BUTTON
  --------------------------------- */
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 300);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------
     FOOTER COUNTERS (SAFE VERSION)
     (effects.js already animates counters)
  --------------------------------- */
  const footerCounters = document.querySelectorAll(
    ".footer-stats [data-counter]"
  );

  footerCounters.forEach(counter => {
    // Ensure default state
    counter.textContent = "0";
  });

  /* ---------------------------------
     NEWSLETTER (DEMO HANDLER)
     (EmailJS handled in app.js)
  --------------------------------- */
  const newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", e => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector("input[type='email']");
      const email = emailInput?.value.trim();

      if (!email) return;

      alert(`✅ Subscribed successfully!\n\nEmail: ${email}`);
      newsletterForm.reset();
    });
  }

  /* ---------------------------------
     SMOOTH SCROLL FOR FOOTER LINKS
  --------------------------------- */
  document.querySelectorAll(".footer-link[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  console.log("✓ Footer initialized");
}

/* ---------------------------------
   AUTO INIT (after components load)
--------------------------------- */
document.addEventListener("DOMContentLoaded", initFooter);

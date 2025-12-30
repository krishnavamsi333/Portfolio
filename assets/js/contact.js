document.addEventListener("DOMContentLoaded", () => {

  // --------------------------------
  // Guards
  // --------------------------------
  if (!window.emailjs) {
    console.error("❌ EmailJS not available");
    return;
  }

  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  // --------------------------------
  // Toast helper
  // --------------------------------
  function showToast(message) {
    if (!toast || !toastMessage) {
      console.log(message);
      return;
    }
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  // --------------------------------
  // Contact Form
  // --------------------------------
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = form.querySelector("button[type='submit']");
      if (btn.disabled) return;

      btn.disabled = true;
      btn.textContent = "Sending...";

      const params = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        title: form.subject.value.trim(),
        message: form.message.value.trim(),
      };

      emailjs
        .send("service_lv8s52p", "template_fq0ahsr", params)
        .then(() => {
          showToast("✅ Message sent successfully!");
          form.reset();
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          showToast("❌ Failed to send message");
        })
        .finally(() => {
          btn.disabled = false;
          btn.textContent = "Send Message";
        });
    });
  }

  // --------------------------------
  // Copy Email Button
  // --------------------------------
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const email = btn.closest(".contact-card")?.dataset.copy;
      if (!email) return;

      navigator.clipboard
        .writeText(email)
        .then(() => showToast("📋 Email copied"))
        .catch(() => showToast("❌ Copy failed"));
    });
  });

});

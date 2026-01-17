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

  let toastTimer = null;

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

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      toastTimer = null;
    }, 3000);
  }

  // --------------------------------
  // Contact Form
  // --------------------------------
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = form.querySelector("button[type='submit']");
      if (!btn || btn.disabled) return;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !subject || !message) {
        showToast("⚠️ Please fill in all fields");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending...";

      const params = {
        name,
        email,
        subject,     // safer naming
        message,
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

      const card = btn.closest(".contact-card");
      const email = card?.dataset.copy;
      if (!email) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(email)
          .then(() => showToast("📋 Email copied"))
          .catch(() => showToast("❌ Copy failed"));
      } else {
        // Fallback
        const temp = document.createElement("textarea");
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand("copy");
          showToast("📋 Email copied");
        } catch {
          showToast("Copy failed");
        }
        document.body.removeChild(temp);
      }
    });
  });

});

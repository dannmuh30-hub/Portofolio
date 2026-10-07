/* =========================================================
   SCRIPT PORTOFOLIO - Vanilla JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Dynamic Greeting sesuai waktu ---------- */
  const greetingEl = document.getElementById("greeting");
  const hour = new Date().getHours();
  let greet = "Selamat Malam";
  if (hour >= 4 && hour < 11) greet = "Selamat Pagi";
  else if (hour >= 11 && hour < 15) greet = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greet = "Selamat Sore";
  greetingEl.textContent = greet + ", saya Muhammad Syahdan";

  /* ---------- 2. Theme Toggle (Dark / Light) + simpan pilihan ---------- */
  const themeBtn = document.getElementById("themeToggle");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  updateThemeIcon();

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    themeBtn.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  }

  /* ---------- 3. Hamburger Menu (mobile) ---------- */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open);
  });

  // Tutup menu setelah link diklik (smooth scroll ditangani CSS: scroll-behavior)
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", false);
    });
  });

  /* ---------- 4. Smooth Scroll untuk semua anchor internal ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---------- Animasi muncul saat di-scroll (reveal) ---------- */
  const revealTargets = document.querySelectorAll(".card, .project-card, .window, .about-text, .section-head");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => { el.classList.add("reveal"); io.observe(el); });
  }

  /* ---------- 5. Back to Top ---------- */
  const backTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 400);
  });
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- 6. Filter Proyek ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      cards.forEach(card => {
        card.classList.toggle("hide", f !== "all" && card.dataset.category !== f);
      });
    });
  });

  /* ---------- 7. Modal Detail Proyek ---------- */
  const modal = document.getElementById("projectModal");
  const mTitle = document.getElementById("modalTitle");
  const mDesc = document.getElementById("modalDesc");
  const mTech = document.getElementById("modalTech");
  const mLink = document.getElementById("modalLink");

  cards.forEach(card => {
    card.querySelector(".btn-link").addEventListener("click", () => {
      mTitle.textContent = card.dataset.title;
      mDesc.textContent = card.dataset.desc;
      mTech.textContent = card.dataset.tech;
      mLink.href = card.dataset.link;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); }); // klik di luar kotak
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------- 8. Validasi Form Kontak + localStorage ---------- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    // Reset pesan error
    ["name", "email", "message"].forEach(id => document.getElementById(id + "Error").textContent = "");
    success.textContent = "";

    if (name.length < 2) {
      document.getElementById("nameError").textContent = "Nama minimal 2 karakter.";
      valid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      document.getElementById("emailError").textContent = "Format email tidak valid.";
      valid = false;
    }
    if (message.length < 10) {
      document.getElementById("messageError").textContent = "Pesan minimal 10 karakter.";
      valid = false;
    }
    if (!valid) return;

    // Simpan ke localStorage (array berisi semua pesan)
    const messages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    messages.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem("contactMessages", JSON.stringify(messages));

    success.textContent = "Terima kasih! Pesanmu berhasil disimpan.";
    form.reset();
  });
});

"use strict";

const body = document.body;
const loader = document.querySelector(".loader");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const progressBar = document.querySelector(".progress-bar");
const backToTop = document.querySelector(".back-to-top");
const counters = document.querySelectorAll(".counter");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const typingText = document.querySelector("#typing-text");
const contactForm = document.querySelector("#contactForm");
const resumeBtn = document.querySelector("#resumeBtn");

const titleText = "RAM CHANDRA JOSHI | +2 Level Teacher | Dedicated Educator | Lifelong Learner";
let typingIndex = 0;
let countersStarted = false;

// Hide the preloader after the page is ready and begin the hero typing effect.
window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 450);
  typeTitle();
});

function typeTitle() {
  if (!typingText) return;
  typingText.textContent = titleText.slice(0, typingIndex);
  typingIndex += 1;

  if (typingIndex <= titleText.length) {
    setTimeout(typeTitle, 48);
  }
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  backToTop.classList.toggle("visible", scrollTop > 600);
}

// Keep the active menu item synced with the section currently in view.
function setActiveNavLink() {
  let currentId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

window.addEventListener("scroll", () => {
  updateScrollProgress();
  setActiveNavLink();
});

// Mobile navigation.
navToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Persist the visitor's theme preference locally.
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark");
  localStorage.setItem("teacher-theme", isDark ? "dark" : "light");
  themeIcon.textContent = isDark ? "☀" : "☾";
});

const storedTheme = localStorage.getItem("teacher-theme");
if (storedTheme === "dark") {
  body.classList.add("dark");
  themeIcon.textContent = "☀";
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounters();
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.35 });

if (counters.length) {
  counterObserver.observe(counters[0]);
}

// Lightweight animated counters for the hero and experience metrics.
function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// Validate the contact form without sending data to an external service.
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  const status = contactForm.querySelector(".form-status");
  let isValid = true;

  clearErrors();

  if (name.value.trim().length < 2) {
    showError(name, "Please enter your full name.");
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (message.value.trim().length < 12) {
    showError(message, "Please write a message of at least 12 characters.");
    isValid = false;
  }

  if (!isValid) {
    status.textContent = "";
    return;
  }

  status.textContent = "Thank you. Your message has been validated successfully.";
  contactForm.reset();
});

function showError(input, message) {
  const error = input.parentElement.querySelector(".error");
  error.textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function clearErrors() {
  contactForm.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";
  });

  contactForm.querySelectorAll("[aria-invalid]").forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

resumeBtn.addEventListener("click", () => {
  const originalText = resumeBtn.textContent;
  resumeBtn.textContent = "Resume Coming Soon";
  resumeBtn.disabled = true;

  setTimeout(() => {
    resumeBtn.textContent = originalText;
    resumeBtn.disabled = false;
  }, 1800);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navPanel.classList.contains("open")) {
    navPanel.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

updateScrollProgress();
setActiveNavLink();

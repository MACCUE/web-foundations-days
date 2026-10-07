// Select elements
const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

// Storage keys
const DRAFT_KEY = "draft";
const THEME_KEY = "theme";

// Update counts & classes
function updateCounts() {
  const text = textarea.value;
  const numChars = text.length;

  // Calculate words
  const trimmed = text.trim();
  const numWords = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

  // Exact string formatting required by prompt
  charCount.textContent = `${numChars} / 200 characters`;
  wordCount.textContent = `${numWords} words`;

  // Manage warning & over classes
  charCount.classList.remove("warning", "over");
  if (numChars > 200) {
    charCount.classList.add("over");
  } else if (numChars > 180) {
    charCount.classList.add("warning");
  }
}

// Clear function
function clearAll() {
  textarea.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
}

// Save draft and update on typing
textarea.addEventListener("input", () => {
  localStorage.setItem(DRAFT_KEY, textarea.value);
  updateCounts();
});

// Clear button
clearBtn.addEventListener("click", clearAll);

// Escape key to clear
textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearAll();
  }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  if (isDark) {
    themeToggle.textContent = "Light mode";
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    themeToggle.textContent = "Dark mode";
    localStorage.setItem(THEME_KEY, "light");
  }
});

// On load: restore saved draft & theme
window.addEventListener("DOMContentLoaded", () => {
  const savedDraft = localStorage.getItem(DRAFT_KEY);
  if (savedDraft) {
    textarea.value = savedDraft;
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "Dark mode";
  }

  updateCounts();
});
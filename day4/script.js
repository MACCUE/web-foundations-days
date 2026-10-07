// =====================================================
// QuickNotes - Project 1 Solution
// =====================================================
 
// ---------- 1. Select elements ----------
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const clearAllBtn = document.querySelector("#clear-all");
 
const STORAGE_KEY = "quicknotes";
const MAX_LENGTH = 200;
 
// ---------- 2. State (the single source of truth) ----------
let notes = loadNotes();
 
// ---------- 3. Storage helpers ----------
function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Saved notes were damaged. Starting fresh.", error);
    return [];
  }
}
 
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}
 
// ---------- 4. Validation ----------
function validate(text) {
  if (text === "") return "Please type a note first.";
  if (text.length > MAX_LENGTH) return "Notes must be 200 characters or fewer.";
  return ""; // empty string = no error
}
 
function showError(message) {
  errorMessage.textContent = message;
}
 
// ---------- 5. Helpers for display ----------
function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
 
function countMessage(total) {
  if (total === 0) return "You have no notes yet.";
  if (total === 1) return "You have 1 note.";
  return `You have ${total} notes.`;
}
 
function createNoteElement(note) {
  const li = document.createElement("li");
  li.classList.add("note", `category-${note.category}`);
 
  const body = document.createElement("div");
  body.classList.add("note-body");
 
  const text = document.createElement("p");
  text.classList.add("note-text");
  text.textContent = note.text; // textContent keeps user input safe
 
  const meta = document.createElement("div");
  meta.classList.add("note-meta");
 
  const badge = document.createElement("span");
  badge.classList.add("badge");
  badge.textContent = capitalise(note.category);
 
  const date = document.createElement("span");
  date.textContent = note.createdAt;
 
  meta.append(badge, date);
  body.append(text, meta);
 
  const del = document.createElement("button");
  del.type = "button";
  del.classList.add("delete-btn");
  del.textContent = "Delete";
  del.addEventListener("click", () => deleteNote(note.id));
 
  li.append(body, del);
  return li;
}
 
// ---------- 6. Render ----------
function render() {
  const query = searchInput.value.trim().toLowerCase();
 
  const visibleNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );
 
  list.innerHTML = ""; // safe: we are only clearing, not inserting user text
 
  if (notes.length > 0 && visibleNotes.length === 0) {
    const empty = document.createElement("li");
    empty.classList.add("empty-message");
    empty.textContent = "No notes match your search.";
    list.appendChild(empty);
  }
 
  visibleNotes.forEach((note) => {
    list.appendChild(createNoteElement(note));
  });
 
  count.textContent = countMessage(notes.length);
  clearAllBtn.hidden = notes.length === 0; // hide when there is nothing to clear
}
 
// ---------- 7. Actions ----------
function addNote(text, category) {
  const note = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };
  notes.unshift(note); // newest note first
  saveNotes();
  render();
}
 
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}
 
function clearAll() {
  if (!confirm("Delete all notes?")) return;
  notes = [];
  saveNotes();
  render();
}
 
// ---------- 8. Event listeners ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();
 
  const text = input.value.trim();
  const error = validate(text);
 
  if (error) {
    showError(error);
    input.focus();
    return; // stop here: do not add an invalid note
  }
 
  showError("");
  addNote(text, categorySelect.value);
  input.value = "";
  input.focus();
});
 
searchInput.addEventListener("input", render);
clearAllBtn.addEventListener("click", clearAll);
 
// ---------- 9. First render ----------
render();
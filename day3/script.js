// Starting Data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. searchNotes(word)
function searchNotes(word) {
  if (!word) return [];
  const query = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(query));
}

// 2. longestNote()
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) =>
    current.text.length > longest.text.length ? current : longest
  );
}

// 3. countByCategory()
function countByCategory() {
  return notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {});
}

// 4. getSummary()
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const label = total === 1 ? "note" : "notes";
  
  const personalCount = counts.personal || 0;
  const workCount = counts.work || 0;
  const studyCount = counts.study || 0;

  return `${total} ${label}: ${personalCount} personal, ${workCount} work, ${studyCount} study.`;
}

// Helper function to normalize spaces & lowercasing
function normalizeText(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

// 5. isDuplicate(text)
function isDuplicate(text) {
  if (!text) return false;
  const cleanInput = normalizeText(text);
  return notes.some(
    (note) => normalizeText(note.text) === cleanInput
  );
}

// 6. addNote(text, category)
function addNote(text, category) {
  const allowedCategories = ["personal", "work", "study"];

  if (!text || text.length < 1 || text.length > 200) {
    console.log("Failed: Text length must be between 1 and 200 characters.");
    return false;
  }

  if (!allowedCategories.includes(category)) {
    console.log("Failed: Category must be personal, work, or study.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Failed: Duplicate note text.");
    return false;
  }

  const newId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  const newNote = {
    id: newId,
    text: text.trim(),
    category: category,
  };

  notes.push(newNote);
  return true;
}

// ==========================================
// TESTS & CONSOLE LOGS
// ==========================================

console.log("--- 1. searchNotes ---");
console.log(searchNotes("javascript")); 
console.log(searchNotes("python"));     

console.log("--- 2. longestNote ---");
console.log(longestNote()); 

console.log("--- 3. countByCategory ---");
console.log(countByCategory()); 

console.log("--- 4. getSummary ---");
console.log(getSummary()); 

console.log("--- 5. isDuplicate ---");
console.log(isDuplicate("  buy  milk   and bread ")); 
console.log(isDuplicate("Learn React"));            

console.log("--- 6. addNote ---");
console.log(addNote("Learn React", "study")); 
console.log(addNote("Call mum", "personal"));
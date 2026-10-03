// Starting Data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];


function searchNotes(word) {
  const query = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(query));
}


function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) =>
    current.text.length > longest.text.length ? current : longest
  );
}


function countByCategory() {
  return notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {});
}


function getSummary() {
  const counts = countByCategory();
  const totalNotes = notes.length;
  const label = totalNotes === 1 ? "note" : "notes";
  const categoryParts = Object.entries(counts)
    .map(([cat, num]) => `${num} ${cat}`)
    .join(", ");

  return `${totalNotes} ${label}: ${categoryParts}.`;
}


function isDuplicate(text) {
  const cleanInput = text.trim().toLowerCase();
  return notes.some(
    (note) => note.text.trim().toLowerCase() === cleanInput
  );
}


function addNote(text, category) {
  const allowedCategories = ["personal", "work", "study"];

  if (!text || text.length < 1 || text.length > 200) {
    console.log("Failed: Text must be 1-200 characters.");
    return false;
  }

  if (!allowedCategories.includes(category)) {
    console.log("Failed: Category must be personal, work, or study.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Failed: Duplicate note text detected.");
    return false;
  }

  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
    text: text.trim(),
    category: category,
  };

  notes.push(newNote);
  return true;
}



console.log("--- 1. searchNotes ---");
console.log(searchNotes("javascript")); arrays", category: "study" }]
console.log(searchNotes("python"));   

console.log("--- 2. longestNote ---");
console.log(longestNote()); category: "work" 

console.log("--- 3. countByCategory ---");
console.log(countByCategory()); 

console.log("--- 4. getSummary ---");
console.log(getSummary()); 

console.log("--- 5. isDuplicate ---");
console.log(isDuplicate("  buy milk and BREAD ")); 
console.log(isDuplicate("Learn React"));            

console.log("--- 6. addNote ---");
console.log(addNote("Learn React", "study")); 
console.log(addNote("Call mum", "personal"));  
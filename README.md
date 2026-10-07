#web-Foundations-Daily Assignments
# QuickNotes Application

QuickNotes is a lightweight, responsive browser-based note-taking application built with plain HTML, CSS, and vanilla JavaScript.

## Features
- **Note Management**: Create and delete notes with distinct categories (Work, Personal, Ideas).
- **Search & Filter**: Filter notes by category or search through note text in real time.
- **Persistence**: Saved notes and active drafts persist across browser reloads using `localStorage`.
- **Character & Word Counter**: Live counters for characters and words with limit warnings (>180 warning, >200 over).
- **Dark Mode**: Persistent light/dark theme toggle utilizing CSS variables.
- **Security**: DOM elements populated via `textContent` to protect against Cross-Site Scripting (XSS).

## Structure
- `index.html` - Semantic HTML structure
- `style.css` - Custom styles and CSS variables for themes
- `script.js` - Dynamic DOM updates, event handling, and localStorage logic
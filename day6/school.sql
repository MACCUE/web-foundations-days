-- Day 6 Assignment: A School Database
-- SQLite compatible

DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE(student_id, course_id)
);

INSERT INTO students (name, email) VALUES 
('Alice Smith', 'alice@example.com'),
('Bob Jones', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com'),
('Diana Prince', 'diana@example.com');

INSERT INTO courses (title, description) VALUES 
('Web Foundations', 'Introduction to HTML, CSS, and JS'),
('Database Systems', 'SQL, normalization, and relational design'),
('Python Programming', 'Core programming concepts in Python');

INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'A'),
(2, 3, 'C'),
(3, 2, 'B');

-- Queries
SELECT s.name AS student_name, c.title AS course_title, e.grade
FROM students s
JOIN enrolments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.name = 'Alice Smith';

SELECT c.title AS course_title, s.name AS student_name, e.grade
FROM courses c
JOIN enrolments e ON c.course_id = e.course_id
JOIN students s ON e.student_id = s.student_id
WHERE c.title = 'Web Foundations';

SELECT c.title AS course_title, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.title;

SELECT s.student_id, s.name, s.email
FROM students s
LEFT JOIN enrolments e ON s.student_id = e.student_id
WHERE e.enrolment_id IS NULL;

UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 1;

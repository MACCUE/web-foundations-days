# School Database Design

## 1. Table Explanations
- **`students`**: Stores personal and contact information for each student registered in the school system, featuring a unique email constraint to prevent duplicate accounts.
- **`courses`**: Holds details about the classes offered, including titles and descriptions.
- **`enrolments`**: Acts as a junction/join table connecting students to courses. It records specific registrations and stores the individual grade achieved by a student in a given course.

## 2. Relationships and Join Table Rationale
- **`students` to `enrolments`**: One-to-Many relationship (one student can have multiple enrolments across different courses).
- **`courses` to `enrolments`**: One-to-Many relationship (one course can have multiple student enrolments).
- **Many-to-Many Relationship**: Students and courses share a many-to-many relationship—any student can enroll in multiple courses, and any course can have many students. 
- **Why a Join Table is Needed**: Relational databases cannot natively represent many-to-many direct relationships in a single column without data redundancy or structural limits. The `enrolments` join table bridges this gap by breaking the many-to-many relationship into two manageable one-to-many relationships while also holding descriptive attributes specific to that interaction (such as the `grade`).

## 3. Recommended Index
- **Index:** `CREATE INDEX idx_enrolments_student ON enrolments(student_id);`
- **Reason:** Since queries frequently look up enrolments by student (e.g., finding all courses for a specific student), indexing the `student_id` foreign key drastically speeds up search performance by avoiding full table scans on the join table.

## 4. SQL vs. NoSQL Choice
For a school database system managing students, courses, and structured academic records like grades, **SQL (Relational Database)** is the ideal choice. Academic data is highly structured, relational, and requires strict consistency (ACID compliance) to ensure that grades, course IDs, and student references never become orphaned or corrupt. Relational constraints (like Foreign Keys and Unique rules) naturally prevent invalid records, making SQL far superior for maintaining data integrity in an educational environment.

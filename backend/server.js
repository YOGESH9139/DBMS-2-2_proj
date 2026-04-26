require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'StudentManagementSystem',
  waitForConnections: true,
  connectionLimit: 10,
});

// ─────────────────────────────────────────────
//  DEPARTMENTS
// ─────────────────────────────────────────────
app.get('/api/departments', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Department');
  res.json(rows);
});
app.post('/api/departments', async (req, res) => {
  const { department_name } = req.body;
  const [r] = await pool.query('INSERT INTO Department (department_name) VALUES (?)', [department_name]);
  res.json({ department_id: r.insertId, department_name });
});
app.put('/api/departments/:id', async (req, res) => {
  const { department_name } = req.body;
  await pool.query('UPDATE Department SET department_name=? WHERE department_id=?', [department_name, req.params.id]);
  res.json({ success: true });
});
app.delete('/api/departments/:id', async (req, res) => {
  await pool.query('DELETE FROM Department WHERE department_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  STUDENTS
// ─────────────────────────────────────────────
app.get('/api/students', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT s.*, d.department_name FROM Student s
     LEFT JOIN Department d ON s.department_id = d.department_id`
  );
  res.json(rows);
});
app.post('/api/students', async (req, res) => {
  const { student_name, email, phone, address, department_id } = req.body;
  const [r] = await pool.query(
    'INSERT INTO Student (student_name, email, phone, address, department_id) VALUES (?,?,?,?,?)',
    [student_name, email, phone, address, department_id]
  );
  res.json({ student_id: r.insertId });
});
app.put('/api/students/:id', async (req, res) => {
  const { student_name, email, phone, address, department_id } = req.body;
  await pool.query(
    'UPDATE Student SET student_name=?, email=?, phone=?, address=?, department_id=? WHERE student_id=?',
    [student_name, email, phone, address, department_id, req.params.id]
  );
  res.json({ success: true });
});
app.delete('/api/students/:id', async (req, res) => {
  await pool.query('DELETE FROM Student WHERE student_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  COURSES
// ─────────────────────────────────────────────
app.get('/api/courses', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, d.department_name FROM Course c
     LEFT JOIN Department d ON c.department_id = d.department_id`
  );
  res.json(rows);
});
app.post('/api/courses', async (req, res) => {
  const { course_name, credits, department_id } = req.body;
  const [r] = await pool.query(
    'INSERT INTO Course (course_name, credits, department_id) VALUES (?,?,?)',
    [course_name, credits, department_id]
  );
  res.json({ course_id: r.insertId });
});
app.put('/api/courses/:id', async (req, res) => {
  const { course_name, credits, department_id } = req.body;
  await pool.query(
    'UPDATE Course SET course_name=?, credits=?, department_id=? WHERE course_id=?',
    [course_name, credits, department_id, req.params.id]
  );
  res.json({ success: true });
});
app.delete('/api/courses/:id', async (req, res) => {
  await pool.query('DELETE FROM Course WHERE course_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  FACULTY
// ─────────────────────────────────────────────
app.get('/api/faculty', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT f.*, d.department_name FROM Faculty f
     LEFT JOIN Department d ON f.department_id = d.department_id`
  );
  res.json(rows);
});
app.post('/api/faculty', async (req, res) => {
  const { faculty_name, email, department_id } = req.body;
  const [r] = await pool.query(
    'INSERT INTO Faculty (faculty_name, email, department_id) VALUES (?,?,?)',
    [faculty_name, email, department_id]
  );
  res.json({ faculty_id: r.insertId });
});
app.put('/api/faculty/:id', async (req, res) => {
  const { faculty_name, email, department_id } = req.body;
  await pool.query(
    'UPDATE Faculty SET faculty_name=?, email=?, department_id=? WHERE faculty_id=?',
    [faculty_name, email, department_id, req.params.id]
  );
  res.json({ success: true });
});
app.delete('/api/faculty/:id', async (req, res) => {
  await pool.query('DELETE FROM Faculty WHERE faculty_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  ENROLLMENT
// ─────────────────────────────────────────────
app.get('/api/enrollments', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT e.*, s.student_name, c.course_name FROM Enrollment e
     JOIN Student s ON e.student_id = s.student_id
     JOIN Course c ON e.course_id = c.course_id`
  );
  res.json(rows);
});
app.post('/api/enrollments', async (req, res) => {
  const { student_id, course_id, semester } = req.body;
  await pool.query(
    'INSERT INTO Enrollment (student_id, course_id, semester) VALUES (?,?,?)',
    [student_id, course_id, semester]
  );
  res.json({ success: true });
});
app.put('/api/enrollments', async (req, res) => {
  const { student_id, course_id, semester, old_student_id, old_course_id } = req.body;
  await pool.query(
    'UPDATE Enrollment SET semester=? WHERE student_id=? AND course_id=?',
    [semester, old_student_id, old_course_id]
  );
  res.json({ success: true });
});
app.delete('/api/enrollments', async (req, res) => {
  const { student_id, course_id } = req.body;
  await pool.query('DELETE FROM Enrollment WHERE student_id=? AND course_id=?', [student_id, course_id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  RESULTS
// ─────────────────────────────────────────────
app.get('/api/results', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, s.student_name, c.course_name FROM Result r
     JOIN Student s ON r.student_id = s.student_id
     JOIN Course c ON r.course_id = c.course_id`
  );
  res.json(rows);
});
app.post('/api/results', async (req, res) => {
  const { student_id, course_id, marks, grade } = req.body;
  const [r] = await pool.query(
    'INSERT INTO Result (student_id, course_id, marks, grade) VALUES (?,?,?,?)',
    [student_id, course_id, marks, grade]
  );
  res.json({ result_id: r.insertId });
});
app.put('/api/results/:id', async (req, res) => {
  const { student_id, course_id, marks, grade } = req.body;
  await pool.query(
    'UPDATE Result SET student_id=?, course_id=?, marks=?, grade=? WHERE result_id=?',
    [student_id, course_id, marks, grade, req.params.id]
  );
  res.json({ success: true });
});
app.delete('/api/results/:id', async (req, res) => {
  await pool.query('DELETE FROM Result WHERE result_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  ATTENDANCE
// ─────────────────────────────────────────────
app.get('/api/attendance', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*, s.student_name, c.course_name FROM Attendance a
     JOIN Student s ON a.student_id = s.student_id
     JOIN Course c ON a.course_id = c.course_id`
  );
  res.json(rows);
});
app.post('/api/attendance', async (req, res) => {
  const { student_id, course_id, attendance_percentage } = req.body;
  const [r] = await pool.query(
    'INSERT INTO Attendance (student_id, course_id, attendance_percentage) VALUES (?,?,?)',
    [student_id, course_id, attendance_percentage]
  );
  res.json({ attendance_id: r.insertId });
});
app.put('/api/attendance/:id', async (req, res) => {
  const { student_id, course_id, attendance_percentage } = req.body;
  await pool.query(
    'UPDATE Attendance SET student_id=?, course_id=?, attendance_percentage=? WHERE attendance_id=?',
    [student_id, course_id, attendance_percentage, req.params.id]
  );
  res.json({ success: true });
});
app.delete('/api/attendance/:id', async (req, res) => {
  await pool.query('DELETE FROM Attendance WHERE attendance_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  DRIVERS
// ─────────────────────────────────────────────
app.get('/api/drivers', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Driver');
  res.json(rows);
});
app.post('/api/drivers', async (req, res) => {
  const { driver_name, phone } = req.body;
  const [r] = await pool.query('INSERT INTO Driver (driver_name, phone) VALUES (?,?)', [driver_name, phone]);
  res.json({ driver_id: r.insertId });
});
app.put('/api/drivers/:id', async (req, res) => {
  const { driver_name, phone } = req.body;
  await pool.query('UPDATE Driver SET driver_name=?, phone=? WHERE driver_id=?', [driver_name, phone, req.params.id]);
  res.json({ success: true });
});
app.delete('/api/drivers/:id', async (req, res) => {
  await pool.query('DELETE FROM Driver WHERE driver_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────
app.get('/api/routes', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Route');
  res.json(rows);
});
app.post('/api/routes', async (req, res) => {
  const { route_name } = req.body;
  const [r] = await pool.query('INSERT INTO Route (route_name) VALUES (?)', [route_name]);
  res.json({ route_id: r.insertId });
});
app.put('/api/routes/:id', async (req, res) => {
  const { route_name } = req.body;
  await pool.query('UPDATE Route SET route_name=? WHERE route_id=?', [route_name, req.params.id]);
  res.json({ success: true });
});
app.delete('/api/routes/:id', async (req, res) => {
  await pool.query('DELETE FROM Route WHERE route_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  ROUTE STOPS
// ─────────────────────────────────────────────
app.get('/api/route-stops', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT rs.*, r.route_name FROM Route_Stops rs
     JOIN Route r ON rs.route_id = r.route_id`
  );
  res.json(rows);
});
app.post('/api/route-stops', async (req, res) => {
  const { route_id, stop_name } = req.body;
  const [r] = await pool.query('INSERT INTO Route_Stops (route_id, stop_name) VALUES (?,?)', [route_id, stop_name]);
  res.json({ stop_id: r.insertId });
});
app.put('/api/route-stops/:id', async (req, res) => {
  const { route_id, stop_name } = req.body;
  await pool.query('UPDATE Route_Stops SET route_id=?, stop_name=? WHERE stop_id=?', [route_id, stop_name, req.params.id]);
  res.json({ success: true });
});
app.delete('/api/route-stops/:id', async (req, res) => {
  await pool.query('DELETE FROM Route_Stops WHERE stop_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  BUS
// ─────────────────────────────────────────────
app.get('/api/buses', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, r.route_name, d.driver_name FROM Bus b
     LEFT JOIN Route r ON b.route_id = r.route_id
     LEFT JOIN Driver d ON b.driver_id = d.driver_id`
  );
  res.json(rows);
});
app.post('/api/buses', async (req, res) => {
  const { bus_no, capacity, route_id, driver_id } = req.body;
  await pool.query('INSERT INTO Bus (bus_no, capacity, route_id, driver_id) VALUES (?,?,?,?)', [bus_no, capacity, route_id, driver_id]);
  res.json({ bus_no });
});
app.put('/api/buses/:bus_no', async (req, res) => {
  const { capacity, route_id, driver_id } = req.body;
  await pool.query('UPDATE Bus SET capacity=?, route_id=?, driver_id=? WHERE bus_no=?', [capacity, route_id, driver_id, req.params.bus_no]);
  res.json({ success: true });
});
app.delete('/api/buses/:bus_no', async (req, res) => {
  await pool.query('DELETE FROM Bus WHERE bus_no=?', [req.params.bus_no]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  TRANSPORT
// ─────────────────────────────────────────────
app.get('/api/transport', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT t.*, s.student_name FROM Transport t
     JOIN Student s ON t.student_id = s.student_id`
  );
  res.json(rows);
});
app.post('/api/transport', async (req, res) => {
  const { student_id, bus_no } = req.body;
  const [r] = await pool.query('INSERT INTO Transport (student_id, bus_no) VALUES (?,?)', [student_id, bus_no]);
  res.json({ transport_id: r.insertId });
});
app.put('/api/transport/:id', async (req, res) => {
  const { student_id, bus_no } = req.body;
  await pool.query('UPDATE Transport SET student_id=?, bus_no=? WHERE transport_id=?', [student_id, bus_no, req.params.id]);
  res.json({ success: true });
});
app.delete('/api/transport/:id', async (req, res) => {
  await pool.query('DELETE FROM Transport WHERE transport_id=?', [req.params.id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  COURSE-FACULTY
// ─────────────────────────────────────────────
app.get('/api/course-faculty', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT cf.*, c.course_name, f.faculty_name FROM Course_Faculty cf
     JOIN Course c ON cf.course_id = c.course_id
     JOIN Faculty f ON cf.faculty_id = f.faculty_id`
  );
  res.json(rows);
});
app.post('/api/course-faculty', async (req, res) => {
  const { course_id, faculty_id } = req.body;
  await pool.query('INSERT INTO Course_Faculty (course_id, faculty_id) VALUES (?,?)', [course_id, faculty_id]);
  res.json({ success: true });
});
app.delete('/api/course-faculty', async (req, res) => {
  const { course_id, faculty_id } = req.body;
  await pool.query('DELETE FROM Course_Faculty WHERE course_id=? AND faculty_id=?', [course_id, faculty_id]);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
//  STUDENT PROFILE
// ─────────────────────────────────────────────
app.get('/api/students/:id/profile', async (req, res) => {
  const id = req.params.id;
  const [[student]] = await pool.query(
    `SELECT s.*, d.department_name FROM Student s
     LEFT JOIN Department d ON s.department_id = d.department_id
     WHERE s.student_id = ?`, [id]
  );
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const [enrollments] = await pool.query(
    `SELECT e.*, c.course_name, c.credits FROM Enrollment e
     JOIN Course c ON e.course_id = c.course_id
     WHERE e.student_id = ?`, [id]
  );
  const [results] = await pool.query(
    `SELECT r.*, c.course_name FROM Result r
     JOIN Course c ON r.course_id = c.course_id
     WHERE r.student_id = ?`, [id]
  );
  const [attendance] = await pool.query(
    `SELECT a.*, c.course_name FROM Attendance a
     JOIN Course c ON a.course_id = c.course_id
     WHERE a.student_id = ?`, [id]
  );
  const [transport] = await pool.query(
    `SELECT t.*, b.capacity, r.route_name, d.driver_name
     FROM Transport t
     LEFT JOIN Bus b ON t.bus_no = b.bus_no
     LEFT JOIN Route r ON b.route_id = r.route_id
     LEFT JOIN Driver d ON b.driver_id = d.driver_id
     WHERE t.student_id = ?`, [id]
  );
  res.json({ student, enrollments, results, attendance, transport });
});

// ─────────────────────────────────────────────
//  FACULTY PROFILE
// ─────────────────────────────────────────────
app.get('/api/faculty/:id/profile', async (req, res) => {
  const id = req.params.id;
  const [[faculty]] = await pool.query(
    `SELECT f.*, d.department_name FROM Faculty f
     LEFT JOIN Department d ON f.department_id = d.department_id
     WHERE f.faculty_id = ?`, [id]
  );
  if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

  const [courses] = await pool.query(
    `SELECT c.*, d.department_name FROM Course_Faculty cf
     JOIN Course c ON cf.course_id = c.course_id
     LEFT JOIN Department d ON c.department_id = d.department_id
     WHERE cf.faculty_id = ?`, [id]
  );
  const [students] = await pool.query(
    `SELECT DISTINCT s.student_id, s.student_name, s.email, c.course_name
     FROM Course_Faculty cf
     JOIN Enrollment e ON cf.course_id = e.course_id
     JOIN Student s ON e.student_id = s.student_id
     JOIN Course c ON e.course_id = c.course_id
     WHERE cf.faculty_id = ?`, [id]
  );
  res.json({ faculty, courses, students });
});

// ─────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────
app.get('/api/dashboard', async (req, res) => {
  const [[{total_students}]]  = await pool.query('SELECT COUNT(*) AS total_students FROM Student');
  const [[{total_faculty}]]   = await pool.query('SELECT COUNT(*) AS total_faculty FROM Faculty');
  const [[{total_courses}]]   = await pool.query('SELECT COUNT(*) AS total_courses FROM Course');
  const [[{total_depts}]]     = await pool.query('SELECT COUNT(*) AS total_depts FROM Department');
  const [[{total_enrollments}]]= await pool.query('SELECT COUNT(*) AS total_enrollments FROM Enrollment');

  const [dept_students] = await pool.query(
    `SELECT d.department_name, COUNT(s.student_id) AS count
     FROM Department d LEFT JOIN Student s ON d.department_id=s.department_id
     GROUP BY d.department_id, d.department_name ORDER BY count DESC`
  );

  const [grade_dist] = await pool.query(
    `SELECT grade, COUNT(*) AS count FROM Result GROUP BY grade ORDER BY grade`
  );

  const [low_attendance] = await pool.query(
    `SELECT a.attendance_id, s.student_name, c.course_name, a.attendance_percentage
     FROM Attendance a
     JOIN Student s ON a.student_id=s.student_id
     JOIN Course c ON a.course_id=c.course_id
     WHERE a.attendance_percentage < 75
     ORDER BY a.attendance_percentage ASC`
  );

  const [top_results] = await pool.query(
    `SELECT s.student_name, c.course_name, r.marks, r.grade
     FROM Result r
     JOIN Student s ON r.student_id=s.student_id
     JOIN Course c ON r.course_id=c.course_id
     ORDER BY r.marks DESC LIMIT 5`
  );

  res.json({ total_students, total_faculty, total_courses, total_depts,
             total_enrollments, dept_students, grade_dist, low_attendance, top_results });
});

// ─────────────────────────────────────────────
//  SCHEMA VISUALIZER & MUTATOR (NODE EDITOR)
// ─────────────────────────────────────────────
app.get('/api/schema', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'StudentManagementSystem';
    const [columns] = await pool.query(`
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_KEY 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ?
    `, [dbName]);

    const [fks] = await pool.query(`
      SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [dbName]);

    const tables = {};
    columns.forEach(c => {
      if(!tables[c.TABLE_NAME]) tables[c.TABLE_NAME] = { name: c.TABLE_NAME, columns: [] };
      tables[c.TABLE_NAME].columns.push({
        name: c.COLUMN_NAME,
        type: c.DATA_TYPE,
        key: c.COLUMN_KEY
      });
    });

    res.json({ tables: Object.values(tables), foreignKeys: fks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new table visually
app.post('/api/schema/table', async (req, res) => {
  try {
    const safeName = (req.body.tableName || '').replace(/[^a-zA-Z0-9_]/g, '');
    if(!safeName) throw new Error("Invalid table name");
    
    // Create a base table with an ID and a string column
    await pool.query(`CREATE TABLE \`${safeName}\` (
      \`${safeName}_id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(255)
    )`);
    res.json({ success: true, name: safeName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Drop table visually
app.delete('/api/schema/table/:name', async (req, res) => {
  try {
    const safeName = req.params.name.replace(/[^a-zA-Z0-9_]/g, '');
    await pool.query('SET FOREIGN_KEY_CHECKS=0');
    await pool.query(`DROP TABLE IF EXISTS \`${safeName}\``);
    await pool.query('SET FOREIGN_KEY_CHECKS=1');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Draw edge (Create Foreign Key)
app.post('/api/schema/edge', async (req, res) => {
  try {
    const safeFrom = (req.body.fromTable || '').replace(/[^a-zA-Z0-9_]/g, '');
    const safeTo = (req.body.toTable || '').replace(/[^a-zA-Z0-9_]/g, '');
    
    // Find target table's primary key
    const [cols] = await pool.query(`SHOW KEYS FROM \`${safeTo}\` WHERE Key_name = 'PRIMARY'`);
    if(cols.length === 0) throw new Error("Target table has no primary key");
    const targetPk = cols[0].Column_name;
    const fkCol = `${safeTo}_id`;

    // Add foreign key column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE \`${safeFrom}\` ADD COLUMN \`${fkCol}\` INT`);
    } catch(e) { /* Ignore if column exists */ }
    
    // Add constraint
    await pool.query(`ALTER TABLE \`${safeFrom}\` ADD FOREIGN KEY (\`${fkCol}\`) REFERENCES \`${safeTo}\`(\`${targetPk}\`) ON DELETE CASCADE`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
//  SERVE FRONTEND IN PRODUCTION
// ─────────────────────────────────────────────
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all route to serve index.html for any unhandled paths (useful for SPA routing if added later)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

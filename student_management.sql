CREATE DATABASE StudentManagementSystem;
USE StudentManagementSystem;

CREATE TABLE Department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Driver (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    driver_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15)
);

CREATE TABLE Route (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    route_name VARCHAR(100) NOT NULL
);

CREATE TABLE Student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    address TEXT,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
        ON DELETE SET NULL
);

CREATE TABLE Course (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    credits INT,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
        ON DELETE SET NULL
);

CREATE TABLE Faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
        ON DELETE SET NULL
);

CREATE TABLE Enrollment (
    student_id INT,
    course_id INT,
    semester VARCHAR(20),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
        ON DELETE CASCADE
);

CREATE TABLE Course_Faculty (
    course_id INT,
    faculty_id INT,
    PRIMARY KEY (course_id, faculty_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
        ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
        ON DELETE CASCADE
);

CREATE TABLE Result (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    marks INT,
    grade VARCHAR(5),
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
        ON DELETE CASCADE
);

CREATE TABLE Attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    attendance_percentage DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
        ON DELETE CASCADE
);

CREATE TABLE Route_Stops (
    stop_id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT,
    stop_name VARCHAR(100),
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
        ON DELETE CASCADE
);

CREATE TABLE Bus (
    bus_no INT PRIMARY KEY,
    capacity INT,
    route_id INT,
    driver_id INT,
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
        ON DELETE SET NULL,
    FOREIGN KEY (driver_id) REFERENCES Driver(driver_id)
        ON DELETE SET NULL
);

CREATE TABLE Transport (
    transport_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    bus_no INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
        ON DELETE CASCADE,
    FOREIGN KEY (bus_no) REFERENCES Bus(bus_no)
        ON DELETE SET NULL
);

SHOW TABLES;

INSERT INTO Department (department_name) VALUES
('CSE'),
('ECE'),
('MECH'),
('CIVIL');

INSERT INTO Student (student_id, student_name, email, phone, address, department_id) VALUES
(3, 'Yogesh', 'yogesh@gmail.com', '9000000001', 'Hyderabad', 1),
(20, 'Pooja', 'pooja@gmail.com', '9000000002', 'Hyderabad', 1),
(33, 'Bharat', 'bharat@gmail.com', '9000000003', 'Hyderabad', 2),
(38, 'Tanushree', 'tanushree@gmail.com', '9000000004', 'Hyderabad', 1),

(1, 'Arjun', 'arjun@gmail.com', '9000000005', 'Hyderabad', 1),
(2, 'Meera', 'meera@gmail.com', '9000000006', 'Hyderabad', 1),
(4, 'Kiran', 'kiran@gmail.com', '9000000007', 'Hyderabad', 2),
(5, 'Ananya', 'ananya@gmail.com', '9000000008', 'Hyderabad', 1),
(6, 'Rahul', 'rahul@gmail.com', '9000000009', 'Hyderabad', 3),
(7, 'Poja', 'poja@gmail.com', '9000000010', 'Hyderabad', 1),

(8, 'Vikram', 'vikram@gmail.com', '9000000011', 'Hyderabad', 2),
(9, 'Neha', 'neha@gmail.com', '9000000012', 'Hyderabad', 1),
(10, 'Aditya', 'aditya@gmail.com', '9000000013', 'Hyderabad', 3),
(11, 'Kavya', 'kavya@gmail.com', '9000000014', 'Hyderabad', 1),
(12, 'Manoj', 'manoj@gmail.com', '9000000015', 'Hyderabad', 4),

(13, 'Sanjay', 'sanjay@gmail.com', '9000000016', 'Hyderabad', 1),
(14, 'Divya', 'divya@gmail.com', '9000000017', 'Hyderabad', 2),
(15, 'Harsha', 'harsha@gmail.com', '9000000018', 'Hyderabad', 1),
(16, 'Nikhil', 'nikhil@gmail.com', '9000000019', 'Hyderabad', 3),
(17, 'Tejas', 'tejas@gmail.com', '9000000020', 'Hyderabad', 1);

INSERT INTO Course (course_name, credits, department_id) VALUES
('DBMS', 4, 1),
('Data Structures', 4, 1),
('Algorithms', 4, 1),
('Digital Electronics', 3, 2),
('Thermodynamics', 3, 3);

INSERT INTO Enrollment (student_id, course_id, semester) VALUES
(3, 1, 'Sem1'),
(20, 2, 'Sem1'),
(33, 4, 'Sem1'),
(38, 1, 'Sem1'),
(1, 2, 'Sem1'),
(2, 3, 'Sem1'),
(4, 4, 'Sem1'),
(5, 1, 'Sem1'),
(6, 5, 'Sem1'),
(7, 1, 'Sem1');

INSERT INTO Result (student_id, course_id, marks, grade) VALUES
(3, 1, 85, 'A'),
(20, 2, 78, 'B'),
(33, 4, 88, 'A'),
(38, 1, 92, 'A+'),
(1, 2, 70, 'B'),
(2, 3, 95, 'A+'),
(4, 4, 60, 'C'),
(5, 1, 82, 'A');

INSERT INTO Faculty (faculty_name, email, department_id) VALUES
('Dr. Sharma', 'sharma@college.com', 1),
('Dr. Rao', 'rao@college.com', 2),
('Dr. Mehta', 'mehta@college.com', 1),
('Dr. Iyer', 'iyer@college.com', 3);

INSERT INTO Course_Faculty (course_id, faculty_id) VALUES
(1, 1),
(2, 3),
(3, 1),
(4, 2),
(5, 4);

INSERT INTO Attendance (student_id, course_id, attendance_percentage) VALUES
(3, 1, 85.5),
(20, 2, 78.0),
(33, 4, 90.0),
(38, 1, 88.5),
(1, 2, 70.0),
(2, 3, 95.0);

INSERT INTO Driver (driver_name, phone) VALUES
('Ramesh', '9000011111'),
('Suresh', '9000022222');

INSERT INTO Route (route_name) VALUES
('Route A'),
('Route B');

INSERT INTO Route_Stops (route_id, stop_name) VALUES
(1, 'Stop 1'),
(1, 'Stop 2'),
(2, 'Stop 3'),
(2, 'Stop 4');

INSERT INTO Bus (bus_no, capacity, route_id, driver_id) VALUES
(101, 40, 1, 1),
(102, 35, 2, 2);

INSERT INTO Transport (student_id, bus_no) VALUES
(3, 101),
(20, 101),
(33, 102),
(38, 101),
(1, 102);
INSERT INTO Enrollment (student_id, course_id, semester) VALUES
(3, 2, 'Sem1'),
(20, 3, 'Sem1'),
(33, 2, 'Sem1'),
(38, 2, 'Sem1'),
(2, 4, 'Sem1'),
(4, 3, 'Sem1');

INSERT IGNORE INTO Enrollment (student_id, course_id, semester) VALUES
(1, 3, 'Sem2'),
(2, 2, 'Sem2'),
(3, 4, 'Sem2'),
(4, 1, 'Sem2'),
(5, 2, 'Sem2'),
(6, 3, 'Sem2'),
(7, 1, 'Sem2');

UPDATE Route_Stops 
SET stop_name = 'JNTU' 
WHERE route_id = 1 AND stop_name = 'Stop 1';

UPDATE Route_Stops 
SET stop_name = 'Kukatpally' 
WHERE route_id = 1 AND stop_name = 'Stop 2';

UPDATE Route_Stops 
SET stop_name = 'Ameerpet' 
WHERE route_id = 2 AND stop_name = 'Stop 3';

UPDATE Route_Stops 
SET stop_name = 'Miyapur' 
WHERE route_id = 2 AND stop_name = 'Stop 4';

SELECT * FROM Department;
SELECT * FROM Student;
SELECT * FROM Course;
SELECT * FROM Faculty;
SELECT * FROM Enrollment;
SELECT * FROM Course_Faculty;
SELECT * FROM Result;
SELECT * FROM Attendance;
SELECT * FROM Driver;
SELECT * FROM Route;
SELECT * FROM Route_Stops;
SELECT * FROM Bus;
SELECT * FROM Transport;
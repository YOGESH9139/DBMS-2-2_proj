# 🎓 Student Management System (DBMS Project)

A comprehensive, full-stack college administration portal built with Node.js, Express, and MySQL. Featuring a data-driven dashboard, automated CRUD management for 13+ entities, and an interactive ER Diagram node editor.

## 🚀 Key Features
- **📊 Interactive Dashboard**: Real-time analytics, grade distributions, and attendance tracking.
- **🛠️ Automated CRUD**: A single configuration engine that generates UI forms and API logic for all database tables.
- **📐 ER Diagram Editor**: A physics-based visualizer for the database schema with "Workbench-style" layout and live DDL mutation.
- **💻 SQL Terminal**: Integrated console to execute raw SQL queries directly from the dashboard.
- **🌓 Dynamic Theming**: Sleek Dark and Light modes for the entire portal.
- **🔄 One-Click Deployment**: Optimized for Railway/Render with a single-server architecture.

## 🏗️ Technology Stack
- **Backend**: Node.js, Express.js, MySQL (mysql2)
- **Frontend**: Vanilla JavaScript (ES6+), CSS3 (Modern Flex/Grid), HTML5
- **Visuals**: Vis.js (Network Graphing), Chart.js (Analytics)

## 📦 Quick Start
1. **Clone & Install**:
   ```bash
   git clone <repo-url>
   cd backend && npm install
   ```
2. **Database Setup**:
   Import `student_management.sql` into your MySQL instance.
3. **Environment**:
   Create a `.env` file in the `backend/` folder with your credentials (`DB_HOST`, `DB_USER`, etc.).
4. **Run**:
   ```bash
   npm start
   ```

## 🌐 Deployment
This project is pre-configured for **Railway.app**. Simply connect your GitHub repository and Railway will automatically detect the root `package.json` to build and serve the full-stack application.

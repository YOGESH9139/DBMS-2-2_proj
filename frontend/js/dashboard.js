// ── Dashboard renderer ──────────────────────────────────────────────────────
async function loadDashboard(){
  const el=document.getElementById('sec-dashboard');
  el.innerHTML='<p class="no-data">Loading dashboard...</p>';
  try{
    const d=await api('/dashboard');
    const maxDept=Math.max(...d.dept_students.map(r=>r.count),1);
    const bars=d.dept_students.map(r=>`
      <div class="bar-row"><div class="bar-label">${r.department_name}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round(r.count/maxDept*100)}%"></div></div>
      <div class="bar-count">${r.count}</div></div>`).join('');
    const pills=d.grade_dist.map(g=>`<div class="grade-pill">${g.grade}<span>×${g.count}</span></div>`).join('');
    const lowRows=d.low_attendance.length
      ? d.low_attendance.map(r=>`<tr><td><a class="name-link" href="student-profile.html?id=${r.attendance_id}">${r.student_name}</a></td><td>${r.course_name}</td><td class="att-pct">${r.attendance_percentage}%</td></tr>`).join('')
      : '<tr><td colspan="3" class="no-data">All students above 75%!</td></tr>';
    const topRows=d.top_results.map(r=>`<tr><td>${r.student_name}</td><td>${r.course_name}</td><td><b>${r.marks}</b></td><td>${r.grade}</td></tr>`).join('');
    el.innerHTML=`
      <div class="dash-title">📊 Dashboard — Overview</div>
      <div class="stat-cards">
        <div class="stat-card"><div class="stat-num">${d.total_students}</div><div class="stat-label">Students</div></div>
        <div class="stat-card"><div class="stat-num">${d.total_faculty}</div><div class="stat-label">Faculty</div></div>
        <div class="stat-card"><div class="stat-num">${d.total_courses}</div><div class="stat-label">Courses</div></div>
        <div class="stat-card"><div class="stat-num">${d.total_depts}</div><div class="stat-label">Departments</div></div>
        <div class="stat-card"><div class="stat-num">${d.total_enrollments}</div><div class="stat-label">Enrollments</div></div>
      </div>
      <div class="dash-row">
        <div class="dash-panel"><h3>Students per Department</h3>${bars}</div>
        <div class="dash-panel"><h3>Grade Distribution</h3><div class="grade-list">${pills||'<span class="no-data">No results yet.</span>'}</div></div>
      </div>
      <div class="dash-row">
        <div class="dash-panel"><h3>⚠️ Low Attendance (&lt; 75%)</h3>
          <table class="low-att-table"><thead><tr><th>Student</th><th>Course</th><th>Attendance</th></tr></thead><tbody>${lowRows}</tbody></table></div>
        <div class="dash-panel"><h3>🏆 Top 5 Results</h3>
          <table class="top-table"><thead><tr><th>Student</th><th>Course</th><th>Marks</th><th>Grade</th></tr></thead><tbody>${topRows}</tbody></table></div>
      </div>`;
  }catch(e){
    el.innerHTML=`<p class="no-data" style="color:red">Could not load dashboard: ${e.message}</p>`;
  }
}

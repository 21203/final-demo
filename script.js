// ======================
// MOCK DATA FOR DEMO ACCOUNTS
// ======================
const DEMO_USERS = {
  teacher: { email: "teacher@gmail.com", password: "teacher123", name: "Demo Teacher", role: "teacher" },
  student: { email: "student@gmail.com", password: "student123", name: "Demo Student", role: "student", grade: 5 },
  parent:  { email: "parent@gmail.com",  password: "parent123",  name: "Demo Parent",  role: "parent" }
};

// ======================
// PAGE NAVIGATION
// ======================
function showPage(pageId) {
  const pages = ['homePage', 'loginPage', 'registerPage', 'teacherDashboard', 'studentDashboard', 'parentDashboard'];
  pages.forEach(id => document.getElementById(id)?.classList.add('hidden'));

  if (pageId === 'home') {
    document.getElementById('homePage').classList.remove('hidden');
  } else if (pageId === 'login') {
    document.getElementById('loginPage').classList.remove('hidden');
  } else if (pageId === 'register') {
    document.getElementById('registerPage').classList.remove('hidden');
    resetRegistrationForms();
  } else if (pageId === 'teacher') {
    renderTeacherDashboard();
    document.getElementById('teacherDashboard').classList.remove('hidden');
  } else if (pageId === 'student') {
    renderStudentDashboard();
    document.getElementById('studentDashboard').classList.remove('hidden');
  } else if (pageId === 'parent') {
    renderParentDashboard();
    document.getElementById('parentDashboard').classList.remove('hidden');
  }

  updateNav();
}

function updateNav() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const logoutBtn = document.getElementById('logoutBtn');
  if (currentUser) {
    logoutBtn.style.display = 'inline-block';
  } else {
    logoutBtn.style.display = 'none';
  }
}

function resetRegistrationForms() {
  document.getElementById('teacherRegistration').style.display = 'none';
  document.getElementById('studentRegistration').style.display = 'none';
  document.getElementById('parentRegistration').style.display = 'none';
}

function showTeacherRegistration() { resetRegistrationForms(); document.getElementById('teacherRegistration').style.display = 'block'; }
function showStudentRegistration() { resetRegistrationForms(); document.getElementById('studentRegistration').style.display = 'block'; }
function showParentRegistration() { resetRegistrationForms(); document.getElementById('parentRegistration').style.display = 'block'; }

// ======================
// USER MANAGEMENT
// ======================
function registerUser(role, data) {
  const newUser = { ...data, role, id: Date.now().toString() };
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  alert(`✅ ${role} account created for ${newUser.name}!\nYou are now logged in.`);
  showPage(role);
}

function registerTeacher() {
  const name = document.getElementById('tName').value.trim();
  const email = document.getElementById('tEmail').value.trim();
  const pass = document.getElementById('tPass').value;
  const pass2 = document.getElementById('tPass2').value;
  if (!name || !email || !pass || pass !== pass2) { alert("Please fill all fields correctly."); return; }
  registerUser('teacher', { name, email, password: pass, school: document.getElementById('tSchool').value, phone: document.getElementById('tPhone').value });
}

function registerStudent() {
  const name = document.getElementById('sName').value.trim();
  const email = document.getElementById('sEmail').value.trim();
  const pass = document.getElementById('sPass').value;
  const pass2 = document.getElementById('sPass2').value;
  if (!name || !email || !pass || pass !== pass2) { alert("Please fill all fields correctly."); return; }
  registerUser('student', { name, email, password: pass, grade: document.getElementById('sGrade').value, parent: document.getElementById('sParent').value, parentPhone: document.getElementById('sParentPhone').value });
}

function registerParent() {
  const name = document.getElementById('pName').value.trim();
  const email = document.getElementById('pEmail').value.trim();
  const pass = document.getElementById('pPass').value;
  const pass2 = document.getElementById('pPass2').value;
  if (!name || !email || !pass || pass !== pass2) { alert("Please fill all fields correctly."); return; }
  registerUser('parent', { name, email, password: pass, child: document.getElementById('pChild').value, grade: document.getElementById('pGrade').value, school: document.getElementById('pSchool').value });
}

function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(u => (u.email === email || u.name === email) && u.password === password);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert(`✅ Welcome back, ${user.name}!`);
    showPage(user.role);
  } else {
    let demoUser = null;
    if (email === "teacher@gmail.com" && password === "teacher123") demoUser = DEMO_USERS.teacher;
    else if (email === "student@gmail.com" && password === "student123") demoUser = DEMO_USERS.student;
    else if (email === "parent@gmail.com" && password === "parent123") demoUser = DEMO_USERS.parent;

    if (demoUser) {
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      alert(`✅ Demo login successful!`);
      showPage(demoUser.role);
    } else {
      alert("❌ Invalid credentials.\nTry:\n• teacher@gmail.com / teacher123\n• student@gmail.com / student123\n• parent@gmail.com / parent123");
    }
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  showPage('home');
  updateNav();
}

// ======================
// DASHBOARD RENDERING
// ======================
function renderTeacherDashboard() {
  document.getElementById('teacherDashboard').innerHTML = `
  <div class="dashboard-section">
    <div class="dashboard-header">
      <h1>Teacher Dashboard</h1>
      <span class="user-role">Teacher</span>
    </div>
    <div class="tabs">
      <div class="tab active" onclick="switchTab('lesson-plans', 'teacher')">Lesson Plans</div>
      <div class="tab" onclick="switchTab('assignments', 'teacher')">Assignments</div>
      <div class="tab" onclick="switchTab('reports', 'teacher')">Progress Reports</div>
      <div class="tab" onclick="switchTab('ai-assistant', 'teacher')">AI Resource Assistant</div>
    </div>
    <div class="tab-content active" id="lesson-plans">
      <h2>Your Lesson Plans</h2>
      <div class="card-grid">
        <div class="card"><h3 class="card-title">Grade 5 Mathematics - Fractions</h3><p>Created: Jan 10, 2026</p></div>
      </div>
    </div>
    <div class="tab-content" id="assignments">...</div>
    <div class="tab-content" id="reports">...</div>
    <div class="tab-content" id="ai-assistant">${renderAIAssistant()}</div>
  </div>`;
  attachEventListeners();
}

function renderStudentDashboard() {
  document.getElementById('studentDashboard').innerHTML = `
  <div class="dashboard-section">
    <div class="dashboard-header">
      <h1>Student Dashboard</h1>
      <span class="user-role">Student</span>
    </div>
    <div class="tabs">
      <div class="tab active" onclick="switchTab('subjects', 'student')">Subjects</div>
      <div class="tab" onclick="switchTab('progress', 'student')">Progress</div>
      <div class="tab" onclick="switchTab('ai-tutor', 'student')">AI Tutor</div>
    </div>
    <div class="tab-content active" id="subjects">
      <div class="card-grid">
        <div class="card">
          <h3 class="card-title">Mathematics</h3>
          <div class="progress-label"><span>Progress</span><span>75%</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width:75%"></div></div>
        </div>
      </div>
    </div>
    <div class="tab-content" id="progress">...</div>
    <div class="tab-content" id="ai-tutor">${renderAITutor()}</div>
  </div>`;
}

function renderParentDashboard() {
  document.getElementById('parentDashboard').innerHTML = `
  <div class="dashboard-section">
    <div class="dashboard-header">
      <h1>Parent Dashboard</h1>
      <span class="user-role">Parent</span>
    </div>
    <div class="tabs">
      <div class="tab active" onclick="switchTab('child-progress', 'parent')">Child Progress</div>
      <div class="tab" onclick="switchTab('payments', 'parent')">Payments</div>
    </div>
    <div class="tab-content active" id="child-progress">
      <h2>James Kamau - Grade 5</h2>
      <div class="progress-label"><span>Overall Progress</span><span>78%</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:78%"></div></div>
    </div>
    <div class="tab-content" id="payments">...</div>
  </div>`;
}

// ======================
// CBC SUBJECT CONFIGURATION
// ======================
const CBC_SUBJECTS = {
  // Lower Primary (Grades 1-3)
  lowerPrimary: [
    "Literacy & Languages",
    "Kiswahili",
    "English",
    "Mathematics",
    "Environmental Activities",
    "Hygiene & Nutrition",
    "Creative Arts",
    "Physical Education",
    "Religious Education"
  ],
  
  // Upper Primary (Grades 4-6)
  upperPrimary: [
    "Literacy & Languages",
    "Kiswahili",
    "English",
    "Mathematics",
    "Science & Technology",
    "Social Studies",
    "Creative Arts",
    "Physical Education",
    "Religious Education",
    "Agriculture",
    "Home Science"
  ],
  
  // Junior Secondary (Grades 7-9)
  juniorSecondary: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "History & Government",
    "Geography",
    "Business Studies",
    "Agriculture",
    "Computer Studies",
    "Home Science",
    "Art & Design",
    "Music",
    "Physical Education",
    "Religious Education"
  ],
  
  // Senior School (Grade 10+)
  seniorSchool: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Pure Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "History & Government",
    "Geography",
    "Economics",
    "Business Studies",
    "Agriculture",
    "Computer Studies",
    "Home Science",
    "Art & Design",
    "Music",
    "French",
    "German",
    "Arabic",
    "Physical Education"
  ]
};

// Update subjects based on selected grade
function updateSubjects() {
  const gradeSelect = document.getElementById('aiGrade');
  const subjectSelect = document.getElementById('aiSubject');
  const grade = parseInt(gradeSelect.value);
  
  // Clear current options
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  
  if (!grade) return;
  
  let subjects = [];
  if (grade >= 1 && grade <= 3) {
    subjects = CBC_SUBJECTS.lowerPrimary;
  } else if (grade >= 4 && grade <= 6) {
    subjects = CBC_SUBJECTS.upperPrimary;
  } else if (grade >= 7 && grade <= 9) {
    subjects = CBC_SUBJECTS.juniorSecondary;
  } else if (grade >= 10) {
    subjects = CBC_SUBJECTS.seniorSchool;
  }
  
  // Add subjects to dropdown
  subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });
}

// AI UI with grouped grades and dynamic subjects
function renderAIAssistant() {
  return `
  <h2>AI Resource Assistant</h2>
  <select id="aiGrade" onchange="updateSubjects()">
    <option value="">Select Grade Level</option>
    
    <!-- Lower Primary (Grades 1-3) -->
    <optgroup label="Lower Primary (Grades 1-3)">
      <option value="1">Grade 1</option>
      <option value="2">Grade 2</option>
      <option value="3">Grade 3</option>
    </optgroup>
    
    <!-- Upper Primary (Grades 4-6) -->
    <optgroup label="Upper Primary (Grades 4-6)">
      <option value="4">Grade 4</option>
      <option value="5">Grade 5</option>
      <option value="6">Grade 6</option>
    </optgroup>
    
    <!-- Junior Secondary (Grades 7-9) -->
    <optgroup label="Junior Secondary (Grades 7-9)">
      <option value="7">Grade 7</option>
      <option value="8">Grade 8</option>
      <option value="9">Grade 9</option>
    </optgroup>
    
    <!-- Senior School (Grade 10) -->
    <optgroup label="Senior School (Grade 10+)">
      <option value="10">Grade 10</option>
    </optgroup>
  </select>
  
  <select id="aiSubject">
    <option value="">Select Subject</option>
    <!-- Subjects will be populated dynamically based on grade level -->
  </select>
  
  <textarea id="aiQuery" placeholder="Describe what you need..."></textarea>
  <button onclick="searchAIResources()">Find Resources</button>
  <div id="aiLoading" style="display:none;"><p>🤖 Thinking...</p></div>
  <div id="aiResults" style="display:none;"><pre id="aiResponse"></pre></div>
  `;
}

function renderAITutor() {
  return `<h2>Ask your question:</h2><textarea id="aiQuestion" placeholder="E.g., How do I add fractions?"></textarea><button onclick="askAITutor()">Ask</button>`;
}

function switchTab(tabId, role) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
}

// ======================
// REAL GEMINI AI INTEGRATION (SECURE)
// ======================
async function searchAIResources() {
  const grade = document.getElementById('aiGrade').value;
  const subject = document.getElementById('aiSubject').value;
  const query = document.getElementById('aiQuery').value.trim();

  if (!grade || !subject || !query) {
    alert("Please fill all fields.");
    return;
  }

  document.getElementById('aiLoading').style.display = 'block';
  document.getElementById('aiResults').style.display = 'none';

  try {
    // ✅ Calls your local backend (not Google directly)
    const response = await fetch('/api/ai-resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, subject, query })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('aiResponse').textContent = data.content;
      document.getElementById('aiResults').style.display = 'block';
    } else {
      alert('❌ AI Error: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    alert('❌ Failed to connect to AI service. Is the server running?');
  } finally {
    document.getElementById('aiLoading').style.display = 'none';
  }
}

function askAITutor() {
  alert("In a real system, this would connect to an AI tutor. This is a demo.");
}

function showForgotPassword() {
  alert("Check your email for reset instructions.");
}

function attachEventListeners() {}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) showPage(currentUser.role);
  else showPage('home');
  updateNav();
});
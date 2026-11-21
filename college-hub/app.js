// ── AUTH CHECK ───────────────────────────────────────────────────
const SESSION_USER = localStorage.getItem('hub:session');
if (!SESSION_USER) {
  window.location.href = 'auth.html';
}

// ── STORAGE HELPERS ─────────────────────────────────────────────
// Per-user prefix so each student account has isolated, persistent data
const PREFIX = SESSION_USER + ':';
const save = (key, data) => localStorage.setItem(PREFIX + key, JSON.stringify(data));
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

// ── DEFAULT STATE & SEED DATA ────────────────────────────────────
const DEFAULT_STATE = {
  classes: [],
  assignments: [],
  subjects: [],
  notes: [],
  studyMaterials: [],
  exams: [],
  examChecklist: [],
  announcements: [],
  events: [],
  clubs: [],
  marks: [],
  tasks: [],
  habits: [],
  habitLog: {},
  sleepLog: [],
  pomodoro: { sessions: 0, date: '' },
  mood: { emoji: '', label: '', date: '' },
  darkMode: false
};

let state = {};

// Known IDs of demo/seed data to purge from personal student records
const FAKE_DEMO_IDS = new Set([
  'c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12','c13','c14','c15','c16',
  'c17','c18','c19','c20','c21','c22','c23','c24','c25','c26','c27','c28','c29','c30',
  'c31','c32','c33','c34','c35','c36','c37','c38','c39','c40','c41','c42','c43','c44',
  'a1','a2','a3','a4','a5','a6',
  's1','s2','s3','s4','s5','s6',
  'e1','e2','e3','e4',
  'ec1','ec2','ec3','ec4','ec5','ec6',
  'mk1','mk2','mk3','mk4','mk5',
  't1','t2','t3','t4',
  'cl1','cl2','cl3','cl4',
  'ev1','ev2','ev3'
]);

function cleanupDemoData() {
  const isDemo = item => item && FAKE_DEMO_IDS.has(item.id);

  if (Array.isArray(state.classes) && state.classes.some(isDemo)) {
    state.classes = state.classes.filter(c => !isDemo(c));
    saveKey('classes');
  }
  if (Array.isArray(state.assignments) && state.assignments.some(isDemo)) {
    state.assignments = state.assignments.filter(a => !isDemo(a));
    saveKey('assignments');
  }
  if (Array.isArray(state.subjects) && state.subjects.some(isDemo)) {
    state.subjects = state.subjects.filter(s => !isDemo(s));
    saveKey('subjects');
  }
  if (Array.isArray(state.exams) && state.exams.some(isDemo)) {
    state.exams = state.exams.filter(e => !isDemo(e));
    saveKey('exams');
  }
  if (Array.isArray(state.examChecklist) && state.examChecklist.some(isDemo)) {
    state.examChecklist = state.examChecklist.filter(ec => !isDemo(ec));
    saveKey('examChecklist');
  }
  if (Array.isArray(state.marks) && state.marks.some(isDemo)) {
    state.marks = state.marks.filter(m => !isDemo(m));
    saveKey('marks');
  }
  if (Array.isArray(state.tasks) && state.tasks.some(isDemo)) {
    state.tasks = state.tasks.filter(t => !isDemo(t));
    saveKey('tasks');
  }
  if (Array.isArray(state.clubs) && state.clubs.some(isDemo)) {
    state.clubs = state.clubs.filter(cl => !isDemo(cl));
    saveKey('clubs');
  }
  if (Array.isArray(state.events) && state.events.some(isDemo)) {
    state.events = state.events.filter(ev => !isDemo(ev));
    saveKey('events');
  }
}

// Genuine shared school curriculum resources and notices
function initSharedSchoolData() {
  if (!state.studyMaterials || state.studyMaterials.length === 0) {
    state.studyMaterials = [
      { id: 'm1', title: 'Quadratic Equations Complete Formula & Derivation Sheet', subject: 'Mathematics', grade: 'Class 10', type: 'Formula Sheet', chapter: 'Chapter 4', link: 'https://ncert.nic.in/', desc: 'Standard quadratic formula, discriminant nature of roots, and step-by-step factorization examples.', date: '2026-11-15' },
      { id: 'm2', title: 'Human Eye & The Colourful World - Mind Map & Diagrams', subject: 'Science', grade: 'Class 10', type: 'Chapter Notes', chapter: 'Chapter 11', link: 'https://ncert.nic.in/', desc: 'Covers defects of vision (myopia, hypermetropia, presbyopia), atmospheric refraction, and rainbow formation.', date: '2026-11-14' },
      { id: 'm3', title: 'CBSE Class 10 Board Previous Year Solved Paper 2025', subject: 'Mathematics', grade: 'Class 10', type: 'Previous Year Paper', chapter: 'Complete Syllabus', link: 'https://cbse.gov.in/', desc: 'Standard 80-mark solved board paper with step marking scheme and examiner tips.', date: '2026-11-12' },
      { id: 'm4', title: 'Electricity & Magnetism: Top 50 Numerical Problems', subject: 'Physics', grade: 'Class 10', type: 'Important Questions', chapter: 'Chapter 12 & 13', link: 'https://ncert.nic.in/', desc: 'High-frequency board exam numericals on Ohm law, series-parallel resistance combinations, and magnetic field lines.', date: '2026-11-10' },
      { id: 'm5', title: 'The Rise of Nationalism in Europe - Timeline & Flashcards', subject: 'Social Science', grade: 'Class 10', type: 'Chapter Notes', chapter: 'History Ch 1', link: 'https://ncert.nic.in/', desc: 'Key historical events from 1789 French Revolution, Treaty of Vienna 1815, to German and Italian Unification.', date: '2026-11-08' },
      { id: 'm6', title: 'Formal Letter Writing & Analytical Paragraph Templates', subject: 'English', grade: 'Class 10', type: 'Question Bank', chapter: 'Writing Skills', link: 'https://cbse.gov.in/', desc: 'Standard formats for letter to the editor, placing order, complaint letter, and graph data interpretation.', date: '2026-11-05' }
    ];
    saveKey('studyMaterials');
  }

  if (!state.announcements || state.announcements.length === 0) {
    state.announcements = [
      { id: 'an1', title: 'Annual Inter-School Science & Innovation Fair 2026', category: 'Competition', date: '2026-11-20', content: 'Registrations are open for students from Classes 6–12 to showcase working STEM models, robotics exhibits, and green energy innovations. Submit abstract to your Science teacher before next Friday.', pinned: true },
      { id: 'an2', title: 'Half-Yearly Examination Timetable & Admit Card Guidelines', category: 'Exam', date: '2026-11-18', content: 'Official examination datesheet for Classes 9–12 is now finalized. Hall tickets will be issued next Monday. Students must carry valid school ID card and strictly adhere to uniform dress code.', pinned: true },
      { id: 'an3', title: 'Winter Vacation Circular & Holiday Assignment Worksheets', category: 'Holiday', date: '2026-11-16', content: 'The school will observe winter recess from December 24 to January 2. Academic worksheets and revision question banks have been uploaded to the Study Materials portal.', pinned: false },
      { id: 'an4', title: 'Selection Trials for Zonal Football & Basketball Tournaments', category: 'General', date: '2026-11-14', content: 'Open trials for the Senior and Junior school football teams will be held on the school playground this Wednesday at 3:30 PM. Interested students must bring sports kit.', pinned: false }
    ];
    saveKey('announcements');
  }
}

function loadAll() {
  state = {};
  for (const key of Object.keys(DEFAULT_STATE)) {
    state[key] = load(key, JSON.parse(JSON.stringify(DEFAULT_STATE[key])));
  }
  cleanupDemoData();
  initSharedSchoolData();
}

function saveKey(key) {
  save(key, state[key]);
}

// ── NAVIGATION ───────────────────────────────────────────────────
const PAGE_IDS = ['dashboard', 'academics', 'resources', 'timetable', 'assignments', 'exams', 'announcements', 'events'];

function showPage(id) {
  PAGE_IDS.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) { el.classList.toggle('active', p === id); }
  });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    const text = btn.textContent.toLowerCase();
    const isActive = (id === 'dashboard' && text.includes('dashboard')) ||
                     (id === 'academics' && text.includes('academics')) ||
                     (id === 'resources' && text.includes('study materials')) ||
                     (id === 'timetable' && text.includes('timetable')) ||
                     (id === 'assignments' && text.includes('assignments')) ||
                     (id === 'exams' && text.includes('examinations')) ||
                     (id === 'announcements' && text.includes('announcements')) ||
                     (id === 'events' && text.includes('events'));
    btn.classList.toggle('active', isActive);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderAll();
}

// ── MODALS ───────────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ── DARK MODE ────────────────────────────────────────────────────
function toggleDark() {
  state.darkMode = !state.darkMode;
  saveKey('darkMode');
  applyDark();
}

function applyDark() {
  document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : '');
  const btn = document.querySelector('.dark-toggle');
  if (btn) btn.textContent = state.darkMode ? '☀️' : '🌙';
}

// ── PROFILE HELPER ───────────────────────────────────────────────
function getActiveProfile() {
  const sessionUser = localStorage.getItem('hub:session');
  if (!sessionUser) return {};

  try {
    const userScoped = localStorage.getItem(sessionUser + ':profile');
    if (userScoped) {
      const p = JSON.parse(userScoped);
      if (p && typeof p === 'object') return p;
    }
  } catch (e) {}

  try {
    const raw = localStorage.getItem('hub:profile');
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p === 'object') {
        if (!p.uid || p.uid === sessionUser) {
          return p;
        }
      }
    }
  } catch (e) {}

  return {};
}

// ── GREETING & PROFILE BANNER ────────────────────────────────────
function renderGreeting() {
  const hours = new Date().getHours();
  const greet = hours < 12 ? 'Good morning' : hours < 17 ? 'Good afternoon' : 'Good evening';
  const profile = getActiveProfile();
  const name = profile.name && profile.name.trim() ? profile.name.trim().split(' ')[0] : '';
  
  const el = document.getElementById('greet-text');
  if (el) {
    el.textContent = name ? `${greet}, ${name}! 👋` : `${greet}! 👋`;
  }

  const dateEl = document.getElementById('greet-date');
  if (dateEl) {
    const now = new Date();
    const day = now.toLocaleDateString('en-IN', { weekday: 'long' });
    const date = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    dateEl.textContent = `${day}, ${date}`;
  }

  // Dashboard profile stats: only show actual student info or 'Not set'
  const dashClass = document.getElementById('dash-class');
  if (dashClass) {
    dashClass.textContent = profile.course ? profile.course : 'Not set';
  }
  
  const dashRoll = document.getElementById('dash-roll');
  if (dashRoll) {
    dashRoll.textContent = profile.rollNo ? '#' + profile.rollNo : 'Not set';
  }

  const navName = document.getElementById('nav-profile-name');
  if (navName) {
    navName.textContent = name || 'My Profile';
  }

  const navAvatar = document.getElementById('nav-avatar');
  if (navAvatar) {
    navAvatar.textContent = profile.avatar || '🧑‍🎓';
  }
}

// ── MOOD ─────────────────────────────────────────────────────────
function setMood(emoji, label) {
  state.mood = { emoji, label, date: today() };
  saveKey('mood');
  renderMood();
}

function renderMood() {
  document.querySelectorAll('#mood-row button').forEach(btn => {
    const isSelected = state.mood && state.mood.date === today() && btn.textContent.includes(state.mood.emoji);
    btn.classList.toggle('active', isSelected);
  });
}

// ── DASHBOARD METRICS ────────────────────────────────────────────
function renderDashboardMetrics() {
  // Pending assignments count
  const pendingCount = (state.assignments || []).filter(a => !a.done).length;
  const pEl = document.getElementById('dash-stat-pending');
  if (pEl) pEl.textContent = pendingCount;

  // Attendance rate: if no classes/subjects recorded, show '—'
  let totalPres = 0, totalClasses = 0;
  (state.subjects || []).forEach(s => {
    totalPres += (s.present || 0);
    totalClasses += (s.present || 0) + (s.absent || 0);
  });
  const attRate = totalClasses > 0 ? Math.round((totalPres / totalClasses) * 100) + '%' : '—';
  const aEl = document.getElementById('dash-stat-attendance');
  if (aEl) aEl.textContent = attRate;

  // Upcoming exams count
  const eEl = document.getElementById('dash-stat-exams');
  if (eEl) eEl.textContent = (state.exams || []).length;

  // Classes today count
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = (state.classes || []).filter(c => c.day === currentDay);
  const cEl = document.getElementById('dash-stat-classes');
  if (cEl) cEl.textContent = todayClasses.length;

  const todayBadge = document.getElementById('dash-today-label');
  if (todayBadge) todayBadge.textContent = currentDay;
}

// ── TIMETABLE & TODAY CLASSES ────────────────────────────────────
let activeTimetableFilter = 'All';

function switchTimetableDay(day) {
  activeTimetableFilter = day;
  document.querySelectorAll('#tt-day-chips .chip').forEach(c => {
    c.classList.toggle('active', c.textContent.trim() === (day === 'All' ? 'Full Weekly Grid' : day));
  });
  renderTimetable();
}

function addClass() {
  const name = v('class-name');
  const day = v('class-day');
  const period = v('class-period') || '1';
  const time = v('class-time') || '08:30';
  const teacher = v('class-teacher');
  const room = v('class-room');

  if (!name || !day) return;

  state.classes.push({
    id: uid(),
    name,
    day,
    period,
    time,
    teacher,
    room
  });

  saveKey('classes');
  closeModal('modal-class');
  clearInputs(['class-name', 'class-teacher', 'class-room']);
  renderClasses();
  renderTimetable();
  renderDashboardMetrics();
}

function deleteClass(id) {
  state.classes = state.classes.filter(c => c.id !== id);
  saveKey('classes');
  renderClasses();
  renderTimetable();
  renderDashboardMetrics();
}

function renderClasses() {
  // Today's classes widget on dashboard
  const el = document.getElementById('dash-classes-list');
  if (!el) return;

  if (!state.classes || state.classes.length === 0) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">🗓️</div><p>Your timetable hasn\'t been added yet.</p><button class="btn btn-sm btn-secondary" style="margin-top:8px;" onclick="openModal(\'modal-class\')">+ Add Period</button></div>';
    return;
  }

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = (state.classes || [])
    .filter(c => c.day === currentDay)
    .sort((a, b) => parseInt(a.period || 0) - parseInt(b.period || 0));

  if (!todayClasses.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">🏖️</div><p>No classes scheduled for today! Enjoy your break.</p></div>';
    return;
  }

  el.innerHTML = todayClasses.map(c => `
    <div class="item-card border-primary">
      <div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="badge badge-primary">Period ${c.period || '—'}</span>
          <strong>${c.name}</strong>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:3px;">
          ⏰ ${c.time || 'Schedule'} ${c.teacher ? '· 👨‍🏫 ' + c.teacher : ''} ${c.room ? '· 📍 ' + c.room : ''}
        </div>
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteClass('${c.id}')" title="Remove Period">✕</button>
    </div>
  `).join('');
}

function renderTimetable() {
  const el = document.getElementById('timetable-grid');
  if (!el) return;

  if (!state.classes || state.classes.length === 0) {
    el.innerHTML = `
      <div class="empty" style="padding:40px 20px;">
        <div class="empty-icon">🗓️</div>
        <p style="font-size:15px;font-weight:600;margin-bottom:6px;">Your timetable hasn't been added yet.</p>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Add your class periods (Monday–Saturday) to view your schedule.</p>
        <button class="btn btn-primary" onclick="openModal('modal-class')">+ Add Period</button>
      </div>
    `;
    return;
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const displayDays = activeTimetableFilter === 'All' ? days : [activeTimetableFilter];
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const periods = [
    { num: '1', time: '08:30 - 09:15', label: 'Period 1' },
    { num: '2', time: '09:15 - 10:00', label: 'Period 2' },
    { isBreak: true, label: '☕ Short Break (10:00 - 10:15)' },
    { num: '3', time: '10:15 - 11:00', label: 'Period 3' },
    { num: '4', time: '11:00 - 11:45', label: 'Period 4' },
    { isBreak: true, label: '🍱 Lunch Break (11:45 - 12:30)' },
    { num: '5', time: '12:30 - 01:15', label: 'Period 5' },
    { num: '6', time: '01:15 - 02:00', label: 'Period 6' },
    { num: '7', time: '02:00 - 02:40', label: 'Period 7' },
    { num: '8', time: '02:40 - 03:20', label: 'Period 8' }
  ];

  let html = '<table class="tt-table">';
  html += '<thead><tr><th style="width:130px;">Day / Time</th>';
  periods.forEach(p => {
    if (p.isBreak) {
      html += `<th style="background:#FEF3C7;color:#92400E;font-size:11px;">Break</th>`;
    } else {
      html += `<th>${p.label}<div style="font-size:10px;font-weight:normal;opacity:.8;">${p.time}</div></th>`;
    }
  });
  html += '</tr></thead><tbody>';

  displayDays.forEach(d => {
    const isToday = d === currentDay;
    html += `<tr class="${isToday ? 'today-row' : ''}">`;
    html += `<td style="font-weight:700;color:var(--primary);">${d} ${isToday ? '<span class="badge badge-secondary" style="font-size:9px;">Today</span>' : ''}</td>`;

    periods.forEach(p => {
      if (p.isBreak) {
        html += `<td style="text-align:center;background:#FFFDF7;"><span class="break-badge">${p.label.split('(')[0].trim()}</span></td>`;
      } else {
        const cls = (state.classes || []).find(c => c.day === d && String(c.period) === String(p.num));
        if (cls) {
          html += `<td>
            <div class="tt-period-box">
              <div class="tt-sub-name">${cls.name}</div>
              <div class="tt-sub-meta">${cls.teacher || 'Class Teacher'}</div>
              <div class="tt-sub-meta" style="color:var(--secondary);font-weight:600;">📍 ${cls.room || 'Room'}</div>
              <button class="btn btn-sm btn-danger" style="padding:2px 6px;font-size:10px;margin-top:4px;" onclick="deleteClass('${cls.id}')">✕</button>
            </div>
          </td>`;
        } else {
          html += `<td style="color:var(--text-muted);font-size:11px;text-align:center;">—</td>`;
        }
      }
    });

    html += '</tr>';
  });

  html += '</tbody></table>';
  el.innerHTML = html;
}

// ── ASSIGNMENTS & HOMEWORK ───────────────────────────────────────
let currentAssignFilter = 'all';

function setAssignFilter(filter) {
  currentAssignFilter = filter;
  ['all', 'pending', 'completed', 'overdue'].forEach(f => {
    const el = document.getElementById('filter-assign-' + f);
    if (el) el.classList.toggle('active', f === filter);
  });
  renderAssignments();
}

function addAssignment() {
  const title = v('assign-title');
  const subject = v('assign-subject') || 'General';
  const due = v('assign-due');
  const desc = v('assign-desc');

  if (!title || !due) {
    alert('Please enter assignment title and due date.');
    return;
  }

  state.assignments.push({
    id: uid(),
    title,
    subject,
    due,
    desc,
    done: false
  });

  saveKey('assignments');
  closeModal('modal-assign');
  clearInputs(['assign-title', 'assign-desc']);
  renderAssignments();
  renderDueSoon();
  renderDashboardMetrics();
}

function toggleAssignment(id) {
  const a = (state.assignments || []).find(x => x.id === id);
  if (a) {
    a.done = !a.done;
    saveKey('assignments');
    renderAssignments();
    renderDueSoon();
    renderDashboardMetrics();
  }
}

function deleteAssignment(id) {
  state.assignments = (state.assignments || []).filter(x => x.id !== id);
  saveKey('assignments');
  renderAssignments();
  renderDueSoon();
  renderDashboardMetrics();
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date(today());
  return Math.ceil(diff / 86400000);
}

function renderAssignments() {
  const el = document.getElementById('assignments-list');
  if (!el) return;

  if (!state.assignments || state.assignments.length === 0) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">📝</div><p>No assignments yet.</p><button class="btn btn-sm btn-primary" style="margin-top:8px;" onclick="openModal(\'modal-assign\')">+ Add Homework</button></div>';
    return;
  }

  const subjectFilter = (document.getElementById('assign-subject-filter')?.value || '').trim();

  let list = (state.assignments || []);
  if (subjectFilter) {
    list = list.filter(a => a.subject === subjectFilter);
  }

  if (currentAssignFilter === 'pending') {
    list = list.filter(a => !a.done);
  } else if (currentAssignFilter === 'completed') {
    list = list.filter(a => a.done);
  } else if (currentAssignFilter === 'overdue') {
    list = list.filter(a => !a.done && daysUntil(a.due) < 0);
  }

  list.sort((a, b) => new Date(a.due) - new Date(b.due));

  if (!list.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">🎉</div><p>No assignments found under this filter!</p></div>';
    return;
  }

  el.innerHTML = list.map(a => {
    const d = daysUntil(a.due);
    let borderClass = 'border-primary';
    let badgeHtml = '';

    if (a.done) {
      borderClass = 'border-success';
      badgeHtml = '<span class="badge badge-success">✓ Completed</span>';
    } else if (d < 0) {
      borderClass = 'border-danger';
      badgeHtml = `<span class="badge badge-danger">⚠️ Overdue by ${Math.abs(d)} day${Math.abs(d)===1?'':'s'}</span>`;
    } else if (d === 0) {
      borderClass = 'border-warn';
      badgeHtml = '<span class="badge badge-warning">Due Today</span>';
    } else if (d <= 2) {
      borderClass = 'border-warn';
      badgeHtml = `<span class="badge badge-warning">Due in ${d} days</span>`;
    } else {
      borderClass = 'border-primary';
      badgeHtml = `<span class="badge badge-secondary">Due in ${d} days</span>`;
    }

    return `
      <div class="item-card ${borderClass}" style="${a.done ? 'opacity:.75;' : ''}">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
            <input type="checkbox" ${a.done ? 'checked' : ''} onchange="toggleAssignment('${a.id}')" style="width:18px;height:18px;cursor:pointer;" />
            <strong style="${a.done ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${a.title}</strong>
            <span class="badge badge-primary">${a.subject || 'Subject'}</span>
            ${badgeHtml}
          </div>
          ${a.desc ? `<p style="font-size:12px;color:var(--text-muted);margin:4px 0 0 26px;">${a.desc}</p>` : ''}
          <div style="font-size:11px;color:var(--text-muted);margin:4px 0 0 26px;">📅 Due: ${a.due}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-sm ${a.done ? 'btn-secondary' : 'btn-success'}" onclick="toggleAssignment('${a.id}')">
            ${a.done ? 'Mark Pending' : '✓ Done'}
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteAssignment('${a.id}')">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderDueSoon() {
  const el = document.getElementById('dash-due-list');
  if (!el) return;

  if (!state.assignments || state.assignments.length === 0) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">📝</div><p>No assignments yet.</p><button class="btn btn-sm btn-secondary" style="margin-top:8px;" onclick="openModal(\'modal-assign\')">+ Add Homework</button></div>';
    return;
  }

  const upcoming = (state.assignments || [])
    .filter(a => !a.done && daysUntil(a.due) <= 7)
    .sort((a, b) => new Date(a.due) - new Date(b.due))
    .slice(0, 5);

  if (!upcoming.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">✨</div><p>All homework completed! No urgent deadlines.</p></div>';
    return;
  }

  el.innerHTML = upcoming.map(a => {
    const d = daysUntil(a.due);
    const border = d < 0 ? 'border-danger' : d <= 2 ? 'border-warn' : 'border-primary';
    const tag = d < 0 ? 'Overdue' : d === 0 ? 'Today' : `In ${d}d`;
    const badgeCls = d < 0 ? 'badge-danger' : d <= 2 ? 'badge-warning' : 'badge-secondary';

    return `
      <div class="item-card ${border}">
        <div style="display:flex;align-items:center;gap:10px;">
          <input type="checkbox" onchange="toggleAssignment('${a.id}')" style="width:17px;height:17px;cursor:pointer;" />
          <div>
            <strong>${a.title}</strong>
            <div style="font-size:11px;color:var(--text-muted);">📚 ${a.subject} · Due: ${a.due}</div>
          </div>
        </div>
        <span class="badge ${badgeCls}">${tag}</span>
      </div>
    `;
  }).join('');
}

// ── STUDY MATERIALS & ACADEMIC RESOURCES ─────────────────────────
function addStudyMaterial() {
  const title = v('res-title');
  const grade = v('res-grade') || 'Class 10';
  const subject = v('res-subject') || 'Science';
  const type = v('res-type') || 'Chapter Notes';
  const chapter = v('res-chapter') || 'General';
  const link = v('res-link');
  const desc = v('res-desc');

  if (!title) {
    alert('Please enter resource title.');
    return;
  }

  state.studyMaterials.push({
    id: uid(),
    title,
    grade,
    subject,
    type,
    chapter,
    link,
    desc,
    date: today()
  });

  saveKey('studyMaterials');
  closeModal('modal-resource');
  clearInputs(['res-title', 'res-chapter', 'res-link', 'res-desc']);
  renderStudyMaterials();
}

function deleteStudyMaterial(id) {
  state.studyMaterials = (state.studyMaterials || []).filter(m => m.id !== id);
  saveKey('studyMaterials');
  renderStudyMaterials();
}

function filterResources() {
  renderStudyMaterials();
}

function renderStudyMaterials() {
  const el = document.getElementById('resources-list');
  if (!el) return;

  const search = (v('res-search-input') || '').toLowerCase();
  const grade = v('res-grade-filter');
  const subject = v('res-subject-filter');
  const type = v('res-type-filter');

  let list = (state.studyMaterials || []);

  if (search) {
    list = list.filter(m =>
      m.title.toLowerCase().includes(search) ||
      (m.chapter && m.chapter.toLowerCase().includes(search)) ||
      (m.desc && m.desc.toLowerCase().includes(search))
    );
  }
  if (grade) list = list.filter(m => m.grade === grade);
  if (subject) list = list.filter(m => m.subject === subject);
  if (type) list = list.filter(m => m.type === type);

  if (!list.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">🔍</div><p>No study materials match your search filters.</p></div>';
    return;
  }

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:14px;">
      ${list.map(m => `
        <div class="card" style="margin-bottom:0;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
              <span class="badge badge-primary">${m.grade || 'All Classes'}</span>
              <span class="badge badge-secondary">${m.type || 'Study Notes'}</span>
            </div>
            <h4 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;">${m.title}</h4>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
              📚 <strong>${m.subject}</strong> ${m.chapter ? '· ' + m.chapter : ''}
            </div>
            ${m.desc ? `<p style="font-size:12px;color:var(--text-muted);line-height:1.5;margin-bottom:12px;">${m.desc}</p>` : ''}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--border);">
            ${m.link ? `<a href="${m.link}" target="_blank" class="btn btn-sm btn-secondary">🔗 Open Resource</a>` : `<span style="font-size:11px;color:var(--text-muted);">Saved in notebook</span>`}
            <button class="btn btn-sm btn-danger" onclick="deleteStudyMaterial('${m.id}')" title="Delete">✕ Remove</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── EXAMINATIONS HUB ─────────────────────────────────────────────
function addExam() {
  const name = v('exam-name');
  const subject = v('exam-subject') || 'Mathematics';
  const date = v('exam-date');
  const time = v('exam-time') || '09:00 AM - 12:00 PM';
  const maxMarks = parseFloat(v('exam-max')) || 80;
  const syllabus = v('exam-syllabus');

  if (!name || !date) {
    alert('Please enter exam name and examination date.');
    return;
  }

  state.exams.push({
    id: uid(),
    name,
    subject,
    date,
    time,
    maxMarks,
    syllabus
  });

  saveKey('exams');
  closeModal('modal-exam');
  clearInputs(['exam-name', 'exam-syllabus']);
  renderExams();
  renderDashboardMetrics();
}

function deleteExam(id) {
  state.exams = (state.exams || []).filter(e => e.id !== id);
  saveKey('exams');
  renderExams();
  renderDashboardMetrics();
}

function renderExams() {
  const el = document.getElementById('exams-list');
  const dashEl = document.getElementById('dash-exams-list');

  const list = [...(state.exams || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Render on main examinations page
  if (el) {
    if (!list.length) {
      el.innerHTML = `
        <div class="empty" style="padding:40px 20px;">
          <div class="empty-icon">🎯</div>
          <p style="font-size:15px;font-weight:600;margin-bottom:6px;">No upcoming examinations.</p>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Add exam datesheets and syllabus portions to track your preparation.</p>
          <button class="btn btn-primary" onclick="openModal('modal-exam')">+ Add Exam Schedule</button>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:14px;">
          ${list.map(e => {
            const d = daysUntil(e.date);
            const badgeCls = d < 0 ? 'badge-danger' : d <= 5 ? 'badge-warning' : 'badge-primary';
            const countdownText = d < 0 ? 'Concluded' : d === 0 ? 'Today' : `Starts in ${d} days`;

            return `
              <div class="card" style="margin-bottom:0;border-left:4px solid var(--secondary);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                  <span class="badge ${badgeCls}">${countdownText}</span>
                  <span class="badge badge-secondary">${e.subject}</span>
                </div>
                <h4 style="font-size:16px;font-weight:700;color:var(--text);">${e.name}</h4>
                <div style="font-size:12px;color:var(--text-muted);margin:6px 0;">
                  📅 <strong>${e.date}</strong> · ⏰ ${e.time} · 🎯 Max: ${e.maxMarks} Marks
                </div>
                ${e.syllabus ? `
                  <div style="background:var(--primary-light);padding:10px;border-radius:8px;font-size:12px;line-height:1.5;margin:8px 0;color:var(--text);">
                    <strong>Syllabus / Portions:</strong><br>${e.syllabus}
                  </div>
                ` : ''}
                <div style="text-align:right;margin-top:10px;">
                  <button class="btn btn-sm btn-danger" onclick="deleteExam('${e.id}')">✕ Delete Schedule</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  // Render on dashboard widget
  if (dashEl) {
    if (!list.length) {
      dashEl.innerHTML = '<div class="empty"><div class="empty-icon">🎯</div><p>No upcoming examinations.</p><button class="btn btn-sm btn-secondary" style="margin-top:8px;" onclick="openModal(\'modal-exam\')">+ Add Exam</button></div>';
    } else {
      dashEl.innerHTML = list.slice(0, 3).map(e => {
        const d = daysUntil(e.date);
        const tag = d < 0 ? 'Past' : d === 0 ? 'Today' : `In ${d}d`;
        const badgeCls = d <= 5 ? 'badge-warning' : 'badge-primary';

        return `
          <div class="item-card border-primary">
            <div>
              <strong>${e.name}</strong>
              <div style="font-size:12px;color:var(--text-muted);">📚 ${e.subject} · 📅 ${e.date}</div>
            </div>
            <span class="badge ${badgeCls}">${tag}</span>
          </div>
        `;
      }).join('');
    }
  }

  renderExamChecklist();
}

// ── EXAM SYLLABUS CHECKLIST ──────────────────────────────────────
function addExamChecklistItem() {
  const input = document.getElementById('exam-topic-input');
  if (!input || !input.value.trim()) return;

  state.examChecklist.push({
    id: uid(),
    topic: input.value.trim(),
    done: false
  });

  saveKey('examChecklist');
  input.value = '';
  renderExamChecklist();
}

function toggleExamChecklist(id) {
  const item = (state.examChecklist || []).find(x => x.id === id);
  if (item) {
    item.done = !item.done;
    saveKey('examChecklist');
    renderExamChecklist();
  }
}

function deleteExamChecklistItem(id) {
  state.examChecklist = (state.examChecklist || []).filter(x => x.id !== id);
  saveKey('examChecklist');
  renderExamChecklist();
}

function renderExamChecklist() {
  const el = document.getElementById('exam-checklist-items');
  const pctEl = document.getElementById('exam-checklist-pct');
  const barEl = document.getElementById('exam-checklist-bar');
  if (!el) return;

  const list = state.examChecklist || [];
  const completed = list.filter(i => i.done).length;
  const pct = list.length > 0 ? Math.round((completed / list.length) * 100) : 0;

  if (pctEl) pctEl.textContent = `${pct}% (${completed}/${list.length})`;
  if (barEl) barEl.style.width = `${pct}%`;

  if (!list.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:12px;">Add key syllabus chapters to track revision!</div>';
    return;
  }

  el.innerHTML = list.map(item => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;flex:1;text-transform:none;letter-spacing:normal;">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleExamChecklist('${item.id}')" style="width:16px;height:16px;" />
        <span style="${item.done ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${item.topic}</span>
      </label>
      <button class="btn btn-sm btn-danger" style="padding:2px 6px;font-size:10px;" onclick="deleteExamChecklistItem('${item.id}')">✕</button>
    </div>
  `).join('');
}

// ── SCHOOL ANNOUNCEMENTS ─────────────────────────────────────────
let activeAnnFilter = 'All';

function filterAnnouncements(cat) {
  activeAnnFilter = cat;
  document.querySelectorAll('#page-announcements .chip-row .chip').forEach(c => {
    c.classList.toggle('active', c.textContent.includes(cat) || (cat === 'All' && c.textContent.includes('All')));
  });
  renderAnnouncements();
}

function addAnnouncement() {
  const title = v('ann-title');
  const category = v('ann-category') || 'General';
  const date = v('ann-date') || today();
  const content = v('ann-content');
  const pinned = document.getElementById('ann-pinned')?.checked || false;

  if (!title || !content) {
    alert('Please enter announcement headline and content.');
    return;
  }

  state.announcements.unshift({
    id: uid(),
    title,
    category,
    date,
    content,
    pinned
  });

  saveKey('announcements');
  closeModal('modal-announcement');
  clearInputs(['ann-title', 'ann-content']);
  renderAnnouncements();
}

function deleteAnnouncement(id) {
  state.announcements = (state.announcements || []).filter(a => a.id !== id);
  saveKey('announcements');
  renderAnnouncements();
}

function renderAnnouncements() {
  const el = document.getElementById('announcements-list');
  const dashEl = document.getElementById('dash-announcements-list');

  let list = [...(state.announcements || [])];

  // Dashboard preview list (top 3 pinned/recent)
  if (dashEl) {
    const dashList = [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).slice(0, 3);
    if (!dashList.length) {
      dashEl.innerHTML = '<div class="empty"><div class="empty-icon">✨</div><p>You\'re all caught up!</p></div>';
    } else {
      dashEl.innerHTML = dashList.map(a => `
        <div class="announcement-card ${a.pinned ? 'pinned' : ''}">
          <div class="ann-meta">
            <span class="badge ${a.category === 'Urgent' ? 'badge-danger' : a.category === 'Holiday' ? 'badge-warning' : 'badge-primary'}">${a.category}</span>
            <span>📅 ${a.date}</span>
          </div>
          <div class="ann-title">${a.title}</div>
          <div class="ann-body">${a.content.length > 120 ? a.content.slice(0, 120) + '...' : a.content}</div>
        </div>
      `).join('');
    }
  }

  // Main announcements page list
  if (el) {
    if (activeAnnFilter !== 'All') {
      list = list.filter(a => a.category === activeAnnFilter);
    }

    list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.date) - new Date(a.date));

    if (!list.length) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">📢</div><p>No announcements found under this category.</p></div>';
      return;
    }

    el.innerHTML = list.map(a => `
      <div class="announcement-card ${a.pinned ? 'pinned' : ''}">
        <div class="ann-meta">
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="badge ${a.category === 'Urgent' ? 'badge-danger' : a.category === 'Holiday' ? 'badge-warning' : 'badge-primary'}">${a.category}</span>
            ${a.pinned ? '<span class="badge badge-warning">📌 Pinned</span>' : ''}
          </div>
          <div>
            <span>📅 ${a.date}</span>
            <button class="btn btn-sm btn-danger" style="margin-left:8px;padding:2px 8px;" onclick="deleteAnnouncement('${a.id}')">✕</button>
          </div>
        </div>
        <div class="ann-title">${a.title}</div>
        <div class="ann-body">${a.content}</div>
      </div>
    `).join('');
  }
}

// ── EVENTS & CLUBS ───────────────────────────────────────────────
function addSchoolEvent() {
  const name = v('event-name');
  const date = v('event-date');
  const category = v('event-category') || 'General';
  const venue = v('event-venue') || 'School Premises';
  const desc = v('event-desc');

  if (!name || !date) {
    alert('Please enter event name and date.');
    return;
  }

  state.events.push({
    id: uid(),
    name,
    date,
    category,
    venue,
    desc,
    joined: false
  });

  saveKey('events');
  closeModal('modal-event');
  clearInputs(['event-name', 'event-venue', 'event-desc']);
  renderEvents();
}

function toggleEventAttendance(id) {
  const ev = (state.events || []).find(e => e.id === id);
  if (ev) {
    ev.joined = !ev.joined;
    saveKey('events');
    renderEvents();
  }
}

function deleteSchoolEvent(id) {
  state.events = (state.events || []).filter(e => e.id !== id);
  saveKey('events');
  renderEvents();
}

function renderEvents() {
  const el = document.getElementById('events-list');
  if (!el) return;

  const list = [...(state.events || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!list.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">🏆</div><p>No upcoming school events scheduled.</p><button class="btn btn-sm btn-primary" style="margin-top:8px;" onclick="openModal(\'modal-event\')">+ Add Event</button></div>';
    return;
  }

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:14px;">
      ${list.map(e => {
        const d = daysUntil(e.date);
        const tag = d < 0 ? 'Concluded' : d === 0 ? 'Today' : `In ${d} days`;

        return `
          <div class="card" style="margin-bottom:0;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                <span class="badge badge-primary">${e.category || 'School Event'}</span>
                <span class="badge ${d <= 7 ? 'badge-warning' : 'badge-secondary'}">${tag}</span>
              </div>
              <h4 style="font-size:16px;font-weight:700;color:var(--text);">${e.name}</h4>
              <div style="font-size:12px;color:var(--text-muted);margin:6px 0;">
                📅 <strong>${e.date}</strong> · 📍 ${e.venue}
              </div>
              ${e.desc ? `<p style="font-size:13px;color:var(--text-muted);line-height:1.5;margin-top:6px;">${e.desc}</p>` : ''}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:10px;border-top:1px solid var(--border);">
              <button class="btn btn-sm ${e.joined ? 'btn-success' : 'btn-secondary'}" onclick="toggleEventAttendance('${e.id}')">
                ${e.joined ? '✓ Participating' : '+ Participate'}
              </button>
              <button class="btn btn-sm btn-danger" onclick="deleteSchoolEvent('${e.id}')">✕ Remove</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function addClub() {
  const name = v('club-name');
  const role = v('club-role') || 'Member';
  const teacher = v('club-teacher');
  const day = v('club-day');

  if (!name) return;

  state.clubs.push({
    id: uid(),
    name,
    role,
    teacher,
    day
  });

  saveKey('clubs');
  closeModal('modal-club');
  clearInputs(['club-name', 'club-teacher', 'club-day']);
  renderClubs();
}

function deleteClub(id) {
  state.clubs = (state.clubs || []).filter(c => c.id !== id);
  saveKey('clubs');
  renderClubs();
}

function renderClubs() {
  const el = document.getElementById('clubs-list');
  if (!el) return;

  const list = state.clubs || [];
  if (!list.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">🎯</div><p>No school clubs added yet.</p><button class="btn btn-sm btn-secondary" style="margin-top:8px;" onclick="openModal(\'modal-club\')">+ Add Club</button></div>';
    return;
  }

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px;">
      ${list.map(c => `
        <div class="card" style="margin-bottom:0;border-left:4px solid var(--primary);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <h4 style="font-size:15px;font-weight:700;color:var(--primary);">${c.name}</h4>
              <div class="badge badge-secondary" style="margin-top:4px;">${c.role}</div>
            </div>
            <button class="btn btn-sm btn-danger" onclick="deleteClub('${c.id}')">✕</button>
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:10px;line-height:1.6;">
            ${c.teacher ? `<div>👨‍🏫 Teacher In-Charge: <strong>${c.teacher}</strong></div>` : ''}
            ${c.day ? `<div>🗓️ Schedule: <strong>${c.day}</strong></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── ATTENDANCE ───────────────────────────────────────────────────
function addSubject() {
  const name = v('subject-name');
  if (!name) return;

  state.subjects.push({ id: uid(), name, present: 0, absent: 0 });
  saveKey('subjects');
  closeModal('modal-subject');
  clearInputs(['subject-name']);
  renderAttendance();
  renderDashboardMetrics();
}

function markAttendance(id, type) {
  const s = (state.subjects || []).find(x => x.id === id);
  if (!s) return;
  if (type === 'P') s.present = (s.present || 0) + 1;
  else s.absent = (s.absent || 0) + 1;
  saveKey('subjects');
  renderAttendance();
  renderDashboardMetrics();
}

function deleteSubject(id) {
  if (!confirm('Remove this subject and its attendance record?')) return;
  state.subjects = (state.subjects || []).filter(s => s.id !== id);
  saveKey('subjects');
  renderAttendance();
  renderDashboardMetrics();
}

function renderAttendance() {
  const el = document.getElementById('attendance-list');
  if (!el) return;

  const list = state.subjects || [];
  if (!list.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">📊</div><p>No subjects added for attendance tracking.</p><button class="btn btn-sm btn-primary" style="margin-top:8px;" onclick="openModal(\'modal-subject\')">+ Add Subject</button></div>';
    return;
  }

  el.innerHTML = list.map(s => {
    const total = (s.present || 0) + (s.absent || 0);
    const pct = total > 0 ? Math.round((s.present / total) * 100) : 100;
    const isLow = pct < 75;

    return `
      <div class="att-item ${isLow ? 'item-card border-danger' : ''}">
        <div>
          <div class="att-title">${s.name}</div>
          <div style="font-size:12px;color:var(--text-muted);">
            Attended: <strong>${s.present || 0}</strong> / Total: ${total} Classes
            ${isLow ? '<span style="color:var(--danger);font-weight:700;margin-left:6px;">⚠️ Below 75%</span>' : ''}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;">
          <div class="att-score" style="color:${isLow ? 'var(--danger)' : 'var(--success)'};">${pct}%</div>
          <div class="att-btns">
            <button class="att-btn present" onclick="markAttendance('${s.id}','P')" title="Mark Present">P</button>
            <button class="att-btn absent" onclick="markAttendance('${s.id}','A')" title="Mark Absent">A</button>
            <button class="btn btn-sm btn-danger" style="padding:4px 8px;font-size:11px;" onclick="deleteSubject('${s.id}')">✕</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── MARKS TRACKER ────────────────────────────────────────────────
function addMarks() {
  const subject = v('marks-subject');
  const test = v('marks-test');
  const score = parseFloat(v('marks-score'));
  const max = parseFloat(v('marks-max'));

  if (!subject || isNaN(score) || isNaN(max) || max <= 0) {
    alert('Please enter subject, test name, and valid marks.');
    return;
  }

  state.marks.push({ id: uid(), subject, test, score, max });
  saveKey('marks');
  closeModal('modal-marks');
  clearInputs(['marks-subject', 'marks-test', 'marks-score']);
  renderMarks();
}

function deleteMarks(id) {
  state.marks = (state.marks || []).filter(m => m.id !== id);
  saveKey('marks');
  renderMarks();
}

function renderMarks() {
  const el = document.getElementById('marks-list');
  if (!el) return;

  const list = state.marks || [];
  if (!list.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">📈</div><p>No assessment scores recorded yet.</p><button class="btn btn-sm btn-secondary" style="margin-top:8px;" onclick="openModal(\'modal-marks\')">+ Add Score</button></div>';
    return;
  }

  el.innerHTML = list.map(m => {
    const pct = Math.round((m.score / m.max) * 100);
    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 50 ? 'C' : 'Needs Improvement';
    const color = pct >= 75 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';

    return `
      <div class="item-card border-primary">
        <div>
          <strong>${m.subject}</strong> — ${m.test}
          <div style="font-size:12px;color:var(--text-muted);">Grade: <strong>${grade}</strong></div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="text-align:right;">
            <div style="font-size:16px;font-weight:700;color:${color};">${m.score} / ${m.max}</div>
            <div style="font-size:11px;color:var(--text-muted);">${pct}%</div>
          </div>
          <button class="btn btn-sm btn-danger" onclick="deleteMarks('${m.id}')">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

// ── POMODORO FOCUS TIMER ─────────────────────────────────────────
let pomoInterval = null;
let pomoSeconds = 25 * 60;
let pomoIsBreak = false;

function togglePomo() {
  if (pomoInterval) {
    clearInterval(pomoInterval);
    pomoInterval = null;
    const btn = document.getElementById('pomo-btn');
    if (btn) btn.textContent = '▶ Start Session';
  } else {
    const btn = document.getElementById('pomo-btn');
    if (btn) btn.textContent = '⏸ Pause';
    pomoInterval = setInterval(() => {
      pomoSeconds--;
      updatePomoDisplay();
      if (pomoSeconds <= 0) {
        clearInterval(pomoInterval);
        pomoInterval = null;
        beep();
        if (!pomoIsBreak) {
          const d = today();
          if (state.pomodoro.date !== d) {
            state.pomodoro.sessions = 0;
            state.pomodoro.date = d;
          }
          state.pomodoro.sessions++;
          saveKey('pomodoro');
          renderPomo();
          pomoIsBreak = true;
          pomoSeconds = 5 * 60;
          const lbl = document.getElementById('pomo-label');
          if (lbl) lbl.textContent = '☕ Short Break';
        } else {
          pomoIsBreak = false;
          pomoSeconds = 25 * 60;
          const lbl = document.getElementById('pomo-label');
          if (lbl) lbl.textContent = '🍅 Focus Session';
        }
        updatePomoDisplay();
        const b = document.getElementById('pomo-btn');
        if (b) b.textContent = '▶ Start Session';
      }
    }, 1000);
  }
}

function resetPomo() {
  clearInterval(pomoInterval);
  pomoInterval = null;
  pomoSeconds = 25 * 60;
  pomoIsBreak = false;
  updatePomoDisplay();
  const btn = document.getElementById('pomo-btn');
  if (btn) btn.textContent = '▶ Start Session';
  const lbl = document.getElementById('pomo-label');
  if (lbl) lbl.textContent = '🍅 Focus Session';
}

function updatePomoDisplay() {
  const el = document.getElementById('pomo-display');
  if (!el) return;
  const m = String(Math.floor(pomoSeconds / 60)).padStart(2, '0');
  const s = String(pomoSeconds % 60).padStart(2, '0');
  el.textContent = `${m}:${s}`;
}

function renderPomo() {
  const el = document.getElementById('pomo-count');
  if (!el) return;
  const d = today();
  const sessions = state.pomodoro.date === d ? state.pomodoro.sessions : 0;
  el.textContent = `${sessions} study session${sessions !== 1 ? 's' : ''} completed today`;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {}
}

// ── QUICK NOTES ──────────────────────────────────────────────────
function addNote() {
  const subject = v('note-subject') || 'General';
  const content = v('note-content');
  if (!content) return;

  state.notes.push({ id: uid(), subject, content, date: today() });
  saveKey('notes');
  clearInputs(['note-content']);
  renderNotes();
}

function deleteNote(id) {
  state.notes = (state.notes || []).filter(n => n.id !== id);
  saveKey('notes');
  renderNotes();
}

function renderNotes() {
  const el = document.getElementById('notes-list');
  if (!el) return;

  const list = state.notes || [];
  if (!list.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">📝</div><p>No notes yet.</p></div>';
    return;
  }

  el.innerHTML = [...list].reverse().map(n => `
    <div class="item-card border-primary">
      <div>
        <span class="badge badge-primary">${n.subject}</span>
        <div style="font-size:13px;margin-top:6px;line-height:1.5;">${n.content}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Saved: ${n.date}</div>
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteNote('${n.id}')">✕</button>
    </div>
  `).join('');
}

// ── DAILY TASKS ──────────────────────────────────────────────────
function addDashTask() {
  const input = document.getElementById('dash-task-input');
  if (!input || !input.value.trim()) return;

  state.tasks.push({ id: uid(), text: input.value.trim(), done: false });
  saveKey('tasks');
  input.value = '';
  renderTasks();
}

function toggleTask(id) {
  const t = (state.tasks || []).find(x => x.id === id);
  if (t) {
    t.done = !t.done;
    saveKey('tasks');
    renderTasks();
  }
}

function deleteTask(id) {
  state.tasks = (state.tasks || []).filter(x => x.id !== id);
  saveKey('tasks');
  renderTasks();
}

function renderTasks() {
  const el = document.getElementById('dash-tasks-list');
  if (!el) return;

  const list = state.tasks || [];
  if (!list.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">✅</div><p>No tasks yet.</p></div>';
    return;
  }

  el.innerHTML = list.map(t => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:var(--card);border:1px solid var(--border);border-radius:8px;margin-bottom:6px;font-size:13px;">
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1;text-transform:none;letter-spacing:normal;">
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask('${t.id}')" style="width:16px;height:16px;" />
        <span style="${t.done ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${t.text}</span>
      </label>
      <button class="btn btn-sm btn-danger" style="padding:2px 6px;font-size:10px;" onclick="deleteTask('${t.id}')">✕</button>
    </div>
  `).join('');
}

// ── RENDER ALL ───────────────────────────────────────────────────
function renderAll() {
  renderGreeting();
  renderMood();
  renderDashboardMetrics();
  renderClasses();
  renderTimetable();
  renderAssignments();
  renderDueSoon();
  renderStudyMaterials();
  renderExams();
  renderAnnouncements();
  renderEvents();
  renderClubs();
  renderAttendance();
  renderMarks();
  renderPomo();
  updatePomoDisplay();
  renderNotes();
  renderTasks();
}

// ── UTILITIES ────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function clearInputs(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ── INITIALIZATION ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadAll();
  applyDark();
  renderAll();
  showPage('dashboard');
});

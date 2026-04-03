// ═══════════════════════════════════
//   ATTENDEASE — courses.js
//   Connects to Node.js backend
// ═══════════════════════════════════

// ── ADD COURSE ──
async function addCourse() {
  hideAlert('courseAlert');

  const name     = (document.getElementById('courseName').value     || '').trim();
  const total    = parseInt(document.getElementById('totalClasses').value);
  const held     = parseInt(document.getElementById('heldClasses').value);
  const attended = parseInt(document.getElementById('attendedClasses').value);

  if (!name)                          { showAlert('courseAlert','⚠️ Please enter a course name!'); return; }
  if (isNaN(total) || total < 1)      { showAlert('courseAlert','⚠️ Total classes must be at least 1!'); return; }
  if (isNaN(held)  || held  < 0)      { showAlert('courseAlert','⚠️ Classes held cannot be negative!'); return; }
  if (isNaN(attended) || attended < 0){ showAlert('courseAlert','⚠️ Attended classes cannot be negative!'); return; }
  if (held > total)                   { showAlert('courseAlert','⚠️ Classes held cannot exceed total!'); return; }
  if (attended > held)                { showAlert('courseAlert','⚠️ Attended cannot exceed classes held!'); return; }

  const courses = getCourses();
  const colorIdx = courses.length % PALETTE.length;

  try {
    await apiAddCourse({ name, total, held, attended, colorIdx });
    // refresh list from backend
    await refreshCourses();
    // clear form
    document.getElementById('courseName').value     = '';
    document.getElementById('totalClasses').value   = '';
    document.getElementById('heldClasses').value    = '';
    document.getElementById('attendedClasses').value = '';
    document.getElementById('courseName').focus();
    showAlert('courseAlert','✅ Course added successfully!','success');
    setTimeout(() => hideAlert('courseAlert'), 2000);
  } catch(err) {
    showAlert('courseAlert', '❌ ' + (err.message || 'Failed to add course.'));
  }
}

// ── REFRESH from backend ──
async function refreshCourses() {
  try {
    const courses = await apiGetCourses();
    renderCourseList(courses);
    return courses;
  } catch(err) {
    console.warn('Could not fetch courses from backend:', err.message);
    renderCourseList(getCourses()); // fallback to cache
    return getCourses();
  }
}

// ── DELETE ──
async function deleteCourse(id) {
  try {
    await apiDeleteCourse(id);
    await refreshCourses();
  } catch(err) {
    alert('Error deleting course: ' + err.message);
  }
}

// ── OPEN EDIT MODAL ──
function openEdit(id) {
  const courses = getCourses();
  const c = courses.find(x => (x._id || x.id) === id || x._id === id);
  if (!c) return;
  document.getElementById('editId').value       = c._id || c.id;
  document.getElementById('editName').value     = c.name;
  document.getElementById('editTotal').value    = c.total;
  document.getElementById('editHeld').value     = c.held;
  document.getElementById('editAttended').value = c.attended;
  document.getElementById('editModal').classList.add('open');
}

function closeModal() { document.getElementById('editModal').classList.remove('open'); }

// ── SAVE EDIT ──
async function saveEdit() {
  const id       = document.getElementById('editId').value;
  const name     = (document.getElementById('editName').value || '').trim();
  const total    = parseInt(document.getElementById('editTotal').value);
  const held     = parseInt(document.getElementById('editHeld').value);
  const attended = parseInt(document.getElementById('editAttended').value);

  if (!name || isNaN(total) || isNaN(held) || isNaN(attended)) { alert('Please fill all fields correctly.'); return; }
  if (held > total)    { alert('Classes held cannot exceed total.'); return; }
  if (attended > held) { alert('Attended cannot exceed classes held.'); return; }

  try {
    await apiUpdateCourse(id, { name, total, held, attended, absent: held-attended });
    closeModal();
    await refreshCourses();
  } catch(err) {
    alert('Error updating course: ' + err.message);
  }
}

// ── BUILD CARD HTML ──
function buildCourseCard(c) {
  const s = calcStats(c);
  const idx = typeof c.colorIdx !== 'undefined' ? c.colorIdx : 0;
  const [c1,c2] = PALETTE[idx % PALETTE.length];
  const id = c._id || c.id;

  return `
  <div class="course-card anim-slidein" id="card-${id}">
    <div class="course-stripe" style="background:linear-gradient(180deg,${c1},${c2})"></div>
    <div class="course-top">
      <div class="course-name">${c.name}</div>
      <div class="course-actions">
        <button class="btn-sm" onclick="openEdit('${id}')">✏️ Edit</button>
        <button class="btn-sm danger" onclick="deleteCourse('${id}')">✕</button>
      </div>
    </div>
    <div class="chips-row">
      <div class="chip">Total <span>${c.total}</span></div>
      <div class="chip">Held <span>${c.held}</span></div>
      <div class="chip">Attended <span>${c.attended}</span></div>
      <div class="chip">Absent <span>${c.absent !== undefined ? c.absent : c.held - c.attended}</span></div>
      <div class="chip">Remaining <span>${s.remaining}</span></div>
    </div>
    <div class="badges-row">
      <span class="pct-badge ${pctClass(s.pctHeld)}">By Held: ${s.pctHeld.toFixed(1)}%</span>
      <span class="pct-badge ${pctClass(s.pctTotal)}">By Total: ${s.pctTotal.toFixed(1)}%</span>
    </div>
    <div class="prog-wrap" style="margin-bottom:10px;">
      <div class="prog-bar" style="width:${Math.min(s.pctTotal,100)}%;background:${barGradient(s.pctTotal)}"></div>
    </div>
    <div class="bunk-info">${bunkMessage(c,s)}</div>
  </div>`;
}

// ── RENDER LIST ──
function renderCourseList(courses) {
  const el = document.getElementById('courseListEl');
  if (!el) return;
  if (!courses || courses.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="e-icon">🎓</div><p>No courses yet.<br/>Add your first course above!</p></div>`;
  } else {
    el.innerHTML = courses.map(buildCourseCard).join('');
  }
}

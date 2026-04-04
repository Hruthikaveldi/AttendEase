// ═══════════════════════════════
//   ATTENDEASE — utils.js
//   Shared helpers + API layer
// ═══════════════════════════════

const API_URL = 'http://localhost:5000/api';

const PALETTE = [
  ['#3d8ef8','#6c5ce7'],
  ['#00d4aa','#3d8ef8'],
  ['#f25c69','#f4845f'],
  ['#f9c74f','#f4845f'],
  ['#c45cfc','#f25c69'],
  ['#5cf7d4','#3d8ef8'],
];

// ── THEME ──
function getTheme() { return localStorage.getItem('ae_theme') || 'dark'; }
function applyTheme() {
  const t = getTheme();
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = t === 'dark' ? '🌙' : '☀️';
}
function toggleTheme() {
  const t = getTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ae_theme', t);
  applyTheme();
  if (typeof onThemeChange === 'function') onThemeChange();
}

// ── TOKEN & USER ──
function getToken()          { return localStorage.getItem('ae_token') || null; }
function setToken(t)         { localStorage.setItem('ae_token', t); }
function clearToken()        { localStorage.removeItem('ae_token'); }
function getCurrentUser()    { return JSON.parse(localStorage.getItem('ae_currentUser') || 'null'); }
function setCurrentUser(u)   { localStorage.setItem('ae_currentUser', JSON.stringify(u)); }
function clearCurrentUser()  { localStorage.removeItem('ae_currentUser'); clearToken(); }
function authHeaders()       { return { 'Content-Type':'application/json', 'Authorization':'Bearer ' + getToken() }; }

// ── API: AUTH ──
async function apiRegister(name, email, password) {
  const res  = await fetch(`${API_URL}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,password}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed.');
  setToken(data.token); setCurrentUser(data.user); return data.user;
}
async function apiLogin(email, password) {
  const res  = await fetch(`${API_URL}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed.');
  setToken(data.token); setCurrentUser(data.user); return data.user;
}

// ── API: COURSES ──
async function apiGetCourses() {
  const res = await fetch(`${API_URL}/courses`, { headers:authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load courses.');
  localStorage.setItem('ae_courses_cache', JSON.stringify(data));
  return data;
}
async function apiAddCourse(course) {
  const res = await fetch(`${API_URL}/courses`, { method:'POST', headers:authHeaders(), body:JSON.stringify(course) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add course.');
  return data;
}
async function apiUpdateCourse(id, updates) {
  const res = await fetch(`${API_URL}/courses/${id}`, { method:'PUT', headers:authHeaders(), body:JSON.stringify(updates) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update course.');
  return data;
}
async function apiDeleteCourse(id) {
  const res = await fetch(`${API_URL}/courses/${id}`, { method:'DELETE', headers:authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete course.');
  return data;
}

// ── API: FRIENDS ──
async function apiGetFriends()             { const r = await fetch(`${API_URL}/friends`,          {headers:authHeaders()}); const d=await r.json(); if(!r.ok) throw new Error(d.message); return d; }
async function apiGetFriendRequests()      { const r = await fetch(`${API_URL}/friends/requests`, {headers:authHeaders()}); const d=await r.json(); if(!r.ok) throw new Error(d.message); return d; }
async function apiSendFriendRequest(email){ const r = await fetch(`${API_URL}/friends/request`,  {method:'POST',headers:authHeaders(),body:JSON.stringify({email})}); const d=await r.json(); if(!r.ok) throw new Error(d.message); return d; }
async function apiRespondFriendRequest(requestId,action){ const r=await fetch(`${API_URL}/friends/respond`,{method:'POST',headers:authHeaders(),body:JSON.stringify({requestId,action})}); const d=await r.json(); if(!r.ok) throw new Error(d.message); return d; }
async function apiRemoveFriend(friendId)  { const r = await fetch(`${API_URL}/friends/${friendId}`,{method:'DELETE',headers:authHeaders()}); const d=await r.json(); if(!r.ok) throw new Error(d.message); return d; }

// ── LOCAL CACHE (offline fallback) ──
function getCourses() {
  try { return JSON.parse(localStorage.getItem('ae_courses_cache') || '[]'); } catch(e) { return []; }
}

// ── STATS ──
function calcStats(c) {
  const pctHeld  = c.held>0  ? (c.attended/c.held *100) : 0;
  const pctTotal = c.total>0 ? (c.attended/c.total*100) : 0;
  const remaining = c.total - c.held;
  const needed75  = Math.ceil(0.75*c.total);
  const canBunk   = c.attended>=needed75 ? remaining : remaining-(needed75-c.attended);
  return { pctHeld, pctTotal, remaining, needed75, canBunk };
}
function pctClass(p)      { return p>=75?'badge-green':p>=60?'badge-yellow':'badge-red'; }
function barGradient(p)   { return p>=75?'linear-gradient(90deg,#00d4aa,#3d8ef8)':p>=60?'linear-gradient(90deg,#f9c74f,#f4845f)':'linear-gradient(90deg,#f25c69,#f4845f)'; }
function barSolidColor(p) { return p>=75?'#00d4aa':p>=60?'#f9c74f':'#f25c69'; }

function bunkMessage(c,s) {
  if(s.remaining===0){ const cls=s.pctTotal>=75?'hi-green':s.pctTotal>=60?'hi-yellow':'hi-red'; return `Semester complete. Final: <span class="${cls}">${s.pctTotal.toFixed(1)}%</span>`; }
  if(s.pctTotal>=75){ return s.canBunk>0?`✅ You can bunk up to <span class="hi-green">${s.canBunk} more class${s.canBunk>1?'es':''}</span> and still stay above 75%.`:`⚠️ Exactly at 75%! Attend <span class="hi-yellow">all remaining</span> classes to stay safe.`; }
  const must=s.needed75-c.attended;
  if(must>s.remaining) return `🚨 <span class="hi-red">Cannot reach 75%</span> even attending all ${s.remaining} remaining. Max: ${((c.attended+s.remaining)/c.total*100).toFixed(1)}%`;
  return `⚠️ Must attend <span class="hi-yellow">${must} more class${must>1?'es':''}</span> out of ${s.remaining} remaining to reach 75%.`;
}

// ── ALERTS ──
function showAlert(id,msg,type='error'){ const el=document.getElementById(id); if(!el)return; el.textContent=msg; el.className='alert-box '+type+' show'; }
function hideAlert(id){ const el=document.getElementById(id); if(el) el.className='alert-box'; }

// ── MISC ──
function getGreeting(name){ const h=new Date().getHours(); return (h<12?'Good morning':h<17?'Good afternoon':'Good evening')+', '+name.split(' ')[0]+'! 👋'; }
function getInitials(name){ return (name||'U').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2); }
function chartColors(){ const dark=getTheme()==='dark'; return { grid:dark?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)', text:dark?'#6b7fa8':'#7a8fb5' }; }

// ══════════════════════════════════════════
//   THEME SYSTEM v2 — color + mode picker
// ══════════════════════════════════════════

const THEMES = [
  { id:'default', name:'Ocean',   gradient:'linear-gradient(135deg,#3d8ef8,#6c5ce7)' },
  { id:'glass',   name:'Glass',   gradient:'linear-gradient(135deg,#a78bfa,#ec4899)' },
  { id:'brutal',  name:'Brutal',  gradient:'linear-gradient(135deg,#ffe135,#ff4d6d)' },
  { id:'luxury',  name:'Luxury',  gradient:'linear-gradient(135deg,#d4af37,#f5d06a)' },
  { id:'minimal', name:'Sage',    gradient:'linear-gradient(135deg,#5a9e4f,#3d7a8a)' },
  { id:'cyber',   name:'Cyber',   gradient:'linear-gradient(135deg,#00ffff,#ff00ff)' },
];

function getColorTheme() { return localStorage.getItem('ae_color') || 'default'; }
function getMode()       { return localStorage.getItem('ae_theme') || 'dark'; }

function applyFullTheme() {
  const mode  = getMode();
  const color = getColorTheme();
  const html  = document.documentElement;
  html.setAttribute('data-theme', mode);
  if (color === 'default') {
    html.removeAttribute('data-color');
  } else {
    html.setAttribute('data-color', color);
  }
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = mode === 'dark' ? '🎨' : '🎨';
  if (typeof onThemeChange === 'function') onThemeChange();
}

// override old applyTheme
function applyTheme() { applyFullTheme(); }
function toggleTheme() {
  const t = getMode() === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ae_theme', t);
  applyFullTheme();
}

function buildThemePanel() {
  if (document.getElementById('themePanelOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'themePanelOverlay';
  overlay.className = 'theme-panel-overlay';
  overlay.innerHTML = `
    <div class="theme-panel">
      <h3>🎨 Appearance</h3>
      <div class="theme-section-label">Mode</div>
      <div class="mode-toggle">
        <button class="mode-btn ${getMode()==='dark'?'active':''}" id="modeDark" onclick="setMode('dark')">🌙 Dark</button>
        <button class="mode-btn ${getMode()==='light'?'active':''}" id="modeLight" onclick="setMode('light')">☀️ Light</button>
      </div>
      <div class="theme-section-label">Color Theme</div>
      <div class="color-swatches" id="colorSwatches"></div>
      <button class="theme-panel-close" onclick="closeThemePanel()">Done</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target===overlay) closeThemePanel(); });
  renderSwatches();
}

function renderSwatches() {
  const wrap = document.getElementById('colorSwatches');
  if (!wrap) return;
  const cur = getColorTheme();
  wrap.innerHTML = THEMES.map(t => `
    <div class="swatch ${t.id===cur?'active':''}" onclick="setColorTheme('${t.id}')">
      <div class="swatch-dot" style="background:${t.gradient}"></div>
      <div class="swatch-name">${t.name}</div>
    </div>
  `).join('');
}

function setMode(m) {
  localStorage.setItem('ae_theme', m);
  applyFullTheme();
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(m==='dark'?'modeDark':'modeLight');
  if (btn) btn.classList.add('active');
}

function setColorTheme(id) {
  localStorage.setItem('ae_color', id);
  applyFullTheme();
  renderSwatches();
}

function openThemePanel()  { buildThemePanel(); document.getElementById('themePanelOverlay').classList.add('open'); }
function closeThemePanel() { const o=document.getElementById('themePanelOverlay'); if(o) o.classList.remove('open'); }
// ═══════════════════════════════════
//   ATTENDEASE — theme.js
//   Multi-color theme system
// ═══════════════════════════════════

const THEMES = {
  ocean:    { label:'Ocean',    grad:'linear-gradient(135deg,#3d8ef8,#6c5ce7)' },
  midnight: { label:'Midnight', grad:'linear-gradient(135deg,#a855f7,#ec4899)' },
  ember:    { label:'Ember',    grad:'linear-gradient(135deg,#f97316,#ef4444)' },
  sage:     { label:'Sage',     grad:'linear-gradient(135deg,#22c55e,#06b6d4)' },
  cyber:    { label:'Cyber',    grad:'linear-gradient(135deg,#eab308,#84cc16)' },
  blossom:  { label:'Blossom',  grad:'linear-gradient(135deg,#f472b6,#c084fc)' },
};

function getSavedMode()  { return localStorage.getItem('ae_theme') || 'dark'; }
function getSavedColor() { return localStorage.getItem('ae_color') || 'ocean'; }

function applyTheme() {
  const mode  = getSavedMode();
  const color = getSavedColor();
  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.setAttribute('data-color', color);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = mode === 'dark' ? '🎨' : '🎨';
}

function toggleTheme() {
  // Now opens the theme panel instead of just toggling dark/light
  openThemePanel();
}

function openThemePanel() {
  // Build panel if not exists
  if (!document.getElementById('themePanelOverlay')) buildThemePanel();
  document.getElementById('themePanelOverlay').classList.add('open');
  updatePanelUI();
}

function closeThemePanel() {
  const overlay = document.getElementById('themePanelOverlay');
  if (overlay) overlay.classList.remove('open');
}

function buildThemePanel() {
  const overlay = document.createElement('div');
  overlay.className = 'theme-panel-overlay';
  overlay.id = 'themePanelOverlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) closeThemePanel(); });

  overlay.innerHTML = `
    <div class="theme-panel">
      <div class="theme-panel-title">🎨 Appearance</div>

      <div class="tp-section-label">Mode</div>
      <div class="mode-toggle">
        <button class="mode-btn" id="modeDark"  onclick="setMode('dark')">🌙 Dark</button>
        <button class="mode-btn" id="modeLight" onclick="setMode('light')">☀️ Light</button>
      </div>

      <div class="tp-section-label">Color Theme</div>
      <div class="color-grid">
        ${Object.entries(THEMES).map(([key, t]) => `
          <div class="color-swatch" id="swatch-${key}"
               style="background:${t.grad}"
               onclick="setColor('${key}')">
            <span class="color-swatch-label">${t.label}</span>
          </div>
        `).join('')}
      </div>

      <button class="theme-done-btn" onclick="closeThemePanel()">Done ✓</button>
    </div>`;

  document.body.appendChild(overlay);
}

function updatePanelUI() {
  const mode  = getSavedMode();
  const color = getSavedColor();

  const darkBtn  = document.getElementById('modeDark');
  const lightBtn = document.getElementById('modeLight');
  if (darkBtn)  darkBtn.classList.toggle('active',  mode === 'dark');
  if (lightBtn) lightBtn.classList.toggle('active', mode === 'light');

  Object.keys(THEMES).forEach(key => {
    const sw = document.getElementById('swatch-' + key);
    if (sw) sw.classList.toggle('active', key === color);
  });
}

function setMode(mode) {
  localStorage.setItem('ae_theme', mode);
  applyTheme();
  updatePanelUI();
  if (typeof onThemeChange === 'function') onThemeChange();
}

function setColor(color) {
  localStorage.setItem('ae_color', color);
  applyTheme();
  updatePanelUI();
  if (typeof onThemeChange === 'function') onThemeChange();
}
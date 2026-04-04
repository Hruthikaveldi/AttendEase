const THEMES = {
  ocean:    { label:'🌊 Ocean',    grad:'linear-gradient(135deg,#3d8ef8,#6c5ce7)' },
  midnight: { label:'🌙 Midnight', grad:'linear-gradient(135deg,#a855f7,#ec4899)' },
  ember:    { label:'🔥 Ember',    grad:'linear-gradient(135deg,#f97316,#ef4444)' },
  sage:     { label:'🌿 Sage',     grad:'linear-gradient(135deg,#22c55e,#06b6d4)' },
  cyber:    { label:'⚡ Cyber',    grad:'linear-gradient(135deg,#eab308,#84cc16)' },
  blossom:  { label:'🌸 Blossom',  grad:'linear-gradient(135deg,#f472b6,#c084fc)' },
};

function getSavedMode()  { return localStorage.getItem('ae_theme') || 'dark'; }
function getSavedColor() { return localStorage.getItem('ae_color') || 'ocean'; }

function applyTheme() {
  const mode  = getSavedMode();
  const color = getSavedColor();
  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.setAttribute('data-color', color);
}

function toggleTheme() { openThemePanel(); }

function openThemePanel() {
  if (!document.getElementById('themePanelOverlay')) buildThemePanel();
  document.getElementById('themePanelOverlay').classList.add('open');
  updatePanelUI();
}

function closeThemePanel() {
  document.getElementById('themePanelOverlay')?.classList.remove('open');
}

function buildThemePanel() {
  const overlay = document.createElement('div');
  overlay.id = 'themePanelOverlay';
  overlay.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.6);
    backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;`;
  overlay.addEventListener('click', e => { if(e.target===overlay) closeThemePanel(); });

  overlay.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:24px;
      padding:28px;width:100%;max-width:320px;box-shadow:var(--shadow);animation:fadeUp .3s ease;">
      <div style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;
        margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
        🎨 Appearance
        <button onclick="closeThemePanel()" style="background:var(--surface);border:1px solid
          var(--border);border-radius:8px;padding:4px 10px;color:var(--muted);cursor:pointer;
          font-size:13px;">✕</button>
      </div>

      <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
        color:var(--muted);margin-bottom:8px;">Mode</div>
      <div style="display:flex;background:var(--surface);border:1px solid var(--border);
        border-radius:12px;padding:3px;gap:3px;margin-bottom:20px;">
        <button id="modeDark" onclick="setMode('dark')" style="flex:1;padding:8px;border:none;
          border-radius:9px;cursor:pointer;font-family:'Syne',sans-serif;font-size:.82rem;
          font-weight:700;transition:all .2s;">🌙 Dark</button>
        <button id="modeLight" onclick="setMode('light')" style="flex:1;padding:8px;border:none;
          border-radius:9px;cursor:pointer;font-family:'Syne',sans-serif;font-size:.82rem;
          font-weight:700;transition:all .2s;">☀️ Light</button>
      </div>

      <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
        color:var(--muted);margin-bottom:10px;">Color Theme</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px;">
        ${Object.entries(THEMES).map(([key,t]) => `
          <div id="sw-${key}" onclick="setColor('${key}')" style="height:70px;border-radius:14px;
            background:${t.grad};cursor:pointer;border:3px solid transparent;
            display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;
            transition:transform .2s,border-color .2s;font-family:'Syne',sans-serif;
            font-size:10px;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.5);"
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'">
            ${t.label}
          </div>`).join('')}
      </div>

      <button onclick="closeThemePanel()" style="width:100%;padding:12px;border-radius:12px;
        background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;
        font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;">
        Done ✓
      </button>
    </div>`;
  document.body.appendChild(overlay);
}

function updatePanelUI() {
  const mode  = getSavedMode();
  const color = getSavedColor();
  const grad  = `linear-gradient(135deg,var(--accent),var(--accent2))`;
  const plain = `var(--surface)`;
  const activeStyle = `background:${grad};color:#fff;`;
  const inactiveStyle = `background:${plain};color:var(--muted);`;

  const d = document.getElementById('modeDark');
  const l = document.getElementById('modeLight');
  if(d) d.style.cssText += mode==='dark' ? activeStyle : inactiveStyle;
  if(l) l.style.cssText += mode==='light' ? activeStyle : inactiveStyle;

  Object.keys(THEMES).forEach(key => {
    const sw = document.getElementById('sw-'+key);
    if(sw) sw.style.borderColor = key===color ? '#fff' : 'transparent';
  });
}

function setMode(mode) {
  localStorage.setItem('ae_theme', mode);
  applyTheme();
  updatePanelUI();
  if(typeof onThemeChange==='function') onThemeChange();
}

function setColor(color) {
  localStorage.setItem('ae_color', color);
  applyTheme();
  updatePanelUI();
  if(typeof onThemeChange==='function') onThemeChange();
}
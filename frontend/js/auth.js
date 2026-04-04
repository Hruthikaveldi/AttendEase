// ═══════════════════════════════════
//   ATTENDEASE — auth.js
// ═══════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
  applyTheme();
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // Already logged in → go to dashboard
  if (getToken() && getCurrentUser()) {
    window.location.href = 'dashboard.html'; return;
  }

  // ── TAB SWITCHING ──
  window.switchTab = function(tab) {
    document.getElementById('loginForm').style.display    = tab==='login'    ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab==='register' ? 'block' : 'none';
    document.getElementById('tabLogin').classList.toggle('active',    tab==='login');
    document.getElementById('tabRegister').classList.toggle('active', tab==='register');
    hideAlert('authAlert');
  };

  // ── LOGIN ──
  window.doLogin = async function() {
    hideAlert('authAlert');
    const email    = (document.getElementById('loginEmail').value || '').trim().toLowerCase();
    const password = (document.getElementById('loginPass').value  || '');

    if (!email)    { showAlert('authAlert','⚠️ Please enter your email.'); return; }
    if (!password) { showAlert('authAlert','⚠️ Please enter your password.'); return; }

    const btn = document.getElementById('loginBtn');
    btn.textContent = '⏳ Logging in...'; btn.disabled = true;

    try {
      await apiLogin(email, password);
      btn.textContent = '✅ Success!';
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 300);
    } catch(err) {
      showAlert('authAlert', '❌ ' + (err.message || 'Login failed. Check your credentials.'));
      btn.textContent = 'Login →'; btn.disabled = false;
    }
  };

  // ── REGISTER ──
  window.doRegister = async function() {
    hideAlert('authAlert');
    const name     = (document.getElementById('regName').value   || '').trim();
    const email    = (document.getElementById('regEmail').value  || '').trim().toLowerCase();
    const password = (document.getElementById('regPass').value   || '');
    const pass2    = (document.getElementById('regPass2').value  || '');

    // Validate fields
    if (!name)                          { showAlert('authAlert','⚠️ Please enter your full name.'); return; }
    if (!email || !email.includes('@')) { showAlert('authAlert','⚠️ Please enter a valid email.'); return; }
    if (password.length < 6)            { showAlert('authAlert','⚠️ Password must be at least 6 characters.'); return; }
    if (password !== pass2)             { showAlert('authAlert','⚠️ Passwords do not match.'); return; }

    // Validate captcha
    const captchaResponse = grecaptcha.getResponse();
    if (!captchaResponse) {
      showAlert('authAlert', '⚠️ Please complete the CAPTCHA verification.');
      return;
    }

    const btn = document.getElementById('registerBtn');
    btn.textContent = '⏳ Creating account...'; btn.disabled = true;

    try {
      await apiRegister(name, email, password);
      btn.textContent = '✅ Account created!';
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 300);
    } catch(err) {
      showAlert('authAlert', '❌ ' + (err.message || 'Registration failed.'));
      btn.textContent = 'Create Account →'; btn.disabled = false;
      grecaptcha.reset();
    }
  };

  // ── ENTER KEY SUPPORT ──
  document.getElementById('loginPass').addEventListener('keydown',  e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('regPass2').addEventListener('keydown',   e => { if(e.key==='Enter') doRegister(); });
  document.getElementById('loginEmail').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('loginPass').focus(); });
});
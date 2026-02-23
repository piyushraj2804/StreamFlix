/* ══════════════════════════════════════════════
   StreamFlix — auth.js
   Login / Signup logic with validation
   ══════════════════════════════════════════════ */

'use strict';

/* ── Theme (persisted) ── */
(function initTheme() {
  const saved = localStorage.getItem('sf_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '🌙' : '☀️';
})();

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('sf_theme', next);
  document.getElementById('themeToggle').textContent = next === 'dark' ? '🌙' : '☀️';
});

/* ── Toggle forms ── */
document.getElementById('goSignup')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('signinForm').classList.add('hidden');
  document.getElementById('signupForm').classList.remove('hidden');
});
document.getElementById('goSignin')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('signinForm').classList.remove('hidden');
});

/* ── Show/Hide password ── */
document.querySelectorAll('.show-pass-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Hide' : 'Show';
  });
});

/* ── Validation helpers ── */
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErrors(...ids) {
  ids.forEach(id => setError(id, ''));
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Password strength ── */
const suPass = document.getElementById('suPassword');
suPass?.addEventListener('input', () => {
  const val = suPass.value;
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { pct: '0%',   color: 'transparent', text: '' },
    { pct: '25%',  color: '#e50914',     text: 'Weak' },
    { pct: '50%',  color: '#ff9800',     text: 'Fair' },
    { pct: '75%',  color: '#4fc3f7',     text: 'Good' },
    { pct: '100%', color: '#46d369',     text: 'Strong' },
  ];
  const lvl = levels[Math.min(score, 4)];
  if (fill)  { fill.style.width = lvl.pct; fill.style.background = lvl.color; }
  if (label) { label.textContent = lvl.text; label.style.color = lvl.color; }
});

/* ── Sign In ── */
document.getElementById('signinBtn')?.addEventListener('click', () => {
  const email    = document.getElementById('siEmail').value.trim();
  const password = document.getElementById('siPassword').value;
  clearErrors('siEmailErr', 'siPassErr');
  let valid = true;

  if (!email) {
    setError('siEmailErr', 'Please enter your email.'); valid = false;
  } else if (!validateEmail(email)) {
    setError('siEmailErr', 'Please enter a valid email.'); valid = false;
  }
  if (!password) {
    setError('siPassErr', 'Please enter your password.'); valid = false;
  } else if (password.length < 6) {
    setError('siPassErr', 'Password must be at least 6 characters.'); valid = false;
  }

  if (!valid) return;

  // Check stored user
  const stored = JSON.parse(localStorage.getItem('sf_user') || 'null');
  if (stored && stored.email === email && stored.password === password) {
    loginUser(stored);
  } else {
    // Demo: accept any valid credentials and create a session
    loginUser({ email, name: email.split('@')[0] });
  }
});

/* ── Guest ── */
document.getElementById('guestBtn')?.addEventListener('click', () => {
  loginUser({ email: 'guest@streamflix.com', name: 'Guest' });
});

/* ── Sign Up ── */
document.getElementById('signupBtn')?.addEventListener('click', () => {
  const name     = document.getElementById('suName').value.trim();
  const email    = document.getElementById('suEmail').value.trim();
  const password = document.getElementById('suPassword').value;
  const confirm  = document.getElementById('suConfirm').value;
  clearErrors('suNameErr', 'suEmailErr', 'suPassErr', 'suConfErr');
  let valid = true;

  if (!name) {
    setError('suNameErr', 'Please enter your name.'); valid = false;
  }
  if (!email) {
    setError('suEmailErr', 'Please enter your email.'); valid = false;
  } else if (!validateEmail(email)) {
    setError('suEmailErr', 'Please enter a valid email address.'); valid = false;
  }
  if (!password) {
    setError('suPassErr', 'Please enter a password.'); valid = false;
  } else if (password.length < 6) {
    setError('suPassErr', 'Password must be at least 6 characters.'); valid = false;
  }
  if (password !== confirm) {
    setError('suConfErr', 'Passwords do not match.'); valid = false;
  }

  if (!valid) return;

  const user = { name, email, password };
  localStorage.setItem('sf_user', JSON.stringify(user));
  loginUser(user);
});

function loginUser(user) {
  localStorage.setItem('sf_session', JSON.stringify({ name: user.name, email: user.email, ts: Date.now() }));
  window.location.href = 'index.html';
}

/* ── Enter key submit ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const signupVisible = !document.getElementById('signupForm').classList.contains('hidden');
    if (signupVisible) {
      document.getElementById('signupBtn')?.click();
    } else {
      document.getElementById('signinBtn')?.click();
    }
  }
});
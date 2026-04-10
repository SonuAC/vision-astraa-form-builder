/* ══════════════════════════════════════════════════════════════
   VisionAstraa EV Academy — Form Logic & Conditional Routing
   ══════════════════════════════════════════════════════════════ */

// ── STATE ──────────────────────────────────────────────────────
const formData = {
  interested: '',
  name:       '',
  email:      '',
  phone:      '',
  education:  '',
  stream:     '',
  interests:  [],
  skills:     [],
  role:       ''
};

// Total visual steps (for progress calc). 0 = welcome, not counted.
// YES path: steps 1-9 = 9 steps. Step 0 is landing.
const TOTAL_YES_STEPS = 9;
let currentStep = 0;

// ── NAVIGATION ─────────────────────────────────────────────────
function goTo(stepNum) {
  const current = document.querySelector('.step.active');
  if (current) current.classList.remove('active');

  const next = document.getElementById('step-' + stepNum);
  if (next) {
    next.classList.add('active');
    currentStep = stepNum;
    updateProgress(stepNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function updateProgress(step) {
  const bar   = document.getElementById('progressBar');
  const label = document.getElementById('progressLabel');

  // Map step → % complete
  const map = { 0:0, 1:10, 2:22, 3:35, 4:48, 5:60, 6:72, 7:82, 8:91, 9:100, 10:100, 11:100 };
  const pct = map[step] ?? 0;
  bar.style.width   = pct + '%';
  label.textContent = pct + '%';
}

// ── INTEREST SELECTION (STEP 1 CONDITIONAL LOGIC) ──────────────
function selectInterest(value) {
  formData.interested = value;

  // Visual selection
  document.getElementById('card-yes').classList.remove('selected');
  document.getElementById('card-no').classList.remove('selected', 'selected-no');

  if (value === 'Yes') {
    document.getElementById('card-yes').classList.add('selected');
    // Slight delay → feels intentional, not instant
    setTimeout(() => goTo(2), 380);
  } else {
    document.getElementById('card-no').classList.add('selected-no');
    // NOT interested → skip to confirmation step then submit
    setTimeout(() => submitNoResponse(), 420);
  }
}

// ── SUBMIT "NO" IMMEDIATELY ─────────────────────────────────────
function submitNoResponse() {
  sendToServer({ interested: 'No' }, function() {
    goTo(11);
  });
}

// ── OPTION LISTS (SINGLE SELECT) ───────────────────────────────
function selectOption(field, value, el) {
  formData[field] = value;

  // Clear siblings
  const list = el.parentElement;
  list.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');

  // Hide error if shown
  const errEl = document.getElementById('err-' + field);
  if (errEl) errEl.classList.remove('show');
}

// ── CHECKBOX CARDS (MULTI-SELECT) ──────────────────────────────
function initCheckboxCards() {
  document.querySelectorAll('.checkbox-card').forEach(card => {
    card.addEventListener('click', () => {
      const inp = card.querySelector('input[type=checkbox]');
      inp.checked = !inp.checked;
      card.classList.toggle('checked', inp.checked);
    });
  });
}

function getCheckedValues(gridId) {
  const grid   = document.getElementById(gridId);
  const checks = grid.querySelectorAll('input[type=checkbox]:checked');
  return Array.from(checks).map(c => c.value);
}

// ── STEP VALIDATION & NEXT ─────────────────────────────────────
function nextStep(stepNum) {
  if (!validate(stepNum)) return;
  collectData(stepNum);

  if (stepNum === 8) {
    buildReview();
    goTo(9);
  } else {
    goTo(stepNum + 1);
  }
}

function validate(step) {
  let ok = true;

  if (step === 2) {
    const v = document.getElementById('inp-name').value.trim();
    if (v.length < 2) { showErr('name'); ok = false; }
    else hideErr('name');
  }

  if (step === 3) {
    const email = document.getElementById('inp-email').value.trim();
    const phone = document.getElementById('inp-phone').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = /^[\d\s+\-()]{7,15}$/.test(phone);
    if (!emailOk) { showErr('email'); ok = false; } else hideErr('email');
    if (!phoneOk) { showErr('phone'); ok = false; } else hideErr('phone');
  }

  if (step === 4) {
    if (!formData.education) { showErr('education'); ok = false; }
    else hideErr('education');
  }

  if (step === 5) {
    if (!formData.stream) { showErr('stream'); ok = false; }
    else hideErr('stream');
  }

  if (step === 6) {
    const vals = getCheckedValues('interestGrid');
    if (vals.length === 0) { showErr('interests'); ok = false; }
    else hideErr('interests');
  }

  if (step === 7) {
    const vals = getCheckedValues('skillGrid');
    if (vals.length === 0) { showErr('skills'); ok = false; }
    else hideErr('skills');
  }

  if (step === 8) {
    if (!formData.role) { showErr('role'); ok = false; }
    else hideErr('role');
  }

  return ok;
}

function collectData(step) {
  if (step === 2) formData.name  = document.getElementById('inp-name').value.trim();
  if (step === 3) {
    formData.email = document.getElementById('inp-email').value.trim();
    formData.phone = document.getElementById('inp-phone').value.trim();
  }
  if (step === 6) formData.interests = getCheckedValues('interestGrid');
  if (step === 7) formData.skills    = getCheckedValues('skillGrid');
}

function showErr(field) {
  const el = document.getElementById('err-' + field);
  if (el) el.classList.add('show');
}
function hideErr(field) {
  const el = document.getElementById('err-' + field);
  if (el) el.classList.remove('show');
}

// ── REVIEW BOX ─────────────────────────────────────────────────
function buildReview() {
  const box = document.getElementById('reviewBox');

  function row(key, val) {
    let display = val;
    if (Array.isArray(val)) {
      display = val.map(v => `<span class="review-badge">${v}</span>`).join('');
    }
    return `<div class="review-row">
      <div class="review-key">${key}</div>
      <div class="review-val">${display || '—'}</div>
    </div>`;
  }

  box.innerHTML =
    row('Name',       formData.name)   +
    row('Email',      formData.email)  +
    row('Phone',      formData.phone)  +
    row('Education',  formData.education) +
    row('Stream',     formData.stream) +
    row('Interests',  formData.interests) +
    row('Skills',     formData.skills) +
    row('Role',       formData.role);
}

// ── FINAL SUBMIT ────────────────────────────────────────────────
function submitForm() {
  sendToServer(formData, function() {
    goTo(10);
  });
}

// ── SEND TO SERVER ──────────────────────────────────────────────
function sendToServer(payload, onSuccess) {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.add('show');

  fetch('/submit', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(data => {
    overlay.classList.remove('show');
    if (data.success) {
      onSuccess();
    } else {
      alert('Something went wrong: ' + data.message);
    }
  })
  .catch(err => {
    overlay.classList.remove('show');
    console.error(err);
    alert('Network error. Please try again.');
  });
}

// ── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCheckboxCards();
  updateProgress(0);

  // Allow Enter key to advance on text inputs
  document.querySelectorAll('.form-input').forEach(inp => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const step = parseInt(inp.closest('.step').dataset.step);
        nextStep(step);
      }
    });
  });
});
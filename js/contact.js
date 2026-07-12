(function () {

  /* ─── SCROLL FADE-UP (cards) ─────────────────────────── */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fadeEls = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  }

  /* ─── TIMING ROWS STAGGER ────────────────────────────── */
  const timingRows = document.querySelectorAll('.timing-row');
  const timingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timingRows.forEach((row, i) => {
          setTimeout(() => row.classList.add('visible'), i * 100);
        });
        timingObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  if (timingRows.length) timingObserver.observe(timingRows[0].closest('.timings-card'));

  /* ─── WHATSAPP INTEGRATION ───────────────────────────── */
  const WHATSAPP_NUMBER = '917416709883'; // +91 74167 09883, country code prepended, no spaces/symbols

  function sendToWhatsApp() {
    const parentName      = document.getElementById('parentName').value.trim();
    const mobileNumber    = document.getElementById('mobileNumber').value.trim();
    const emailAddress    = document.getElementById('emailAddress').value.trim();
    const childName       = document.getElementById('childName').value.trim();
    const classInterested = document.getElementById('classInterested').value.trim();
    const admissionYear   = document.getElementById('admissionYear').value.trim();
    const message          = document.getElementById('message').value.trim();

    const lines = [
      'New Admission Enquiry - Chaitanya Bharath School',
      '',
      `Parent/Guardian: ${parentName}`,
      `Mobile: ${mobileNumber}`,
    ];
    if (emailAddress) lines.push(`Email: ${emailAddress}`);
    lines.push(
      `Child's Name: ${childName}`,
      `Class Interested: ${classInterested}`,
      `Admission Year: ${admissionYear}`
    );
    if (message) lines.push(`Message: ${message}`);

    const text = encodeURIComponent(lines.join('\n'));
    const url  = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank');
  }

  /* ─── FORM VALIDATION ────────────────────────────────── */
  const form        = document.getElementById('enquiryForm');
  const fieldsWrap  = document.getElementById('formFieldsWrap');
  const successBox  = document.getElementById('successMessage');
  const resetBtn    = document.getElementById('resetFormBtn');

  const rules = [
    { id: 'parentName',      required: true,  validate: v => v.trim().length > 0 },
    { id: 'mobileNumber',    required: true,  validate: v => /^(91)?[6-9]\d{9}$/.test(v.replace(/\D/g,'')) },
    { id: 'emailAddress',    required: false, validate: v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    { id: 'childName',       required: true,  validate: v => v.trim().length > 0 },
    { id: 'classInterested', required: true,  validate: v => v !== '' },
    { id: 'message',         required: false, validate: v => true },
  ];

  function setFieldState(id, valid) {
    const el  = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    el.classList.toggle('is-invalid', !valid);
    el.toggleAttribute('aria-invalid', !valid);
    if (err) err.style.display = valid ? 'none' : 'block';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true, firstBad = null;

    rules.forEach(rule => {
      const el   = document.getElementById(rule.id);
      const pass = rule.validate(el.value);
      setFieldState(rule.id, pass);
      if (!pass && !firstBad) { ok = false; firstBad = el; }
    });

    if (!ok) { firstBad.focus(); return; }

    sendToWhatsApp();

    fieldsWrap.classList.add('collapsing');
    setTimeout(() => {
      fieldsWrap.style.display = 'none';
      fieldsWrap.classList.remove('collapsing');
      successBox.classList.add('show');
      successBox.focus();
    }, 300);
  });

  // Live validation — clear error as user fixes a field
  rules.forEach(rule => {
    const el  = document.getElementById(rule.id);
    const evt = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, () => {
      if (el.classList.contains('is-invalid') && rule.validate(el.value)) {
        setFieldState(rule.id, true);
      }
    });
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    rules.forEach(r => setFieldState(r.id, true));
    successBox.classList.remove('show');
    fieldsWrap.style.display = 'block';
  });

})();
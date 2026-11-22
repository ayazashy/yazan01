const COPY = {
  en: {
    langToggle: 'عربي',
    location: 'RIYADH · KSA',
    name: 'Yazan Ashy',
    role: 'Software Engineering <span class="serif-amp">&amp;</span> AI Systems',
    indexLabel: 'INDEX · <span dir="ltr">01-06</span>',
    kickerRight: 'KEY FIGURES',
    m1: 'Olympiad Training Hours',
    m2: 'Community Members',
    m3: 'Educational Reach',
    m4: 'National Standings',
    m5: 'National Medals',
    m6: 'Shipped Systems',
    copy: 'Copy',
    copied: 'Copied',
    footerCity: 'Riyadh, Saudi Arabia',
  },
  ar: {
    langToggle: 'EN',
    location: 'الرياض · السعودية',
    name: 'يزن آشي',
    role: 'هندسة البرمجيات <span class="serif-amp">·</span> أنظمة الذكاء الاصطناعي',
    indexLabel: 'المؤشرات · <span dir="ltr">01-06</span>',
    kickerRight: 'أبرز الأرقام',
    m1: 'ساعة تدريب أولمبي',
    m2: 'عضو ومستفيد',
    m3: 'مشاهدة ووصول تعليمي',
    m4: 'المركز الأول وطنياً',
    m5: 'ميداليات ذهبية وفضية',
    m6: 'نظاماً ومنصة منشورة',
    copy: 'نسخ',
    copied: 'تم النسخ',
    footerCity: 'الرياض، المملكة العربية السعودية',
  },
};

const html = document.documentElement;
const langBtn = document.getElementById('lang-toggle');
const langLabel = document.getElementById('lang-label');
const copyBtn = document.getElementById('copy-email');
const copyState = document.getElementById('copy-state');
const toneBtns = Array.from(document.querySelectorAll('[data-set-tone]'));

function getInitialLang() {
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param === 'ar' || param === 'en') return param;
  const saved = localStorage.getItem('yazan01_lang');
  return saved === 'ar' ? 'ar' : 'en';
}

function getInitialTone() {
  const saved = localStorage.getItem('yazan01_tone');
  return saved === 'amber' || saved === 'mono' ? saved : 'cyan';
}

let currentLang = getInitialLang();
let currentTone = getInitialTone();

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('yazan01_lang', lang);
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const dict = COPY[lang];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key || !(key in dict)) return;
    if (key === 'role' || key === 'indexLabel') {
      el.innerHTML = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });

  if (langLabel) langLabel.textContent = dict.langToggle;
}

function applyTone(tone) {
  currentTone = tone;
  localStorage.setItem('yazan01_tone', tone);
  html.setAttribute('data-tone', tone);
  toneBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-set-tone') === tone);
  });
}

function animateNumbers() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const cards = Array.from(document.querySelectorAll('.metric-card'));
  const duration = 900;

  if (reduced) return;

  const start = performance.now();
  const formatNum = (n) => Math.round(n).toLocaleString('en-US');

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    cards.forEach((card) => {
      const target = Number(card.getAttribute('data-count-to') || '0');
      const prefix = card.getAttribute('data-prefix') || '';
      const suffix = card.getAttribute('data-suffix') || '';
      const valueEl = card.querySelector('[data-value-el]');
      if (!valueEl) return;

      const val = target <= 4 ? Math.max(1, Math.round(eased * target)) : target * eased;
      valueEl.textContent = `${prefix}${formatNum(val)}${suffix}`;
    });

    if (t < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

if (window.matchMedia?.('(pointer: fine)').matches) {
  let targetX = 50;
  let targetY = 30;
  let curX = 50;
  let curY = 30;

  window.addEventListener(
    'pointermove',
    (e) => {
      targetX = (e.clientX / Math.max(window.innerWidth, 1)) * 100;
      targetY = (e.clientY / Math.max(window.innerHeight, 1)) * 100;
    },
    { passive: true }
  );

  const drift = () => {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    html.style.setProperty('--mx', `${curX.toFixed(2)}%`);
    html.style.setProperty('--my', `${curY.toFixed(2)}%`);
    requestAnimationFrame(drift);
  };
  requestAnimationFrame(drift);
}

langBtn?.addEventListener('click', () => {
  applyLang(currentLang === 'en' ? 'ar' : 'en');
});

toneBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const nextTone = btn.getAttribute('data-set-tone');
    if (nextTone) applyTone(nextTone);
  });
});

copyBtn?.addEventListener('click', async () => {
  const email = 'ayazashy@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    window.location.href = `mailto:${email}`;
  }
  if (copyState) {
    copyState.textContent = COPY[currentLang].copied;
    window.setTimeout(() => {
      copyState.textContent = COPY[currentLang].copy;
    }, 1800);
  }
});

applyTone(currentTone);
applyLang(currentLang);
animateNumbers();

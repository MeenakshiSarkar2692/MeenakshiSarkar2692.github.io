// ── Scroll progress bar ──
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
}

// ── Cursor spotlight ──
const cursorGlow = document.getElementById('cursor-glow');
let cursorVisible = false;
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  if (!cursorVisible) { cursorGlow.style.opacity = '1'; cursorVisible = true; }
});
document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; cursorVisible = false; });

// ── Particle canvas ──
(function() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  function createParticles() {
    particles = [];
    const count = Math.floor(canvas.width * canvas.height / 10000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.1
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${p.o})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    }
    requestAnimationFrame(draw);
  }
  const ro = new ResizeObserver(() => { resize(); createParticles(); });
  ro.observe(canvas.parentElement);
  resize(); createParticles(); draw();
})();

// ── Intersection Observer for scroll animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Staggered children animation ──
document.querySelectorAll('.skills-grid, .projects-grid, .edu-grid, .achievements-grid').forEach(grid => {
  grid.querySelectorAll(':scope > *').forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.08}s`;
    child.classList.add('fade-in');
    observer.observe(child);
  });
});

// ── Animated stat counters ──
const statEls = document.querySelectorAll('.stat-num[data-count]');
let countersDone = false;
const statsObserver = new IntersectionObserver(entries => {
  if (countersDone || !entries.some(e => e.isIntersecting)) return;
  countersDone = true;
  statEls.forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isFloat = target % 1 !== 0;
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target * ease;
      el.textContent = (isFloat ? val.toFixed(2) : Math.floor(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
if (statEls.length) statsObserver.observe(statEls[0].closest('.hero-stats'));

// ── Nav background on scroll ──
const navEl = document.querySelector('nav');
const hireMeBtn = document.getElementById('hire-me-btn');
const backToTop = document.getElementById('back-to-top');
function onScroll() {
  updateProgress();
  const scrolled = window.scrollY;
  navEl.style.background = scrolled > 50 ? 'rgba(15,14,23,0.95)' : 'rgba(15,14,23,0.8)';
  if (scrolled > 500) {
    hireMeBtn.classList.add('visible');
    backToTop.classList.add('visible');
  } else {
    hireMeBtn.classList.remove('visible');
    backToTop.classList.remove('visible');
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Back to top ──
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Typed text effect ──
const texts = ['Cloud Native Developer', 'Full-Stack Engineer', 'SAP Ecosystem Expert', 'GenAI Enthusiast'];
let tIdx = 0, cIdx = 0, deleting = false;
const titleEl = document.querySelector('.hero-title');
const baseHTML = ' &amp; <strong>Full-Stack Engineer</strong> at SAP Labs India';
function typeRole() {
  const current = texts[tIdx];
  if (!deleting) {
    cIdx++;
    if (cIdx >= current.length) { deleting = true; setTimeout(typeRole, 2000); return; }
  } else {
    cIdx--;
    if (cIdx <= 0) { deleting = false; tIdx = (tIdx + 1) % texts.length; }
  }
  titleEl.innerHTML = current.slice(0, cIdx) + '<span style="opacity:0.7">|</span>' + baseHTML;
  setTimeout(typeRole, deleting ? 60 : 100);
}

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
function toggleMenu(open) {
  hamburger.classList.toggle('open', open);
  navLinks.classList.toggle('open', open);
  navOverlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
hamburger.addEventListener('click', () => toggleMenu(!navLinks.classList.contains('open')));
navOverlay.addEventListener('click', () => toggleMenu(false));
document.querySelectorAll('.nav-item-link').forEach(link => link.addEventListener('click', () => toggleMenu(false)));

setTimeout(typeRole, 1500);

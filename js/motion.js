/* =========================================================
   EASYWORK ENTERPRISE — QUIET MOTION CONTROLLER
   UI ONLY. No API/backend dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    '.page-header',
    '.content-panel',
    '.hero-panel',
    '.stats-grid',
    '.metric-card',
    '.preview-card',
    '.process-card',
    '.action-card',
    '.coverage-card',
    '.info-box',
    '.cta-panel',
    '.service-panel',
    '.feature-card'
  ];

  const targets = [...new Set(selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector))))];
  if (!targets.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('motion-visible'));
    return;
  }

  targets.forEach((el, index) => {
    el.classList.add('motion-reveal', 'motion-ready');
    /* Keep staggering subtle and capped so pages never feel slow. */
    const delay = Math.min((index % 4) * 55, 165);
    el.style.setProperty('--motion-delay', `${delay}ms`);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  targets.forEach((el) => observer.observe(el));
});

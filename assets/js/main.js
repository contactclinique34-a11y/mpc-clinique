/* ============================================
   MPC CLINIQUE — JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navigation mobile ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ---- Header scroll effect ---- */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 20
        ? '0 2px 20px rgba(0,0,0,.15)'
        : '0 2px 12px rgba(0,0,0,.08)';
    });
  }

  /* ---- Compteurs animés ---- */
  const counters = document.querySelectorAll('.count-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const step = target / (duration / 16);
      let current = 0;
      const update = () => {
        current = Math.min(current + step, target);
        el.textContent = current >= 1000000
          ? (current / 1000000).toFixed(1) + 'M'
          : Math.floor(current).toLocaleString('fr-FR');
        if (current < target) requestAnimationFrame(update);
        else el.textContent = target >= 1000000
          ? (target / 1000000).toFixed(1) + 'M'
          : target.toLocaleString('fr-FR');
        el.textContent += suffix;
      };
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- Testimonial carousel ---- */
  const track = document.querySelector('.testimonial-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let perView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    let current = 0;
    const maxSlide = Math.ceil(cards.length / perView) - 1;

    // Create dots
    if (dotsContainer) {
      for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxSlide));
      const cardW = cards[0].offsetWidth + 24; // gap = 24px
      track.style.transform = `translateX(-${current * cardW * perView}px)`;
      dotsContainer && dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    document.getElementById('prevBtn') && document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
    document.getElementById('nextBtn') && document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

    window.addEventListener('resize', () => {
      const newPer = window.innerWidth <= 768 ? 1 : window.innerWidth <= 900 ? 2 : 3;
      if (newPer !== perView) { perView = newPer; goTo(0); }
    });

    // Auto-play
    let autoPlay = setInterval(() => goTo(current < maxSlide ? current + 1 : 0), 5000);
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => goTo(current < maxSlide ? current + 1 : 0), 5000);
    });
  }

  /* ---- Video player ---- */
  const videoThumb = document.querySelector('.video-thumbnail');
  if (videoThumb) {
    videoThumb.addEventListener('click', () => {
      const videoId = videoThumb.dataset.videoId;
      const wrapper = videoThumb.closest('.definition-video');
      wrapper.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
          allow="autoplay; fullscreen"
          allowfullscreen
          style="width:100%;height:380px;display:block;border:none;border-radius:16px;"
        ></iframe>`;
    });
  }

  /* ---- Fade-in on scroll ---- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => fadeObs.observe(el));
  }

  /* ---- Contact form validation ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = form.querySelectorAll('[required]');
      let valid = true;
      fields.forEach(f => {
        if (!f.value.trim()) { f.style.borderColor = '#e74c3c'; valid = false; }
        else f.style.borderColor = '';
      });
      if (valid) {
        const btn = form.querySelector('.form-submit');
        btn.textContent = 'Message envoyé ✓';
        btn.style.background = '#009A3A';
        setTimeout(() => {
          btn.textContent = 'Envoyer le message';
          btn.style.background = '';
          form.reset();
        }, 3000);
      }
    });
  }

});

/* ============================================
   MPC CLINIQUE — JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navigation mobile ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ---- Header scroll effect ---- */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Compteurs animés ---- */
  const counters = document.querySelectorAll('.count-up');
  if (counters.length) {
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
          else {
            el.textContent = target >= 1000000
              ? (target / 1000000).toFixed(1) + 'M'
              : target.toLocaleString('fr-FR');
            el.textContent += suffix;
          }
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => observer.observe(c));
  }

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
    let maxSlide = Math.ceil(cards.length / perView) - 1;

    const buildDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      maxSlide = Math.ceil(cards.length / perView) - 1;
      for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    };

    const goTo = (index) => {
      current = Math.max(0, Math.min(index, maxSlide));
      const cardW = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardW * perView}px)`;
      dotsContainer && dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    buildDots();

    document.getElementById('prevBtn')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('nextBtn')?.addEventListener('click', () => goTo(current + 1));

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newPer = window.innerWidth <= 768 ? 1 : window.innerWidth <= 900 ? 2 : 3;
        if (newPer !== perView) { perView = newPer; buildDots(); goTo(0); }
      }, 150);
    }, { passive: true });

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
      videoThumb.innerHTML = `<iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
        allow="autoplay; fullscreen" allowfullscreen
        style="width:100%;height:460px;display:block;border:none;"></iframe>`;
    });
  }

  /* ---- Fade-in on scroll ---- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => fadeObs.observe(el));
  }

  /* ---- Before/After slider ---- */
  const slider = document.getElementById('baSlider');
  if (slider) {
    const before = document.getElementById('baBefore');
    const handle = document.getElementById('baHandle');
    let dragging = false;

    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = Math.min(Math.max((x - rect.left) / rect.width, 0.02), 0.98);
      before.style.width = (pct * 100) + '%';
      handle.style.left = (pct * 100) + '%';
    };

    slider.addEventListener('mousedown', e => {
      e.preventDefault();
      dragging = true;
      document.body.style.userSelect = 'none';
      setPosition(e.clientX);
    });
    slider.addEventListener('touchstart', e => {
      dragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', () => { dragging = false; document.body.style.userSelect = ''; });
    window.addEventListener('touchend', () => dragging = false);
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

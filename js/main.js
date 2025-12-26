// Scroll suave para anchors internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const targetId = anchor.getAttribute('href');
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        const header = document.querySelector('.topbar');
        const offset = (header?.offsetHeight || 0) + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// Carrusel con step exacto (ancho de item + gap) y reanimación de textos
function initCarousel(name) {
  const track = document.querySelector(`[data-carousel-track="${name}"]`);
  const controls = document.querySelector(`[data-carousel="${name}"]`);
  if (!track || !controls) return;

  const prev = controls.querySelector('.prev');
  const next = controls.querySelector('.next');
  const step = () => {
    const first = track.firstElementChild;
    if (!first) return track.clientWidth;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    const itemWidth = first.getBoundingClientRect().width;
    return itemWidth + gap;
  };

  function replayTexts() {
    const cards = track.querySelectorAll('.card');
    cards.forEach(card => {
      card.classList.remove('replay-anim');
      void card.offsetWidth; // reflow
      card.classList.add('replay-anim');
    });
  }

  prev?.addEventListener('click', () => {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
    replayTexts();
  });

  next?.addEventListener('click', () => {
    track.scrollBy({ left: step(), behavior: 'smooth' });
    replayTexts();
  });

  let auto = setInterval(() => {
    track.scrollBy({ left: step(), behavior: 'smooth' });
    replayTexts();
  }, 6000);

  [track, prev, next].forEach(el => {
    el?.addEventListener('mouseenter', () => clearInterval(auto));
    el?.addEventListener('mouseleave', () => {
      auto = setInterval(() => {
        track.scrollBy({ left: step(), behavior: 'smooth' });
        replayTexts();
      }, 6000);
    });
  });
}

['acts', 'team', 'photos'].forEach(initCarousel);

// Intersection observer para animaciones de entrada
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.25 });

document.querySelectorAll('.anim-observe').forEach(el => observer.observe(el));

// Tilt suave en slides de imagen
function initTilt() {
  const slides = document.querySelectorAll('.image-slide');
  slides.forEach(slide => {
    slide.addEventListener('mousemove', (e) => {
      const rect = slide.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      slide.style.setProperty('--tiltX', `${y}deg`);
      slide.style.setProperty('--tiltY', `${x}deg`);
    });
    slide.addEventListener('mouseleave', () => {
      slide.style.removeProperty('--tiltX');
      slide.style.removeProperty('--tiltY');
    });
  });
}

initTilt();

// Burbujas flotantes
function spawnBubbles(container, count = 14) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('span');
    b.className = 'bubble';
    const size = Math.random() * 12 + 8;
    b.style.width = `${size}px`;
    b.style.height = `${size}px`;
    b.style.left = `${Math.random() * 100}%`;
    b.style.animationDuration = `${Math.random() * 10 + 12}s`;
    b.style.animationDelay = `${Math.random() * 6}s`;
    container.appendChild(b);
  }
}

document.querySelectorAll('.floating-bubbles').forEach(el => spawnBubbles(el));

// Parallax suave en hero y media grid
function initParallax(selector, intensity = 10) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * intensity;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * intensity;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate3d(0,0,0)';
  });
}

initParallax('.hero', 12);
initParallax('.media-grid-section', 8);

// Contadores animados en métricas
function animateCounters() {
  const counters = document.querySelectorAll('.metric-number');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count || counter.textContent, 10);
    if (Number.isNaN(target)) return;
    const suffix = counter.dataset.suffix ?? '+';
    const duration = parseInt(counter.dataset.duration || '1400', 10);
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

const metricsSection = document.querySelector('.metrics');
if (metricsSection) {
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        metricsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  metricsObserver.observe(metricsSection);
}

// Reproductor de video en modal centrada
function initVideoModal() {
  const modal = document.querySelector('[data-video-modal]');
  const video = modal?.querySelector('[data-video-player]');
  const caption = modal?.querySelector('[data-video-caption]');
  const closeEls = modal?.querySelectorAll('[data-video-close]');
  const cards = document.querySelectorAll('[data-video-src]');
  if (!modal || !video || cards.length === 0) return;

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    video.pause();
    video.removeAttribute('src');
    video.load();
    modal.classList.remove('open');
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
  }

  function openModal(src, title, poster) {
    if (!src) return;
    modal.removeAttribute('hidden');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (poster) video.poster = poster;
    else video.removeAttribute('poster');
    video.src = src;
    if (caption) caption.textContent = title || '';
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {
      /* El navegador puede bloquear autoplay con audio; el usuario puede pulsar play manualmente */
    });
    const dialog = modal.querySelector('.video-dialog');
    const closeBtn = modal.querySelector('[data-video-close]');
    closeBtn?.focus({ preventScroll: true });
    // Asegura que en mA3vil el modal quede centrado y visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      modal.scrollTop = 0;
      dialog?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      video.focus?.({ preventScroll: true });
    }, 40);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.videoSrc, card.dataset.videoTitle, card.dataset.videoPoster);
    });
  });

  closeEls?.forEach(el => el.addEventListener('click', closeModal));

  modal.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest('[data-video-close]') || target.classList.contains('video-modal')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

initVideoModal();

// Carrusel de logo
function initLogoGallery() {
  const slider = document.querySelector('[data-logo-slider]');
  if (!slider) return;

  const track = slider.querySelector('[data-logo-track]');
  const slides = Array.from(track?.querySelectorAll('[data-logo-slide]') || []);
  const prev = slider.querySelector('[data-logo-prev]');
  const next = slider.querySelector('[data-logo-next]');
  const dotsWrap = slider.querySelector('[data-logo-dots]');
  let current = 0;

  if (!slides.length) return;

  function show(idx) {
    const target = (idx + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === target);
    });
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === target);
      });
    }
    current = target;
  }

  slides.forEach((_, i) => {
    if (!dotsWrap) return;
    const dot = document.createElement('button');
    dot.type = 'button';
    if (i === 0) dot.className = 'is-active';
    dot.addEventListener('click', () => show(i));
    dotsWrap.appendChild(dot);
  });

  prev?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));

  show(0);
}

initLogoGallery();

// Bio slider
(function(){
  var slider = document.querySelector('[data-bio-slider]');
  if (!slider) return;
  var slides = Array.from(slider.querySelectorAll('.bio-slide'));
  var dotsWrap = slider.querySelector('[data-bio-dots]');
  var prevBtn = slider.querySelector('[data-bio-prev]');
  var nextBtn = slider.querySelector('[data-bio-next]');
  if (!slides.length || !dotsWrap) return;

  var current = 0;
  function show(idx){
    slides.forEach(function(s,i){
      s.classList.toggle('is-active', i === idx);
    });
    Array.from(dotsWrap.children).forEach(function(dot,i){ dot.classList.toggle('is-active', i === idx); });
    current = idx;
  }

  slides.forEach(function(_,i){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = i === 0 ? 'is-active' : '';
    btn.addEventListener('click', function(){ show(i); });
    dotsWrap.appendChild(btn);
  });

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function(){
      var next = (current - 1 + slides.length) % slides.length;
      show(next);
    });
    nextBtn.addEventListener('click', function(){
      var next = (current + 1) % slides.length;
      show(next);
    });
  }

  show(0);
})();

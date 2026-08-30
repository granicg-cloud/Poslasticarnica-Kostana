document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    const mq = window.matchMedia('(min-width: 481px)');
    mq.addEventListener('change', (e) => {
      if (e.matches) {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll reveal animation
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Footer year
  const yearEl = document.getElementById('godina');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Lightbox galerije (npr. "Naše torte") — samo prva slika vidljiva, klik otvara sve ostale
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    function showImage(index) {
      currentIndex = (index + currentImages.length) % currentImages.length;
      const item = currentImages[currentIndex];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
    }

    function openLightbox(images, startIndex) {
      currentImages = images;
      showImage(startIndex);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.lightbox-gallery').forEach(gallery => {
      const imgs = [...gallery.querySelectorAll('img')].map(img => ({ src: img.currentSrc || img.src, alt: img.alt }));
      const cover = gallery.querySelector('.gallery-item:first-child');
      if (!cover || imgs.length === 0) return;

      if (imgs.length > 1) {
        const badge = document.createElement('span');
        badge.className = 'gallery-cover-badge';
        badge.textContent = '+' + (imgs.length - 1) + ' fotografija';
        cover.appendChild(badge);
      }

      cover.addEventListener('click', () => openLightbox(imgs, 0));
    });

    btnClose.addEventListener('click', closeLightbox);
    btnNext.addEventListener('click', () => showImage(currentIndex + 1));
    btnPrev.addEventListener('click', () => showImage(currentIndex - 1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    });
  }
});

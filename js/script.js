document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    const loaderText = preloader.querySelector('.loader span');
    const loadingMessage = 'Easywork Enterprise';

    /* Deliberately paced brand type-on effect so the full name is clearly visible. */
    if (loaderText) {
      loaderText.textContent = '';
      loaderText.setAttribute('aria-label', loadingMessage);

      let index = 0;
      const typeNext = () => {
        if (index < loadingMessage.length) {
          loaderText.textContent += loadingMessage.charAt(index);
          index += 1;
          window.setTimeout(typeNext, 85);
        }
      };
      typeNext();
    }

    /* Keep the preloader visible long enough for the complete brand animation. */
    window.setTimeout(() => preloader.classList.add('loaded'), 2400);
    window.setTimeout(() => {
      preloader.style.display = 'none';
      preloader.style.visibility = 'hidden';
      preloader.style.pointerEvents = 'none';
    }, 2900);
  }

  const currentPage = document.body.dataset.page || 'index.html';
  const sideLinks = document.querySelectorAll('.side-nav a');
  sideLinks.forEach((link) => {
    const page = link.getAttribute('data-page');
    if (page === currentPage) {
      link.classList.add('active');
    }
  });

  const docs = document.querySelectorAll('.whatsapp-link');
  docs.forEach((link) => {
    const text = link.dataset.message || 'Hello Easywork Enterprise, I would like to enquire about your services.';
    link.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
});
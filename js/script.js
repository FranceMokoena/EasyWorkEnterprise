document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('loaded'), 200);
    setTimeout(() => {
      preloader.style.display = 'none';
      preloader.style.visibility = 'hidden';
      preloader.style.pointerEvents = 'none';
    }, 600);
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

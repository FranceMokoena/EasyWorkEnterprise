document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.dataset.page || 'index.html';
  const sideLinks = document.querySelectorAll('.side-nav a');

  sideLinks.forEach((link) => {
    const href = link.getAttribute('data-page');
    if (href === currentPage) {
      link.classList.add('active');
    }

    if (!link.querySelector('.nav-label')) {
      const label = document.createElement('span');
      label.className = 'nav-label';
      label.textContent = link.textContent.trim();
      link.textContent = '';
      link.appendChild(label);
    }
  });

  const sidebar = document.querySelector('.sidebar');
  const brandBlock = sidebar ? sidebar.querySelector('.brand-block') : null;

  if (brandBlock && !sidebar.querySelector('.sidebar-toggle')) {
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'sidebar-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle sidebar');
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.innerHTML = '<span></span><span></span><span></span>';

    toggleButton.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 800;

      if (isMobile) {
        const isOpen = sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open', isOpen);
        toggleButton.setAttribute('aria-expanded', String(isOpen));
        return;
      }

      const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
      sidebar.classList.toggle('sidebar-collapsed', isCollapsed);
      toggleButton.setAttribute('aria-expanded', String(!isCollapsed));
    });

    brandBlock.insertBefore(toggleButton, brandBlock.firstChild);
  }








  const brandText = brandBlock ? brandBlock.querySelector('.brand-text') : null;
  if (brandText === null && brandBlock) {
    const textWrap = document.createElement('div');
    textWrap.className = 'brand-text';
    const strong = brandBlock.querySelector('strong');
    const span = brandBlock.querySelector('span');
    if (strong && span) {
      const container = document.createElement('div');
      container.appendChild(strong);
      container.appendChild(span);
      textWrap.appendChild(container);
      brandBlock.appendChild(textWrap);
    }
  }

  const syncSidebarState = () => {
    const isMobile = window.innerWidth <= 800;
    const toggleButton = sidebar ? sidebar.querySelector('.sidebar-toggle') : null;

    if (isMobile) {
      document.body.classList.remove('sidebar-collapsed');
      if (sidebar) {
        sidebar.classList.remove('sidebar-collapsed');
      }
      if (toggleButton) {
        toggleButton.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
      }
      return;
    }

    if (sidebar) {
      sidebar.classList.remove('open');
    }
    document.body.classList.remove('sidebar-open');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', String(!document.body.classList.contains('sidebar-collapsed')));
    }
  };

  window.addEventListener('resize', syncSidebarState);
  syncSidebarState();

  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
  }
});

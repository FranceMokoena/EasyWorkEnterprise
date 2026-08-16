document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const currentPage = body.dataset.page || window.location.pathname.split('/').pop() || 'index.html';
  const sidebar = document.querySelector('.sidebar');
  const sideLinks = document.querySelectorAll('.side-nav a');

  const routes = [
    { href: 'index.html', label: 'Home', icon: '⌂' },
    { href: 'products.html', label: 'Products', icon: '▦' },
    { href: 'services.html', label: 'Services', icon: '▤' },
    { href: 'procurement.html', label: 'Request', icon: '+' },
    { href: 'delivery.html', label: 'Delivery', icon: '▰' },
    { href: 'about.html', label: 'About', icon: 'ⓘ' },
    { href: 'contact.html', label: 'Contact', icon: '✉' }
  ];

  sideLinks.forEach((link) => {
    const href = link.getAttribute('data-page') || link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (sidebar) {
    const brandBlock = sidebar.querySelector('.brand-block');

    if (brandBlock && !brandBlock.querySelector('.sidebar-toggle')) {
      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'sidebar-toggle';
      toggleButton.setAttribute('aria-label', 'Open navigation menu');
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.innerHTML = '<span></span><span></span><span></span>';
      brandBlock.appendChild(toggleButton);

      toggleButton.addEventListener('click', () => {
        const open = sidebar.classList.toggle('open');
        body.classList.toggle('sidebar-open', open);
        toggleButton.setAttribute('aria-expanded', String(open));
        toggleButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      });
    }
  }

  const closeSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    body.classList.remove('sidebar-open');
    const button = sidebar.querySelector('.sidebar-toggle');
    if (button) {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation menu');
    }
  };

  sideLinks.forEach((link) => {
    link.addEventListener('click', closeSidebar);
  });

  const createMobileHeader = () => {
    if (document.querySelector('.mobile-header')) return;

    const header = document.createElement('header');
    header.className = 'mobile-header';
    header.innerHTML = `
      <button class="mobile-header-menu" type="button" aria-label="Open navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <a class="mobile-brand" href="index.html" aria-label="Easywork Enterprise home">
        <img src="assets/logo/logo.svg" alt="" />
        <span><strong>Easywork</strong><small>Enterprise</small></span>
      </a>
      <a class="mobile-header-action" href="procurement.html" aria-label="Request materials"><span>+</span><b>Request</b></a>
    `;

    document.body.insertBefore(header, document.body.firstChild);

    const button = header.querySelector('.mobile-header-menu');
    button.addEventListener('click', () => {
      const open = sidebar ? sidebar.classList.toggle('open') : false;
      body.classList.toggle('sidebar-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      const sidebarButton = sidebar ? sidebar.querySelector('.sidebar-toggle') : null;
      if (sidebarButton) sidebarButton.setAttribute('aria-expanded', String(open));
    });
  };

  const createMobileBottomNav = () => {
    if (document.querySelector('.mobile-bottom-nav')) return;

    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', 'Mobile navigation');

    const primary = [routes[0], routes[1], routes[3], routes[6]];
    nav.innerHTML = primary.map((route) => {
      const active = route.href === currentPage ? ' active' : '';
      return `<a href="${route.href}" class="${active}"${route.href === currentPage ? ' aria-current="page"' : ''}><span class="mobile-nav-icon">${route.icon}</span><span>${route.label}</span></a>`;
    }).join('');

    document.body.appendChild(nav);
  };

  const createSidebarOverlay = () => {
    if (!sidebar || document.querySelector('.sidebar-overlay')) return;

    const overlay = document.createElement('button');
    overlay.type = 'button';
    overlay.className = 'sidebar-overlay';
    overlay.setAttribute('aria-label', 'Close navigation menu');
    overlay.tabIndex = -1;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeSidebar);
  };

  createMobileHeader();
  createMobileBottomNav();
  createSidebarOverlay();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeSidebar();
  });

  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => body.classList.add('nav-ready'));
  } else {
    body.classList.add('nav-ready');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const currentPage = body.dataset.page || window.location.pathname.split('/').pop() || 'index.html';
  const sidebar = document.querySelector('.sidebar');
  const sideLinks = document.querySelectorAll('.side-nav a');

  /* UI-only stylesheet. No API/backend dependencies. */
  const loadUIFixes = () => {
    if (document.querySelector('link[data-easywork-ui-fixes]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/ui-fixes.css';
    link.dataset.easyworkUiFixes = 'true';
    document.head.appendChild(link);
  };

  const loadProductsUI = () => {
    if (currentPage !== 'products.html') return;
    if (document.querySelector('link[data-easywork-products-ui]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/products-revamp.css';
    link.dataset.easyworkProductsUi = 'true';
    document.head.appendChild(link);
  };

  const loadMotionUI = () => {
    if (document.querySelector('link[data-easywork-motion]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/motion.css';
    link.dataset.easyworkMotion = 'true';
    document.head.appendChild(link);
  };

  loadUIFixes();
  loadProductsUI();
  loadMotionUI();

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

  const closeSidebar = () => {
    if (!sidebar) return;

    sidebar.classList.remove('open');
    body.classList.remove('sidebar-open');

    const headerButton = document.querySelector('.mobile-header-menu');
    if (headerButton) {
      headerButton.setAttribute('aria-expanded', 'false');
      headerButton.setAttribute('aria-label', 'Open navigation menu');
    }

    const closeButton = sidebar.querySelector('.mobile-drawer-close');
    if (closeButton) closeButton.setAttribute('aria-label', 'Close navigation menu');
  };

  const openSidebar = () => {
    if (!sidebar || window.innerWidth > 900) return;

    sidebar.classList.add('open');
    body.classList.add('sidebar-open');

    const headerButton = document.querySelector('.mobile-header-menu');
    if (headerButton) {
      headerButton.setAttribute('aria-expanded', 'true');
      headerButton.setAttribute('aria-label', 'Close navigation menu');
    }
  };

  const toggleSidebar = () => {
    if (!sidebar || window.innerWidth > 900) return;
    if (sidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  };

  const createDrawerCloseButton = () => {
    if (!sidebar) return;

    const brandBlock = sidebar.querySelector('.brand-block');
    if (!brandBlock || brandBlock.querySelector('.mobile-drawer-close')) return;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'mobile-drawer-close';
    closeButton.setAttribute('aria-label', 'Close navigation menu');
    closeButton.setAttribute('title', 'Close navigation menu');
    closeButton.innerHTML = '×';
    brandBlock.appendChild(closeButton);
    closeButton.addEventListener('click', closeSidebar);
  };

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
    button.addEventListener('click', toggleSidebar);
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
    overlay.setAttribute('title', 'Close navigation menu');
    overlay.tabIndex = 0;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeSidebar);
  };

  createDrawerCloseButton();
  createMobileHeader();
  createMobileBottomNav();
  createSidebarOverlay();

  sideLinks.forEach((link) => {
    link.addEventListener('click', closeSidebar);
  });

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

  /* Motion is presentation-only and deliberately loaded after navigation setup. */
  if (!document.querySelector('script[data-easywork-motion]')) {
    const motionScript = document.createElement('script');
    motionScript.src = 'js/motion.js';
    motionScript.dataset.easyworkMotion = 'true';
    document.body.appendChild(motionScript);
  }
});

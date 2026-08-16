document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const currentPage = body.dataset.page || window.location.pathname.split('/').pop() || 'index.html';
  const sidebar = document.querySelector('.sidebar');
  const sideLinks = document.querySelectorAll('.side-nav a');
  const BRAND_LOGO = 'assets/logo/easywork-logo.svg';
  const SITE_URL = 'https://easyworkenterprise.co.za';

  /* UI-only stylesheet. No API/backend dependencies. */
  const loadUIFixes = () => {
    if (document.querySelector('link[data-easywork-ui-fixes]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/ui-fixes.css';
    link.dataset.easyworkUiFixes = 'true';
    document.head.appendChild(link);
  };

  const loadBrandUI = () => {
    if (document.querySelector('link[data-easywork-brand-ui]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/brand.css';
    link.dataset.easyworkBrandUi = 'true';
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

  const applyBranding = () => {
    document.querySelectorAll('.sidebar .brand-mark').forEach((img) => {
      img.src = BRAND_LOGO;
      img.alt = 'Easywork Enterprise logo';
    });

    const topbarBrand = document.querySelector('.topbar-inner > :first-child');
    if (topbarBrand && !topbarBrand.classList.contains('topbar-logo')) {
      const logoLink = document.createElement('a');
      logoLink.className = 'topbar-logo';
      logoLink.href = 'index.html';
      logoLink.setAttribute('aria-label', 'Easywork Enterprise home');
      logoLink.innerHTML = `<img src="${BRAND_LOGO}" alt="Easywork Enterprise" />`;
      topbarBrand.replaceWith(logoLink);
    }

    const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = 'assets/logo/easywork-icon.svg';
    if (!favicon.parentNode) document.head.appendChild(favicon);

    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]') || document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = 'assets/logo/easywork-icon.svg';
    if (!appleIcon.parentNode) document.head.appendChild(appleIcon);
  };

  /* Search-engine presentation and structured data. This is intentionally
     generated from the existing page content so it stays consistent with the UI. */
  const applySEO = () => {
    const seo = {
      'index.html': {
        title: 'Easywork Enterprise | Business Materials Supply & Delivery in South Africa',
        description: 'Easywork Enterprise supplies plastic bags, refuse bags, heavy-duty plastics and general business materials with supply and delivery support across South Africa.'
      },
      'products.html': {
        title: 'Plastic Bags, Refuse Bags & Business Materials | Easywork Enterprise',
        description: 'Browse Easywork Enterprise products including plastic bags, refuse bags, heavy-duty plastics and general materials for business supply requirements in South Africa.'
      },
      'services.html': {
        title: 'Business Materials Supply & Delivery Services | Easywork Enterprise',
        description: 'Business materials sourcing, supply and delivery services from Easywork Enterprise for customers and organisations across Mpumalanga and South Africa.'
      },
      'procurement.html': {
        title: 'Request Materials & Quotation | Easywork Enterprise',
        description: 'Submit your request for sourcing and quotation for plastic bags, refuse bags, business materials and delivery requirements from Easywork Enterprise.'
      },
      'delivery.html': {
        title: 'Materials Supply & Delivery Across South Africa | Easywork Enterprise',
        description: 'Easywork Enterprise coordinates business material supply and delivery requirements across Mpumalanga and South Africa.'
      },
      'about.html': {
        title: 'About Easywork Enterprise | Materials Supply & Delivery',
        description: 'Learn about Easywork Enterprise and its business materials supply, plastic products, refuse bags and delivery services in South Africa.'
      },
      'contact.html': {
        title: 'Contact Easywork Enterprise | Supply & Delivery Enquiries',
        description: 'Contact Easywork Enterprise for plastic bag supply, refuse bags, general materials, sourcing, quotations and delivery enquiries in South Africa.'
      }
    };

    const data = seo[currentPage] || seo['index.html'];
    const pathMap = {
      'index.html': '/',
      'products.html': '/products/',
      'services.html': '/services/',
      'procurement.html': '/procurement/',
      'delivery.html': '/delivery/',
      'about.html': '/about/',
      'contact.html': '/contact/'
    };
    const canonicalUrl = `${SITE_URL}${pathMap[currentPage] || '/'}`;

    document.title = data.title;

    const setMeta = (selector, attributes) => {
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        document.head.appendChild(tag);
      }
      Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
    };

    setMeta('meta[name="description"]', { name: 'description', content: data.description });
    setMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: data.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: data.description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Easywork Enterprise' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: data.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: data.description });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Easywork Enterprise (Pty) Ltd',
      url: SITE_URL,
      logo: `${SITE_URL}/assets/logo/easywork-logo.svg`,
      description: 'Business materials supply and delivery service in South Africa, including plastic bags, refuse bags, heavy-duty plastics and general materials.',
      areaServed: {
        '@type': 'Country',
        name: 'South Africa'
      },
      knowsAbout: [
        'Business materials supply',
        'Plastic bags',
        'Refuse bags',
        'Heavy-duty plastic bags',
        'Materials sourcing',
        'Business material delivery'
      ]
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Easywork Enterprise',
      url: SITE_URL,
      description: data.description,
      inLanguage: 'en-ZA'
    };

    document.head.querySelectorAll('script[data-easywork-schema]').forEach((node) => node.remove());
    [schema, websiteSchema].forEach((item) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.easyworkSchema = 'true';
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });

    if (currentPage === 'products.html') {
      const productCards = [...document.querySelectorAll('.product-card')];
      if (productCards.length) {
        const itemList = {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Easywork Enterprise Products',
          itemListElement: productCards.map((card, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: card.dataset.name || card.querySelector('h3')?.textContent.trim() || 'Business material'
          }))
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.easyworkSchema = 'true';
        script.textContent = JSON.stringify(itemList);
        document.head.appendChild(script);
      }
    }
  };

  loadUIFixes();
  loadBrandUI();
  loadProductsUI();
  loadMotionUI();
  applyBranding();
  applySEO();

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
        <img src="${BRAND_LOGO}" alt="Easywork Enterprise" />
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

  sideLinks.forEach((link) => link.addEventListener('click', closeSidebar));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSidebar(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeSidebar(); });

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

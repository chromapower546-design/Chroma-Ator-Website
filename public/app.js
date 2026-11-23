// Chroma-Ator Luxury Power Systems - Application Core
(function () {
  const LOCAL_PRODUCT_PHOTOS = {
    'gas-generators': '/images/gas-generator-set.jpg',
    'gas-engines': '/images/gas-engine.jpg',
    'dual-fuel-systems': '/images/dual-fuel-engine.jpg',
    'composite-dispensing-units': '/images/cdu-unit.jpg',
    'cng-dispensers': '/images/cng-dispenser-yellow.jpg',
    'mobile-refuelling-units': '/images/mobile-cng-truck.jpg'
  };

  const STUDIO_360_UNITS = {
    generator: {
      label: 'Gas Generator',
      name: 'Chroma-Ator Gas Generator',
      spec: '5 kVA – 20 MW • CNG / PNG / Bio-Gas',
      image: '/images/360-generator.jpg',
      alt: 'Chroma-Ator gas generator set'
    },
    engine: {
      label: 'Gas Engine',
      name: 'Chroma-Ator Gas Engine',
      spec: '10–70 HP • CPCB Approved • CNG / PNG / Bio-Gas',
      image: '/images/360-engine.jpg',
      alt: 'Chroma-Ator gas engine'
    },
    dfs: {
      label: 'Dual-Fuel System',
      name: 'Chroma-Ator Dual-Fuel System',
      spec: 'Up to 70% diesel saving • No engine modification',
      image: '/images/360-dfs.jpg',
      alt: 'Chroma-Ator dual-fuel system'
    },
    cdu: {
      label: 'Composite Dispensing Unit',
      name: 'Chroma-Ator Composite Dispensing Unit (CDU)',
      spec: 'PESO Approved • Storage, booster and dispenser in one',
      image: '/images/360-cdu.jpg',
      alt: 'Chroma-Ator composite dispensing unit'
    },
    mru: {
      label: 'Mobile Refuelling Unit',
      name: 'Chroma-Ator Mobile Refuelling Unit (MRU)',
      spec: 'PESO Approved • Around 2,000 kg gas payload',
      image: '/images/360-mru.jpg',
      alt: 'Chroma-Ator mobile refuelling unit'
    }
  };

  const STUDIO_360_BY_PRODUCT = {
    'gas-generators': 'generator',
    'gas-engines': 'engine',
    'dual-fuel-systems': 'dfs',
    'composite-dispensing-units': 'cdu',
    'mobile-refuelling-units': 'mru'
  };

  const REDUCED_MOTION = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const STUDIO_360_STATE = {
    unit: 'generator',
    spinning: !REDUCED_MOTION
  };

  function has360Photo(slug) {
    return Boolean(STUDIO_360_BY_PRODUCT[slug]);
  }

  function withLocalProductPhotos(products) {
    return products.map(product => ({
      ...product,
      image: LOCAL_PRODUCT_PHOTOS[product.slug] || product.image
    }));
  }

  const STATE = {
    route: 'home',
    products: withLocalProductPhotos(window.CHROMA_PRODUCTS || []),
    selectedProduct: null,
    productCategory: 'all',
    adminToken: localStorage.getItem('chroma_admin_token') || null,
    adminUser: null,
    adminTab: 'enquiries',
    catalogProduct: null,
    catalogPage: 0,
    catalogOpen: false,
  };

  // DOM Elements
  const appContainer = document.getElementById('app-main') || document.getElementById('app-root') || document.body;
  let scrollRevealObserver = null;

  function setupScrollReveals() {
    const revealTargets = [
      ...appContainer.querySelectorAll('section, h1, h2, h3, h4, .glass-panel, .industry-sector-card, .motion-card, .journey-list'),
      ...document.querySelectorAll('#site-footer, #site-footer .footer__grid > div, #site-footer .footer__bottom')
    ];

    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach(element => element.classList.add('reveal-on-scroll', 'is-visible'));
      return;
    }

    scrollRevealObserver?.disconnect();
    scrollRevealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -36px 0px' });

    revealTargets.forEach(element => {
      element.classList.add('reveal-on-scroll');
      scrollRevealObserver.observe(element);
    });
  }

  // Contact Info
  const CONTACT = {
    brand: "Chroma-Ator",
    legalName: "Chroma Power Systems India Private Limited",
    tagline: "Powering a Cleaner, More Efficient Future",
    corporateAddress: "G-85, Preet Vihar, New Delhi - 110092, India",
    corporateMapQuery: "Chroma Power Systems India Private Limited, G-85, Preet Vihar, New Delhi 110092",
    manufacturingAddress: "F-337, RICO Industrial Growth Centre Extension, Dholpur, Rajasthan, India",
    international: {
      company: "CHROMA-ATOR INTERNATIONAL FZ LLC",
      office: "Compass Building - Al Hulaila, Al Hulaila Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates",
      phones: [
        { label: "UAE", display: "+971 585996045", tel: "+971585996045" },
        { label: "India", display: "+91 9811404342", tel: "+919811404342" }
      ],
      email: "parushi@chroma-ator.com"
    },
    sales: {
      phones: ["+91 9811194542", "+91 9350679448"],
      emails: ["sales@chroma-ator.com", "kamal@chroma-ator.com"]
    },
    engineer: {
      name: "Shashikant Triwari",
      phones: ["+91 9218043940"],
      email: "shashikant@chroma-ator.com"
    },
    service: {
      phones: ["+91 9350679448", "+91 9350508019"],
      email: "kamal@chroma-ator.com"
    },
    emails: ["sales@chroma-ator.com", "kamal@chroma-ator.com", "parushi@chroma-ator.com", "shashikant@chroma-ator.com"],
    phones: ["+91 9811194542", "+91 9350679448", "+91 9218043940", "+91 9350508019", "+971 585996045", "+91 9811404342"]
  };

  const contactPhone = phone => `<a href="tel:${String(phone).replace(/[^\d+]/g, '')}">${phone}</a>`;
  const contactEmail = email => `<a href="mailto:${email}">${email}</a>`;

  const PROJECT_CASES = window.CHROMA_PROJECTS || [];
  const INDUSTRY_SECTORS = window.CHROMA_INDUSTRIES || [];

  const INTERNATIONAL_NODES = [
    { name: 'Dholpur, India · Manufacturing', shortName: 'India', type: 'office', lat: 26.7025, lon: 77.8930 },
    { name: 'Ras Al Khaimah, UAE · International Office', shortName: 'UAE office', type: 'office', lat: 25.7895, lon: 55.9432 },
    { name: 'Toronto, Canada · Customer', shortName: 'Canada', type: 'customer', lat: 43.6532, lon: -79.3832 },
    { name: 'Monrovia, Liberia · Customer', shortName: 'Liberia', type: 'customer', lat: 6.3156, lon: -10.8074 },
    { name: 'Brazzaville, Republic of the Congo · Customer', shortName: 'Republic of Congo', type: 'customer', lat: -4.2634, lon: 15.2429 },
    { name: 'Johannesburg, South Africa · Customer', shortName: 'South Africa', type: 'customer', lat: -26.2041, lon: 28.0473 },
    { name: 'Kampala, Uganda · Customer', shortName: 'Uganda', type: 'customer', lat: 0.3476, lon: 32.5825 },
    { name: 'Dhaka, Bangladesh · Customer', shortName: 'Bangladesh', type: 'customer', lat: 23.8103, lon: 90.4125 },
    { name: 'Dubai, UAE · Customer', shortName: 'Dubai customer', type: 'customer', lat: 25.2048, lon: 55.2708, screenOffsetX: 7 },
    { name: 'Manila, Philippines · Customer', shortName: 'Philippines', type: 'customer', lat: 14.5995, lon: 120.9842 },
    { name: 'Dar es Salaam, Tanzania · Customer', shortName: 'Tanzania', type: 'customer', lat: -6.7924, lon: 39.2083 },
    { name: 'Lagos, Nigeria · Customer', shortName: 'Nigeria', type: 'customer', lat: 6.5244, lon: 3.3792 },
    { name: 'Addis Ababa, Ethiopia · Customer', shortName: 'Ethiopia', type: 'customer', lat: 8.9806, lon: 38.7578 },
    { name: 'Tegucigalpa, Honduras · Customer', shortName: 'Honduras', type: 'customer', lat: 14.0723, lon: -87.1921 }
  ];

  // Initialization
  async function init() {
    setupNavEvents();
    setupDropdownEvents();
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    try {
      await fetchProducts();
      if (STATE.route === 'products' || STATE.route === 'home' || STATE.route.startsWith('product')) {
        handleRouting();
      }
    } catch (err) {
      console.warn('Product fetch error:', err);
    }
  }

  // Fetch product catalog from backend API
  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.data) {
        STATE.products = withLocalProductPhotos(data.data);
      }
    } catch (e) {
      console.warn('API offline or loading fallback:', e);
    }
  }

  // Setup Navbar & Drawer listeners
  function setupNavEvents() {
    const mobileBtn = document.getElementById('nav-hamburger') || document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('nav-drawer') || document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.onclick = () => {
        mobileMenu.classList.toggle('open');
        mobileMenu.classList.toggle('hidden');
      };
    }

    // Header scroll background effect
    const nav = document.getElementById('site-nav') || document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        if (nav) nav.classList.add('scrolled', 'bg-obsidian/90', 'backdrop-blur-md', 'border-b', 'border-white/10');
      } else {
        if (nav) nav.classList.remove('scrolled', 'bg-obsidian/90', 'backdrop-blur-md', 'border-b', 'border-white/10');
      }
    });
  }

  // Header enquiry dropdown + mobile drawer submenu
  function closeNavDropdowns() {
    const dropdown = document.getElementById('nav-enquiry-dropdown');
    const toggle = document.getElementById('nav-enquiry-toggle');
    if (dropdown) dropdown.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');

    const drawerGroup = document.getElementById('drawer-enquiry-group');
    const drawerToggle = document.getElementById('drawer-enquiry-toggle');
    if (drawerGroup) drawerGroup.classList.remove('is-open');
    if (drawerToggle) drawerToggle.setAttribute('aria-expanded', 'false');
  }

  function setupDropdownEvents() {
    const dropdown = document.getElementById('nav-enquiry-dropdown');
    const toggle = document.getElementById('nav-enquiry-toggle');

    if (dropdown && toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) closeNavDropdowns();
      });
    }

    const drawerGroup = document.getElementById('drawer-enquiry-group');
    const drawerToggle = document.getElementById('drawer-enquiry-toggle');
    if (drawerGroup && drawerToggle) {
      drawerToggle.addEventListener('click', () => {
        const isOpen = drawerGroup.classList.toggle('is-open');
        drawerToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    const catalogModal = document.getElementById('catalog-modal');
    if (catalogModal) {
      catalogModal.addEventListener('click', (e) => {
        if (e.target === catalogModal) closeCatalog();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeNavDropdowns();
        if (STATE.catalogOpen) closeCatalog();
        const drawer = document.getElementById('nav-drawer');
        if (drawer) drawer.classList.remove('open');
      }

      if (!STATE.catalogOpen) return;

      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextCatalogPage(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevCatalogPage(); }
    });
  }

  // Router handler
  function handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const [route, param] = hash.split('/');

    STATE.route = route;
    if (route !== 'industries') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Close mobile drawer on route change
    const mobileMenu = document.getElementById('nav-drawer') || document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      mobileMenu.classList.add('hidden');
    }

    closeNavDropdowns();

    // Update active nav links
    const activeRoute = route === 'industries' ? 'about' : route;
    document.querySelectorAll('.nav__links a, .nav-link').forEach(link => {
      const target = link.getAttribute('href')?.replace('#', '');
      if (target === activeRoute) {
        link.classList.add('active', 'text-neon-emerald', 'font-semibold');
      } else {
        link.classList.remove('active', 'text-neon-emerald', 'font-semibold');
      }
    });

    renderCurrentView(route, param);
  }

  // Render view router
  function renderCurrentView(route, param) {
    if (!appContainer) return;

    switch (route) {
      case 'home':
        renderHomeView();
        break;
      case 'products':
        renderProductsView();
        break;
      case 'product':
        renderProductDetailView(param);
        break;
      case 'catalogs':
        renderCatalogsView();
        break;
      case 'about':
        renderAboutView();
        break;
      case 'international':
        renderInternationalView();
        break;
      case 'industries':
        // Legacy route: Industries now lives at the end of the About page.
        renderAboutView();
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#about');
        }
        setTimeout(() => {
          document.getElementById('industries')?.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, 150);
        break;
      case 'projects':
        renderProjectsView();
        break;
      case 'careers':
        renderCareersView();
        break;
      case 'support':
        renderSupportView();
        break;
      case 'contact':
        renderContactView();
        break;
      case 'admin':
        renderAdminView();
        break;
      case 'legal':
        renderLegalView();
        break;
      default:
        renderHomeView();
    }

    setupScrollReveals();

    // Refresh Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ================= VIEW TEMPLATES =================

  // 1. HOME VIEW
  function renderHomeView() {
    appContainer.innerHTML = `
      <!-- Hero Section -->
      <section class="home-hero relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16 bg-obsidian">
         <!-- Light industrial backdrop with a soft readability wash -->
        <div class="absolute inset-0 z-0 opacity-25 bg-cover bg-center mix-blend-luminosity scale-105 transition-transform duration-1000"
             style="background-image: url('/images/genset-installation.jpg')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-transparent z-0"></div>

         <div class="hero-content container mx-auto px-6 relative z-10 text-left max-w-[1240px]">
          <!-- Status Pill -->
        <div class="home-hero-status inline-flex items-center gap-2.5 px-4 py-1.5 border border-white/10 backdrop-blur-md mb-8">
            <span class="w-2.5 h-2.5 rounded-full bg-neon-emerald shadow-[0_0_10px_#00e676]"></span>
            <span class="text-xs font-mono tracking-wider text-pearl uppercase">Since 1995 • Gas Engines, Generators &amp; CNG Equipment</span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-pearl leading-[1.08] mb-6 max-w-5xl">
            Powering a Cleaner.<br />
            <span class="home-hero-highlight">
              More Efficient Future.
            </span>
          </h1>

          <p class="text-lg sm:text-xl text-muted max-w-3xl mb-10 font-normal leading-relaxed">
            Chroma-Ator has manufactured gas engines, gas generators and clean-fuel equipment since 1995. Our range covers 5 kVA to 20 MW gas generators, 10–70 HP CPCB-approved engines, dual-fuel systems and PESO-approved CNG refuelling equipment.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center justify-start gap-4">
            <a href="#products" class="btn-luxury">
              <i data-lucide="box" class="w-5 h-5"></i>
              <span>Explore Products in 3D</span>
            </a>
            <button onclick="window.ChromaApp.openQuoteModal()" class="btn-luxury-outline text-gold border-gold/40 hover:border-gold hover:text-gold">
              <i data-lucide="file-text" class="w-5 h-5"></i>
              <span>Request Custom RFQ</span>
            </button>
          </div>

          <!-- Core Highlights Metric Pills -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto text-left">
            <div class="glass-panel p-5">
              <div class="text-2xl font-mono font-bold text-neon-emerald">5 kVA - 20 MW</div>
              <div class="text-xs text-muted mt-1 uppercase tracking-wider">Gas Generator Range</div>
            </div>
            <div class="glass-panel p-5">
              <div class="text-2xl font-mono font-bold text-pearl">10 - 70 HP</div>
              <div class="text-xs text-muted mt-1 uppercase tracking-wider">CPCB Approved Gas Engines</div>
            </div>
            <div class="glass-panel p-5">
              <div class="text-2xl font-mono font-bold text-gold">~5,000</div>
              <div class="text-xs text-muted mt-1 uppercase tracking-wider">Generators Annual Capacity</div>
            </div>
            <div class="glass-panel p-5">
              <div class="text-2xl font-mono font-bold text-pearl">Up to 70%</div>
              <div class="text-xs text-muted mt-1 uppercase tracking-wider">Diesel Saving with Dual Fuel</div>
            </div>
          </div>
        </div>
      </section>

      <section class="certifications-band py-10">
        <div class="container mx-auto px-6">
          <p class="text-xs font-mono uppercase tracking-widest text-muted text-center mb-7">
            Approvals, patents &amp; experience
          </p>
          <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            <span class="certification-mark">CPCB Approved Engines</span>
            <span class="certification-mark">PESO Approved CNG Equipment</span>
            <span class="certification-mark">Patented CDU</span>
            <span class="certification-mark">Patent Applied · Dual Fuel &amp; MRU</span>
            <span class="certification-mark">Since 1995</span>
            <span class="certification-mark">~5,000 Generators / Year</span>
          </div>
        </div>
      </section>

      <!-- Marquee Ticker -->
      <div class="border-y border-white/10 bg-forest/40 py-3.5 overflow-hidden">
        <div class="marquee-track">
          <div class="marquee-content font-mono text-xs text-muted uppercase tracking-widest">
            <span class="flex items-center gap-2"><span class="text-neon-emerald">●</span> Gas Generators 5 kVA – 20 MW</span>
            <span class="flex items-center gap-2"><span class="text-gold">●</span> Gas Engines 10 – 70 HP · CPCB Approved</span>
            <span class="flex items-center gap-2"><span class="text-neon-emerald">●</span> Dual Fuel · Up to 70% Diesel Saving</span>
            <span class="flex items-center gap-2"><span class="text-pearl">●</span> World's First Composite Dispensing Unit</span>
            <span class="flex items-center gap-2"><span class="text-neon-emerald">●</span> PESO Approved MRU &amp; CDU</span>
            <span class="flex items-center gap-2"><span class="text-gold">●</span> Exports to Middle East, Southeast Asia, Africa &amp; Europe</span>
          </div>
          <div class="marquee-content font-mono text-xs text-muted uppercase tracking-widest" aria-hidden="true">
            <span class="flex items-center gap-2"><span class="text-neon-emerald">●</span> Gas Generators 5 kVA – 20 MW</span>
            <span class="flex items-center gap-2"><span class="text-gold">●</span> Gas Engines 10 – 70 HP · CPCB Approved</span>
            <span class="flex items-center gap-2"><span class="text-neon-emerald">●</span> Dual Fuel · Up to 70% Diesel Saving</span>
            <span class="flex items-center gap-2"><span class="text-pearl">●</span> World's First Composite Dispensing Unit</span>
            <span class="flex items-center gap-2"><span class="text-neon-emerald">●</span> PESO Approved MRU &amp; CDU</span>
            <span class="flex items-center gap-2"><span class="text-gold">●</span> Exports to Middle East, Southeast Asia, Africa &amp; Europe</span>
          </div>
        </div>
      </div>

      <!-- Featured Products Grid -->
      <section class="home-products-section py-20 bg-obsidian">
        <div class="container mx-auto px-6">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge-gold mb-3">Product Range</span>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight">
              Gas Power &amp; CNG Refuelling
            </h2>
            <p class="text-muted mt-3 text-base">
              Gas generators, gas engines, dual-fuel systems and CNG refuelling equipment — designed, manufactured and supported by Chroma-Ator.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${(STATE.products.slice(0, 6)).map(p => `
              <div class="glass-panel overflow-hidden flex flex-col group">
                <div class="relative h-56 overflow-hidden">
                  <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain p-3" />
                  <span class="absolute top-4 left-4 badge-emerald">${p.group}</span>
                  ${has360Photo(p.slug) ? '<span class="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-gold/20 text-gold border border-gold/40">3D VIEW</span>' : ''}
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-pearl group-hover:text-neon-emerald transition-colors">${p.name}</h3>
                    <p class="text-xs font-mono text-gold mt-1">${p.tagline || ''}</p>
                    <p class="text-sm text-muted mt-3 line-clamp-3 leading-relaxed">${p.description}</p>
                  </div>
                  <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <a href="#product/${p.slug}" class="text-sm font-semibold text-neon-emerald hover:underline flex items-center gap-1.5">
                      <span>View Specifications</span>
                      <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                    <button onclick="window.ChromaApp.openQuoteModal('${p.name}')" class="text-xs font-mono text-muted hover:text-pearl px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-neon-emerald">
                      Quote
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="text-center mt-12">
            <a href="#products" class="btn-luxury-outline">
              <span>View All ${STATE.products.length} Products &amp; Technical Sheets</span>
              <i data-lucide="layers" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- Global Presence 3D Globe Section -->
      <section class="globe-home-section py-20 bg-obsidian">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-6">
              <span class="badge-emerald mb-3">Global Engineering Network</span>
              <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mb-4">
                Indian Engineering. International Reach.
              </h2>
              <p class="text-muted leading-relaxed mb-6">
                Gas engines, generators and refuelling equipment engineered and manufactured in India, with an international business office in Ras Al Khaimah serving customers across the Middle East, Asia and Africa.
              </p>

              <!-- Location Cards -->
              <div class="space-y-3 max-w-lg">
                <div class="glass-panel p-4 flex items-start gap-4">
                  <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-[10px] shrink-0 mt-0.5">INTL</div>
                  <div>
                    <h4 class="font-bold text-pearl text-sm">${CONTACT.international.company}</h4>
                    <p class="text-xs text-muted mt-1 leading-relaxed">International Business Office<br />${CONTACT.international.office}</p>
                    <p class="text-xs font-mono text-neon-emerald mt-2">Mob: ${CONTACT.international.phones.map(p => `${contactPhone(p.display)} (${p.label})`).join(' · ')}</p>
                    <p class="text-xs font-mono text-neon-emerald mt-1">${contactEmail(CONTACT.international.email)}</p>
                  </div>
                </div>

                <div class="glass-panel p-4 flex items-start gap-4">
                  <div class="w-8 h-8 rounded-full bg-neon-emerald/20 flex items-center justify-center text-neon-emerald font-bold text-[10px] shrink-0 mt-0.5">IN</div>
                  <div class="space-y-2">
                    <h4 class="font-bold text-pearl text-sm">India Contact Details</h4>
                    <p class="text-xs text-muted leading-relaxed"><span class="font-mono uppercase tracking-wider text-pearl">Sales:</span> ${CONTACT.sales.phones.map(contactPhone).join(' · ')}<br />${CONTACT.sales.emails.map(contactEmail).join(' · ')}</p>
                    <p class="text-xs text-muted leading-relaxed"><span class="font-mono uppercase tracking-wider text-pearl">Engineer:</span> ${CONTACT.engineer.name}<br />${CONTACT.engineer.phones.map(contactPhone).join(' · ')} · ${contactEmail(CONTACT.engineer.email)}</p>
                    <p class="text-xs text-muted leading-relaxed"><span class="font-mono uppercase tracking-wider text-pearl">Service:</span> ${CONTACT.service.phones.map(contactPhone).join(' · ')}<br />${contactEmail(CONTACT.service.email)}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Canvas Globe Display -->
            <div class="lg:col-span-6 flex flex-col items-center justify-center">
              <div class="globe-stage relative w-full max-w-[480px] aspect-square">
                <canvas id="globe-canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>
                <div class="absolute bottom-2 text-center w-full text-xs font-mono text-muted/70">
                  Interactive 3D Globe • Drag to spin
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Ready to Transition CTA Banner -->
      <section class="home-cta-section py-20 bg-gradient-to-t from-obsidian to-forest/50 relative overflow-hidden">
        <div class="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mb-6">
            Powering a Cleaner, More Efficient Future.
          </h2>
          <p class="text-lg text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            Tell us your load, fuel supply and site conditions. Chroma-Ator's team can design, manufacture, install and commission a turnkey power or refuelling solution.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <button onclick="window.ChromaApp.openQuoteModal()" class="btn-luxury">
              <i data-lucide="send" class="w-4 h-4"></i>
              <span>Request a Quote</span>
            </button>
            <a href="tel:+919218043940" class="btn-luxury-outline">
              <i data-lucide="phone-call" class="w-4 h-4"></i>
              <span>Talk to an Engineer: +91 9218043940</span>
            </a>
          </div>
        </div>
      </section>
    `;

    // Initialize the globe after its canvas is attached.
    setTimeout(() => {
      if (window.ChromaGlobe) {
        window.ChromaGlobe.init('globe-canvas', {
          nodes: INTERNATIONAL_NODES,
          mode: 'international',
          showLabels: false
        });
      }
    }, 150);
  }

  // 3D product photo studio embedded in the product catalog.
  const STUDIO_360_FACTS = {
    generator: [
      ['Range', '5 kVA – 20 MW'],
      ['Fuels', 'CNG / PNG / Bio-Gas'],
      ['Engine', 'Chroma-Ator / MAN'],
      ['Alternator', 'Stamford / Leroy Somer']
    ],
    engine: [
      ['Range', '10 – 70 HP'],
      ['Approval', 'CPCB Approved'],
      ['Fuels', 'CNG / PNG / Bio-Gas'],
      ['Applications', 'Generators & compressors']
    ],
    dfs: [
      ['Diesel Saving', 'Up to 70%'],
      ['Engine Mods', 'None required'],
      ['Control', 'ECU-based'],
      ['Safety', 'Automatic switching']
    ],
    cdu: [
      ['Models', 'CDU 50-3 / 200-45 / 200-30'],
      ['Compression Ratio', '40:1'],
      ['Input Pressure', '4–250 bar'],
      ['Approval', 'PESO approved']
    ],
    mru: [
      ['Configurations', 'Station / cabinet / cascade truck'],
      ['Payload', 'Around 2,000 kg'],
      ['External Power', 'Not required'],
      ['Approval', 'PESO approved; patented']
    ]
  };

  function render360Facts(unitKey) {
    return (STUDIO_360_FACTS[unitKey] || []).map(([label, value]) => `
      <div class="p-3 bg-white/5 rounded-lg border border-white/5">
        <div class="text-xs font-mono text-muted">${label}</div>
        <div class="text-sm font-mono font-bold text-pearl mt-1">${value}</div>
      </div>
    `).join('');
  }

  function render360StudioMarkup() {
    const unitKeys = Object.keys(STUDIO_360_UNITS);
    const activeKey = STUDIO_360_UNITS[STUDIO_360_STATE.unit] ? STUDIO_360_STATE.unit : unitKeys[0];
    const active = STUDIO_360_UNITS[activeKey];

    return `
      <section class="products-studio-section py-16" id="product-studio">
        <div class="container mx-auto px-6">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <span class="badge-emerald mb-2">3D Product Studio</span>
              <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight">See Every Product in 3D</h2>
              <p class="text-muted mt-2 max-w-2xl text-sm">
                Every unit is a real-time 3D model built from Chroma-Ator equipment geometry — not a photograph. Drag to orbit, tilt with a mouse, or let the unit rotate on its own.
              </p>
            </div>
            <div class="mt-4 md:mt-0 flex flex-wrap gap-3">
              <button type="button" onclick="window.ChromaApp.toggle360Spin()" id="studio-360-toggle" class="btn-luxury-outline">
                <i data-lucide="pause" class="w-4 h-4" id="studio-360-toggle-pause"></i>
                <i data-lucide="play" class="w-4 h-4 hidden" id="studio-360-toggle-play"></i>
                <span id="studio-360-toggle-label">Pause Rotation</span>
              </button>
              <button onclick="window.ChromaApp.openQuoteModal()" class="btn-luxury">
                <i data-lucide="file-text" class="w-4 h-4"></i>
                <span>Quote This Unit</span>
              </button>
            </div>
          </div>

          <div class="glass-panel p-6 studio-360-panel">
            <div class="studio-360-toolbar">
              <div class="studio-360-tabs" role="tablist" aria-label="Select product">
                ${unitKeys.map(key => `
                  <button type="button" role="tab" aria-selected="${key === activeKey}" data-studio-unit="${key}" onclick="window.ChromaApp.switch360Unit('${key}')" class="unit-mode-btn ${key === activeKey ? 'is-active' : ''}">
                    ${STUDIO_360_UNITS[key].label}
                  </button>
                `).join('')}
              </div>
              <div class="studio-360-controls">
                <button type="button" onclick="window.ChromaApp.rotate360(-30)" class="studio-360-arrow" title="Rotate left" aria-label="Rotate left">
                  <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                </button>
                <button type="button" onclick="window.ChromaApp.rotate360(30)" class="studio-360-arrow" title="Rotate right" aria-label="Rotate right">
                  <i data-lucide="rotate-cw" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <div class="product-3d-stage" id="product-3d-stage" role="img" aria-label="${active.name} shown as an interactive 3D model">
              <canvas id="product-3d-canvas" class="product-3d-canvas" data-unit="${activeKey}" data-fallback="${active.image}" data-alt="${active.alt}" data-spin="${STUDIO_360_STATE.spinning}" aria-label="${active.name} interactive 3D model"></canvas>
              <div class="product-3d-load" id="product-3d-loading" aria-hidden="true">
                <span class="product-3d-spinner"></span>
                <span>Building 3D model</span>
              </div>
              <img class="product-3d-fallback" id="product-3d-fallback" src="${active.image}" alt="${active.alt}" />
              <span class="product-3d-hint">Drag to orbit · double-click to reset</span>
              <span class="product-3d-live"><span class="product-3d-live-dot"></span> Real-time 3D</span>
              <div class="product-3d-caption">
                <div class="text-sm font-mono text-neon-emerald font-bold" id="studio-360-name">${active.name}</div>
                <div class="text-[11px] text-muted font-mono mt-0.5" id="studio-360-spec">${active.spec}</div>
                <div class="product-3d-caption__meta">Interactive geometry · drag to orbit</div>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10" id="studio-360-facts">
              ${render360Facts(activeKey)}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Mounts the real-time Three.js model studio. The viewer module may still be
  // loading when the product view renders, so retry briefly until it is ready.
  function start360Studio() {
    const canvas = document.getElementById('product-3d-canvas');
    if (!canvas) return;
    let attempts = 0;

    const boot = () => {
      const node = document.getElementById('product-3d-canvas');
      if (!node) return;
      if (!window.ChromaProduct3D) {
        if (attempts < 50) {
          attempts += 1;
          setTimeout(boot, 100);
        }
        return;
      }
      // Let the stage and its loading state paint before the (one-off) shader
      // compilation pass, so the page never stalls on a blank studio.
      if (attempts === 0) {
        attempts = 1;
        setTimeout(boot, 90);
        return;
      }
      window.ChromaProduct3D.mount({
        canvasId: 'product-3d-canvas',
        unit: STUDIO_360_STATE.unit,
        spin: STUDIO_360_STATE.spinning
      });
    };

    boot();
  }

  function stop360Studio() {
    if (window.ChromaProduct3D) window.ChromaProduct3D.dispose();
  }

  function update360UnitUI(unitKey) {
    const unit = STUDIO_360_UNITS[unitKey];
    if (!unit) return;

    STUDIO_360_STATE.unit = unitKey;

    const canvas = document.getElementById('product-3d-canvas');
    if (canvas) {
      canvas.dataset.unit = unitKey;
      canvas.dataset.fallback = unit.image;
      canvas.dataset.alt = unit.alt;
      canvas.dataset.spin = String(STUDIO_360_STATE.spinning);
      canvas.setAttribute('aria-label', `${unit.name} interactive 3D model`);
    }

    const fallback = document.getElementById('product-3d-fallback');
    if (fallback) {
      fallback.src = unit.image;
      fallback.alt = unit.alt;
    }

    if (window.ChromaProduct3D) {
      window.ChromaProduct3D.mount({
        canvasId: 'product-3d-canvas',
        unit: unitKey,
        spin: STUDIO_360_STATE.spinning
      });
    }

    const stage = document.getElementById('product-3d-stage');
    if (stage) stage.setAttribute('aria-label', `${unit.name} shown as an interactive 3D model`);

    const name = document.getElementById('studio-360-name');
    if (name) name.textContent = unit.name;

    const spec = document.getElementById('studio-360-spec');
    if (spec) spec.textContent = unit.spec;

    const facts = document.getElementById('studio-360-facts');
    if (facts) facts.innerHTML = render360Facts(unitKey);

    document.querySelectorAll('[data-studio-unit]').forEach(btn => {
      const active = btn.dataset.studioUnit === unitKey;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
  }

  function update360SpinUI() {
    const toggle = document.getElementById('studio-360-toggle');
    const label = document.getElementById('studio-360-toggle-label');
    const pauseIcon = document.getElementById('studio-360-toggle-pause');
    const playIcon = document.getElementById('studio-360-toggle-play');
    if (label) label.textContent = STUDIO_360_STATE.spinning ? 'Pause Rotation' : 'Play Rotation';
    if (toggle) toggle.setAttribute('aria-pressed', String(!STUDIO_360_STATE.spinning));
    if (pauseIcon) pauseIcon.classList.toggle('hidden', !STUDIO_360_STATE.spinning);
    if (playIcon) playIcon.classList.toggle('hidden', STUDIO_360_STATE.spinning);
  }


  // PRODUCTS CATALOG VIEW
  function renderProductsView() {
    const categories = ['all', 'Power Generation', 'CNG Refuelling', 'Clean Fuels'];
    const filtered = STATE.productCategory === 'all'
      ? STATE.products
      : STATE.products.filter(p => p.group === STATE.productCategory);

    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <span class="badge-emerald mb-2">Technical Portfolio</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight">
              Products &amp; Solutions
            </h1>
            <p class="text-muted mt-3 text-base">
              Gas generators, gas engines, dual-fuel systems and CNG refuelling equipment, with the specifications and approvals published by Chroma-Ator.
            </p>
          </div>

          <!-- Category Filter Tabs -->
          <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
            ${categories.map(c => `
              <button onclick="window.ChromaApp.setProductCategory('${c}')" class="px-5 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                STATE.productCategory === c
                  ? 'bg-gradient-to-r from-emerald to-neon-emerald text-obsidian shadow-[0_0_15px_rgba(0,230,118,0.4)]'
                  : 'bg-white/5 text-pearl border border-white/10 hover:border-white/30'
              }">
                ${c === 'all' ? `All Products (${STATE.products.length})` : c}
              </button>
            `).join('')}
          </div>

          <!-- Products Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${filtered.map(p => `
              <div class="glass-panel overflow-hidden flex flex-col group">
                <div class="relative h-60 overflow-hidden">
                  <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain p-3" />
                  <span class="absolute top-4 left-4 badge-emerald">${p.group}</span>
                  ${has360Photo(p.slug) ? '<span class="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-gold/20 text-gold border border-gold/40">3D VIEW</span>' : ''}
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-pearl group-hover:text-neon-emerald transition-colors">${p.name}</h3>
                    <p class="text-xs font-mono text-gold mt-1">${p.tagline || ''}</p>
                    <p class="text-sm text-muted mt-3 line-clamp-3 leading-relaxed">${p.description}</p>

                    <!-- Fuel Tags -->
                    <div class="flex flex-wrap gap-1.5 mt-4">
                      ${(p.fuels || []).map(f => `<span class="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-muted border border-white/5">${f}</span>`).join('')}
                    </div>
                  </div>
                  <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <a href="#product/${p.slug}" class="text-sm font-semibold text-neon-emerald hover:underline flex items-center gap-1.5">
                      <span>Full Technical Sheet</span>
                      <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                    <button onclick="window.ChromaApp.openQuoteModal('${p.name}')" class="btn-luxury-outline !px-4 !py-1.5 text-xs">
                      Quote
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ${render360StudioMarkup()}
      </section>
    `;

    setTimeout(() => {
      update360UnitUI(STUDIO_360_STATE.unit);
      update360SpinUI();
      start360Studio();
    }, 150);
  }

  // ================= VIEW-ONLY PRODUCT CATALOG LIBRARY =================

  function catalogRef(product) {
    return String(product.slug || 'catalog').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^CNG-/, '');
  }

  function buildCatalogPages(product) {
    const ref = catalogRef(product);
    const totalPages = 4;
    const fuels = (product.fuels || []).map(f => `<span class="catalog-chip">${f}</span>`).join('');
    const applications = (product.applications || []).map(a => `<li>${a}</li>`).join('');
    const features = (product.features || []).map(f => `<li>${f}</li>`).join('');
    const specs = (product.specs || []).map(s => `
      <div class="catalog-spec-row">
        <span>${s.label}</span>
        <strong>${s.value}</strong>
      </div>
    `).join('');

    const models = (product.models && product.models.length) ? `
      <section class="catalog-models">
        <h4>Model range</h4>
        <div class="catalog-table-wrap">
          <table class="catalog-table">
            <thead>
              <tr><th>Model</th><th>kVA</th><th>kW</th><th>Cylinders</th><th>Fuel consumption</th></tr>
            </thead>
            <tbody>
              ${product.models.map(m => `
                <tr>
                  <td>${m.code}</td>
                  <td>${m.kva ?? '—'}</td>
                  <td>${m.kw ?? '—'}</td>
                  <td>${m.cylinders ?? '—'}</td>
                  <td>${m.fuelCons || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    ` : '';

    const pageFoot = (pageNumber) => `
      <footer class="catalog-page__foot">
        <span>Chroma Power Systems India Pvt. Ltd. · ${CONTACT.sales.emails[0]} · ${CONTACT.sales.phones[1]}</span>
        <span>${ref} · Page ${pageNumber} of ${totalPages}</span>
      </footer>
    `;

    return [
      // 1. Cover
      `
        <div class="catalog-page catalog-page--cover">
          <div class="catalog-cover__brand">
            <span class="catalog-brand">CHROMA<span>·</span>ATOR</span>
            <span class="catalog-brand__tag">Powering a Cleaner, More Efficient Future</span>
          </div>
          <div class="catalog-cover__body">
            <span class="catalog-eyebrow">Product Catalog · ${product.group}</span>
            <h2>${product.name}</h2>
            <p class="catalog-cover__tagline">${product.tagline || ''}</p>
            <div class="catalog-cover__image">
              <img src="${product.image}" alt="${product.name}" draggable="false" />
            </div>
            <div class="catalog-cover__meta">
              <span>Catalog Ref: ${ref}</span>
              <span>Edition 2026</span>
            </div>
          </div>
          ${pageFoot(1)}
        </div>
      `,
      // 2. Overview
      `
        <div class="catalog-page">
          <header class="catalog-page__head">
            <span class="catalog-eyebrow">${product.group}</span>
            <h3>Overview &amp; Applications</h3>
          </header>
          <p class="catalog-lead">${product.description || ''}</p>
          <div class="catalog-two-col">
            <section>
              <h4>Supported fuels</h4>
              <div class="catalog-chips">${fuels || '<span class="catalog-chip">Configurable on request</span>'}</div>
            </section>
            <section>
              <h4>Typical applications</h4>
              <ul class="catalog-list">${applications || '<li>Industrial applications on request</li>'}</ul>
            </section>
          </div>
          <div class="catalog-note">Every unit is engineered to order. Contact our application engineering team for site-specific sizing, fuel quality review and compliance guidance.</div>
          ${pageFoot(2)}
        </div>
      `,
      // 3. Specifications
      `
        <div class="catalog-page">
          <header class="catalog-page__head">
            <span class="catalog-eyebrow">Technical data</span>
            <h3>Engineering Specifications</h3>
          </header>
          <div class="catalog-specs">${specs || '<p>Detailed specifications are available on request.</p>'}</div>
          ${models}
          ${pageFoot(3)}
        </div>
      `,
      // 4. Features
      `
        <div class="catalog-page">
          <header class="catalog-page__head">
            <span class="catalog-eyebrow">Engineering</span>
            <h3>Key Features</h3>
          </header>
          <ul class="catalog-list catalog-list--two">${features || '<li>Feature list available on request.</li>'}</ul>
          <div class="catalog-note">Catalog content is provided for reference only. Specifications are subject to continuous improvement without notice.</div>
          ${pageFoot(4)}
        </div>
      `
    ];
  }

  function renderCatalogsView() {
    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6">
          <div class="text-center max-w-3xl mx-auto mb-10">
            <span class="badge-emerald mb-2">Catalog Library</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight">
              Product Catalogs
            </h1>
            <p class="text-muted mt-3 text-base">
              Browse the technical catalog for every Chroma-Ator product line. Catalogs open in an on-screen viewer and are available for viewing only.
            </p>
          </div>

          <div class="catalog-viewonly-banner">
            <i data-lucide="eye"></i>
            <div>
              <strong>View only.</strong> These catalogs are provided for on-screen reference. Downloading, printing and copying are disabled. Need a copy for a tender? Contact <a href="mailto:sales@chroma-ator.com">sales@chroma-ator.com</a>.
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${STATE.products.map((p, index) => `
              <article class="glass-panel motion-card overflow-hidden flex flex-col group" style="--motion-delay:${index * 50}ms">
                <div class="relative h-48 overflow-hidden">
                  <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain p-3" draggable="false" />
                  <span class="absolute top-4 left-4 badge-emerald">${p.group}</span>
                  <span class="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/80 text-gold border border-gold/40">VIEW ONLY</span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p class="text-[10px] font-mono text-gold uppercase tracking-widest">Catalog ${catalogRef(p)}</p>
                    <h3 class="text-lg font-bold text-pearl mt-1">${p.name}</h3>
                    <p class="text-xs text-muted mt-2 line-clamp-2">${p.short || p.tagline || ''}</p>
                  </div>
                  <div class="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <button type="button" onclick="window.ChromaApp.openCatalog('${p.slug}')" class="text-sm font-semibold text-neon-emerald hover:underline flex items-center gap-1.5">
                      <i data-lucide="book-open" class="w-4 h-4"></i>
                      <span>View Catalog</span>
                    </button>
                    <span class="text-[10px] font-mono text-muted uppercase">No download</span>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function openCatalog(slug) {
    const product = STATE.products.find(p => p.slug === slug);
    if (!product) return;

    STATE.catalogProduct = product;
    STATE.catalogPage = 0;
    STATE.catalogOpen = true;

    const modal = document.getElementById('catalog-modal');
    if (!modal) return;

    modal.classList.add('open', 'active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('catalog-open');

    const title = document.getElementById('catalog-title');
    if (title) title.textContent = product.name;

    const viewer = document.getElementById('catalog-viewer');
    if (viewer) {
      viewer.oncontextmenu = (e) => { e.preventDefault(); return false; };
    }

    renderCatalogPage();
  }

  function closeCatalog() {
    STATE.catalogOpen = false;
    const modal = document.getElementById('catalog-modal');
    if (modal) {
      modal.classList.remove('open', 'active');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('catalog-open');
  }

  function renderCatalogPage() {
    const product = STATE.catalogProduct;
    const viewer = document.getElementById('catalog-viewer');
    if (!product || !viewer) return;

    const pages = buildCatalogPages(product);
    const index = Math.min(Math.max(STATE.catalogPage, 0), pages.length - 1);
    STATE.catalogPage = index;

    viewer.innerHTML = pages[index];
    viewer.scrollTop = 0;

    const indicator = document.getElementById('catalog-page-indicator');
    if (indicator) indicator.textContent = `Page ${index + 1} of ${pages.length}`;

    const prev = document.getElementById('catalog-prev');
    const next = document.getElementById('catalog-next');
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === pages.length - 1;
  }

  function prevCatalogPage() {
    if (!STATE.catalogOpen) return;
    STATE.catalogPage -= 1;
    renderCatalogPage();
  }

  function nextCatalogPage() {
    if (!STATE.catalogOpen) return;
    STATE.catalogPage += 1;
    renderCatalogPage();
  }

  function renderAboutView() {
    appContainer.innerHTML = `
      <section class="about-company py-20 pt-32">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-6">
              <span class="eyebrow">About Chroma-Ator</span>
              <h1 class="text-4xl sm:text-6xl font-extrabold text-pearl tracking-tight leading-tight">
                Three Decades of Innovation. A Legacy of Engineering.
              </h1>
              <p class="text-lg text-muted mt-6 leading-relaxed">
                From generator rentals to pioneering indigenous power generation and gas-energy technologies. Chroma-Ator started operations in 1995 and has grown into a manufacturer and exporter of gas engines, gas and diesel gensets, gas compressors and mobile refuelling units. Gas-powered silent generators were developed in 2008, and the gas generator range now runs from 5 kVA to 20 MW.
              </p>
              <div class="flex flex-wrap gap-8 mt-8">
                <div><strong class="about-stat">1995</strong><span class="about-stat-label">operations began</span></div>
                <div><strong class="about-stat">~5,000</strong><span class="about-stat-label">generators annual capacity</span></div>
                <div><strong class="about-stat">170+</strong><span class="about-stat-label">service dealers</span></div>
                <div><strong class="about-stat">₹200 Mn</strong><span class="about-stat-label">turnover</span></div>
              </div>
            </div>
            <div class="lg:col-span-6">
              <figure class="about-company-figure">
                <img class="about-company-image" src="/images/about-oil-gas.jpg" alt="Oil refinery distillation towers and flare stacks at dusk" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section class="about-founder py-20">
        <div class="container mx-auto px-6">
          <div class="founder-message">
            <figure class="founder-portrait founder-portrait--photo motion-card" style="--motion-delay:80ms">
              <div class="founder-photo-frame">
                <img src="/images/founder-pankaj-saini.jpg" alt="Pankaj Saini, Founder and Managing Director of Chroma-Ator" />
              </div>
              <figcaption>
                <strong>Mr. Pankaj Saini</strong>
                <span>Founder &amp; Managing Director</span>
              </figcaption>
            </figure>

            <div class="founder-letter motion-card" style="--motion-delay:0ms">
              <span class="about-kicker">A message from our founder</span>
              <h2>A Message from Our Founder &amp; Managing Director</h2>
              <p class="founder-letter__lead">Every successful venture begins with a belief – a belief in possibilities, perseverance and the determination to build something meaningful.</p>
              <p>My professional journey began at the age of 16. Starting early taught me lessons that no classroom alone could offer: the value of hard work, responsibility, discipline and continuous learning. As a first-generation entrepreneur, I have always believed in building through experience, taking challenges as opportunities and moving forward with purpose.</p>
              <p>The vision behind Chroma-Ator was to create an organisation that contributes meaningfully to the power generation and energy sector through engineering, innovation and dependable technology.</p>
              <p>Over the years, our focus has remained on understanding the evolving needs of industries and developing solutions that deliver reliability, efficiency and long-term value. From gas-based power generation and Dual Fuel Systems to mobile refuelling and gas dispensing technologies, we continue to strengthen our capabilities and explore new possibilities.</p>
              <p>I believe that progress comes from constantly challenging ourselves, embracing innovation and building relationships founded on trust and integrity.</p>
              <p>As we move forward, our ambition is to take Chroma-Ator beyond boundaries, expand our international presence and establish ourselves as a trusted name in power generation and gas-energy solutions.</p>
              <p>For us, this is more than a business. It is a commitment to engineering progress and powering possibilities.</p>
              <p class="founder-letter__signoff"><strong>Pankaj Saini</strong><span>Founder &amp; Managing Director, Chroma-Ator</span></p>
            </div>
          </div>
        </div>
      </section>

      <section class="about-journey py-20">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mb-12">
            <span class="eyebrow">Our journey</span>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mt-3">Three Decades of Innovation. A Legacy of Engineering.</h2>
            <p class="text-lg text-muted mt-4 leading-relaxed">From generator rentals to pioneering indigenous power generation and gas-energy technologies.</p>
          </div>
          <ol class="journey-list">
            <li class="motion-card" style="--motion-delay:0ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>1995 · The Beginning</h3><p>Started as a generator rental company, laying the foundation for our journey in power generation.</p></div></li>
            <li class="motion-card" style="--motion-delay:50ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>1995–2008 · Diesel Power Generation</h3><p>Expanded our operations in diesel gensets, building industry experience and a strong understanding of power requirements.</p></div></li>
            <li class="motion-card" style="--motion-delay:100ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2008–2009 · India's First Gas Genset</h3><p>Introduced India's first gas genset in collaboration with the CK Birla Group, marking our entry into gas-based power generation.</p></div></li>
            <li class="motion-card" style="--motion-delay:150ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2011 · Gas Engine Manufacturing</h3><p>Expanded into gas engine manufacturing, developing capabilities across different applications and power capacities.</p></div></li>
            <li class="motion-card" style="--motion-delay:200ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2016 · Injector-Based Dual Fuel Technology</h3><p>Introduced India's first injector-based Dual Fuel System, developed through extensive in-house research and engineering.</p></div></li>
            <li class="motion-card" style="--motion-delay:250ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2018 · German Technology Collaboration</h3><p>Established a technology collaboration with Germany for gas engines, strengthening our engineering capabilities.</p></div></li>
            <li class="motion-card" style="--motion-delay:300ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2019 · International Collaboration</h3><p>Entered into a collaboration with Siemens, Spain, for gas engine technology.</p></div></li>
            <li class="motion-card" style="--motion-delay:350ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2020 · India's First 1 MW HCNG Genset</h3><p>Introduced India's first 1 MW Hydrogen-enriched Compressed Natural Gas (HCNG) genset, advancing our work in alternative-fuel power generation.</p></div></li>
            <li class="motion-card" style="--motion-delay:400ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2021 · Independent Module Innovation</h3><p>Introduced an innovative independent module, representing another milestone in our product engineering and technology development.</p></div></li>
            <li class="motion-card" style="--motion-delay:450ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2022–2023 · Indigenous Dispenser Manufacturing</h3><p>Became the first Indian company to manufacture dispensers, according to the company's historical milestone.</p></div></li>
            <li class="motion-card" style="--motion-delay:500ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2023 · Floating Composite Dispensing Unit</h3><p>Developed and introduced an innovative floating Composite Dispensing Unit in Varanasi, demonstrating our ability to engineer solutions for specialised applications.</p></div></li>
            <li class="motion-card" style="--motion-delay:550ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2023 · Recognition for R&amp;D Excellence</h3><p>Received a special award from DRDO for research and development activities.</p></div></li>
            <li class="motion-card" style="--motion-delay:600ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2024 · Compact CNG Technology</h3><p>Advanced compact CNG solutions with an exceptionally small equipment footprint.</p></div></li>
            <li class="motion-card" style="--motion-delay:650ms"><span class="journey-list__marker" aria-hidden="true"></span><div><h3>2025–Present · The Journey Continues</h3><p>Continuing to innovate, strengthen our manufacturing capabilities and expand our presence in the evolving global energy market.</p></div></li>
          </ol>
          <p class="journey-closing">Engineering Tomorrow, Today.</p>
        </div>
      </section>

      <section class="about-factory py-20" id="factory">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mb-12">
            <span class="about-kicker">Inside our facility</span>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mt-4">Where Engineering Takes Shape.</h2>
            <p class="text-lg text-muted mt-4 leading-relaxed">Gas gensets, engines and gas-energy equipment are assembled, integrated and prepared for dispatch at our manufacturing facility in India.</p>
          </div>
          <div class="factory-gallery">
            <figure class="factory-shot factory-shot--feature motion-card" style="--motion-delay:0ms">
              <img src="/images/about-factory-01.jpg" alt="Gas generator sets assembled inside the Chroma-Ator manufacturing facility" loading="lazy" />
            </figure>
            <figure class="factory-shot factory-shot--tall motion-card" style="--motion-delay:60ms">
              <img src="/images/about-factory-02.jpg" alt="Rows of gas gensets in the Chroma-Ator production bay" loading="lazy" />
            </figure>
            <figure class="factory-shot factory-shot--tall motion-card" style="--motion-delay:120ms">
              <img src="/images/about-factory-03.jpg" alt="Overhead crane moving generator sets at the Chroma-Ator factory" loading="lazy" />
            </figure>
            <figure class="factory-shot factory-shot--wide motion-card" style="--motion-delay:180ms">
              <img src="/images/about-factory-04.jpg" alt="Chroma-Ator manufacturing hall with overhead cranes and gas gensets" loading="lazy" />
            </figure>
            <figure class="factory-shot factory-shot--wide motion-card" style="--motion-delay:240ms">
              <img src="/images/about-factory-05.jpg" alt="Gas genset assembly floor at the Chroma-Ator facility" loading="lazy" />
            </figure>
          </div>
          <p class="factory-gallery__note">Gas genset assembly and testing bays at our manufacturing facility in India.</p>
          <div class="factory-location">
            <div class="factory-address">
              <span class="about-kicker">Manufacturing unit</span>
              <p class="factory-address__line">${CONTACT.manufacturingAddress}</p>
              <a class="factory-address__link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(CONTACT.manufacturingAddress)}" target="_blank" rel="noopener noreferrer">
                <i data-lucide="map-pin" class="w-4 h-4"></i>
                <span>Get directions</span>
                <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
              </a>
            </div>
            <figure class="factory-map">
              <iframe
                class="factory-map__frame"
                title="Map showing the Chroma-Ator manufacturing unit in Dholpur, Rajasthan"
                src="https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.manufacturingAddress)}&amp;z=13&amp;output=embed"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen>
              </iframe>
              <figcaption class="factory-map__caption">Dholpur, Rajasthan · India</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="about-why py-20">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mb-12">
            <span class="about-kicker">Why Chroma-Ator?</span>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mt-4">Experience That Powers Innovation. Engineering That Builds Trust.</h2>
            <p class="text-lg text-muted mt-5 leading-relaxed">With a journey spanning three decades, Chroma-Ator combines engineering experience, indigenous product development and in-house manufacturing to deliver specialised power generation and gas-energy solutions.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <article class="purpose-item motion-card" style="--motion-delay:0ms"><div class="purpose-item__bg" style="background-image:url('/images/about-factory-01.jpg')" aria-hidden="true"></div><span>01 / Since 1995</span><h3>Three Decades of Industry Experience</h3><p>Established in 1995, our journey spans generator rentals, diesel gensets and advanced gas-energy technologies.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:60ms"><div class="purpose-item__bg" style="background-image:url('/images/about-factory-02.jpg')" aria-hidden="true"></div><span>02 / Manufacturing</span><h3>In-House Manufacturing</h3><p>Our products are manufactured in-house, allowing us to maintain greater control over production, engineering and quality.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:120ms"><div class="purpose-item__bg" style="background-image:url('/images/about-factory-03.jpg')" aria-hidden="true"></div><span>03 / R&amp;D</span><h3>Research &amp; Development</h3><p>We invest in product research, engineering trials and continuous development to create solutions for evolving industry requirements.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:180ms"><div class="purpose-item__bg" style="background-image:url('/images/about-factory-04.jpg')" aria-hidden="true"></div><span>04 / Innovation</span><h3>Indigenous Product Innovation</h3><p>From injector-based Dual Fuel Systems to specialised gas dispensing technologies, we focus on developing our own products and engineering capabilities.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:0ms"><div class="purpose-item__bg" style="background-image:url('/images/about-factory-05.jpg')" aria-hidden="true"></div><span>05 / Collaboration</span><h3>Global Technology Collaborations</h3><p>Our technology collaborations with international organisations have helped strengthen our knowledge and capabilities in gas engine technology.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:60ms"><div class="purpose-item__bg" style="background-image:url('/images/about-oil-gas.jpg')" aria-hidden="true"></div><span>06 / Approvals</span><h3>Regulatory Approvals</h3><p>Our applicable products have received PESO approvals, demonstrating our focus on meeting relevant regulatory and safety requirements.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:120ms"><div class="purpose-item__bg" style="background-image:url('/images/gas-generator-set.jpg')" aria-hidden="true"></div><span>07 / Portfolio</span><h3>Diverse Product Portfolio</h3><p>Our capabilities extend across Gas Gensets, DFS, MRU, CDU, Gas Engines, Compressors, Dispensers, Cascades and DCUs.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:180ms"><div class="purpose-item__bg" style="background-image:url('/images/genset-installation.jpg')" aria-hidden="true"></div><span>08 / Projects</span><h3>Project-Based Engineering Experience</h3><p>Our experience in tender-based projects and specialised installations reflects our ability to work with diverse technical and project requirements.</p></article>
          </div>
          <aside class="why-closing motion-card">
            <h3>More Than Manufacturing. We Engineer Possibilities.</h3>
            <p>At Chroma-Ator, we believe in developing solutions through experience, engineering knowledge and continuous innovation. Every product represents our commitment to creating technology that serves real-world industrial needs.</p>
          </aside>
        </div>
      </section>

      ${renderIndustriesSection()}

      <section class="about-related py-20">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mb-12">
            <span class="about-kicker">Relevant products</span>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mt-4">Related Products &amp; Equipment</h2>
            <p class="text-lg text-muted mt-4 leading-relaxed">Explore our additional range of gas-energy equipment and associated solutions.</p>
          </div>
          <div class="related-grid">
            <article class="related-card motion-card" style="--motion-delay:0ms"><span>01</span><h3>Gas Engines</h3><p>Engine solutions for gas-powered applications.</p></article>
            <article class="related-card motion-card" style="--motion-delay:60ms"><span>02</span><h3>Compressors</h3><p>Motor-driven and engine-driven options.</p></article>
            <article class="related-card motion-card" style="--motion-delay:120ms"><span>03</span><h3>Dispensers</h3><p>Dispensing solutions designed for efficient, reliable and accurate vehicle refuelling at gas stations.</p></article>
            <article class="related-card motion-card" style="--motion-delay:180ms"><span>04</span><h3>Cascades</h3><p>High-pressure gas storage solutions.</p></article>
            <article class="related-card motion-card" style="--motion-delay:240ms"><span>05</span><h3>DCU – Decompression Unit</h3><p>Gas decompression and pressure reduction equipment.</p></article>
          </div>
        </div>
      </section>

      <section class="about-purpose py-20">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mb-12">
            <span class="about-kicker">What guides us</span>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mt-4">Engineering for the long run.</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <article class="purpose-item motion-card" style="--motion-delay:0ms"><div class="purpose-item__bg" style="background-image:url('/images/vision-sustainable-energy.jpg')" aria-hidden="true"></div><span>01 / Vision</span><h3>Energise with better technology</h3><p>Energise the world with better technology, green energy and world-class service.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:80ms"><div class="purpose-item__bg" style="background-image:url('/images/mission-green-manufacturing.jpg')" aria-hidden="true"></div><span>02 / Mission</span><h3>Manufacture for green energy</h3><p>Manufacture and market generating sets and other equipment fuelled by green energy, with better technology and systems integration.</p></article>
            <article class="purpose-item motion-card" style="--motion-delay:160ms"><div class="purpose-item__bg" style="background-image:url('/images/approach-client-partnership.jpg')" aria-hidden="true"></div><span>03 / Approach</span><h3>Work with our clients</h3><p>Encourage constant client feedback on products and service quality, and keep upgrading products and production systems.</p></article>
          </div>
          <a href="#products" class="btn-luxury mt-10">Explore Products in 3D</a>
        </div>
      </section>
    `;
  }

  function renderInternationalView() {
    appContainer.innerHTML = `
      <div class="intl-page">
        <section class="intl-hero" style="background-image:url('/images/intl-partners.jpg')">
          <div class="intl-hero__overlay"></div>
          <div class="container intl-hero__inner">
            <span class="intl-eyebrow">${CONTACT.international.company}</span>
            <h1>Indian Engineering.<br />Global Opportunities.</h1>
            <p class="intl-hero__lead">Taking power generation and gas-energy solutions to international markets.</p>
            <p>${CONTACT.international.company} is focused on expanding the global reach of Chroma-Ator's engineering and manufacturing capabilities. Our international business office is at ${CONTACT.international.office}. With a manufacturing foundation in India, we aim to connect international customers with reliable power generation and gas-energy products.</p>
            <p>Our business focuses on international product sales, exports, distribution partnerships and project-based opportunities across global markets.</p>
            <div class="intl-actions">
              <button type="button" onclick="document.getElementById('intl-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })" class="btn-luxury">Explore Our Products</button>
              <button type="button" onclick="document.getElementById('intl-partners')?.scrollIntoView({ behavior: 'smooth', block: 'start' })" class="btn-luxury-outline">Become Our Partner</button>
            </div>
          </div>
        </section>

        <section class="intl-about" id="intl-about">
          <div class="container intl-split">
            <div class="intl-media intl-media--about">
              <img src="/images/international-dubai.jpg" alt="Dubai skyline modern business district" loading="lazy" />
            </div>
            <div class="intl-copy">
              <span class="intl-kicker">About our international business</span>
              <h2>Connecting Engineering Capabilities with Global Markets</h2>
              <p>Our international business brings together Indian manufacturing capabilities and opportunities across international markets.</p>
              <p>We aim to serve customers seeking dependable equipment for power generation, gas infrastructure and industrial applications. Through product supply, commercial coordination and business partnerships, we are working to build a strong international network.</p>
            </div>
          </div>
          <div class="container intl-clients">
            <p class="intl-clients__label">Our Clients</p>
            <div class="intl-clients__grid">
              <img src="/images/clients/ambuja-cement.jpg" alt="Ambuja Cement" loading="lazy" />
              <img src="/images/clients/bharat-steel.jpg" alt="Bharat Steel" loading="lazy" />
              <img src="/images/clients/bhutani.jpg" alt="Bhutani Infra" loading="lazy" />
              <img src="/images/clients/iem.jpg" alt="IEM" loading="lazy" />
              <img src="/images/clients/pcj.jpg" alt="PCJ" loading="lazy" />
              <img src="/images/clients/torrent-gas.jpg" alt="Torrent Gas" loading="lazy" />
              <img src="/images/clients/tough-security.jpg" alt="Tough Security Services" loading="lazy" />
              <img src="/images/clients/rotatory.jpg" alt="Rotatory" loading="lazy" />
              <img src="/images/clients/ambuja-cement.jpg" alt="Ambuja Cement" loading="lazy" />
              <img src="/images/clients/bharat-steel.jpg" alt="Bharat Steel" loading="lazy" />
              <img src="/images/clients/bhutani.jpg" alt="Bhutani Infra" loading="lazy" />
              <img src="/images/clients/iem.jpg" alt="IEM" loading="lazy" />
              <img src="/images/clients/pcj.jpg" alt="PCJ" loading="lazy" />
              <img src="/images/clients/torrent-gas.jpg" alt="Torrent Gas" loading="lazy" />
              <img src="/images/clients/tough-security.jpg" alt="Tough Security Services" loading="lazy" />
              <img src="/images/clients/rotatory.jpg" alt="Rotatory" loading="lazy" />
            </div>
          </div>
        </section>

        <section class="intl-products" id="intl-products">
          <div class="container">
            <div class="intl-section-head">
              <span class="intl-kicker">Products available for international markets</span>
              <h2>Our Product Portfolio</h2>
              <p>We offer a range of products for international customers, distributors and project requirements.</p>
            </div>
            <h3 class="intl-subhead">Main Products</h3>
            <div class="intl-product-grid">
              <article class="intl-product-card">
                <div class="intl-media intl-media--product"><img src="/images/intl-gas-genset.jpg" alt="Chroma-Ator gas genset" loading="lazy" /></div>
                <div class="intl-product-card__body">
                  <span>01</span>
                  <h4>Gas Gensets</h4>
                  <p>Gas-powered generator solutions for industrial, commercial and infrastructure power requirements.</p>
                </div>
              </article>
              <article class="intl-product-card">
                <div class="intl-media intl-media--product"><img src="/images/intl-dfs.jpg" alt="Chroma-Ator dual fuel system" loading="lazy" /></div>
                <div class="intl-product-card__body">
                  <span>02</span>
                  <h4>Dual Fuel Systems (DFS)</h4>
                  <p>Systems designed to operate compatible diesel engines using diesel and gaseous fuel simultaneously.</p>
                </div>
              </article>
              <article class="intl-product-card">
                <div class="intl-media intl-media--product"><img src="/images/intl-mru.jpg" alt="Chroma-Ator mobile refuelling unit truck" loading="lazy" /></div>
                <div class="intl-product-card__body">
                  <span>03</span>
                  <h4>Mobile Refuelling Units (MRU)</h4>
                  <p>Mobile gas refuelling solutions available in motor-driven and engine-driven configurations.</p>
                </div>
              </article>
              <article class="intl-product-card">
                <div class="intl-media intl-media--product"><img src="/images/cdu-unit.jpg" alt="Chroma-Ator composite dispensing unit" loading="lazy" /></div>
                <div class="intl-product-card__body">
                  <span>04</span>
                  <h4>Composite Dispensing Units (CDU)</h4>
                  <p>Composite-based gas dispensing solutions for fixed and specialised applications.</p>
                </div>
              </article>
            </div>
            <div class="intl-additional">
              <h3 class="intl-subhead">Additional Products &amp; Equipment</h3>
              <ul class="intl-tags">
                <li>Gas Engines</li>
                <li>Gas Compressors</li>
                <li>Dispensers</li>
                <li>Dispenser Cascades</li>
                <li>Decompression Units (DCU)</li>
              </ul>
              <p>Contact our team for product specifications, technical documentation, drawings and commercial enquiries.</p>
              <button onclick="window.ChromaApp.openQuoteModal('International Product Enquiry', 'I would like product specifications, technical documentation, drawings or a commercial quotation.', 'international')" class="btn-luxury">Enquire About Products</button>
            </div>
          </div>
        </section>

        <section class="intl-presence" id="intl-presence">
          <div class="container">
            <div class="intl-section-head">
              <span class="intl-kicker">Our international presence</span>
              <h2>Two Locations. One Connected Business.</h2>
            </div>
            <div class="intl-presence-grid">
              <article class="intl-presence-card">
                <div class="intl-media intl-media--presence"><img src="/images/intl-uae.jpg" alt="Chroma-Ator international customer and export network" loading="lazy" /></div>
                <div class="intl-presence-card__body">
                  <span>UAE</span>
                  <h3>International Business Office</h3>
                  <p>Our UAE office serves as an international point of contact for customer enquiries, business development and partnership opportunities, with a focus on the Middle East and other global markets.</p>
                </div>
              </article>
              <article class="intl-presence-card">
                <div class="intl-media intl-media--presence"><img src="/images/intl-india.jpg" alt="Chroma-Ator manufacturing facility in India" loading="lazy" /></div>
                <div class="intl-presence-card__body">
                  <span>India</span>
                  <h3>Manufacturing &amp; Engineering</h3>
                  <p>India is the foundation of our manufacturing and engineering capabilities, supporting product development, manufacturing coordination and international product supply.</p>
                </div>
              </article>
            </div>
            <p class="intl-presence__closing">Connecting Indian Manufacturing with International Opportunities.</p>
          </div>
        </section>

        <section class="intl-globe" id="intl-globe">
          <div class="container intl-globe__grid">
            <div class="intl-globe__copy">
              <span class="intl-kicker intl-kicker--light">Global footprint</span>
              <h2>One Connected Network. Many Markets.</h2>
              <p>From our international business office in Ras Al Khaimah and our manufacturing base in India, Chroma-Ator connects with customers, distributors and project partners across regions. Drag the globe to explore our international network.</p>
              <ul class="intl-tags intl-tags--dark">
                <li>Middle East</li>
                <li>Africa</li>
                <li>Asia-Pacific</li>
                <li>Other Global Markets</li>
              </ul>
            </div>
            <div class="intl-globe__stage">
              <div class="globe-stage">
                <canvas id="intl-globe-canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>
                <div class="intl-globe__hint">Interactive 3D Globe • Drag to spin</div>
              </div>
            </div>
          </div>
        </section>

        <section class="intl-markets" id="intl-markets">
          <div class="container">
            <div class="intl-section-head">
              <span class="intl-kicker">Markets &amp; industries</span>
              <h2>Exploring Opportunities Across Global Markets</h2>
              <p>We are looking to develop business relationships across:</p>
            </div>
            <div class="intl-map">
              <img src="/images/intl-markets.jpg" alt="World map showing Chroma-Ator export markets and client network" loading="lazy" />
            </div>
            <div class="intl-market-grid">
              <article class="intl-market-card"><h3>Middle East</h3><p>UAE, Saudi Arabia, Oman, Qatar, Kuwait and other GCC markets.</p></article>
              <article class="intl-market-card"><h3>Africa</h3><p>Opportunities in energy, industrial and gas infrastructure.</p></article>
              <article class="intl-market-card"><h3>Asia-Pacific</h3><p>Growing industrial and energy markets.</p></article>
              <article class="intl-market-card"><h3>Other Global Markets</h3><p>International product enquiries and business collaborations are welcome.</p></article>
            </div>
            <div class="intl-industries">
              <h3>Industries we cater to include:</h3>
              <ul class="intl-tags">
                <li>Oil &amp; Gas</li>
                <li>City Gas Distribution</li>
                <li>Power Generation</li>
                <li>CNG Infrastructure</li>
                <li>Manufacturing</li>
                <li>Data Centres</li>
                <li>Transportation</li>
                <li>Infrastructure Development</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="intl-support" id="intl-support">
          <div class="container intl-split intl-split--support">
            <div class="intl-media intl-media--support">
              <img src="/images/intl-support.jpg" alt="Chroma-Ator gas refuelling project installation" loading="lazy" />
            </div>
            <div class="intl-copy">
              <span class="intl-kicker">International sales &amp; project enquiries</span>
              <h2>The Right Products for Your Requirements</h2>
              <p>We welcome international enquiries from customers seeking equipment for their projects and business operations.</p>
              <h3>Our team can coordinate:</h3>
              <ul class="intl-check-list">
                <li>Product selection and application discussions.</li>
                <li>Available technical specifications and drawings.</li>
                <li>Project-specific requirements.</li>
                <li>Commercial quotations and product supply.</li>
                <li>Manufacturing and export coordination.</li>
                <li>Installation, commissioning and technical support arrangements, according to the agreed project scope.</li>
              </ul>
              <button type="button" onclick="document.getElementById('intl-contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })" class="btn-luxury">Start an Enquiry</button>
            </div>
          </div>
        </section>

        <section class="intl-partners" id="intl-partners" style="background-image:url('/images/international-hero.jpg')">
          <div class="intl-partners__overlay"></div>
          <div class="container intl-partners__inner">
            <div class="intl-section-head">
              <span class="intl-kicker intl-kicker--light">Become our international partner</span>
              <h2>Let's Grow Together</h2>
              <p>We are actively looking to establish relationships with businesses interested in representing, distributing or sourcing our products in international markets.</p>
            </div>
            <h3 class="intl-subhead intl-subhead--light">We welcome enquiries from:</h3>
            <div class="intl-partner-grid">
              <div class="intl-partner-card">Distributors &amp; Dealers</div>
              <div class="intl-partner-card">EPC Contractors &amp; Project Developers</div>
              <div class="intl-partner-card">Oil &amp; Gas and Energy Companies</div>
              <div class="intl-partner-card">City Gas Distribution Companies</div>
              <div class="intl-partner-card">Industrial Equipment Suppliers</div>
              <div class="intl-partner-card">Strategic Business &amp; Technology Partners</div>
            </div>
            <p class="intl-partners__note">If you are interested in distributing our products, collaborating on a project or exploring a long-term business relationship, we would be pleased to connect.</p>
            <button onclick="window.ChromaApp.openQuoteModal('International Partnership', 'I am interested in representing, distributing or sourcing Chroma-Ator products in an international market.', 'international')" class="btn-luxury">Become a Partner</button>
          </div>
        </section>

        <section class="intl-contact" id="intl-contact">
          <div class="container intl-contact__grid">
            <div class="intl-contact__copy">
              <span class="intl-kicker intl-kicker--light">Let's connect</span>
              <h2>Have a Product Requirement or a Business Opportunity?</h2>
              <p>Whether you are looking to purchase our products, request a quotation, discuss a project or explore a distribution opportunity, connect with ${CONTACT.international.company}.</p>
              <div class="intl-contact__details">
                <strong>${CONTACT.international.company}</strong>
                <p>International Business Office: ${CONTACT.international.office}</p>
                <p>Manufacturing Unit: ${CONTACT.manufacturingAddress}</p>
                <p class="intl-contact__group-title">Contact our international team</p>
                <p>Mob: ${CONTACT.international.phones.map(p => `${contactPhone(p.display)} (${p.label})`).join(' · ')}</p>
                <p>Email: ${contactEmail(CONTACT.international.email)}</p>
                <p class="intl-contact__group-title">Contact details</p>
                <p>Sales: ${CONTACT.sales.phones.map(contactPhone).join(' · ')}<br />${CONTACT.sales.emails.map(contactEmail).join(' · ')}</p>
                <p>Engineer: ${CONTACT.engineer.name}<br />${CONTACT.engineer.phones.map(contactPhone).join(' · ')} · ${contactEmail(CONTACT.engineer.email)}</p>
                <p>Service: ${CONTACT.service.phones.map(contactPhone).join(' · ')}<br />${contactEmail(CONTACT.service.email)}</p>
              </div>
              <button onclick="window.ChromaApp.openQuoteModal('International Business Enquiry', 'I would like to connect with the Chroma-Ator International team.', 'international')" class="btn-luxury">Contact Our International Team</button>
              <p class="intl-contact__closing">Connecting Indian Engineering with Global Opportunities.</p>
            </div>
            <form class="intl-form" onsubmit="window.ChromaApp.submitContactForm(event)">
              <input type="hidden" name="type" value="international" />
              <div class="intl-form__row">
                <label>Name *<input type="text" name="name" required /></label>
                <label>Company<input type="text" name="company" /></label>
              </div>
              <div class="intl-form__row">
                <label>Email *<input type="email" name="email" required /></label>
                <label>Phone *<input type="tel" name="phone" required /></label>
              </div>
              <div class="intl-form__row">
                <label>Country / Region<input type="text" name="city" /></label>
                <label>Product Interest
                  <select name="product">
                    <option>Gas Gensets</option>
                    <option>Dual Fuel Systems (DFS)</option>
                    <option>Mobile Refuelling Units (MRU)</option>
                    <option>Composite Dispensing Units (CDU)</option>
                    <option>Gas Engines</option>
                    <option>Gas Compressors</option>
                    <option>Dispensers</option>
                    <option>Dispenser Cascades</option>
                    <option>Decompression Units (DCU)</option>
                    <option>Partnership / Distribution</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>
              <label>Message<textarea name="message" rows="4"></textarea></label>
              <button type="submit" class="btn-luxury">Send Enquiry</button>
            </form>
          </div>
        </section>
      </div>
    `;

    // Initialize the international globe after its canvas is attached.
    setTimeout(() => {
      if (window.ChromaGlobe) {
        window.ChromaGlobe.init('intl-globe-canvas', {
          nodes: INTERNATIONAL_NODES,
          mode: 'international',
          showLabels: false
        });
      }
    }, 150);
  }

  // 4. PRODUCT DETAIL VIEW
  function renderProductDetailView(slug) {
    const product = STATE.products.find(p => p.slug === slug);
    if (!product) {
      appContainer.innerHTML = `
        <div class="min-h-screen pt-32 text-center text-pearl">
          <h2 class="text-2xl font-bold">Product Not Found</h2>
          <p class="text-muted mt-2">The requested product could not be located.</p>
          <a href="#products" class="btn-luxury mt-6">Return to Products</a>
        </div>
      `;
      return;
    }

    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6 max-w-6xl">
          <!-- Back Link -->
          <a href="#products" class="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-neon-emerald mb-6">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            <span>Back to All Products</span>
          </a>

          <!-- Product Hero Banner -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            <div class="lg:col-span-7">
              <span class="badge-emerald mb-3">${product.group}</span>
              <h1 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mb-3">
                ${product.name}
              </h1>
              <p class="text-sm font-mono text-gold mb-6">${product.tagline || ''}</p>
              <p class="text-muted leading-relaxed text-base mb-6">${product.description}</p>

              <!-- Fuel compatibility badges -->
              <div class="mb-8">
                <span class="text-xs font-mono uppercase text-muted block mb-2">Fuel / Configuration:</span>
                <div class="flex flex-wrap gap-2">
                  ${(product.fuels || []).map(f => `
                    <span class="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-pearl flex items-center gap-1.5">
                      <i data-lucide="flame" class="w-3.5 h-3.5 text-neon-emerald"></i>
                      <span>${f}</span>
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- Action CTAs -->
              <div class="flex flex-wrap gap-4">
                <button onclick="window.ChromaApp.openQuoteModal('${product.name}')" class="btn-luxury">
                  <i data-lucide="file-text" class="w-4 h-4"></i>
                  <span>Request Engineering Quote</span>
                </button>
                ${has360Photo(product.slug) ? `
                  <button type="button" onclick="window.ChromaApp.open360Studio('${STUDIO_360_BY_PRODUCT[product.slug]}')" class="btn-luxury-outline">
                    <i data-lucide="rotate-cw" class="w-4 h-4"></i>
                    <span>View in 3D Studio</span>
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Image Card -->
            <div class="lg:col-span-5">
              <div class="glass-panel overflow-hidden p-2">
                <img src="${product.image}" alt="${product.name}" class="w-full h-80 object-contain rounded-xl bg-[#F7F8F6] p-3" />
              </div>
            </div>
          </div>

          <!-- Technical Specifications Table -->
          <div class="glass-panel p-6 sm:p-8 mb-12">
            <h3 class="text-xl font-bold text-pearl mb-6 flex items-center gap-2">
              <i data-lucide="sliders" class="w-5 h-5 text-neon-emerald"></i>
              <span>Engineering Specifications</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${(product.specs || []).map(s => `
                <div class="flex items-center justify-between p-3.5 rounded-lg bg-white/5 border border-white/5">
                  <span class="text-xs font-mono text-muted">${s.label}</span>
                  <span class="text-xs font-mono font-bold text-pearl text-right">${s.value}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Key Features & Applications -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div class="glass-panel p-6">
              <h3 class="text-lg font-bold text-pearl mb-4 flex items-center gap-2">
                <i data-lucide="check-circle" class="w-5 h-5 text-neon-emerald"></i>
                <span>Key Engineering Features</span>
              </h3>
              <ul class="space-y-3 text-sm text-muted">
                ${(product.features || []).map(f => `
                  <li class="flex items-start gap-2.5">
                    <span class="text-neon-emerald mt-1 font-bold">›</span>
                    <span>${f}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="glass-panel p-6">
              <h3 class="text-lg font-bold text-pearl mb-4 flex items-center gap-2">
                <i data-lucide="building" class="w-5 h-5 text-gold"></i>
                <span>Typical Industrial Applications</span>
              </h3>
              <ul class="space-y-3 text-sm text-muted">
                ${(product.applications || []).map(a => `
                  <li class="flex items-start gap-2.5">
                    <span class="text-gold mt-1 font-bold">›</span>
                    <span>${a}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // INDUSTRIES SECTION (rendered within the About page)
  function renderIndustriesSection() {
    return `
      <section class="about-industries py-20" id="industries">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mb-12">
            <span class="about-kicker">Industries &amp; relevant products</span>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight mt-4">Industries We Serve</h2>
            <p class="text-muted mt-4 text-base">
              Power generation, gas handling and refuelling solutions engineered for the operational challenges of each industry.
            </p>
          </div>

          <div class="industry-grid">
            ${INDUSTRY_SECTORS.map((item, index) => `
              <article class="industry-card motion-card" style="--motion-delay:${index * 60}ms">
                <div class="industry-card__bg" style="background-image:url('${item.image || ''}')" aria-hidden="true"></div>
                <div class="industry-card__top">
                  <span class="industry-card__num">${String(index + 1).padStart(2, '0')}</span>
                  <h3>${item.title}</h3>
                </div>
                <p class="industry-card__desc">${item.desc}</p>
                <div class="industry-card__products">
                  <span class="industry-card__label">Relevant products</span>
                  <ul>${(item.products || []).map(product => `<li>${product}</li>`).join('')}</ul>
                </div>
                <button onclick="window.ChromaApp.openQuoteModal('${item.title}')" class="industry-card__cta">
                  <span>Enquire for this sector</span>
                  <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </button>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 8. PROJECTS VIEW
  function renderProjectsView() {
    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6 max-w-5xl">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge-emerald mb-2">Track Record</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight">
              Selected Installations
            </h1>
            <p class="text-muted mt-3 text-base">
              Gas generators, dual-fuel systems and water metering projects delivered for city gas distribution, public infrastructure, telecom and municipal utilities.
            </p>
          </div>

          <div class="space-y-8">
            ${PROJECT_CASES.map((project, index) => `
              <div class="glass-panel motion-card overflow-hidden grid grid-cols-1 md:grid-cols-12" style="--motion-delay:${index * 70}ms">
                <div class="md:col-span-5 h-64 md:h-auto">
                  ${project.image
                    ? `<img src="${project.image}" alt="${project.title}" class="w-full h-full object-contain bg-[#F7F8F6] p-3" />`
                    : `<div class="w-full h-full min-h-[16rem] flex items-center justify-center bg-white/5"><i data-lucide="${project.icon || 'droplets'}" class="w-16 h-16 text-neon-emerald/60"></i></div>`}
                </div>
                <div class="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span class="badge-emerald mb-2">${project.category}</span>
                    <h3 class="text-2xl font-bold text-pearl">${project.title}</h3>
                    <p class="text-xs font-mono text-gold mt-1">${project.client}</p>
                    <p class="text-sm text-muted mt-3 leading-relaxed">${project.summary}</p>
                  </div>
                  <div class="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                    ${(project.tags || []).map(tag => `<span class="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/5 text-muted border border-white/10">${tag}</span>`).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;

    if (window.lucide) window.lucide.createIcons();
    setupScrollReveals();
  }

  // 9. CAREERS VIEW
  function renderCareersView() {
    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6 max-w-5xl">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge-emerald mb-2">Join Our Mission</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight">
              Build Your Career in Clean Energy
            </h1>
            <p class="text-muted mt-3 text-base">
              Chroma-Ator has manufactured gas engines, generators and refuelling equipment in India since 1995. Join a team working across gas power generation, clean fuels and municipal water metering.
            </p>
          </div>

          <!-- Open Roles List -->
          <div class="glass-panel motion-card p-6 sm:p-8 mb-12" style="--motion-delay:0ms">
            <h3 class="text-xl font-bold text-pearl mb-6 flex items-center gap-2">
              <i data-lucide="briefcase" class="w-5 h-5 text-neon-emerald"></i>
              <span>Current Open Positions</span>
            </h3>

            <div class="space-y-4" id="careers-jobs-list">
              <div class="text-center py-8 text-muted font-mono text-xs">Loading open opportunities...</div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Fetch and display active jobs
    fetch('/api/jobs')
      .then(r => r.json())
      .then(res => {
        const jobsList = document.getElementById('careers-jobs-list');
        if (!jobsList) return;

        if (!res.data || res.data.length === 0) {
          jobsList.innerHTML = `<div class="text-center py-6 text-muted text-sm">No vacancies currently open. You can still submit an open technical application below.</div>`;
          return;
        }

        jobsList.innerHTML = res.data.map((job, index) => `
          <div class="motion-card p-5 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style="--motion-delay:${index * 70}ms">
            <div>
              <span class="text-xs font-mono text-neon-emerald uppercase tracking-wider">${job.department} • ${job.location}</span>
              <h4 class="text-lg font-bold text-pearl mt-1">${job.title}</h4>
              <p class="text-xs text-muted mt-1 max-w-2xl">${job.description}</p>
              <div class="text-xs font-mono text-gold mt-2">Required: ${job.requirements}</div>
            </div>
            <button onclick="window.ChromaApp.openJobModal('${job.id}', '${job.title}')" class="btn-luxury !px-4 !py-2 text-xs shrink-0">
              Apply Now
            </button>
          </div>
        `).join('');

        setupScrollReveals();
        if (window.lucide) window.lucide.createIcons();
      })
      .catch(() => {
        const jobsList = document.getElementById('careers-jobs-list');
        if (jobsList) jobsList.innerHTML = `<div class="text-center py-4 text-muted text-xs">Failed to load vacancies.</div>`;
      });
  }

  // 10. SERVICE & SUPPORT VIEW
  function renderSupportView() {
    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6 max-w-4xl">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge-emerald mb-2">Customer Assurance</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight">
              Service &amp; Technical Support
            </h1>
            <p class="text-muted mt-3 text-base">
              Chroma-Ator products are backed by more than 170 service dealers spanning the country, along with an after-sales support system for installations and service quality.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div class="glass-panel p-6">
              <h3 class="text-lg font-bold text-pearl mb-3">Service Dealer Network</h3>
              <p class="text-xs text-muted mb-4">More than 170 service dealers across India support Chroma-Ator products in the field.</p>
              <p class="text-lg font-mono font-bold text-neon-emerald">${CONTACT.service.phones.map(contactPhone).join(' · ')}</p>
              <p class="text-xs font-mono text-muted mt-1">${contactEmail(CONTACT.service.email)}</p>
            </div>

            <div class="glass-panel p-6">
              <h3 class="text-lg font-bold text-pearl mb-3">Water Meter O&amp;M</h3>
              <p class="text-xs text-muted mb-4">Seven-year O&amp;M from the date of installation for both AMR and non-AMR meters in Delhi, including testing of new meters, handheld readings and data for bill generation.</p>
              <button onclick="window.ChromaApp.openQuoteModal('Water Meter O&M')" class="btn-luxury-outline text-xs">
                Inquire About Water Meter O&amp;M
              </button>
            </div>

            <div class="glass-panel p-6">
              <h3 class="text-lg font-bold text-pearl mb-3">Annual Maintenance Contracts</h3>
              <p class="text-xs text-muted mb-4">Comprehensive and non-comprehensive AMC agreements for generator sets and gas equipment.</p>
              <button onclick="window.ChromaApp.openQuoteModal('Annual Maintenance Contract (AMC)')" class="btn-luxury-outline text-xs">
                Inquire About AMC Plans
              </button>
            </div>

            <div class="glass-panel p-6">
              <h3 class="text-lg font-bold text-pearl mb-3">Installation &amp; Commissioning</h3>
              <p class="text-xs text-muted mb-4">Design, manufacturing, installation, commissioning, synchronization systems, control panels and acoustic enclosures are delivered as part of Chroma-Ator's turnkey scope.</p>
              <button onclick="window.ChromaApp.openQuoteModal('Installation & Commissioning')" class="btn-luxury-outline text-xs">
                Discuss a Project
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 11. CONTACT & RFQ VIEW
  function renderContactView() {
    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6 max-w-5xl">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge-emerald mb-2">Direct Channel</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-pearl tracking-tight">
              Contact Chroma-Ator
            </h1>
            <p class="text-muted mt-3 text-base">
              Speak with our sales team regarding commercial quotes, power requirements, or dealership partnerships.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Info -->
            <div class="lg:col-span-5 glass-panel motion-card p-6 sm:p-8" style="--motion-delay:0ms">
              <h3 class="text-xl font-bold text-pearl mb-4">Contact Details</h3>
              <p class="text-sm font-semibold text-neon-emerald">${CONTACT.international.company}</p>
              <p class="text-xs text-muted mt-2 leading-relaxed"><strong class="text-pearl">International Business Office</strong><br />${CONTACT.international.office}</p>
              <p class="text-xs text-muted mt-2 leading-relaxed"><strong class="text-pearl">Corporate Office</strong><br />${CONTACT.corporateAddress}</p>
              <p class="text-xs text-muted mt-2 leading-relaxed"><strong class="text-pearl">Manufacturing Unit</strong><br />${CONTACT.manufacturingAddress}</p>

              <div class="mt-8 space-y-5">
                <div>
                  <div class="text-[11px] font-mono text-muted uppercase">Contact our international team</div>
                  <div class="text-xs font-mono text-pearl font-bold mt-1">Mob: ${CONTACT.international.phones.map(p => `${contactPhone(p.display)} (${p.label})`).join(' · ')}</div>
                  <div class="text-xs font-mono text-pearl mt-1">${contactEmail(CONTACT.international.email)}</div>
                </div>

                <div>
                  <div class="text-[11px] font-mono text-muted uppercase">Sales</div>
                  <div class="text-xs font-mono text-pearl font-bold mt-1">${CONTACT.sales.phones.map(contactPhone).join(' · ')}</div>
                  <div class="text-xs font-mono text-pearl mt-1">${CONTACT.sales.emails.map(e => contactEmail(e)).join(' · ')}</div>
                </div>

                <div>
                  <div class="text-[11px] font-mono text-muted uppercase">Engineer</div>
                  <div class="text-xs text-pearl font-bold mt-1">${CONTACT.engineer.name}</div>
                  <div class="text-xs font-mono text-pearl mt-1">${CONTACT.engineer.phones.map(contactPhone).join(' · ')} · ${contactEmail(CONTACT.engineer.email)}</div>
                </div>

                <div>
                  <div class="text-[11px] font-mono text-muted uppercase">Service</div>
                  <div class="text-xs font-mono text-pearl font-bold mt-1">${CONTACT.service.phones.map(contactPhone).join(' · ')}</div>
                  <div class="text-xs font-mono text-pearl mt-1">${contactEmail(CONTACT.service.email)}</div>
                </div>
              </div>

              <div class="contact-map-wrap">
                <iframe
                  class="contact-map"
                  title="Map to the Chroma-Ator corporate office in Preet Vihar, New Delhi"
                  src="https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.corporateMapQuery)}&amp;output=embed"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen>
                </iframe>
                <a class="contact-map-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(CONTACT.corporateMapQuery)}" target="_blank" rel="noopener noreferrer">
                  <i data-lucide="map-pin" class="w-4 h-4"></i>
                  <span>Open directions</span>
                  <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                </a>
              </div>
            </div>

            <!-- Right Contact Form -->
            <div class="lg:col-span-7 glass-panel motion-card p-6 sm:p-8" style="--motion-delay:100ms">
              <h3 class="text-xl font-bold text-pearl mb-6">Send an Inquiry</h3>
              <form id="contact-page-form" onsubmit="window.ChromaApp.submitContactForm(event)" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-mono text-muted uppercase mb-1">Your Name *</label>
                    <input type="text" name="name" required class="w-full bg-obsidian border border-white/15 rounded-lg px-3 py-2 text-xs text-pearl focus:border-neon-emerald focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-mono text-muted uppercase mb-1">Company Name</label>
                    <input type="text" name="company" class="w-full bg-obsidian border border-white/15 rounded-lg px-3 py-2 text-xs text-pearl focus:border-neon-emerald focus:outline-none" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-mono text-muted uppercase mb-1">Business Email *</label>
                    <input type="email" name="email" required class="w-full bg-obsidian border border-white/15 rounded-lg px-3 py-2 text-xs text-pearl focus:border-neon-emerald focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-mono text-muted uppercase mb-1">Phone Number (with Code) *</label>
                    <input type="tel" name="phone" required placeholder="+91 ..." class="w-full bg-obsidian border border-white/15 rounded-lg px-3 py-2 text-xs text-pearl focus:border-neon-emerald focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-mono text-muted uppercase mb-1">Product or Solution of Interest</label>
                  <select name="product" class="w-full bg-obsidian border border-white/15 rounded-lg px-3 py-2 text-xs text-pearl focus:border-neon-emerald focus:outline-none">
                    <option value="General Inquiry">General Technical Inquiry</option>
                    ${STATE.products.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-mono text-muted uppercase mb-1">Message / Requirements</label>
                  <textarea name="message" rows="4" placeholder="Detail your power capacity, fuel supply, site location..." class="w-full bg-obsidian border border-white/15 rounded-lg px-3 py-2 text-xs text-pearl focus:border-neon-emerald focus:outline-none"></textarea>
                </div>

                <button type="submit" class="w-full btn-luxury">
                  <i data-lucide="send" class="w-4 h-4"></i>
                  <span>Submit Inquiry to Engineering Team</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 12. ADMIN PORTAL VIEW
  function renderAdminView() {
    if (!STATE.adminToken) {
      // Render Login Screen
      appContainer.innerHTML = `
        <section class="min-h-screen pt-32 pb-16 flex items-center justify-center bg-obsidian">
          <div class="glass-panel p-8 w-full max-w-md border-neon-emerald/30">
            <div class="text-center mb-8">
              <span class="badge-emerald mb-2">Internal Access</span>
              <h2 class="text-2xl font-bold text-pearl">Chroma Executive Portal</h2>
              <p class="text-xs text-muted mt-1">Sign in to manage quotes, leads, and talent applications.</p>
            </div>

            <form onsubmit="window.ChromaApp.loginAdmin(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-mono text-muted uppercase mb-1">Admin Email</label>
                <input type="email" id="admin-email" value="admin@chroma-ator.com" required class="w-full bg-obsidian border border-white/15 rounded-lg px-3 py-2.5 text-xs text-pearl font-mono focus:border-neon-emerald focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono text-muted uppercase mb-1">Password</label>
                <input type="password" id="admin-password" value="chroma2026!" required class="w-full bg-obsidian border border-white/15 rounded-lg px-3 py-2.5 text-xs text-pearl font-mono focus:border-neon-emerald focus:outline-none" />
              </div>
              <button type="submit" class="w-full btn-luxury mt-2">
                <span>Sign In to Executive Dashboard</span>
              </button>
            </form>
            <div class="mt-4 text-center text-[11px] font-mono text-muted">
              Default password: <code>chroma2026!</code> or <code>admin123</code>
            </div>
          </div>
        </section>
      `;
      return;
    }

    // Render Full Dashboard
    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6 max-w-6xl">
          <!-- Top Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 mb-8">
            <div>
              <span class="badge-emerald mb-1">Executive Dashboard</span>
              <h1 class="text-2xl font-bold text-pearl">Chroma-Ator Management Console</h1>
            </div>
            <div class="mt-4 sm:mt-0 flex items-center gap-3">
              <span class="text-xs font-mono text-muted">Logged in as: <b class="text-pearl">Executive Admin</b></span>
              <button onclick="window.ChromaApp.logoutAdmin()" class="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-red-500/20 text-pearl hover:text-red-400 border border-white/10">
                Logout
              </button>
            </div>
          </div>

          <!-- KPI Counters -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" id="admin-stats-row">
            <div class="glass-panel p-4">
              <div class="text-xs font-mono text-muted">Total Inquiries</div>
              <div class="text-2xl font-mono font-bold text-neon-emerald mt-1" id="stat-enquiries">--</div>
            </div>
            <div class="glass-panel p-4">
              <div class="text-xs font-mono text-muted">Pending Quotes</div>
              <div class="text-2xl font-mono font-bold text-gold mt-1" id="stat-pending">--</div>
            </div>
            <div class="glass-panel p-4">
              <div class="text-xs font-mono text-muted">Talent Applications</div>
              <div class="text-2xl font-mono font-bold text-pearl mt-1" id="stat-apps">--</div>
            </div>
            <div class="glass-panel p-4">
              <div class="text-xs font-mono text-muted">Active Job Openings</div>
              <div class="text-2xl font-mono font-bold text-neon-emerald mt-1" id="stat-jobs">--</div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="flex gap-2 border-b border-white/10 pb-4 mb-6">
            <button onclick="window.ChromaApp.setAdminTab('enquiries')" id="tab-btn-enquiries" class="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/40">
              Quotes & Enquiries
            </button>
            <button onclick="window.ChromaApp.setAdminTab('applications')" id="tab-btn-applications" class="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white/5 text-pearl border border-white/10 hover:border-white/30">
              Job Applications
            </button>
            <button onclick="window.ChromaApp.setAdminTab('jobs')" id="tab-btn-jobs" class="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white/5 text-pearl border border-white/10 hover:border-white/30">
              Job Openings Manager
            </button>
          </div>

          <!-- Tab Content Container -->
          <div id="admin-tab-content">
            <div class="text-center py-12 text-muted font-mono text-xs">Loading dashboard data...</div>
          </div>
        </div>
      </section>
    `;

    window.ChromaApp.loadAdminStats();
    window.ChromaApp.loadAdminTabData();
  }

  // 13. LEGAL POLICIES VIEW
  function renderLegalView() {
    appContainer.innerHTML = `
      <section class="min-h-screen pt-28 pb-16 bg-obsidian">
        <div class="container mx-auto px-6 max-w-4xl">
          <div class="glass-panel p-8">
            <h1 class="text-2xl font-bold text-pearl mb-4">Privacy Policy & Commercial Terms</h1>
            <p class="text-xs font-mono text-gold mb-6">Chroma Power Systems India Private Limited • Effective 2026</p>
            <div class="space-y-4 text-sm text-muted leading-relaxed">
              <p>Chroma-Ator and Chroma Power Systems India Private Limited respect customer and candidate data privacy. Technical inquiries and commercial proposals are held in confidence.</p>
              <h3 class="text-base font-bold text-pearl pt-4">Product Documentation</h3>
              <p>Technical specifications, models and approvals vary by product. The applicable product data sheet, quotation and contract define the scope and configuration supplied for each order.</p>
              <h3 class="text-base font-bold text-pearl pt-4">Approvals</h3>
              <p>Chroma-Ator gas engines in the 10-70 HP range are CPCB approved. Dispensers, composite dispensing units and mobile refuelling units are stated as PESO approved in Chroma-Ator product literature. Customers should confirm the approvals applicable to their specific model and site.</p>
              <h3 class="text-base font-bold text-pearl pt-4">Warranty &amp; Service</h3>
              <p>Warranty, maintenance and service terms are set out in the applicable quotation, purchase order and contract.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ================= 3D STUDIO UI HELPERS =================

  function open360StudioView(unitKey) {
    if (unitKey && STUDIO_360_UNITS[unitKey]) {
      STUDIO_360_STATE.unit = unitKey;
    }

    const reveal = () => {
      update360UnitUI(STUDIO_360_STATE.unit);
      start360Studio();
      document.getElementById('product-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (window.location.hash.replace('#', '') !== 'products') {
      window.location.hash = '#products';
      setTimeout(reveal, 420);
    } else {
      reveal();
    }
  }

  // ================= GLOBAL APP CONTROLLER =================

  window.ChromaApp = {
    // Real-time 3D studio helpers
    switch360Unit: function (unitKey) {
      if (!STUDIO_360_UNITS[unitKey]) return;
      update360UnitUI(unitKey);
    },
    toggle360Spin: function () {
      STUDIO_360_STATE.spinning = !STUDIO_360_STATE.spinning;
      if (window.ChromaProduct3D) window.ChromaProduct3D.setSpin(STUDIO_360_STATE.spinning);
      update360SpinUI();
    },
    rotate360: function (delta) {
      STUDIO_360_STATE.spinning = false;
      if (window.ChromaProduct3D) window.ChromaProduct3D.rotateBy(delta);
      update360SpinUI();
    },
    open360Studio: function (unitKey) {
      open360StudioView(unitKey);
    },

    // Category Filter
    setProductCategory: function (cat) {
      STATE.productCategory = cat;
      renderProductsView();
      setupScrollReveals();
      if (window.lucide) window.lucide.createIcons();
    },

    // View-only catalog viewer
    openCatalog: function (slug) {
      openCatalog(slug);
    },
    closeCatalog: function () {
      closeCatalog();
    },
    catalogPrevPage: function () {
      prevCatalogPage();
    },
    catalogNextPage: function () {
      nextCatalogPage();
    },

    // RFQ / Quote Modal (also used for distributor and international enquiries)
    openEnquiryModal: function (kind = 'quote') {
      const presets = {
        quote: {
          product: '',
          message: '',
          type: 'quote'
        },
        distributor: {
          product: 'Distributorship / Dealership',
          message: 'I would like to explore becoming a Chroma-Ator distributor / dealer.\n\nTerritory / region: \nCurrent business: \nYears in the gas or power industry: ',
          type: 'distributor'
        },
        international: {
          product: 'International Enquiry',
          message: 'I have an international business enquiry.\n\nCountry / region: \nApplication: \nRequired capacity: ',
          type: 'international'
        }
      };
      const preset = presets[kind] || presets.quote;
      this.openQuoteModal(preset.product, preset.message, preset.type);
    },

    openQuoteModal: function (productName = '', customMessage = '', enquiryType = 'quote') {
      const modal = document.getElementById('quote-modal') || document.getElementById('modal-quote');
      if (!modal) return;
      modal.classList.add('open');
      modal.classList.add('active');

      const copyByType = {
        quote: {
          badge: 'Request Proposal',
          heading: 'Request a Commercial & Technical Quote',
          subtitle: 'Our application engineering team will provide a detailed techno-commercial quotation.'
        },
        distributor: {
          badge: 'Channel Partners',
          heading: 'Become a Chroma-Ator Distributor',
          subtitle: 'Tell us about your territory and business. Our channel team will follow up with partnership terms.'
        },
        international: {
          badge: 'Global Business',
          heading: 'International Business Enquiry',
          subtitle: 'Share your country, application and capacity requirements. Our export team will respond.'
        }
      };
      const copy = copyByType[enquiryType] || copyByType.quote;

      const badgeElem = document.getElementById('modal-quote-badge');
      if (badgeElem) badgeElem.textContent = copy.badge;
      const headingElem = document.getElementById('modal-quote-heading');
      if (headingElem) headingElem.textContent = copy.heading;
      const subtitleElem = document.getElementById('modal-quote-subtitle');
      if (subtitleElem) subtitleElem.textContent = copy.subtitle;

      const typeInput = document.getElementById('modal-quote-type');
      if (typeInput) typeInput.value = enquiryType;

      const prodSelect = document.getElementById('modal-quote-product');
      if (prodSelect) {
        if (productName) {
          const hasOption = Array.from(prodSelect.options).some(option => option.value === productName);
          if (!hasOption) {
            const option = document.createElement('option');
            option.value = productName;
            option.textContent = productName;
            prodSelect.appendChild(option);
          }
          prodSelect.value = productName;
        } else if (prodSelect.options.length) {
          prodSelect.selectedIndex = 0;
        }
      }
      const msgInput = document.getElementById('modal-quote-message');
      if (msgInput) msgInput.value = customMessage || '';
    },

    closeQuoteModal: function () {
      const modal = document.getElementById('quote-modal') || document.getElementById('modal-quote');
      if (modal) {
        modal.classList.remove('open');
        modal.classList.remove('active');
      }
    },

    openModal: function (type, extra1, extra2) {
      if (type === 'quote') this.openQuoteModal(extra1, extra2);
      else if (type === 'job') this.openJobModal(extra1, extra2);
    },

    closeModal: function (type) {
      if (type === 'quote') this.closeQuoteModal();
      else if (type === 'job') this.closeJobModal();
    },

    submitQuote: function (e) {
      return this.submitQuoteModal(e);
    },

    submitQuoteModal: async function (e) {
      e.preventDefault();
      const form = e.target;
      const field = (name) => {
        const element = form.elements[name];
        return element && typeof element.value === 'string' ? element.value : '';
      };
      const body = {
        name: field('name'),
        company: field('company'),
        email: field('email'),
        phone: field('phone'),
        city: field('city'),
        product: field('product'),
        capacity: field('capacity'),
        fuel: field('fuel'),
        message: field('message'),
        type: field('type') || 'quote'
      };

      try {
        const res = await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
          const notificationMessage = data.notificationSent
            ? 'A notification was emailed to the sales team.'
            : 'Your request is saved in the admin portal, but its email notification could not be sent. Please contact sales@chroma-ator.com or kamal@chroma-ator.com.';
          alert('Thank you! Your quote request has been received. Reference ID: ' + data.enquiryId + '\n' + notificationMessage);
          this.closeQuoteModal();
          form.reset();
        } else {
          alert('Submission error: ' + data.message);
        }
      } catch (err) {
        alert('Network error. Please call +91 9811194542.');
      }
    },

    submitContactForm: async function (e) {
      e.preventDefault();
      const form = e.target;
      const field = (name) => {
        const element = form.elements[name];
        return element && typeof element.value === 'string' ? element.value : '';
      };
      const body = {
        name: field('name'),
        company: field('company'),
        email: field('email'),
        phone: field('phone'),
        city: field('city'),
        product: field('product'),
        message: field('message'),
        type: field('type') || 'contact'
      };

      try {
        const res = await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
          const fallback = body.type === 'international'
            ? 'parushi@chroma-ator.com'
            : 'sales@chroma-ator.com or kamal@chroma-ator.com';
          alert(data.notificationSent
            ? 'Your inquiry has been received and emailed to the sales team.'
            : `Your inquiry is saved in the admin portal, but its email notification could not be sent. Please contact ${fallback}.`);
          form.reset();
        } else {
          alert('Submission error: ' + data.message);
        }
      } catch (err) {
        alert('Submission failed.');
      }
    },

    // Job Application Modal
    openJobModal: function (jobId, jobTitle) {
      const modal = document.getElementById('job-modal') || document.getElementById('modal-job');
      if (!modal) return;
      modal.classList.add('open');
      modal.classList.add('active');
      const idElem = document.getElementById('modal-job-id');
      if (idElem) idElem.value = jobId || '';
      const titleElem = document.getElementById('modal-job-title');
      if (titleElem) titleElem.value = jobTitle || '';
      const headElem = document.getElementById('modal-job-heading');
      if (headElem) headElem.innerText = `Apply for: ${jobTitle || 'Position'}`;
    },

    closeJobModal: function () {
      const modal = document.getElementById('job-modal') || document.getElementById('modal-job');
      if (modal) {
        modal.classList.remove('open');
        modal.classList.remove('active');
      }
    },

    submitJobApplication: async function (e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);

      try {
        const res = await fetch('/api/applications', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          alert(data.notificationSent
            ? 'Your application has been received and emailed to the sales team. Thank you!'
            : 'Your application is saved in the admin portal, but its email notification could not be sent. Please contact sales@chroma-ator.com or kamal@chroma-ator.com.');
          this.closeJobModal();
          form.reset();
        } else {
          alert('Error: ' + data.message);
        }
      } catch (err) {
        alert('Application submission error.');
      }
    },

    // Admin Functions
    loginAdmin: async function (e) {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
          STATE.adminToken = data.token;
          localStorage.setItem('chroma_admin_token', data.token);
          renderAdminView();
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert('Login failed');
      }
    },

    logoutAdmin: function () {
      STATE.adminToken = null;
      localStorage.removeItem('chroma_admin_token');
      renderAdminView();
    },

    setAdminTab: function (tab) {
      STATE.adminTab = tab;
      ['enquiries', 'applications', 'jobs'].forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        if (btn) {
          if (t === tab) {
            btn.className = "px-4 py-2 rounded-lg text-xs font-mono font-bold bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/40";
          } else {
            btn.className = "px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white/5 text-pearl border border-white/10 hover:border-white/30";
          }
        }
      });
      this.loadAdminTabData();
    },

    loadAdminStats: async function () {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${STATE.adminToken}` }
        });
        const stats = await res.json();
        document.getElementById('stat-enquiries').innerText = stats.totalEnquiries;
        document.getElementById('stat-pending').innerText = stats.pendingQuotes;
        document.getElementById('stat-apps').innerText = stats.totalApplications;
        document.getElementById('stat-jobs').innerText = stats.activeJobs;
      } catch (e) {}
    },

    loadAdminTabData: async function () {
      const container = document.getElementById('admin-tab-content');
      if (!container) return;

      if (STATE.adminTab === 'enquiries') {
        const res = await fetch('/api/admin/enquiries', {
          headers: { 'Authorization': `Bearer ${STATE.adminToken}` }
        });
        const items = await res.json();

        if (items.length === 0) {
          container.innerHTML = `<div class="text-center py-10 text-muted font-mono text-xs">No customer inquiries yet.</div>`;
          return;
        }

        container.innerHTML = `
          <div class="overflow-x-auto">
            <table class="w-full text-left font-mono text-xs">
              <thead class="border-b border-white/10 text-muted uppercase">
                <tr>
                  <th class="py-3 px-4">Contact</th>
                  <th class="py-3 px-4">Product / Capacity</th>
                  <th class="py-3 px-4">Fuel & Details</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${items.map(i => `
                  <tr class="hover:bg-white/5">
                    <td class="py-3.5 px-4">
                      <b class="text-pearl block">${i.name}</b>
                      <span class="text-muted block">${i.company}</span>
                      <span class="text-neon-emerald block">${i.phone} • ${i.email}</span>
                    </td>
                    <td class="py-3.5 px-4 text-pearl">
                      <b>${i.product}</b>
                      <span class="text-muted block">${i.capacity || 'N/A'}</span>
                    </td>
                    <td class="py-3.5 px-4 text-muted max-w-xs">
                      <span class="text-gold block">${i.fuel}</span>
                      <span class="truncate block">${i.message || 'No remarks'}</span>
                    </td>
                    <td class="py-3.5 px-4">
                      <select onchange="window.ChromaApp.updateEnquiryStatus('${i.id}', this.value)" class="bg-obsidian border border-white/15 rounded px-2 py-1 text-xs font-mono text-pearl">
                        <option value="new" ${i.status === 'new' ? 'selected' : ''}>NEW</option>
                        <option value="in_review" ${i.status === 'in_review' ? 'selected' : ''}>IN REVIEW</option>
                        <option value="quoted" ${i.status === 'quoted' ? 'selected' : ''}>QUOTED</option>
                        <option value="closed" ${i.status === 'closed' ? 'selected' : ''}>CLOSED</option>
                      </select>
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <button onclick="alert('Client Details:\\n\\nName: ${i.name}\\nEmail: ${i.email}\\nPhone: ${i.phone}\\nMessage: ${i.message}')" class="px-2.5 py-1 rounded bg-white/5 text-pearl hover:bg-white/10">View</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } else if (STATE.adminTab === 'applications') {
        const res = await fetch('/api/admin/applications', {
          headers: { 'Authorization': `Bearer ${STATE.adminToken}` }
        });
        const items = await res.json();

        container.innerHTML = `
          <div class="space-y-3 font-mono text-xs">
            ${items.length === 0 ? '<div class="text-center py-10 text-muted">No applications received yet.</div>' : ''}
            ${items.map(a => `
              <div class="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <b class="text-pearl text-sm">${a.name}</b>
                  <span class="text-neon-emerald block mt-0.5">${a.jobTitle} • ${a.phone} • ${a.email}</span>
                  <p class="text-muted text-[11px] mt-1">${a.coverNote || 'No cover note provided.'}</p>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  ${a.resumeFilename ? `
                    <a href="/api/admin/applications/${a.id}/resume" target="_blank" class="px-3 py-1.5 rounded-lg bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/40 hover:bg-neon-emerald/30">
                      Download Resume
                    </a>
                  ` : '<span class="text-muted">No Resume</span>'}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (STATE.adminTab === 'jobs') {
        const res = await fetch('/api/admin/jobs', {
          headers: { 'Authorization': `Bearer ${STATE.adminToken}` }
        });
        const jobs = await res.json();

        container.innerHTML = `
          <div class="space-y-4 font-mono text-xs">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-pearl font-bold">Active Career Openings</h4>
              <button onclick="window.ChromaApp.createJobPrompt()" class="btn-luxury !px-3 !py-1 text-xs">
                + Add Vacancy
              </button>
            </div>
            ${jobs.map(j => `
              <div class="glass-panel p-4 flex items-center justify-between">
                <div>
                  <b class="text-pearl text-sm">${j.title}</b>
                  <span class="text-muted block">${j.department} • ${j.location} • Status: <span class="${j.status === 'open' ? 'text-neon-emerald' : 'text-red-400'}">${j.status.toUpperCase()}</span></span>
                </div>
                <button onclick="window.ChromaApp.deleteJob('${j.id}')" class="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">
                  Delete
                </button>
              </div>
            `).join('')}
          </div>
        `;
      }
    },

    updateEnquiryStatus: async function (id, status) {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${STATE.adminToken}` },
        body: JSON.stringify({ status })
      });
      this.loadAdminStats();
    },

    createJobPrompt: async function () {
      const title = prompt("Job Title:");
      if (!title) return;
      const dept = prompt("Department (e.g., R&D, Operations):") || "Engineering";
      const location = prompt("Location:") || "Delhi NCR, India";

      await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${STATE.adminToken}` },
        body: JSON.stringify({ title, department: dept, location, status: 'open', requirements: 'Engineering Degree' })
      });
      this.loadAdminTabData();
    },

    deleteJob: async function (id) {
      if (!confirm("Are you sure you want to remove this job vacancy?")) return;
      await fetch(`/api/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${STATE.adminToken}` }
      });
      this.loadAdminTabData();
    }
  };

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

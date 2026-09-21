/**
 * Innovix Global Architectural Hardware Animated Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let allProducts = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // DOM Elements
  const productGrid = document.getElementById('productGrid');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const searchInput = document.getElementById('searchInput');
  const modalBackdrop = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBodyContent = document.getElementById('modalBodyContent');
  const contactForm = document.getElementById('contactForm');
  const formNotification = document.getElementById('formNotification');
  const dealerForm = document.getElementById('dealerForm');
  const dealerNotification = document.getElementById('dealerNotification');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  // Contact Persons Details
  const CONTACT_PERSONS = [
    { name: 'Dholariya Sneh', role: 'Sales Management', phone: '+91 91061 84146', waNumber: '919106184146' },
    { name: 'Ramani Prem', role: 'Business Operations', phone: '+91 82382 82481', waNumber: '918238282481' }
  ];

  init();

  async function init() {
    highlightActivePage();
    setupEventListeners();
    setupScrollAnimations();
    setupAnimatedCounters();
    checkUrlQueryParams();
    if (productGrid) {
      await fetchProducts();
    }
  }

  // IntersectionObserver Scroll Reveal Animation Setup
  function setupScrollAnimations() {
    const targets = document.querySelectorAll('.section, .feature-card, .process-card, .contact-info-card, .form-card, .hero-content, .hero-stats');
    targets.forEach((el) => {
      if (!el.classList.contains('reveal-up')) {
        el.classList.add('reveal-up');
      }
    });

    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // Animated Number Counter on Scroll
  function setupAnimatedCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length === 0) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.innerText;
          const targetNum = parseInt(text.replace(/[^0-9]/g, ''));
          if (!isNaN(targetNum) && targetNum > 0) {
            animateNumber(el, 0, targetNum, 2000, text);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statValues.forEach(stat => counterObserver.observe(stat));
  }

  function animateNumber(element, start, end, duration, originalText) {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);

      if (originalText.includes('+')) {
        element.innerText = current.toLocaleString() + '+';
      } else if (originalText.includes('%')) {
        element.innerText = current + '%';
      } else {
        element.innerText = current.toLocaleString();
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = originalText;
      }
    }

    window.requestAnimationFrame(step);
  }

  // Highlight active page link based on URL
  function highlightActivePage() {
    let rawPath = window.location.pathname.toLowerCase();
    let currentFileName = rawPath.split('/').pop() || 'index.html';
    if (currentFileName === '' || rawPath === '/') {
      currentFileName = 'index.html';
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      let linkFileName = href.split('/').pop() || 'index.html';
      if (linkFileName === '' || href === '/') {
        linkFileName = 'index.html';
      }

      const currentClean = currentFileName.replace('.html', '');
      const linkClean = linkFileName.replace('.html', '');

      if (currentClean === linkClean) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Check URL params for category filter (e.g. ?category=mortise)
  function checkUrlQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam && categoryTabs.length > 0) {
      currentCategory = catParam;
      categoryTabs.forEach(tab => {
        if (tab.dataset.category === catParam) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }
  }

  function setupEventListeners() {
    // Mobile menu toggle & interactions
    const navMenu = document.getElementById('navMenu') || navLinks;
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open', isActive);
        mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.className = isActive ? 'ri-close-line' : 'ri-menu-line';
        }
      });

      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) icon.className = 'ri-menu-line';
        });
      });

      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !e.target.closest('.header')) {
          navMenu.classList.remove('active');
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) icon.className = 'ri-menu-line';
        }
      });
    }

    // Category Tabs
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category || 'all';
        filterAndRenderProducts();
      });
    });

    // Live Search
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterAndRenderProducts();
      });
    }

    // Modal Close
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    // Forms
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => handleFormSubmit(e, '/api/contact', contactForm, formNotification));
    }
    if (dealerForm) {
      dealerForm.addEventListener('submit', (e) => handleFormSubmit(e, '/api/dealership', dealerForm, dealerNotification));
    }
  }

  // Fetch Products from API
  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      allProducts = data.products || [];
      filterAndRenderProducts();
    } catch (error) {
      console.error('Failed to fetch products catalog:', error);
      if (productGrid) {
        productGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="ri-error-warning-line" style="font-size: 2rem; color: #ef4444;"></i>
            <p style="margin-top: 12px;">Unable to load catalog products right now. Please try refreshing.</p>
          </div>
        `;
      }
    }
  }

  // Filter & Render Products
  function filterAndRenderProducts() {
    if (!productGrid) return;

    let filtered = allProducts;

    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.modelCode.toLowerCase().includes(searchQuery) ||
        p.material.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery)
      );
    }

    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);" class="reveal-up reveal-active">
          <i class="ri-search-line" style="font-size: 3rem; color: var(--accent-gold);"></i>
          <h3 style="margin-top: 16px; font-size: 1.4rem; color: #ffffff;">No Products Found</h3>
          <p style="color: var(--text-muted); margin-top: 8px;">Try adjusting your category filter or search terms.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = filtered.map((product, idx) => `
      <div class="product-card reveal-up reveal-active" style="transition-delay: ${Math.min(idx * 0.04, 0.3)}s;">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
          <span class="product-badge">${product.modelCode}</span>
        </div>
        <div class="product-details">
          <div class="product-category">${product.categoryName}</div>
          <h3 class="product-title">${product.name}</h3>
          
          <div class="product-spec-row">
            <i class="ri-shield-flash-line" style="color: var(--accent-gold);"></i>
            <span>${product.material}</span>
          </div>

          <div class="finishes-tags">
            ${product.finishes.slice(0, 3).map(f => `<span class="finish-chip">${f}</span>`).join('')}
            ${product.finishes.length > 3 ? `<span class="finish-chip">+${product.finishes.length - 3} More</span>` : ''}
          </div>

          <div class="card-actions">
            <button class="btn btn-outline btn-card view-details-btn" data-id="${product.id}">
              <i class="ri-eye-line"></i> Quick View
            </button>
            <a href="https://wa.me/919106184146?text=${encodeURIComponent(`Hello Innovix Global, I would like to inquire about model ${product.modelCode} (${product.name}). Please share details.`)}"
               target="_blank" 
               class="btn btn-whatsapp btn-card">
              <i class="ri-whatsapp-line"></i> Inquire
            </a>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click handlers
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.id;
        const item = allProducts.find(p => p.id === productId);
        if (item) openProductModal(item);
      });
    });
  }

  // Open Product Lightbox Modal
  function openProductModal(product) {
    if (!modalBackdrop || !modalBodyContent) return;

    modalBodyContent.innerHTML = `
      <div class="modal-image-wrap">
        <img src="${product.image}" alt="${product.name}" class="modal-image">
      </div>
      <div>
        <div class="product-category">${product.categoryName} • ${product.modelCode}</div>
        <h2 style="font-size: 1.8rem; margin: 8px 0 14px 0; color: #ffffff;">${product.name}</h2>
        <p style="color: var(--text-muted); font-size: 0.98rem; margin-bottom: 22px; line-height: 1.6;">
          ${product.description}
        </p>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 18px; border-radius: var(--radius-md); margin-bottom: 20px;">
          <h4 style="font-size: 0.98rem; color: var(--accent-gold); margin-bottom: 10px; font-weight: 800;">Technical Specifications</h4>
          <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 0.92rem; color: var(--text-muted);">
            <div><strong style="color: #ffffff;">Material Grade:</strong> ${product.material}</div>
            <div><strong style="color: #ffffff;">Available Sizes:</strong> ${product.sizes.join(', ')}</div>
            <div><strong style="color: #ffffff;">Available Finishes:</strong> ${product.finishes.join(', ')}</div>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 0.98rem; color: #ffffff; margin-bottom: 10px; font-weight: 800;">Quality & Engineering Features</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem; color: var(--text-muted);">
            ${product.features.map(f => `<li style="display: flex; align-items: center; gap: 8px;"><i class="ri-checkbox-circle-fill" style="color: var(--accent-gold);"></i> ${f}</li>`).join('')}
          </ul>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <label style="font-size: 0.88rem; color: var(--text-muted); font-weight: 700;">Select Representative for Instant WhatsApp Inquiry:</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            ${CONTACT_PERSONS.map(person => `
              <a href="https://wa.me/${person.waNumber}?text=${encodeURIComponent(`Hello ${person.name}, I am inquiring about catalog item ${product.modelCode} (${product.name}).`)}"
                 target="_blank" 
                 class="btn btn-whatsapp" 
                 style="padding: 11px 12px; font-size: 0.85rem; flex-direction: column; gap: 2px;">
                <span style="font-weight: 700;">Chat with ${person.name.split(' ')[0]}</span>
                <span style="font-size: 0.75rem; opacity: 0.9;">${person.phone}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  // Generic Form Submission Handler
  async function handleFormSubmit(e, endpoint, formElem, notificationElem) {
    e.preventDefault();
    const formData = new FormData(formElem);
    const payload = Object.fromEntries(formData.entries());

    if (notificationElem) {
      notificationElem.style.display = 'block';
      notificationElem.innerHTML = '<span style="color: var(--accent-gold);"><i class="ri-loader-4-line spin"></i> Submitting details...</span>';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const res = await response.json();

      if (response.ok && res.success) {
        if (notificationElem) {
          notificationElem.innerHTML = `<span style="color: #22c55e;"><i class="ri-checkbox-circle-line"></i> ${res.message}</span>`;
        }
        formElem.reset();
      } else {
        throw new Error(res.error || 'Failed to submit form');
      }
    } catch (err) {
      if (notificationElem) {
        notificationElem.innerHTML = `<span style="color: #ef4444;"><i class="ri-error-warning-line"></i> ${err.message}</span>`;
      }
    }
  }
});

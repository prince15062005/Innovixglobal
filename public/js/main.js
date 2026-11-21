/**
 * INNOVIX GLOBAL - Architectural Hardware
 * Main JavaScript Module
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let allProducts = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // DOM Elements
  const productGrid = document.getElementById('productGrid');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const searchInput = document.getElementById('searchInput');
  const contactForm = document.getElementById('contactForm');
  const formNotification = document.getElementById('formNotification');
  const dealerForm = document.getElementById('dealerForm');
  const dealerNotification = document.getElementById('dealerNotification');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const header = document.querySelector('.header');

  // Contact Persons
  const CONTACT_PERSONS = [
    { name: 'Dholariya Sneh', role: 'Key Accounts & Sales', phone: '+91 91061 84146', waNumber: '919106184146' },
    { name: 'Ramani Prem', role: 'Business Operations', phone: '+91 82382 82481', waNumber: '918238282481' }
  ];

  init();

  async function init() {
    highlightActivePage();
    setupEventListeners();
    setupScrollAnimations();
    setupAnimatedCounters();
    setupHeaderScroll();
    checkUrlQueryParams();
    if (productGrid) {
      await fetchProducts();
    }
  }

  // Scroll Animations
  function setupScrollAnimations() {
    const targets = document.querySelectorAll('.reveal');
    if (targets.length === 0) return;

    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    targets.forEach(el => revealObserver.observe(el));
  }

  // Animated Counters
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
      } else if (originalText.includes(',')) {
        element.innerText = current.toLocaleString();
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

  // Header Scroll Effect
  function setupHeaderScroll() {
    if (!header) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Highlight Active Page
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

    // Mobile menu links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      let linkFileName = href.split('/').pop() || 'index.html';
      if (linkFileName === '' || href === '/') {
        linkFileName = 'index.html';
      }

      const currentClean = currentFileName.replace('.html', '');
      const linkClean = linkFileName.replace('.html', '');

      if (currentClean === linkClean) {
        link.style.background = 'rgba(197, 161, 90, 0.1)';
        link.style.color = '#C5A15A';
      }
    });
  }

  // URL Query Params
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

  // Event Listeners
  function setupEventListeners() {
    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenuOverlay) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (mobileMenuClose && mobileMenuOverlay) {
      mobileMenuClose.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
          mobileMenuOverlay.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    }

    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenuOverlay) {
          mobileMenuOverlay.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    });

    // Category Tabs
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category || 'all';
        filterAndRenderProducts();
      });
    });

    // Search Input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterAndRenderProducts();
      });
    }

    // Forms
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => handleFormSubmit(e, '/api/contact', contactForm, formNotification));
    }
    if (dealerForm) {
      dealerForm.addEventListener('submit', (e) => handleFormSubmit(e, '/api/dealership', dealerForm, dealerNotification));
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Fetch Products
  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      allProducts = data.products || [];

      // Update tab counts
      const allTab = document.querySelector('.category-tab[data-category="all"]');
      const mortiseTab = document.querySelector('.category-tab[data-category="mortise"]');
      const pullTab = document.querySelector('.category-tab[data-category="pull"]');
      if (allTab) allTab.innerHTML = `<i class="ri-apps-2-line"></i> All Products (${allProducts.length})`;
      if (mortiseTab) {
        const mortiseCount = allProducts.filter(p => p.category === 'mortise').length;
        mortiseTab.innerHTML = `<i class="ri-door-open-line"></i> Mortise Handles (${mortiseCount})`;
      }
      if (pullTab) {
        const pullCount = allProducts.filter(p => p.category === 'pull').length;
        pullTab.innerHTML = `<i class="ri-drag-move-fill"></i> Main Door Handles (${pullCount})`;
      }

      filterAndRenderProducts();
    } catch (error) {
      console.error('Failed to fetch products catalog:', error);
      if (productGrid) {
        productGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);" class="reveal active">
            <i class="ri-error-warning-line" style="font-size: 2rem; color: #EF4444;"></i>
            <p style="margin-top: 12px;">Unable to load catalog products. Please try refreshing.</p>
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
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);" class="reveal active">
          <i class="ri-search-line" style="font-size: 3rem; color: var(--color-gold);"></i>
          <h3 style="margin-top: 16px; font-size: 1.4rem; color: var(--color-white);">No Products Found</h3>
          <p style="color: var(--color-neutral-muted); margin-top: 8px;">Try adjusting your category filter or search terms.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = filtered.map((product, idx) => `
      <article class="product-card reveal" style="transition-delay: ${Math.min(idx * 0.04, 0.3)}s;">
        <a href="product-detail.html?id=${product.id}" class="product-card-link">
          <div class="product-card-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-card-image" loading="lazy">
            <div class="product-card-badges">
              <span class="badge badge-primary">${product.categoryName}</span>
            </div>
          </div>
          <div class="product-card-overlay">
            <div class="product-card-overlay-content">
              <span class="product-card-category">${product.categoryName}</span>
              <h3 class="product-card-code">${product.modelCode}</h3>
              <p class="product-card-material">${product.material}</p>
            </div>
          </div>
        </a>
        <div class="product-card-content">
          <div class="product-card-finishes">
            ${product.finishes.slice(0, 3).map(f => `<span class="finish-tag">${f}</span>`).join('')}
            ${product.finishes.length > 3 ? `<span class="finish-tag more">+${product.finishes.length - 3} more</span>` : ''}
          </div>
          <div class="product-card-footer">
            <div class="product-card-specs">
              <span><i class="ri-ruler-line"></i> ${product.sizes.length} size${product.sizes.length !== 1 ? 's' : ''}</span>
              <span><i class="ri-palette-line"></i> ${product.finishes.length} finish${product.finishes.length !== 1 ? 'es' : ''}</span>
            </div>
            <span class="product-card-action">View Details <i class="ri-arrow-right-line"></i></span>
          </div>
        </div>
      </article>
    `).join('');

    // Re-observe new elements for scroll animations
    const newReveals = productGrid.querySelectorAll('.reveal');
    newReveals.forEach(el => {
      el.classList.add('active');
    });
  }

  // Form Submission Handler
  async function handleFormSubmit(e, endpoint, formElem, notificationElem) {
    e.preventDefault();
    const formData = new FormData(formElem);
    const payload = Object.fromEntries(formData.entries());

    if (notificationElem) {
      notificationElem.style.display = 'block';
      notificationElem.innerHTML = '<span style="color: var(--color-gold);"><i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i> Submitting details...</span>';
    }

    const submitBtn = formElem.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

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
        notificationElem.innerHTML = `<span style="color: #EF4444;"><i class="ri-error-warning-line"></i> ${err.message}</span>`;
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  // Toast Notification System
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '<i class="ri-checkbox-circle-line toast-icon"></i>',
      error: '<i class="ri-error-warning-line toast-icon"></i>',
      warning: '<i class="ri-alert-line toast-icon"></i>',
      info: '<i class="ri-information-line toast-icon"></i>'
    };

    toast.innerHTML = `
      ${icons[type] || icons.info}
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()"><i class="ri-close-line"></i></button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  };

  function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }
});

// Spin animation for loader
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin { animation: spin 1s linear infinite; }
`;
document.head.appendChild(style);
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('showcaseMenuToggle');
  const menu = document.getElementById('showcaseMenu');
  const heroImage = document.getElementById('showcaseHeroImage');
  const heroCategory = document.getElementById('showcaseHeroCategory');
  const heroTitle = document.getElementById('showcaseHeroTitle');
  const heroDescription = document.getElementById('showcaseHeroDescription');
  const heroLink = document.getElementById('showcaseHeroLink');
  const dots = document.getElementById('showcaseDots');
  const categoryGrid = document.getElementById('homeCategoryGrid');
  const previousButton = document.getElementById('showcasePrevious');
  const nextButton = document.getElementById('showcaseNext');

  let featuredProducts = [];
  let activeSlide = 0;
  const heroSceneSources = {
    'IGM-001': '/catalog-images/img_004.jpg',
    'IGM-018': '/catalog-images/img_002.jpg'
  };
  const categorySceneSources = {
    mortise: '/catalog-images/img_004.jpg',
    rose: '/catalog-images/img_002.jpg'
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menu.hidden = isOpen;
    menuToggle.querySelector('i').className = isOpen ? 'ri-menu-line' : 'ri-close-line';
  });

  document.addEventListener('click', (event) => {
    if (!menu.hidden && !event.target.closest('.showcase-nav')) {
      menu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.querySelector('i').className = 'ri-menu-line';
    }
  });

  previousButton.addEventListener('click', () => showSlide(activeSlide - 1));
  nextButton.addEventListener('click', () => showSlide(activeSlide + 1));

  fetch('/api/products')
    .then((response) => {
      if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const products = Array.isArray(data.products) ? data.products : [];
      if (!products.length) return;

      const productsById = new Map(products.map((product) => [product.id, product]));
      featuredProducts = ['IGM-001', 'IGM-003', 'IGM-018', 'IGM-019']
        .map((id) => productsById.get(id))
        .filter((product) => product && product.image);

      if (!featuredProducts.length) {
        featuredProducts = products.filter((product) => product.image).slice(0, 4);
      }

      renderDots();
      showSlide(0);
      renderCategories(products);
    })
    .catch((error) => console.error('Unable to load homepage catalog:', error));

  function showSlide(index) {
    if (!featuredProducts.length) return;

    activeSlide = (index + featuredProducts.length) % featuredProducts.length;
    const product = featuredProducts[activeSlide];
    heroImage.src = heroSceneSources[product.id] || product.image;
    heroImage.alt = product.name;
    heroCategory.textContent = `${product.categoryName || 'Hardware'} / ${product.modelCode || product.id}`;
    heroTitle.textContent = product.name;
    heroDescription.textContent = product.description;
    heroLink.href = `products.html?category=${encodeURIComponent(product.category || 'all')}`;

    dots.querySelectorAll('.showcase-dot').forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === activeSlide));
    });
  }

  function renderDots() {
    dots.replaceChildren();
    featuredProducts.forEach((product, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'showcase-dot';
      dot.setAttribute('aria-label', `Show ${product.name}`);
      dot.setAttribute('aria-current', String(index === activeSlide));
      dot.addEventListener('click', () => showSlide(index));
      dots.append(dot);
    });
  }

  function renderCategories(products) {
    const categories = new Map();
    products.forEach((product) => {
      if (!product.category) return;
      if (!categories.has(product.category)) {
        categories.set(product.category, { category: product.category, products: [] });
      }
      categories.get(product.category).products.push(product);
    });

    const labels = {
      mortise: 'Mortise Handles',
      pull: 'Main Door Pull Handles',
      rose: 'Rose, Cabinet & Knob Hardware',
      locks: 'Locks & Cylinders'
    };

    categoryGrid.replaceChildren();
    categories.forEach(({ category, products: categoryProducts }) => {
      const sample = categoryProducts.find((product) => product.image);
      if (!sample) return;

      const card = document.createElement('a');
      card.className = 'home-category';
      card.href = `products.html?category=${encodeURIComponent(category)}`;

      const imageFrame = document.createElement('span');
      imageFrame.className = 'home-category-image';
      const image = document.createElement('img');
      image.src = categorySceneSources[category] || sample.image;
      image.alt = '';
      image.loading = 'lazy';
      imageFrame.append(image);

      const name = document.createElement('span');
      name.className = 'home-category-name';
      name.textContent = labels[category] || sample.categoryName || category;

      const meta = document.createElement('span');
      meta.className = 'home-category-meta';
      meta.append(document.createTextNode(`${categoryProducts.length} ${categoryProducts.length === 1 ? 'style' : 'styles'}`));
      const arrow = document.createElement('i');
      arrow.className = 'ri-arrow-right-line';
      arrow.setAttribute('aria-hidden', 'true');
      meta.append(arrow);

      card.append(imageFrame, name, meta);
      categoryGrid.append(card);
    });
  }
});
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const SITE_FILE = path.join(DATA_DIR, 'site.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const USERS_FILE = path.join(DATA_DIR, 'user-store.json');
const isProduction = process.env.NODE_ENV === 'production';
const useSecureCookies = process.env.SESSION_SECURE === 'true';

const COMPANY_INFO = {
  name: 'Innovix Global',
  brand: 'Innovix Global Architectural Hardware',
  catalog: 'Innovix Global Catalog 2026',
  email: 'innovixxglobal@gmail.com',
  address: '“Matel”, Brahmaniyapara-19, Near govindbag vegetable market, Pedak road, Rajkot-360003, Gujarat, India',
  contacts: [
    { name: 'Dholariya Sneh', role: 'Key Accounts & Sales', phone: '+91 91061 84146', rawPhone: '919106184146' },
    { name: 'Ramani Prem', role: 'Business Operations', phone: '+91 82382 82481', rawPhone: '918238282481' }
  ]
};

const DEFAULT_SITE = {
  company: COMPANY_INFO,
  hero: {
    headline: 'Mastercrafting Premium Architectural Door Hardware',
    subheading: 'INNOVIX GLOBAL presents its 2026 Collection — precision-forged Mortise Handles, Grand Pull Handles, and premium architectural hardware engineered in Rajkot, India.',
    primaryCta: 'Explore Collection',
    secondaryCta: 'Request a Quote'
  },
  services: [
    { title: 'Mortise Handles', description: 'Elegant lever and mortise solutions for premium residences, villas, and hospitality interiors.', icon: 'ri-door-open-line' },
    { title: 'Main Door Pulls', description: 'Architectural pulls designed for entrances, lobbies, showrooms, and statement façades.', icon: 'ri-drag-move-fill' }
  ],
  stats: [
    { value: '250K+', label: 'Cycle fatigue tested' },
    { value: '41', label: 'Core product models' },
    { value: '100%', label: 'Solid brass construction' },
    { value: '24/7', label: 'Business support' }
  ],
  process: [
    { title: 'Consult', description: 'We align product selection with design intent, door type, and usage requirements.' },
    { title: 'Design', description: 'Our engineering team evaluates finish, metal grade, and installation compatibility.' },
    { title: 'Manufacture', description: 'Precision machining, plating, and quality control ensure consistent premium output.' },
    { title: 'Deliver', description: 'We support project delivery with efficient dispatch and sales coordination.' }
  ],
  projects: [
    { title: 'Luxury Villa Entrances', summary: 'Premium door hardware packages for high-end residential and lifestyle developments.' },
    { title: 'Hospitality Suites', summary: 'Polished, tactile hardware collections for boutique hotels and premium rooms.' },
    { title: 'Commercial Lobbies', summary: 'Statement hardware systems for offices, retail spaces, and corporate reception areas.' }
  ],
  testimonials: [
    { quote: 'Their finish quality and product consistency stand out in every premium project we specify.', author: 'Architectural Consultant' },
    { quote: 'The communication, product depth, and delivery support made the entire procurement process easy.', author: 'Dealer Partner' }
  ],
  faq: [
    { q: 'Do you provide custom finish requests?', a: 'Yes, we discuss finish, size, and project-based specifications with sales and operations teams.' },
    { q: 'Can you support bulk or dealer orders?', a: 'We supply architectural and dealer channels with project coordination for volume requirements.' },
    { q: 'Are your products suitable for hospitality and commercial use?', a: 'Yes. Our hardware is chosen for durability, finish consistency, and premium everyday performance.' }
  ],
  seo: {
    title: 'INNOVIX GLOBAL | Architectural Hardware',
    description: 'Premium architectural hardware and designer handles for residential and commercial applications in India.',
    canonical: 'https://www.innovixglobal.in/'
  }
};

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Main Door Handles', slug: 'main-door-handles', description: 'Premium main door handles crafted with precision and elegance', image: '/images/IGPH-211.jpg', status: 'active' },
  { id: 'cat-2', name: 'Mortise Handles', slug: 'mortise-handles', description: 'Exquisite mortise handles for sophisticated interiors', image: '/images/IGM-001.jpg', status: 'active' }
];

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf8');
      return structuredClone(fallback);
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Unable to read ${filePath}:`, error.message);
    return structuredClone(fallback);
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Failed to read product catalog:', error.message);
  }
  return [];
}

function writeProducts(products) {
  writeJson(PRODUCTS_FILE, products);
}

function readCategories() {
  return readJson(CATEGORIES_FILE, DEFAULT_CATEGORIES);
}

function writeCategories(categories) {
  writeJson(CATEGORIES_FILE, categories);
}

function readSiteData() {
  return readJson(SITE_FILE, DEFAULT_SITE);
}

function writeSiteData(data) {
  writeJson(SITE_FILE, data);
}

function readInquiries() {
  return readJson(INQUIRIES_FILE, []);
}

function writeInquiries(data) {
  writeJson(INQUIRIES_FILE, data);
}

async function ensureSeedAdminUser() {
  const users = readJson(USERS_FILE, []);
  const email = process.env.ADMIN_EMAIL || 'admin@innovixglobal.in';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  if (!users.length) {
    const hash = await bcrypt.hash(password, 10);
    users.push({
      id: 'super-admin',
      name: 'Super Admin',
      email,
      role: 'Super Admin',
      passwordHash: hash,
      active: true,
      createdAt: new Date().toISOString()
    });
    writeJson(USERS_FILE, users);
  }

  return { email, passwordHint: process.env.ADMIN_PASSWORD ? 'configured via environment' : 'default password is ChangeMe123! - change it immediately in production' };
}

const app = express();

app.disable('x-powered-by');

// Build CSP header manually to avoid Helmet 7+ default upgrade-insecure-requests
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
  'connect-src': ["'self'"],
  'frame-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'script-src-attr': ["'none'"]
};

if (isProduction) {
  cspDirectives['upgrade-insecure-requests'] = [];
}

const cspHeader = Object.entries(cspDirectives)
  .map(([key, values]) => values.length > 0 ? `${key} ${values.join(' ')}` : key)
  .join('; ');

app.use(helmet({
  contentSecurityPolicy: false, // Disable Helmet's CSP, we'll set it manually
  crossOriginEmbedderPolicy: false,
  hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false
}));

// Custom CSP middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', cspHeader);
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'innovix-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: useSecureCookies,
    maxAge: 1000 * 60 * 60 * 8
  }
}));

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait a few minutes and try again.' }
});

app.use(publicLimiter);

app.use(express.static(PUBLIC_DIR, { index: false }));
app.use('/catalog-images', express.static(path.join(__dirname, 'extracted_pdf_images'), { index: false }));

function requireAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) return next();
  return res.redirect('/admin/login');
}

// Public routes
app.get(['/','/index','/index.html','/home'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get(['/about','/about.html','/aboutus'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'about.html')));
app.get(['/products','/products.html','/product'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'products.html')));
app.get(['/product-detail','/product-detail.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'product-detail.html')));
app.get(['/how-to-clean','/how-to-clean.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'how-to-clean.html')));
app.get(['/contact','/contact.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'contact.html')));
app.get(['/privacy-policy','/privacy-policy.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'privacy-policy.html')));
app.get(['/terms-and-conditions','/terms-and-conditions.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'terms-and-conditions.html')));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'robots.txt')));

// Dynamic Sitemap Generation
app.get('/sitemap.xml', async (req, res) => {
  try {
    const products = readProducts();
    const baseUrl = 'https://www.innovixglobal.in';
    const today = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' },
      { url: '/about.html', priority: '0.8', changefreq: 'monthly' },
      { url: '/products.html', priority: '0.9', changefreq: 'weekly' },
      { url: '/how-to-clean.html', priority: '0.6', changefreq: 'monthly' },
      { url: '/contact.html', priority: '0.7', changefreq: 'monthly' },
      { url: '/products.html?category=pull', priority: '0.8', changefreq: 'weekly' },
      { url: '/products.html?category=mortise', priority: '0.8', changefreq: 'weekly' },
      { url: '/services.html', priority: '0.7', changefreq: 'monthly' },
      { url: '/manufacturing.html', priority: '0.7', changefreq: 'monthly' },
      { url: '/dealership.html', priority: '0.6', changefreq: 'monthly' }
    ];
    
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });
    
    // Product pages
    products.forEach(product => {
      sitemap += `
  <url>
    <loc>${baseUrl}/product-detail.html?id=${product.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    sitemap += `
</urlset>`;
    
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.set('Content-Type', 'application/xml');
    res.sendFile(path.join(PUBLIC_DIR, 'sitemap.xml'));
  }
});

app.get('/404.html', (req, res) => res.sendFile(path.join(PUBLIC_DIR, '404.html')));
app.get('/404.html', (req, res) => res.sendFile(path.join(PUBLIC_DIR, '404.html')));

// Public API
app.get('/api/company', (req, res) => res.json(COMPANY_INFO));

app.get('/api/site', (req, res) => {
  res.json(readSiteData());
});

app.post('/api/site', requireAuth, (req, res) => {
  const site = readSiteData();
  const incoming = req.body || {};
  site.hero = { ...site.hero, ...incoming.hero };
  site.seo = { ...site.seo, ...incoming.seo };
  if (Array.isArray(incoming.services)) site.services = incoming.services;
  if (Array.isArray(incoming.projects)) site.projects = incoming.projects;
  if (Array.isArray(incoming.testimonials)) site.testimonials = incoming.testimonials;
  if (Array.isArray(incoming.faq)) site.faq = incoming.faq;
  if (Array.isArray(incoming.process)) site.process = incoming.process;
  if (Array.isArray(incoming.stats)) site.stats = incoming.stats;
  writeSiteData(site);
  res.json({ success: true, message: 'Website settings saved successfully.' });
});

app.get('/api/products', (req, res) => {
  const products = readProducts();
  let filtered = products;
  const { category, search, id, status } = req.query;

  if (id) {
    const found = filtered.find((product) => String(product.id).toLowerCase() === String(id).toLowerCase());
    if (found) return res.json(found);
    return res.status(404).json({ error: 'Product not found' });
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((product) => product.category === category);
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((product) => product.status === status);
  }

  if (search) {
    const searchTerm = String(search).toLowerCase();
    filtered = filtered.filter((product) => {
      const values = [
        product.name,
        product.modelCode,
        product.categoryName,
        product.description,
        product.material,
        ...(Array.isArray(product.finishes) ? product.finishes : [])
      ];
      return values.some((value) => String(value).toLowerCase().includes(searchTerm));
    });
  }

  res.json({ total: filtered.length, products: filtered });
});

// Public contact forms
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message, productCode, company } = req.body || {};
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Please provide your name, email, and contact number.' });
  }

  const inquiries = readInquiries();
  inquiries.unshift({
    id: `INQ-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    subject: String(subject || 'General inquiry').trim(),
    message: String(message || '').trim(),
    productCode: productCode || null,
    company: company || null,
    status: 'new',
    createdAt: new Date().toISOString()
  });
  writeInquiries(inquiries);

  return res.json({ success: true, message: 'Thank you for contacting Innovix Global. Our team will respond shortly.' });
});

app.post('/api/quote', (req, res) => {
  const { name, email, phone, items } = req.body || {};
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Please provide your name, email, and phone number for the quote request.' });
  }

  const inquiries = readInquiries();
  inquiries.unshift({
    id: `Q-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    subject: 'Quote request',
    message: items ? `Quoted items: ${Array.isArray(items) ? items.join(', ') : items}` : 'Quote request submitted',
    status: 'new',
    createdAt: new Date().toISOString()
  });
  writeInquiries(inquiries);

  res.json({ success: true, message: 'Your quote request has been submitted successfully. Our team will prepare a detailed proposal.' });
});

app.post('/api/dealership', (req, res) => {
  const { name, email, phone, city, message } = req.body || {};
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Please provide your name, email, and phone number.' });
  }

  const inquiries = readInquiries();
  inquiries.unshift({
    id: `DLR-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    subject: 'Dealership inquiry',
    message: `City: ${String(city || 'Not provided')} | ${String(message || 'Dealership application submitted')}`,
    status: 'new',
    createdAt: new Date().toISOString()
  });
  writeInquiries(inquiries);

  res.json({ success: true, message: 'Thank you for your dealership application. Our sales manager will contact you within 24 hours.' });
});

// Admin routes
app.get('/admin/login', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin', 'login.html')));
app.get('/admin', requireAuth, (req, res) => res.redirect('/admin/dashboard'));
app.get('/admin/dashboard', requireAuth, (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin', 'dashboard.html')));
app.get('/admin/products', requireAuth, (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin', 'products.html')));
app.get('/admin/categories', requireAuth, (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin', 'categories.html')));
app.get('/admin/enquiries', requireAuth, (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin', 'enquiries.html')));
app.get('/admin/settings', requireAuth, (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin', 'settings.html')));

app.post('/admin/login', authLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  const users = readJson(USERS_FILE, []);
  const user = users.find((entry) => entry.email.toLowerCase() === String(email || '').toLowerCase() && entry.active !== false);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const valid = await bcrypt.compare(String(password || ''), user.passwordHash || '');
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to create a secure session.' });
    }

    req.session.isAuthenticated = true;
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return res.json({ success: true, redirect: '/admin/dashboard' });
  });
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, redirect: '/admin/login' });
  });
});

app.get('/api/admin/profile', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

app.put('/api/admin/profile', requireAuth, async (req, res) => {
  const { name, email, password } = req.body || {};
  const users = readJson(USERS_FILE, []);
  const userIndex = users.findIndex(u => u.id === req.session.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (password) users[userIndex].passwordHash = await bcrypt.hash(password, 10);
  users[userIndex].updatedAt = new Date().toISOString();
  
  writeJson(USERS_FILE, users);
  
  req.session.user = { ...req.session.user, name: users[userIndex].name, email: users[userIndex].email };
  res.json({ success: true, user: req.session.user });
});

app.get('/api/admin/summary', requireAuth, (req, res) => {
  const site = readSiteData();
  const inquiries = readInquiries();
  const products = readProducts();

  res.json({
    totals: {
      services: Array.isArray(site.services) ? site.services.length : 0,
      projects: Array.isArray(site.projects) ? site.projects.length : 0,
      testimonials: Array.isArray(site.testimonials) ? site.testimonials.length : 0,
      products: Array.isArray(products) ? products.length : 0,
      inquiries: inquiries.length,
      blogPosts: 0
    },
    recent: inquiries.slice(0, 5)
  });
});

// Admin Products API
app.get('/api/admin/products', requireAuth, (req, res) => {
  const products = readProducts();
  let filtered = products;
  const { category, search, status } = req.query;

  if (category && category !== 'all') {
    filtered = filtered.filter((product) => product.category === category);
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((product) => product.status === status);
  }

  if (search) {
    const searchTerm = String(search).toLowerCase();
    filtered = filtered.filter((product) => {
      const values = [
        product.name,
        product.modelCode,
        product.categoryName,
        product.description,
        product.material,
        ...(Array.isArray(product.finishes) ? product.finishes : [])
      ];
      return values.some((value) => String(value).toLowerCase().includes(searchTerm));
    });
  }

  res.json({ total: filtered.length, products: filtered });
});

app.post('/api/admin/products', requireAuth, (req, res) => {
  const products = readProducts();
  const { productCode, name, category, status, description, material, featured, finishes, sizes, image } = req.body || {};
  
  if (!productCode || !name || !category || !material || !finishes || !sizes) {
    return res.status(400).json({ error: 'Missing required fields: productCode, name, category, material, finishes, sizes' });
  }
  
  if (products.find(p => p.productCode === productCode || p.id === productCode)) {
    return res.status(400).json({ error: 'Product code already exists' });
  }

  const newProduct = {
    id: productCode,
    productCode,
    name,
    modelCode: productCode,
    category,
    categoryName: category === 'pull' ? 'Main Door Handles' : 'Mortise Handles',
    status: status || 'published',
    description: description || '',
    material,
    featured: featured || false,
    finishes: Array.isArray(finishes) ? finishes : finishes.split('\n').map(f => f.trim()).filter(f => f),
    sizes: Array.isArray(sizes) ? sizes : sizes.split('\n').map(s => s.trim()).filter(s => s),
    image: image || `/images/${productCode.toLowerCase()}.jpg`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', requireAuth, (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id || p.productCode === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { productCode, name, category, status, description, material, featured, finishes, sizes, image } = req.body || {};
  
  if (productCode && productCode !== products[index].productCode) {
    if (products.find(p => p.productCode === productCode)) {
      return res.status(400).json({ error: 'Product code already exists' });
    }
  }

  products[index] = {
    ...products[index],
    productCode: productCode || products[index].productCode,
    name: name || products[index].name,
    modelCode: productCode || products[index].modelCode,
    category: category || products[index].category,
    categoryName: (category || products[index].category) === 'pull' ? 'Main Door Handles' : 'Mortise Handles',
    status: status || products[index].status,
    description: description !== undefined ? description : products[index].description,
    material: material || products[index].material,
    featured: featured !== undefined ? featured : products[index].featured,
    finishes: finishes ? (Array.isArray(finishes) ? finishes : finishes.split('\n').map(f => f.trim()).filter(f => f)) : products[index].finishes,
    sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split('\n').map(s => s.trim()).filter(s => s)) : products[index].sizes,
    image: image !== undefined ? image : products[index].image,
    updatedAt: new Date().toISOString()
  };

  writeProducts(products);
  res.json({ success: true, product: products[index] });
});

app.delete('/api/admin/products/:id', requireAuth, (req, res) => {
  let products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id || p.productCode === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(index, 1);
  writeProducts(products);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Admin Categories API
app.get('/api/admin/categories', requireAuth, (req, res) => {
  const categories = readCategories();
  res.json({ categories });
});

app.post('/api/admin/categories', requireAuth, (req, res) => {
  const categories = readCategories();
  const { name, slug, description, image, status } = req.body || {};
  
  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required' });
  }
  
  if (categories.find(c => c.slug === slug)) {
    return res.status(400).json({ error: 'Category slug already exists' });
  }

  const newCategory = {
    id: `cat-${Date.now()}`,
    name,
    slug,
    description: description || '',
    image: image || '/images/placeholder.jpg',
    status: status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  categories.push(newCategory);
  writeCategories(categories);
  res.status(201).json({ success: true, category: newCategory });
});

app.put('/api/admin/categories/:id', requireAuth, (req, res) => {
  const categories = readCategories();
  const index = categories.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const { name, slug, description, image, status } = req.body || {};
  
  if (slug && slug !== categories[index].slug) {
    if (categories.find(c => c.slug === slug)) {
      return res.status(400).json({ error: 'Category slug already exists' });
    }
  }

  categories[index] = {
    ...categories[index],
    name: name || categories[index].name,
    slug: slug || categories[index].slug,
    description: description !== undefined ? description : categories[index].description,
    image: image !== undefined ? image : categories[index].image,
    status: status || categories[index].status,
    updatedAt: new Date().toISOString()
  };

  writeCategories(categories);
  res.json({ success: true, category: categories[index] });
});

app.delete('/api/admin/categories/:id', requireAuth, (req, res) => {
  let categories = readCategories();
  const index = categories.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  categories.splice(index, 1);
  writeCategories(categories);
  res.json({ success: true, message: 'Category deleted successfully' });
});

// Admin Enquiries API
app.get('/api/admin/enquiries', requireAuth, (req, res) => {
  const inquiries = readInquiries();
  let filtered = inquiries;
  const { search, status } = req.query;

  if (status && status !== 'all') {
    filtered = filtered.filter((i) => i.status === status);
  }

  if (search) {
    const searchTerm = String(search).toLowerCase();
    filtered = filtered.filter((i) => {
      const values = [i.name, i.email, i.phone, i.subject, i.message, i.productCode, i.company];
      return values.some((v) => String(v || '').toLowerCase().includes(searchTerm));
    });
  }

  res.json({ enquiries: filtered });
});

app.patch('/api/admin/enquiries/:id', requireAuth, (req, res) => {
  const { status } = req.body || {};
  const inquiries = readInquiries();
  const item = inquiries.find((entry) => entry.id === req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  item.status = status || item.status;
  item.updatedAt = new Date().toISOString();
  writeInquiries(inquiries);
  return res.json({ success: true, enquiry: item });
});

app.delete('/api/admin/enquiries/:id', requireAuth, (req, res) => {
  let inquiries = readInquiries();
  const index = inquiries.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  inquiries.splice(index, 1);
  writeInquiries(inquiries);
  res.json({ success: true, message: 'Enquiry deleted successfully' });
});

// Admin Settings API
app.get('/api/admin/settings', requireAuth, (req, res) => {
  const site = readSiteData();
  res.json(site);
});

app.post('/api/admin/settings', requireAuth, (req, res) => {
  const site = readSiteData();
  const incoming = req.body || {};
  
  if (incoming.company) site.company = { ...site.company, ...incoming.company };
  if (incoming.hero) site.hero = { ...site.hero, ...incoming.hero };
  if (incoming.seo) site.seo = { ...site.seo, ...incoming.seo };
  if (Array.isArray(incoming.services)) site.services = incoming.services;
  if (Array.isArray(incoming.projects)) site.projects = incoming.projects;
  if (Array.isArray(incoming.testimonials)) site.testimonials = incoming.testimonials;
  if (Array.isArray(incoming.faq)) site.faq = incoming.faq;
  if (Array.isArray(incoming.process)) site.process = incoming.process;
  if (Array.isArray(incoming.stats)) site.stats = incoming.stats;
  
  writeSiteData(site);
  res.json({ success: true, message: 'Settings saved successfully.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

ensureDirectory(DATA_DIR);
ensureSeedAdminUser().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`===================================================`);
    console.log(`   INNOVIX GLOBAL - SECURE CORPORATE APP`);
    console.log(`   Running at: http://${HOST}:${PORT}`);
    console.log(`   Admin login: http://${HOST}:${PORT}/admin/login`);
    console.log(`===================================================`);
  });
}).catch((error) => {
  console.error('Failed to start server.', error);
  process.exit(1);
});
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
    headline: 'Luxury hardware designed for bold entrances and lasting impressions.',
    subheading: 'Innovix Global crafts premium mortise handles, statement pull handles, and architectural hardware for residential and commercial projects across India.',
    primaryCta: 'Explore catalog',
    secondaryCta: 'Request a quote'
  },
  services: [
    {
      title: 'Mortise Handles',
      description: 'Elegant lever and mortise solutions for premium residences, villas, and hospitality interiors.',
      icon: 'ri-door-open-line'
    },
    {
      title: 'Main Door Pulls',
      description: 'Architectural pulls designed for entrances, lobbies, showrooms, and statement façades.',
      icon: 'ri-drag-move-fill'
    }
  ],
  stats: [
    { value: '250K+', label: 'Cycle fatigue tested' },
    { value: '22', label: 'Core product models' },
    { value: '100%', label: 'Solid brass and zinc alloy' },
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
    title: 'Innovix Global | Architectural Hardware',
    description: 'Premium architectural hardware and designer handles for residential and commercial applications in India.',
    canonical: 'https://www.innovixglobal.in/'
  }
};

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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
      connectSrc: ["'self'", 'https://maps.google.com'],
      frameSrc: ["'self'", 'https://maps.google.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: isProduction ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));

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

app.get(['/','/index','/index.html','/home'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get(['/about','/about.html','/aboutus'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'about.html')));
app.get(['/products','/products.html','/product'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'products.html')));
app.get(['/services','/services.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'services.html')));
app.get(['/manufacturing','/manufacturing.html','/quality'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'manufacturing.html')));
app.get(['/dealership','/dealership.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'dealership.html')));
app.get(['/contact','/contact.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'contact.html')));
app.get(['/privacy-policy','/privacy-policy.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'privacy-policy.html')));
app.get(['/terms-and-conditions','/terms-and-conditions.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'terms-and-conditions.html')));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'robots.txt')));
app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'sitemap.xml')));
app.get('/404.html', (req, res) => res.sendFile(path.join(PUBLIC_DIR, '404.html')));

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
  const { category, search, id } = req.query;

  if (id) {
    const found = filtered.find((product) => String(product.id).toLowerCase() === String(id).toLowerCase());
    if (found) return res.json(found);
    return res.status(404).json({ error: 'Product not found' });
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((product) => product.category === category);
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

app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
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

app.get('/admin/login', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin', 'login.html')));
app.get('/admin', requireAuth, (req, res) => res.redirect('/admin/dashboard'));
app.get('/admin/dashboard', requireAuth, (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin', 'dashboard.html')));

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

app.get('/api/admin/inquiries', requireAuth, (req, res) => {
  res.json(readInquiries());
});

app.patch('/api/admin/inquiries/:id', requireAuth, (req, res) => {
  const { status } = req.body || {};
  const inquiries = readInquiries();
  const item = inquiries.find((entry) => entry.id === req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Inquiry not found.' });
  }

  item.status = status || item.status;
  item.updatedAt = new Date().toISOString();
  writeInquiries(inquiries);
  return res.json({ success: true, inquiry: item });
});

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

# INNOVIX GLOBAL - Architectural Hardware Website

A premium corporate website and interactive product catalogue for INNOVIX GLOBAL, manufacturers of luxury architectural hardware including Main Door Handles and Mortise Handles.

## Features

- **Premium Design**: Black/charcoal backgrounds with champagne gold accents
- **Product Catalogue**: 41 products (19 Main Door Handles + 22 Mortise Handles)
- **Product Detail Pages**: Dynamic pages with image galleries, specifications, and enquiry forms
- **Admin Dashboard**: Secure management for products, categories, enquiries, and settings
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **SEO Optimized**: Meta tags, structured data, sitemap, robots.txt
- **Security**: Helmet.js, rate limiting, secure sessions, bcrypt password hashing

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla HTML/CSS/JS with modern design system
- **Database**: JSON file-based (easily migratable to MongoDB)
- **Authentication**: Session-based with bcrypt
- **Styling**: Custom CSS with CSS variables and design tokens

## Project Structure

```
innovix-global/
├── public/                 # Static frontend files
│   ├── index.html          # Home page
│   ├── about.html          # About Us page
│   ├── products.html       # Product catalogue
│   ├── product-detail.html # Dynamic product detail
│   ├── how-to-clean.html   # Cleaning instructions
│   ├── contact.html        # Contact/enquiry page
│   ├── css/
│   │   └── style.css       # Complete design system
│   ├── js/
│   │   └── main.js         # Frontend JavaScript
│   ├── images/             # Product images
│   ├── admin/              # Admin panel
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── products.html
│   │   ├── categories.html
│   │   ├── enquiries.html
│   │   └── settings.html
│   ├── robots.txt
│   └── sitemap.xml
├── data/                   # JSON database
│   ├── products.json       # 41 products from brochure
│   ├── categories.json     # Product categories
│   ├── site.json           # Site settings
│   ├── inquiries.json      # Customer enquiries
│   └── user-store.json     # Admin users
├── server.js               # Express server with all APIs
├── package.json
└── .env                    # Environment variables
```

## Installation (macOS)

### Prerequisites

- Node.js 18+ 
- npm 9+

### Steps

1. **Clone/Navigate to project**
   ```bash
   cd /path/to/innovix-global
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the website**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin/login
   - Default admin: admin@innovixglobal.in / ChangeMe123!

## Environment Variables

Create a `.env` file:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
SESSION_SECRET=your-super-secret-session-key-change-in-production
SESSION_SECURE=false
ADMIN_EMAIL=admin@innovixglobal.in
ADMIN_PASSWORD=YourSecurePassword123!
```

## Production Deployment

### 1. Build for Production

```bash
NODE_ENV=production npm start
```

### 2. Process Manager (PM2)

```bash
npm install -g pm2
pm2 start server.js --name innovix-global
pm2 startup
pm2 save
```

### 3. Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name www.innovixglobal.in innovixglobal.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.innovixglobal.in innovixglobal.in;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d www.innovixglobal.in -d innovixglobal.in
```

## Admin Panel Guide

### Access
- URL: `/admin/login`
- Default credentials (change immediately):
  - Email: admin@innovixglobal.in
  - Password: ChangeMe123!

### Dashboard
- Overview statistics
- Recent enquiries with quick status updates

### Products Management
- Add/Edit/Delete products
- Search and filter by category, status
- Manage finishes, sizes, materials
- Featured product toggle

### Categories Management
- Manage product categories
- SEO-friendly slugs

### Enquiries Management
- View all customer enquiries
- Filter by status, search
- Update status: New → Pending → Contacted → Completed
- View full enquiry details

### Settings
- Company information
- Hero section content
- SEO settings (title, description, canonical)
- Admin profile & password

## API Endpoints

### Public
- `GET /api/products` - List products (with filters)
- `GET /api/products?id=IGPH-211` - Single product
- `GET /api/site` - Site settings
- `POST /api/contact` - Contact form
- `POST /api/quote` - Quote request
- `POST /api/dealership` - Dealership application

### Admin (require authentication)
- `GET /api/admin/summary` - Dashboard stats
- `GET /api/admin/products` - All products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - All categories
- `POST/PUT/DELETE /api/admin/categories` - Category CRUD
- `GET /api/admin/enquiries` - All enquiries
- `PATCH /api/admin/enquiries/:id` - Update status
- `DELETE /api/admin/enquiries/:id` - Delete enquiry
- `GET /api/admin/settings` - Get settings
- `POST /api/admin/settings` - Update settings

## Product Data Structure

```json
{
  "id": "IGPH-211",
  "productCode": "IGPH-211",
  "name": "Aura Lattice Imperial Pull Handle",
  "modelCode": "IGPH-211",
  "category": "pull",
  "categoryName": "Main Door Handles",
  "image": "/images/IGPH-211.jpg",
  "material": "SS + Brass",
  "finishes": ["Black/R.Gold", "AB/Gold", "R.Gold/TT"],
  "sizes": ["300mm", "450mm", "600mm", "900mm", "1200mm"],
  "description": "Premium main door handle...",
  "features": ["Feature 1", "Feature 2"],
  "status": "published",
  "featured": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Customization

### Colors (CSS Variables in style.css)
```css
:root {
  --color-primary: #05050A;      /* Primary black */
  --color-secondary: #17171D;    /* Secondary charcoal */
  --color-gold: #C5A15A;         /* Champagne gold */
  --color-gold-light: #E5C98D;   /* Light gold */
  --color-white: #FFFFFF;
  --color-neutral: #D5D0C7;
}
```

### Adding Products
1. Add product image to `public/images/`
2. Add entry to `data/products.json`
3. Or use Admin Panel → Products → Add Product

### Adding Categories
1. Use Admin Panel → Categories → Add Category
2. Or add to `data/categories.json`

## Performance

- Static file serving with Express
- Optimized images (WebP recommended)
- Minified CSS/JS in production
- Proper caching headers
- Lazy loading for images

## Security

- Helmet.js for security headers
- Rate limiting (60 req/min public, 8/15min auth)
- Secure session cookies (HttpOnly, SameSite)
- bcrypt password hashing (10 rounds)
- Input validation and sanitization
- CSP headers configured

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.

## Support

For technical support or customization requests, contact the development team.

---

**INNOVIX GLOBAL** - THE STRUCTURE OF STYLE
Premium Architectural Hardware since 2024
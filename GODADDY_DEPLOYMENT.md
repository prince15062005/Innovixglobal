# GoDaddy Deployment Guide for Innovix Global

This is the production deployment guide for the current Innovix Global Node.js site. The app is already built around Express, static public pages, JSON-backed catalog data, and a protected admin area. It is a good fit for GoDaddy cPanel hosting and also works on a Linux VPS when run behind Nginx.

---

## 1. Upload the project to GoDaddy

Upload the complete project folder to the hosting account, including:

- server.js
- package.json
- .env.example
- public/
- data/
- images/
- pdf/

The app does not need a database for the current build. Product data and inquiry records are stored in JSON files in the data directory.

---

## 2. Create the production environment file

In the hosting root, create a file named .env with the real production values.

Use these values as a starting point:

PORT=3000
HOST=0.0.0.0
NODE_ENV=production
SESSION_SECRET=replace_with_a_strong_random_string
ADMIN_EMAIL=admin@innovixglobal.in
ADMIN_PASSWORD=ChangeMe123!

Important:
- Replace SESSION_SECRET with a long random string.
- Replace ADMIN_PASSWORD immediately after the first admin login.
- Keep ADMIN_EMAIL in a real business address if you want a branded admin account.

---

## 3. GoDaddy cPanel setup

### Option A: cPanel Node.js App (recommended)

1. Open cPanel and select Setup Node.js App.
2. Create a new application.
3. Set:
   - Node.js version: 18 or 20
   - Application mode: Production
   - Application root: the folder that contains the project
   - Application URL: your domain root or subdomain
   - Startup file: server.js
4. Save the app.
5. Run npm install from the app folder or use the cPanel install button.
6. Restart the app.
7. Confirm the site loads at your domain.

### Important cPanel requirement

Make sure the Node.js app is assigned to the correct domain and not just a private folder. If the app is not linked to the domain root, the site will appear unreachable even when the server is running.

---

## 4. DNS and domain setup

If the domain is already registered with GoDaddy, check the DNS records for the live site.

Use these basic records:

- A record for @ pointing to the hosting server IP
- CNAME record for www pointing to the root domain

Example:

- Type: A, Name: @, Value: your hosting server IPv4 address
- Type: CNAME, Name: www, Value: yourdomain.com

Do not point the domain to 127.0.0.1 or to a local machine. That will fail in production.

To test DNS after saving:

- dig +short yourdomain.com A
- dig +short www.yourdomain.com A
- curl -I https://yourdomain.com

If the A record is blank, DNS has not propagated yet. If the site still fails after DNS resolves, verify the app startup file and the domain mapping inside cPanel.

---

## 5. Restart and verify the app

After deployment:

- Restart the Node application in cPanel
- Visit the domain homepage
- Check the admin login page at /admin/login
- Confirm the products endpoint responds with JSON data

The project already includes a protected admin area and public routes for home, products, services, contact, and legal pages.

---

## 6. Secure deployment checklist

Before going live:

- Change the default admin password
- Set a strong SESSION_SECRET
- Turn on HTTPS in GoDaddy or the hosting panel
- Update the company contact and address details if needed
- Confirm the domain is mapped to the correct Node app

---

## 7. Production notes

This project is intentionally lightweight and does not require a database to start. It is a good fit for a small-to-medium business site that needs:

- public marketing pages
- catalog browsing
- inquiry forms
- admin login and dashboard
- secure headers and session protection

If the business grows later, the current JSON-based storage can be moved to a proper database without changing the public frontend structure.

---

## 8. Contact details included in the site

- Company: Innovix Global
- Brand: Innovix Global Architectural Hardware
- Email: innovixxglobal@gmail.com
- Address: “Matel”, Brahmaniyapara-19, Near govindbag vegetable market, Pedak road, Rajkot-360003
- Contacts:
  - Dholariya Sneh: +91 91061 84146
  - Ramani Prem: +91 82382 82481

This guide is ready for your GoDaddy production deployment and matches the current secure Express build in the project.

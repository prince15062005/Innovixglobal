import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Send } from 'lucide-react';
import { companyInfo } from '../../data/products';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Catalogue', href: '/catalogue' },
      { label: 'How to Clean', href: '/how-to-clean' },
      { label: 'Contact', href: '/contact' },
    ],
    products: [
      { label: 'Main Door Handles', href: '/catalogue?category=main-door' },
      { label: 'Mortise Handles', href: '/catalogue?category=mortise' },
      { label: 'Finishes Guide', href: '/catalogue#finishes' },
      { label: 'Size Guide', href: '/catalogue#sizes' },
    ],
    support: [
      { label: 'Enquiry Form', href: '/contact' },
      { label: 'WhatsApp Us', href: `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}` },
      { label: 'Cleaning Instructions', href: '/how-to-clean' },
      { label: 'FAQ', href: '/contact#faq' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-secondary border-t border-neutral/10">
      <div className="section-container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6" aria-label="INNOVIX GLOBAL Home">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <Send className="w-7 h-7 text-primary" />
              </div>
              <div>
                <span className="font-display text-2xl font-medium text-white tracking-wide block">INNOVIX GLOBAL</span>
                <p className="font-serif text-sm text-gold tracking-widest mt-[-6px]">THE STRUCTURE OF STYLE</p>
              </div>
            </Link>
            <p className="text-neutral max-w-xs mb-8 leading-relaxed">
              Premium architectural hardware crafted with precision and elegance. 
              Transforming spaces with luxury door handles and mortise handles.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-neutral transition-all duration-300 ${social.color} hover:bg-gold/10 hover:text-gold`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-medium text-gold mb-6">Quick Links</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-neutral hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display text-lg font-medium text-gold mb-6">Products</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-neutral hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-medium text-gold mb-6">Contact Us</h4>
            <address className="not-italic space-y-4 text-neutral">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{companyInfo.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${companyInfo.phone[0].replace(/\s/g, '')}`} className="block text-sm hover:text-gold transition-colors">
                    {companyInfo.phone[0]}
                  </a>
                  <a href={`tel:${companyInfo.phone[1].replace(/\s/g, '')}`} className="block text-sm hover:text-gold transition-colors mt-1">
                    {companyInfo.phone[1]}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <a href={`mailto:${companyInfo.email}`} className="text-sm hover:text-gold transition-colors">
                  {companyInfo.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Send className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <a 
                  href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-gold transition-colors flex items-center gap-1"
                >
                  <span>WhatsApp</span>
                  <span className="text-green-500">▸</span>
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral/60 text-sm">
            © {currentYear} INNOVIX GLOBAL. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral/60">
            <span>Architectural Hardware</span>
            <span className="text-gold">•</span>
            <span>Rajkot, Gujarat, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
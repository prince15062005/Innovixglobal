import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Phone, Mail } from 'lucide-react';
import { companyInfo } from '../../data/products';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/how-to-clean', label: 'How to Clean' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-primary/95 backdrop-blur-sm border-b border-neutral/10' : 'bg-transparent'}`}>
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 z-50" aria-label="INNOVIX GLOBAL Home">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-medium text-white tracking-wide">INNOVIX GLOBAL</span>
              <p className="font-serif text-xs text-gold tracking-widest mt-[-4px]">THE STRUCTURE OF STYLE</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8" role="menubar">
              {navLinks.map((link) => (
                <li key={link.href} role="none">
                  <Link
                    to={link.href}
                    role="menuitem"
                    className={`nav-link text-sm font-medium ${location.pathname === link.href ? 'text-gold' : ''}`}
                    aria-current={location.pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <div className="hidden lg:flex items-center gap-6 ml-4 border-l border-neutral/20 pl-6">
              <a 
                href={`tel:${companyInfo.phone[0].replace(/\s/g, '')}`} 
                className="flex items-center gap-2 text-sm text-neutral hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                {companyInfo.phone[0]}
              </a>
              <a 
                href={`mailto:${companyInfo.email}`} 
                className="flex items-center gap-2 text-sm text-neutral hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                {companyInfo.email}
              </a>
            </div>
          </div>

          {/* Mobile Menu Button & CTA */}
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="hidden sm:inline-flex btn-primary text-sm px-6 py-2.5"
            >
              Send Enquiry
            </Link>
            
            <button
              className="md:hidden p-2 text-neutral hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-6 border-t border-neutral/10 animate-slide-down">
            <ul className="flex flex-col gap-4" role="menu">
              {navLinks.map((link) => (
                <li key={link.href} role="none">
                  <Link
                    to={link.href}
                    role="menuitem"
                    className={`block px-2 py-3 text-base font-medium rounded-lg transition-colors ${location.pathname === link.href ? 'bg-gold/10 text-gold' : 'text-neutral hover:text-gold hover:bg-secondary'}`}
                    aria-current={location.pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-neutral/10 flex flex-col gap-3">
              <Link
                to="/contact"
                className="btn-primary text-center"
              >
                Send Enquiry
              </Link>
              <div className="flex flex-col gap-3 text-sm text-neutral">
                <a href={`tel:${companyInfo.phone[0].replace(/\s/g, '')}`} className="flex items-center justify-center gap-2 hover:text-gold transition-colors">
                  <Phone className="w-5 h-5" />
                  {companyInfo.phone[0]}
                </a>
                <a href={`mailto:${companyInfo.email}`} className="flex items-center justify-center gap-2 hover:text-gold transition-colors">
                  <Mail className="w-5 h-5" />
                  {companyInfo.email}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ShoppingBag, Award, Truck, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { mainDoorHandles, mortiseHandles, categories, companyInfo } from '../data/products';
import Button from '../components/ui/Button';

const featuredProducts = [...mainDoorHandles.filter(p => p.featured), ...mortiseHandles.filter(p => p.featured)].slice(0, 6);

const features = [
  { icon: Award, title: 'Premium Craftsmanship', description: 'Each piece meticulously crafted with attention to detail' },
  { icon: Shield, title: 'Quality Materials', description: 'Finest brass, stainless steel, and premium finishes' },
  { icon: Star, title: 'Innovative Design', description: 'Contemporary designs that elevate architectural spaces' },
  { icon: Truck, title: 'Pan India Delivery', description: 'Reliable shipping across India with secure packaging' },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>INNOVIX GLOBAL - Architectural Hardware | THE STRUCTURE OF STYLE</title>
        <meta name="description" content="INNOVIX GLOBAL - Premium architectural hardware manufacturer. Luxury main door handles, mortise handles, and designer door hardware. THE STRUCTURE OF STYLE." />
        <meta property="og:title" content="INNOVIX GLOBAL - Architectural Hardware" />
        <meta property="og:description" content="Premium luxury door handles and mortise handles. THE STRUCTURE OF STYLE." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/hero-1.jpg" 
            alt="INNOVIX GLOBAL Architectural Hardware" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/90" />
        </div>
        
        <div className="section-container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="inline-block px-6 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium tracking-wider mb-6">
                ARCHITECTURAL HARDWARE
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-tight mb-6"
            >
              THE STRUCTURE <br />
              <span className="text-gold">OF STYLE</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Discover premium architectural hardware that transforms spaces. 
              Exquisite main door handles and mortise handles crafted with precision.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/catalogue">
                <Button size="lg" leftIcon={<ShoppingBag className="w-5 h-5" />}>
                  Discover Our Collection
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  Send Enquiry
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span className="text-gold font-medium tracking-wider text-sm">OUR COLLECTIONS</motion.span>
            <motion.h2 className="section-title mt-2">Featured Collections</motion.h2>
            <motion.p className="section-subtitle mt-4">
              Explore our premium range of architectural hardware designed for discerning spaces
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <motion.article
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-2xl border border-neutral/10 hover:border-gold/30 transition-all duration-500"
              >
                <Link to={`/catalogue?category=${category.slug}`} className="block">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h3 className="font-display text-3xl md:text-4xl font-medium text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-neutral mb-6">{category.description}</p>
                      <span className="inline-flex items-center gap-2 text-gold font-medium self-start group-hover:gap-3 transition-all">
                        Explore Collection
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <motion.span className="text-gold font-medium tracking-wider text-sm">FEATURED PRODUCTS</motion.span>
              <motion.h2 className="section-title mt-2">Handpicked Excellence</motion.h2>
            </div>
            <Link to="/catalogue" className="btn-secondary self-end md:self-auto">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.article
                key={product.productCode}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="product-card"
              >
                <Link to={`/products/${product.productCode.toLowerCase()}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="product-card-image"
                      loading="lazy"
                    />
                    <div className="product-card-overlay">
                      <div className="w-full">
                        <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-medium mb-3">
                          {product.category === 'main-door' ? 'Main Door Handle' : 'Mortise Handle'}
                        </span>
                        <h3 className="font-display text-xl font-medium text-white mb-1">{product.productCode}</h3>
                        <p className="text-neutral text-sm">{product.material}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.finishes.slice(0, 3).map((finish) => (
                        <span key={finish} className="px-2 py-0.5 rounded text-xs bg-primary/50 text-neutral/70 border border-neutral/20">
                          {finish}
                        </span>
                      ))}
                      {product.finishes.length > 3 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gold/20 text-gold border border-gold/30">
                          +{product.finishes.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-medium">View Details</span>
                      <ArrowRight className="w-4 h-4 text-gold/50 group-hover:text-gold transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose INNOVIX GLOBAL */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span className="text-gold font-medium tracking-wider text-sm">WHY CHOOSE US</motion.span>
            <motion.h2 className="section-title mt-2">Why Choose INNOVIX GLOBAL</motion.h2>
            <motion.p className="section-subtitle mt-4">
              Committed to excellence in every piece of architectural hardware we create
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-medium text-white mb-3">{feature.title}</h3>
                <p className="text-neutral">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Introduction */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span className="text-gold font-medium tracking-wider text-sm">ABOUT US</motion.span>
              <motion.h2 className="section-title mt-2">The Structure of Style</motion.h2>
              <motion.div className="gold-divider mx-auto md:mx-0" />
              <motion.p className="mt-8 text-lg text-neutral leading-relaxed">
                INNOVIX GLOBAL stands at the forefront of architectural hardware innovation, 
                creating premium door handles and mortise handles that define luxury living spaces. 
                Our commitment to exceptional craftsmanship and timeless design has made us 
                a trusted name in the industry.
              </motion.p>
              <motion.p className="mt-6 text-neutral leading-relaxed">
                Every piece in our collection is engineered with precision, using the finest materials 
                including premium brass, stainless steel, and exclusive finishes. From contemporary 
                main door handles to sophisticated mortise handles, our products embody the perfect 
                balance of form and function.
              </motion.p>
              <motion.div className="mt-8 flex flex-wrap gap-4">
                <Link to="/about" className="btn-primary">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/catalogue" className="btn-secondary">
                  Explore Collection
                </Link>
              </motion.div>
            </div>
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <img
                  src="/images/hero/hero-2.jpg"
                  alt="INNOVIX GLOBAL Craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent" />
              </motion.div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-gold/95 text-primary px-6 py-4 rounded-xl shadow-2xl"
              >
                <p className="font-display text-2xl font-medium">22+</p>
                <p className="text-sm font-medium tracking-wide">Product Designs</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero/hero-3.jpg')] bg-cover bg-center opacity-5" />
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 className="section-title">Ready to Transform Your Space?</motion.h2>
            <motion.p className="section-subtitle mt-4">
              Connect with our experts to find the perfect architectural hardware for your project
            </motion.p>
            <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" leftIcon={<ShoppingBag className="w-5 h-5" />}>
                  Send Enquiry
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a 
                href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                WhatsApp Us
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
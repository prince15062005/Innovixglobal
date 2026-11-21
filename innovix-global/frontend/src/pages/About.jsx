import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Award, Shield, Star, Truck, Sparkles, Gem } from 'lucide-react';
import { companyInfo } from '../data/products';

const values = [
  { icon: Award, title: 'Craftsmanship Excellence', description: 'Every piece is meticulously crafted by skilled artisans who understand the nuances of premium architectural hardware.' },
  { icon: Gem, title: 'Premium Materials', description: 'We source only the finest brass, stainless steel, and specialized alloys to ensure lasting beauty and durability.' },
  { icon: Sparkles, title: 'Innovative Design', description: 'Our design team continuously pushes boundaries, creating hardware that combines timeless elegance with modern functionality.' },
  { icon: Shield, title: 'Quality Assurance', description: 'Rigorous quality control at every stage ensures each product meets our exacting standards before it reaches you.' },
  { icon: Star, title: 'Customer Centricity', description: 'We listen to architects, designers, and homeowners to create solutions that truly enhance living spaces.' },
  { icon: Truck, title: 'Reliable Delivery', description: 'Pan-India distribution network with secure packaging ensures your products arrive in perfect condition.' },
];

const stats = [
  { value: '19+', label: 'Product Designs' },
  { value: '2', label: 'Categories' },
  { value: '100%', label: 'Quality Checked' },
  { value: 'Pan India', label: 'Delivery Network' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | INNOVIX GLOBAL - Architectural Hardware</title>
        <meta name="description" content="Learn about INNOVIX GLOBAL - Premium architectural hardware manufacturer. Our story, values, and commitment to craftsmanship excellence." />
        <meta property="og:title" content="About Us | INNOVIX GLOBAL" />
        <meta property="og:description" content="Premium architectural hardware manufacturer. Our story, values, and commitment to craftsmanship excellence." />
      </Helmet>

      {/* Page Header */}
      <section className="relative py-20 md:py-28 bg-secondary">
        <div className="absolute inset-0 bg-[url('/images/hero/hero-1.jpg')] bg-cover bg-center opacity-10" />
        <div className="section-container relative">
          <div className="max-w-3xl">
            <motion.span className="text-gold font-medium tracking-wider text-sm">ABOUT US</motion.span>
            <motion.h1 className="section-title mt-2 max-w-2xl">The Structure of Style</motion.h1>
            <motion.div className="gold-divider mx-auto md:mx-0 mt-6" />
            <motion.p className="mt-8 text-lg text-neutral leading-relaxed max-w-2xl">
              INNOVIX GLOBAL stands at the forefront of architectural hardware innovation, 
              creating premium door handles and mortise handles that define luxury living spaces.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2 className="section-title">Our Brand Philosophy</motion.h2>
              <motion.div className="gold-divider mx-auto md:mx-0 mt-4" />
              <motion.div className="mt-8 space-y-6 text-neutral leading-relaxed">
                <motion.p>
                  At INNOVIX GLOBAL, we believe that architectural hardware is more than just 
                  functional components—it's the jewelry of architecture. Every handle, every 
                  mortise lock, every finish tells a story of craftsmanship and design excellence.
                </motion.p>
                <motion.p>
                  Our journey began with a simple vision: to create architectural hardware that 
                  elevates spaces from ordinary to extraordinary. Today, that vision drives 
                  every product we design, every finish we perfect, and every detail we refine.
                </motion.p>
                <motion.p>
                  We specialize in two core categories—Main Door Handles and Mortise Handles—each 
                  engineered with precision using premium materials including brass, stainless steel, 
                  and specialized alloys. Our finishes range from classic gold and rose gold to 
                  contemporary black, graphite, and PVD coatings, ensuring the perfect match for 
                  any architectural style.
                </motion.p>
              </motion.div>
            </div>
            
            <div className="relative">
              <motion.div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src="/images/hero/hero-2.jpg"
                  alt="INNOVIX GLOBAL Manufacturing"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span className="text-gold font-medium tracking-wider text-sm">CORE VALUES</motion.span>
            <motion.h2 className="section-title mt-2">What Drives Us</motion.h2>
            <motion.p className="section-subtitle mt-4">
              The principles that guide every decision and every product we create
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover p-8"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-medium text-white mb-3">{value.title}</h3>
                <p className="text-neutral">{value.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Specialization */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span className="text-gold font-medium tracking-wider text-sm">SPECIALIZATION</motion.span>
            <motion.h2 className="section-title mt-2">Architectural Hardware Expertise</motion.h2>
            <motion.p className="section-subtitle mt-4">
              Focused mastery in premium door hardware categories
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-hover p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl font-medium text-white mb-4">Main Door Handles</h3>
                <p className="text-neutral mb-6 leading-relaxed">
                  Our main door handles collection features 19 distinct designs (IGPH-211 through IGPH-337), 
                  each available in multiple premium finishes and sizes ranging from 200mm to 1200mm. 
                  Materials include SS + Brass combinations, Full Brass, SS + Aluminum, and Brass + Wood 
                  for natural warmth.
                </p>
                <ul className="space-y-3 text-neutral" role="list">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    19 unique designs
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    Multiple finish options
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    Sizes: 200-1200mm
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    Premium material combinations
                  </li>
                </ul>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-hover p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                  <Gem className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl font-medium text-white mb-4">Mortise Handles</h3>
                <p className="text-neutral mb-6 leading-relaxed">
                  Our mortise handles collection features 22 sophisticated designs (IGM-001 through IGM-022), 
                  all crafted from Full Brass with Rose sizing. Finishes include SS, Graphite Black, AB, 
                  Z.Black, and premium PVD coatings in Gold, Rose Gold, and Copper variations.
                </p>
                <ul className="space-y-3 text-neutral" role="list">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    22 unique designs
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    Full Brass construction
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    PVD premium finishes
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    Rose size standard
                  </li>
                </ul>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary relative">
        <div className="absolute inset-0 bg-[url('/images/hero/hero-3.jpg')] bg-cover bg-center opacity-5" />
        <div className="section-container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-medium text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral text-sm tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 className="section-title">Experience the Difference</motion.h2>
            <motion.p className="section-subtitle mt-4">
              Explore our complete collection of premium architectural hardware
            </motion.p>
            <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/catalogue" className="btn-primary">
                View Catalogue
              </a>
              <a href="/contact" className="btn-secondary">
                Get in Touch
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
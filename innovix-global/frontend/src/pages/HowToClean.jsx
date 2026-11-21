import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, X, Cotton, SprayCan, Droplets, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import { cleaningInstructions, companyInfo } from '../data/products';

const doItems = [
  { icon: Cotton, title: 'Use Cotton Cloth', description: 'Always use a soft, clean cotton cloth to gently wipe the surface of your hardware products.' },
];

const dontItems = [
  { icon: SprayCan, title: 'Thinner', description: 'Chemical thinners can strip protective coatings and damage the finish permanently.' },
  { icon: Shield, title: 'Masking Tape', description: 'Adhesive residue from tapes can react with finishes and cause discoloration.' },
  { icon: Droplets, title: 'Acid', description: 'Acidic cleaners will etch and corrode metal surfaces, destroying the premium finish.' },
  { icon: SprayCan, title: 'Toilet Cleaner', description: 'Harsh chemicals in toilet cleaners are too aggressive for architectural hardware.' },
  { icon: Sparkles, title: 'Detergent Powder', description: 'Abrasive particles in detergent powders can scratch and dull the surface finish.' },
];

export default function HowToClean() {
  return (
    <>
      <Helmet>
        <title>How to Clean | INNOVIX GLOBAL - Architectural Hardware</title>
        <meta name="description" content="Learn how to properly clean and maintain your INNOVIX GLOBAL architectural hardware. Essential care instructions for premium door handles and mortise handles." />
        <meta property="og:title" content="How to Clean | INNOVIX GLOBAL" />
        <meta property="og:description" content="Essential cleaning and maintenance instructions for premium architectural hardware." />
      </Helmet>

      {/* Page Header */}
      <section className="relative py-20 md:py-28 bg-secondary">
        <div className="absolute inset-0 bg-[url('/images/hero/hero-1.jpg')] bg-cover bg-center opacity-10" />
        <div className="section-container relative">
          <div className="max-w-3xl">
            <motion.span className="text-gold font-medium tracking-wider text-sm">PRODUCT CARE</motion.span>
            <motion.h1 className="section-title mt-2">How to Clean</motion.h1>
            <motion.div className="gold-divider mx-auto md:mx-0 mt-6" />
            <motion.p className="mt-8 text-lg text-neutral leading-relaxed max-w-2xl">
              Proper care ensures your INNOVIX GLOBAL architectural hardware maintains its 
              premium appearance and functionality for years to come.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Do's Section */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span className="text-green-400 font-medium tracking-wider text-sm">RECOMMENDED</motion.span>
            <motion.h2 className="section-title mt-2">Do Use</motion.h2>
            <motion.p className="section-subtitle mt-4">
              The only recommended cleaning method for all our products
            </motion.p>
          </div>

          <div className="max-w-2xl mx-auto">
            {doItems.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-6 p-8 bg-green-500/5 border border-green-500/20 rounded-2xl"
              >
                <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                  <item.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-white mb-2">{item.title}</h3>
                  <p className="text-neutral">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Don'ts Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span className="text-red-400 font-medium tracking-wider text-sm">STRICTLY AVOID</motion.span>
            <motion.h2 className="section-title mt-2">Do Not Use</motion.h2>
            <motion.p className="section-subtitle mt-4">
              These products and substances will permanently damage your hardware finishes
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dontItems.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover p-6 relative overflow-hidden group"
              >
                <div className="absolute top-4 right-4 w-12 h-12 text-red-500/20">
                  <X className="w-full h-full" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-5">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-lg font-medium text-white mb-3">{item.title}</h3>
                  <p className="text-neutral text-sm">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-8 md:p-12 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-medium text-white mb-4">Important Notice</h3>
            <p className="text-lg text-neutral leading-relaxed">
              {cleaningInstructions.note}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Maintenance Tips */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span className="text-gold font-medium tracking-wider text-sm">MAINTENANCE TIPS</motion.span>
            <motion.h2 className="section-title mt-2">Long-term Care</motion.h2>
            <motion.p className="section-subtitle mt-4">
              Additional guidelines to preserve the beauty of your hardware
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-hover p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-medium text-white mb-2">Regular Dusting</h3>
              <p className="text-neutral text-sm">Gently dust with a dry cotton cloth weekly to prevent buildup</p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-hover p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Droplets className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-medium text-white mb-2">Dry Immediately</h3>
              <p className="text-neutral text-sm">If exposed to moisture, dry immediately with a soft cloth</p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card-hover p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-medium text-white mb-2">Handle with Care</h3>
              <p className="text-neutral text-sm">Avoid impacts and scratches from rings, keys, or tools</p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="card-hover p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Cotton className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-medium text-white mb-2">Soft Cloth Only</h3>
              <p className="text-neutral text-sm">Never use abrasive pads, steel wool, or rough materials</p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-secondary to-primary relative">
        <div className="absolute inset-0 bg-[url('/images/hero/hero-3.jpg')] bg-cover bg-center opacity-5" />
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 className="section-title">Need More Guidance?</motion.h2>
            <motion.p className="section-subtitle mt-4">
              Contact our experts for specific care instructions for your hardware finish
            </motion.p>
            <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contact" className="btn-primary">
                Contact Us
              </Button>
              <a 
                href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                WhatsApp Support
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
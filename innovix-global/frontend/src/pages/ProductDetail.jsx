import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Share2, MessageSquare, Phone, Send, Check } from 'lucide-react';
import { allProducts, companyInfo } from '../data/products';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = allProducts.find(p => p.productCode.toLowerCase() === slug);
  const relatedProducts = allProducts
    .filter(p => p.category === product?.category && p.productCode !== product?.productCode)
    .slice(0, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Product Enquiry',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Set SEO data
  useEffect(() => {
    if (product) {
      document.title = product.seoTitle || `${product.productCode} | INNOVIX GLOBAL`;
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', subject: 'Product Enquiry', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Enquiry submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const whatsappMessage = `Hi, I'm interested in ${product?.productCode} - ${product?.material}. ${formData.message || 'Please provide more details.'}`;
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <h1 className="font-display text-4xl text-gold mb-4">Product Not Found</h1>
          <p className="text-neutral mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/catalogue" className="btn-primary">Back to Catalogue</Link>
        </div>
      </div>
    );
  }

  const categoryLabel = product.category === 'main-door' ? 'Main Door Handle' : 'Mortise Handle';

  return (
    <>
      <Helmet>
        <title>{product.seoTitle}</title>
        <meta name="description" content={product.seoDescription} />
        <meta property="og:title" content={product.seoTitle} />
        <meta property="og:description" content={product.seoDescription} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://www.innovixglobal.in/products/${slug}` />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.productCode,
            description: product.description,
            brand: { '@type': 'Brand', name: 'INNOVIX GLOBAL' },
            category: categoryLabel,
            material: product.material,
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              priceCurrency: 'INR',
            },
            image: product.images,
          })}
        </script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="py-6 bg-secondary border-b border-neutral/10" aria-label="Breadcrumb">
        <div className="section-container">
          <ol className="flex items-center gap-2 text-sm" role="list">
            <li><Link to="/" className="text-neutral hover:text-gold transition-colors">Home</Link></li>
            <li className="text-neutral/50">/</li>
            <li><Link to="/catalogue" className="text-neutral hover:text-gold transition-colors">Catalogue</Link></li>
            <li className="text-neutral/50">/</li>
            <li><Link to={`/catalogue?category=${product.category}`} className="text-neutral hover:text-gold transition-colors">{categoryLabel}</Link></li>
            <li className="text-neutral/50">/</li>
            <li className="text-gold font-medium" aria-current="page">{product.productCode}</li>
          </ol>
        </div>
      </nav>

      {/* Product Detail */}
      <section className="py-12 md:py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="sticky top-28">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 group"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={`${product.productCode} - View ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold hover:text-primary z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold hover:text-primary z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Zoom Button */}
                <button
                  onClick={() => setShowLightbox(true)}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold hover:text-primary"
                  aria-label="Zoom image"
                >
                  <Maximize className="w-5 h-5" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge variant="primary" size="sm">{categoryLabel}</Badge>
                  {product.featured && <Badge variant="featured" size="sm">Featured</Badge>}
                  <Badge variant="published" size="sm">{product.status}</Badge>
                </div>
              </motion.div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-gold' : 'border-neutral/20 hover:border-gold/50'}`}
                      aria-label={`View image ${index + 1}`}
                      aria-current={selectedImage === index}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="primary">{categoryLabel}</Badge>
                  {product.featured && <Badge variant="featured">Featured</Badge>}
                </div>

                <h1 className="font-display text-4xl md:text-5xl font-medium text-white mb-4">{product.productCode}</h1>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 rounded-lg bg-secondary border border-neutral/20 text-neutral">
                    {product.material}
                  </span>
                  {product.category === 'main-door' && (
                    <span className="px-4 py-2 rounded-lg bg-secondary border border-neutral/20 text-neutral">
                      Sizes: {product.sizes.join(', ')}mm
                    </span>
                  )}
                </div>

                <p className="text-lg text-neutral leading-relaxed mb-8">{product.description}</p>

                {/* Specifications */}
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="font-medium text-white mb-4">Available Finishes</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.finishes.map((finish) => (
                        <span key={finish} className="px-4 py-2 rounded-lg bg-secondary border border-neutral/20 text-sm text-white">
                          {finish}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-4">Available Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <span key={size} className="px-4 py-2 rounded-lg bg-secondary border border-neutral/20 text-sm text-white">
                          {size}mm
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-4">Material</h3>
                    <p className="text-neutral">{product.material}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-neutral/10">
                  <Button size="lg" onClick={() => setShowEnquiryModal(true)} leftIcon={<MessageSquare className="w-5 h-5" />}>
                    Send Enquiry
                  </Button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 sm:flex-none">
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp Enquiry
                  </a>
                </div>

                {/* Share */}
                <div className="mt-6 pt-6 border-t border-neutral/10 flex items-center gap-4">
                  <span className="text-sm text-neutral">Share:</span>
                  <button className="p-2 rounded-lg bg-secondary hover:bg-gold/10 text-neutral hover:text-gold transition-colors" aria-label="Share on WhatsApp">
                    <Send className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-secondary hover:bg-gold/10 text-neutral hover:text-gold transition-colors" aria-label="Share via Email">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-secondary hover:bg-gold/10 text-neutral hover:text-gold transition-colors" aria-label="Copy Link">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-secondary">
          <div className="section-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-gold font-medium tracking-wider text-sm">RELATED PRODUCTS</span>
                <h2 className="section-title mt-2">You May Also Like</h2>
              </div>
              <Link to={`/catalogue?category=${product.category}`} className="btn-secondary">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct, index) => (
                <motion.article
                  key={relProduct.productCode}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="product-card"
                >
                  <Link to={`/products/${relProduct.productCode.toLowerCase()}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={relProduct.images[0]}
                        alt={relProduct.name}
                        className="product-card-image"
                        loading="lazy"
                      />
                      <div className="product-card-overlay">
                        <div className="w-full">
                          <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-medium mb-3">
                            {relProduct.category === 'main-door' ? 'Main Door' : 'Mortise'}
                          </span>
                          <h3 className="font-display text-xl font-medium text-white mb-1">{relProduct.productCode}</h3>
                          <p className="text-neutral text-sm">{relProduct.material}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {relProduct.finishes.slice(0, 3).map((finish) => (
                          <span key={finish} className="px-2 py-0.5 rounded text-xs bg-primary/50 text-neutral/70 border border-neutral/20">
                            {finish}
                          </span>
                        ))}
                        {relProduct.finishes.length > 3 && (
                          <span className="px-2 py-0.5 rounded text-xs bg-gold/20 text-gold border border-gold/30">
                            +{relProduct.finishes.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gold font-medium">View Details</span>
                        <ChevronRight className="w-4 h-4 text-gold/50" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enquiry Modal */}
      <AnimatePresence>
        {showEnquiryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/90 backdrop-blur-sm"
            onClick={() => setShowEnquiryModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-secondary rounded-2xl border border-neutral/10 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral/10">
                <h2 id="enquiry-modal-title" className="font-display text-2xl font-medium text-white">
                  Enquiry for {product.productCode}
                </h2>
                <button
                  onClick={() => setShowEnquiryModal(false)}
                  className="p-2 rounded-lg bg-primary/50 hover:bg-gold/10 text-neutral hover:text-gold transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl text-white mb-2">Enquiry Sent!</h3>
                  <p className="text-neutral mb-6">Thank you for your interest. Our team will contact you soon.</p>
                  <Button onClick={() => { setShowEnquiryModal(false); setSubmitSuccess(false); }}>
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <Input
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    placeholder="Your name"
                    required
                  />
                  <Input
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="your@email.com"
                    required
                  />
                  <Input
                    label="Phone Number *"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    placeholder="+91 XXXXXXXXXX"
                    required
                  />
                  <Input
                    label="Company Name"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                  <Select
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    options={[
                      { value: 'Product Enquiry', label: 'Product Enquiry' },
                      { value: 'Bulk Order', label: 'Bulk Order' },
                      { value: 'Technical Query', label: 'Technical Query' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
                  <Textarea
                    label="Message *"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    error={errors.message}
                    placeholder="Your enquiry details..."
                    rows={4}
                    required
                  />
                  <div className="pt-4 flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => setShowEnquiryModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting} className="flex-1">
                      Send Enquiry
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={() => setShowLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image zoom"
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              onClick={() => setShowLightbox(false)}
              aria-label="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <motion.img
              key={selectedImage}
              src={product.images[selectedImage]}
              alt={`${product.productCode} - Zoomed view ${selectedImage + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            />
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(index); }}
                  className={`w-3 h-3 rounded-full transition-all ${selectedImage === index ? 'bg-gold' : 'bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
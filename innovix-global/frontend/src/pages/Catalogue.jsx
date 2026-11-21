import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, ChevronDown, Grid, List } from 'lucide-react';
import { allProducts, categories, mainDoorHandles, mortiseHandles } from '../data/products';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const finishesList = [
  'Black/R.Gold', 'AB/Gold', 'R.Gold/TT', 'Black/Gold', 'Black/TT',
  'Black/Satin', 'R.Gold/White', 'Gold/White', 'Black/Wood', 'AB/Wood',
  'R.Gold/Wood', 'Gold/Wood', 'SS', 'Graphite Black', 'AB', 'Z.Black',
  'Z.Black/Gold', 'Z.Black/Copper', 'Z.Black/M.Black', 'Z.Black/PVD Gold',
  'Z.Black/PVD R.Gold', 'PVD Gold', 'PVD R.Gold', 'Z.Black/SS', 'AB/PVD Gold',
  'SS/Z.Black', 'Z.Black/AB'
];

const materialsList = [
  'SS + Brass', 'Full Brass', 'SS + Korean', 'Brass + Wooden', 
  'SS + Aluminum'
];

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedFinish, setSelectedFinish] = useState(searchParams.get('finish') || '');
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get('material') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedFinish) params.set('finish', selectedFinish);
    if (selectedMaterial) params.set('material', selectedMaterial);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, selectedFinish, selectedMaterial, setSearchParams]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p => 
        p.productCode.toLowerCase().includes(query) ||
        p.material.toLowerCase().includes(query) ||
        p.finishes.some(f => f.toLowerCase().includes(query))
      );
    }

    // Finish filter
    if (selectedFinish) {
      products = products.filter(p => p.finishes.includes(selectedFinish));
    }

    // Material filter
    if (selectedMaterial) {
      products = products.filter(p => p.material === selectedMaterial);
    }

    // Sort
    switch (sortBy) {
      case 'code-asc':
        products.sort((a, b) => a.productCode.localeCompare(b.productCode));
        break;
      case 'code-desc':
        products.sort((a, b) => b.productCode.localeCompare(a.productCode));
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        products.sort((a, b) => (b.featured === a.featured) ? 0 : b.featured ? 1 : -1);
        break;
    }

    return products;
  }, [selectedCategory, searchQuery, selectedFinish, selectedMaterial, sortBy]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    searchQuery,
    selectedFinish,
    selectedMaterial
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFinish('');
    setSelectedMaterial('');
  };

  return (
    <>
      <Helmet>
        <title>Product Catalogue | INNOVIX GLOBAL - Architectural Hardware</title>
        <meta name="description" content="Browse INNOVIX GLOBAL's complete catalogue of premium architectural hardware. Main door handles (IGPH series) and mortise handles (IGM series) with multiple finishes and sizes." />
        <meta property="og:title" content="Product Catalogue | INNOVIX GLOBAL" />
        <meta property="og:description" content="Browse our complete range of premium main door handles and mortise handles." />
      </Helmet>

      {/* Page Header */}
      <section className="relative py-16 md:py-24 bg-secondary">
        <div className="absolute inset-0 bg-[url('/images/hero/hero-1.jpg')] bg-cover bg-center opacity-10" />
        <div className="section-container relative">
          <motion.div className="max-w-3xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold font-medium tracking-wider text-sm">PRODUCT CATALOGUE</span>
            <h1 className="section-title mt-2">Complete Collection</h1>
            <p className="section-subtitle mt-4">
              Explore our premium range of main door handles and mortise handles.
              Filter by category, finish, material, or search by product code.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12 md:py-16">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-6">
                {/* Mobile Filter Toggle */}
                <button
                  className="lg:hidden btn-secondary w-full justify-between"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="gold" size="sm">{activeFiltersCount}</Badge>
                  )}
                </button>

                <AnimatePresence>
                  {showFilters || true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="lg:block hidden space-y-6"
                    >
                      {/* Search */}
                      <div>
                        <label htmlFor="search" className="label-field">Search Products</label>
                        <div className="relative mt-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral/50" />
                          <input
                            id="search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by code..."
                            className="input-field pl-10"
                          />
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="label-field">Category</label>
                        <div className="space-y-2 mt-1">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value="all"
                              checked={selectedCategory === 'all'}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="w-4 h-4 text-gold border-neutral/30 focus:ring-gold accent-gold"
                            />
                            <span className="text-sm text-neutral">All Products</span>
                          </label>
                          {categories.map((cat) => (
                            <label key={cat.slug} className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                value={cat.slug}
                                checked={selectedCategory === cat.slug}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-4 h-4 text-gold border-neutral/30 focus:ring-gold accent-gold"
                              />
                              <span className="text-sm text-neutral">{cat.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Finish Filter */}
                      <div>
                        <label className="label-field">Finish</label>
                        <Select
                          value={selectedFinish}
                          onChange={(e) => setSelectedFinish(e.target.value)}
                          options={[{ value: '', label: 'All Finishes' }, ...finishesList.map(f => ({ value: f, label: f }))]}
                          className="mt-1"
                        />
                      </div>

                      {/* Material Filter */}
                      <div>
                        <label className="label-field">Material</label>
                        <Select
                          value={selectedMaterial}
                          onChange={(e) => setSelectedMaterial(e.target.value)}
                          options={[{ value: '', label: 'All Materials' }, ...materialsList.map(m => ({ value: m, label: m }))]}
                          className="mt-1"
                        />
                      </div>

                      {/* Sort */}
                      <div>
                        <label className="label-field">Sort By</label>
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          options={[
                            { value: 'featured', label: 'Featured First' },
                            { value: 'code-asc', label: 'Product Code (A-Z)' },
                            { value: 'code-desc', label: 'Product Code (Z-A)' },
                            { value: 'name-asc', label: 'Name (A-Z)' },
                          ]}
                          className="mt-1"
                        />
                      </div>

                      {/* Clear Filters */}
                      {activeFiltersCount > 0 && (
                        <Button variant="outline" fullWidth onClick={clearFilters} className="mt-4">
                          <X className="w-4 h-4" />
                          Clear All Filters
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="gold" size="sm">{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gold/10 text-gold' : 'bg-secondary text-neutral hover:bg-neutral/50'}`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gold/10 text-gold' : 'bg-secondary text-neutral hover:bg-neutral/50'}`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Products */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}
                >
                  {filteredProducts.length === 0 ? (
                    <motion.div className="col-span-full text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Search className="w-16 h-16 mx-auto text-neutral/30 mb-4" />
                      <h3 className="font-display text-xl text-white mb-2">No products found</h3>
                      <p className="text-neutral mb-6">Try adjusting your filters or search query</p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </motion.div>
                  ) : (
                    filteredProducts.map((product, index) => (
                      <motion.article
                        key={product.productCode}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={viewMode === 'grid' ? 'product-card' : 'flex gap-6 p-4 bg-secondary rounded-xl border border-neutral/10 hover:border-gold/30 transition-all'}
                      >
                        <Link to={`/products/${product.productCode.toLowerCase()}`} className={viewMode === 'grid' ? 'block' : 'flex gap-6 w-full'}>
                          <div className={viewMode === 'grid' ? 'relative aspect-[4/3] overflow-hidden' : 'relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg'}>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                            {product.featured && (
                              <Badge className="absolute top-3 left-3" variant="featured" size="sm">
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <div className={viewMode === 'grid' ? 'p-5' : 'flex-1 p-4 flex flex-col justify-center'}>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="primary" size="sm">
                                {product.category === 'main-door' ? 'Main Door' : 'Mortise'}
                              </Badge>
                              {product.featured && <Badge variant="featured" size="sm">Featured</Badge>}
                            </div>
                            <h3 className="font-display text-lg md:text-xl font-medium text-white mb-1">
                              {product.productCode}
                            </h3>
                            <p className="text-neutral text-sm mb-3">{product.material}</p>
                            
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {product.finishes.slice(0, viewMode === 'grid' ? 3 : 4).map((finish) => (
                                <span key={finish} className="px-2 py-0.5 rounded text-xs bg-primary/50 text-neutral/70 border border-neutral/20">
                                  {finish}
                                </span>
                              ))}
                              {product.finishes.length > (viewMode === 'grid' ? 3 : 4) && (
                                <span className="px-2 py-0.5 rounded text-xs bg-gold/20 text-gold border border-gold/30">
                                  +{product.finishes.length - (viewMode === 'grid' ? 3 : 4)} more
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-neutral">
                                <span>{product.sizes.length} size{product.sizes.length !== 1 ? 's' : ''}</span>
                                <span>•</span>
                                <span>{product.finishes.length} finish{product.finishes.length !== 1 ? 'es' : ''}</span>
                              </div>
                              <span className="text-gold font-medium flex items-center gap-1">
                                View Details
                                <ChevronDown className="w-4 h-4" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Categories CTA */}
      <section className="py-16 bg-secondary">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                to={`/catalogue?category=${category.slug}`}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group block"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="font-display text-3xl font-medium text-white mb-2">{category.name}</h3>
                  <p className="text-neutral mb-4">{category.description}</p>
                  <span className="inline-flex items-center gap-2 text-gold font-medium self-start group-hover:gap-3 transition-all">
                    Browse Collection
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
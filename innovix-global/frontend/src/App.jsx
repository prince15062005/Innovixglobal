import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './layouts/Layout';
import AdminLayout from './admin/layouts/AdminLayout';
import Loading from './components/ui/Loading';
import NotFound from './pages/NotFound';

// Public pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Catalogue = lazy(() => import('./pages/Catalogue'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const HowToClean = lazy(() => import('./pages/HowToClean'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin pages
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminProducts = lazy(() => import('./admin/pages/Products'));
const AdminCategories = lazy(() => import('./admin/pages/Categories'));
const AdminEnquiries = lazy(() => import('./admin/pages/Enquiries'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));
const AdminProfile = lazy(() => import('./admin/pages/Profile'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="how-to-clean" element={<HowToClean />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
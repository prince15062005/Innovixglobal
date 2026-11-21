import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Layout() {
  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={`https://www.innovixglobal.in${window.location.pathname}`} />
      </Helmet>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
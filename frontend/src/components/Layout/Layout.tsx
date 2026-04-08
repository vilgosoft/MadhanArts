import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

export default function Layout() {
  const { pathname } = useLocation();
  // Hero pages handle their own padding
  const fullPages = ['/', '/gallery', '/privacy-policy', '/terms', '/shipping-policy', '/refund-policy'];
  const isFullPage = fullPages.includes(pathname);

  return (
    <>
      <Header />
      <main style={{ paddingTop: isFullPage ? 0 : '80px', minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}

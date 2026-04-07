import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  // Hero pages handle their own padding
  const isFullPage = pathname === '/' || pathname === '/gallery';

  return (
    <>
      <Header />
      <main style={{ paddingTop: isFullPage ? 0 : '80px', minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

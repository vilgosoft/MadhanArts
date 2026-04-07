import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px', minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

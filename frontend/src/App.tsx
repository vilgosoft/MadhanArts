import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import UserLogin from './components/Auth/UserLogin';
import AdminLogin from './components/Auth/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageGallery from './pages/admin/ManageGallery';
import ManagePricing from './pages/admin/ManagePricing';
import ManageOrders from './pages/admin/ManageOrders';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<HomePage />} />
        <Route path="/order/:categoryId" element={<OrderPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<Layout />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="pricing" element={<ManagePricing />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Route>
    </Routes>
  );
}

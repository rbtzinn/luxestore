import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import StoreLayout from './components/layout/StoreLayout';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';

import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBanners from './pages/admin/AdminBanners';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCustomers from './pages/admin/AdminCustomers';
import About from './pages/About';
import InfoPage from './pages/InfoPage';

const queryClient = new QueryClient();

const storeRoutes = [
  { path: '/', element: <Index /> },
  { path: '/about', element: <About /> },
  { path: '/products', element: <Products /> },
  { path: '/products/:slug', element: <ProductDetail /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/wishlist', element: <Wishlist /> },
  { path: '/categories', element: <Products /> },
] as const;

const infoRoutes = ['/contact', '/shipping', '/faq', '/size-guide', '/careers', '/press', '/sustainability', '/privacy', '/terms'] as const;

const adminRoutes = [
  { path: 'products', element: <AdminProducts /> },
  { path: 'orders', element: <AdminOrders /> },
  { path: 'categories', element: <AdminCategories /> },
  { path: 'coupons', element: <AdminCoupons /> },
  { path: 'banners', element: <AdminBanners /> },
  { path: 'reviews', element: <AdminReviews /> },
  { path: 'customers', element: <AdminCustomers /> },
] as const;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<StoreLayout />}>
              {storeRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              {infoRoutes.map((path) => (
                <Route key={path} path={path} element={<InfoPage />} />
              ))}
            </Route>

            <Route path="/auth" element={<Auth />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              {adminRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

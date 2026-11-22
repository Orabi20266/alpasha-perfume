import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import CartDrawer from '../shop/CartDrawer';
import QuickViewModal from '../shop/QuickViewModal';
import CheckoutModal from '../shop/CheckoutModal';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <FloatingActions />
      <CartDrawer />
      <QuickViewModal />
      <CheckoutModal />
    </div>
  );
}

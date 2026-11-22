import { useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { StoreProvider } from './store/StoreContext';
import { UiProvider } from './store/UiContext';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import Offers from './pages/Offers';
import Raffle from './pages/Raffle';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ToastHost from './components/ui/ToastHost';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <UiProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="offers" element={<Offers />} />
              <Route path="raffle" element={<Raffle />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="admin" element={<Admin />} />
          </Routes>
          <ToastHost />
        </UiProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useStore } from './StoreContext';

const UiContext = createContext(null);

const defaultFilters = (maxPrice) => ({
  category: 'all',
  query: '',
  maxPrice,
  discountOnly: false,
  wishlistOnly: false,
  sort: 'featured',
});

export function UiProvider({ children }) {
  const { maxProductPrice } = useStore();

  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState(null);
  const [checkout, setCheckout] = useState({ open: false, mode: 'order' });
  const [filters, setFilters] = useState(() => defaultFilters(maxProductPrice));

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const openQuickView = useCallback((id) => setQuickViewId(id), []);
  const closeQuickView = useCallback(() => setQuickViewId(null), []);

  const openCheckout = useCallback((mode = 'order') => {
    setCartOpen(false);
    setQuickViewId(null);
    setCheckout({ open: true, mode });
  }, []);
  const closeCheckout = useCallback(
    () => setCheckout((current) => ({ ...current, open: false })),
    [],
  );

  const setFilter = useCallback((key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters(maxProductPrice));
  }, [maxProductPrice]);

  // Keep the slider usable when the catalog changes in the admin panel.
  useEffect(() => {
    setFilters((current) =>
      current.maxPrice > maxProductPrice
        ? { ...current, maxPrice: maxProductPrice }
        : current,
    );
  }, [maxProductPrice]);

  // Lock page scroll while any overlay is open.
  const overlayOpen = cartOpen || quickViewId !== null || checkout.open;
  useEffect(() => {
    if (!overlayOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlayOpen]);

  const value = useMemo(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      quickViewId,
      openQuickView,
      closeQuickView,
      checkout,
      openCheckout,
      closeCheckout,
      filters,
      setFilter,
      resetFilters,
      maxProductPrice,
    }),
    [
      cartOpen,
      openCart,
      closeCart,
      quickViewId,
      openQuickView,
      closeQuickView,
      checkout,
      openCheckout,
      closeCheckout,
      filters,
      setFilter,
      resetFilters,
      maxProductPrice,
    ],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used inside UiProvider');
  return ctx;
}

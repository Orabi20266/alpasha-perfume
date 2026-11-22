import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  seedOffers,
  seedProducts,
  seedSettings,
  categoryLabel,
} from '../data/seed';
import { makeOrderId, makeRaffleCode, readStorage, writeStorage } from '../lib/format';
import { STORAGE_KEYS } from '../lib/storage';
import {
  discountForSubtotal,
  normalizeTiers,
} from '../lib/discount';

const StoreContext = createContext(null);

const mergeSettings = (saved) => {
  const source = saved && typeof saved === 'object' ? saved : {};
  const legacy = Number(source.dataVersion || 0) < seedSettings.dataVersion;
  const branding = legacy
    ? {
        storeName: seedSettings.storeName,
        storeNameAr: seedSettings.storeNameAr,
        tagline: seedSettings.tagline,
        announcement: seedSettings.announcement,
        payments: seedSettings.payments,
      }
    : {};

  return {
    ...seedSettings,
    ...source,
    ...branding,
    dataVersion: seedSettings.dataVersion,
    social: {
      ...seedSettings.social,
      ...(source.social || {}),
    },
    raffle: {
      ...seedSettings.raffle,
      ...(source.raffle || {}),
      winner: source.raffle?.winner ?? null,
    },
  };
};

const mergeOffers = (saved) => {
  const source = saved && typeof saved === 'object' ? saved : {};
  const legacy = Number(source.dataVersion || 0) < seedOffers.dataVersion;
  const base = legacy
    ? { ...source, ...seedOffers }
    : { ...seedOffers, ...source };
  delete base.couponCode;
  delete base.couponNote;

  return {
    ...base,
    dataVersion: seedOffers.dataVersion,
    tiers: normalizeTiers(
      legacy || !Array.isArray(source.tiers) || !source.tiers.length
        ? seedOffers.tiers
        : source.tiers,
    ),
  };
};

const loadProducts = () => {
  const saved = readStorage(STORAGE_KEYS.products, null);
  if (!Array.isArray(saved) || !saved.length) {
    writeStorage(STORAGE_KEYS.products, seedProducts);
    return seedProducts;
  }
  return saved;
};


export function StoreProvider({ children }) {
  const [products, setProducts] = useState(loadProducts);
  const [settings, setSettings] = useState(() =>
    mergeSettings(readStorage(STORAGE_KEYS.settings, null)),
  );
  const [offers, setOffers] = useState(() =>
    mergeOffers(readStorage(STORAGE_KEYS.offers, null)),
  );
  const [orders, setOrders] = useState(() =>
    readStorage(STORAGE_KEYS.orders, []),
  );
  const [cart, setCart] = useState(() => readStorage(STORAGE_KEYS.cart, []));
  const [wishlist, setWishlist] = useState(() =>
    readStorage(STORAGE_KEYS.wishlist, [1, 3]),
  );
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.session) === '1';
    } catch {
      return false;
    }
  });
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  useEffect(() => {
    writeStorage(STORAGE_KEYS.products, products);
  }, [products]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.offers, offers);
  }, [offers]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.orders, orders);
  }, [orders]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, cart);
  }, [cart]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.wishlist, wishlist);
  }, [wishlist]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const entry = {
        id,
        message,
        type: options.type || 'success',
        action: options.action || null,
      };
      setToasts((list) => [...list.slice(-2), entry]);
      const timer = setTimeout(() => {
        setToasts((list) => list.filter((t) => t.id !== id));
        timers.current.delete(id);
      }, options.duration || 4200);
      timers.current.set(id, timer);
    },
    [],
  );

  const maxProductPrice = useMemo(() => {
    const top = products.reduce(
      (max, p) => Math.max(max, Number(p.price) || 0),
      0,
    );
    return Math.max(500, Math.ceil(top / 100) * 100);
  }, [products]);

  const cartItems = useMemo(
    () =>
      cart
        .map((line) => {
          const product = products.find((p) => p.id === line.id);
          return product ? { ...line, product } : null;
        })
        .filter(Boolean),
    [cart, products],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, line) => sum + Number(line.product.price) * line.qty,
        0,
      ),
    [cartItems],
  );

  const discountTiers = useMemo(
    () => normalizeTiers(offers.tiers),
    [offers.tiers],
  );

  const { tier: appliedTier, amount: discount } = useMemo(
    () => discountForSubtotal(subtotal, discountTiers),
    [subtotal, discountTiers],
  );

  const taxableSubtotal = Math.max(0, subtotal - discount);

  const tax = useMemo(
    () => Math.round((taxableSubtotal * Number(settings.taxRate || 0)) / 100),
    [taxableSubtotal, settings.taxRate],
  );

  const shipping = useMemo(() => {
    if (!cartItems.length) return 0;
    return subtotal >= Number(settings.freeShippingThreshold || 0)
      ? 0
      : Number(settings.shippingFee || 0);
  }, [cartItems.length, subtotal, settings.freeShippingThreshold, settings.shippingFee]);

  const total = taxableSubtotal + tax + shipping;
  const cartCount = cartItems.reduce((sum, line) => sum + line.qty, 0);

  const addToCart = useCallback(
    (productId, qty = 1) => {
      const product = products.find((item) => item.id === productId);
      const max = product ? Math.max(0, Number(product.stock) || 0) : 0;
      if (max <= 0) return false;
      setCart((current) => {
        const existing = current.find((line) => line.id === productId);
        if (existing) {
          return current.map((line) =>
            line.id === productId
              ? { ...line, qty: Math.min(max, line.qty + qty) }
              : line,
          );
        }
        return [...current, { id: productId, qty: Math.min(max, qty) }];
      });
      return true;
    },
    [products],
  );

  const setQty = useCallback(
    (productId, qty) => {
      const product = products.find((item) => item.id === productId);
      const max = product ? Math.max(0, Number(product.stock) || 0) : 0;
      setCart((current) =>
        qty <= 0 || max <= 0
          ? current.filter((line) => line.id !== productId)
          : current.map((line) =>
              line.id === productId
                ? { ...line, qty: Math.min(max, qty) }
                : line,
            ),
      );
    },
    [products],
  );

  const changeQty = useCallback(
    (productId, delta) => {
      const product = products.find((item) => item.id === productId);
      const max = product ? Math.max(0, Number(product.stock) || 0) : 0;
      setCart((current) =>
        current
          .map((line) =>
            line.id === productId
              ? { ...line, qty: Math.min(max, line.qty + delta) }
              : line,
          )
          .filter((line) => line.qty > 0),
      );
    },
    [products],
  );

  const removeFromCart = useCallback((productId) => {
    setCart((current) => current.filter((line) => line.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const placeOrder = useCallback(
    (payload) => {
      let raffleCode = makeRaffleCode();
      let guard = 0;
      while (orders.some((order) => order.raffleCode === raffleCode) && guard < 25) {
        raffleCode = makeRaffleCode();
        guard += 1;
      }
      const order = {
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        type: payload.type || 'order',
        status: 'new',
        payment: 'cod',
        customer: payload.customer,
        items: cartItems.map((line) => ({
          id: line.product.id,
          name: line.product.name,
          sku: line.product.sku,
          price: line.product.price,
          qty: line.qty,
        })),
        subtotal,
        discount,
        discountRate: appliedTier?.percent || 0,
        discountThreshold: appliedTier?.threshold || 0,
        tax,
        shipping,
        total,
        raffleCode,
        raffleEntered: false,
        raffleEnteredAt: null,
      };
      setOrders((current) => [order, ...current]);
      if (order.type !== 'quote') setCart([]);
      return order;
    },
    [cartItems, subtotal, discount, appliedTier, tax, shipping, total, orders],
  );

  const updateOrderStatus = useCallback((id, status) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  }, []);

  const deleteOrder = useCallback((id) => {
    setOrders((current) => current.filter((order) => order.id !== id));
  }, []);

  const enterRaffle = useCallback(
    (rawCode) => {
      const code = String(rawCode || '').trim().toUpperCase();
      if (!code) return { ok: false, reason: 'empty' };
      const order = orders.find(
        (item) => String(item.raffleCode || '').toUpperCase() === code,
      );
      if (!order) return { ok: false, reason: 'not-found' };
      if (order.type === 'quote') return { ok: false, reason: 'quote' };
      if (order.status === 'cancelled') return { ok: false, reason: 'cancelled' };
      if (order.raffleEntered) {
        return { ok: true, already: true, order };
      }
      const enteredAt = new Date().toISOString();
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id
            ? { ...item, raffleEntered: true, raffleEnteredAt: enteredAt }
            : item,
        ),
      );
      return {
        ok: true,
        already: false,
        order: { ...order, raffleEntered: true, raffleEnteredAt: enteredAt },
      };
    },
    [orders],
  );

  const updateRaffle = useCallback((patch) => {
    setSettings((current) => ({
      ...current,
      raffle: {
        ...current.raffle,
        ...patch,
      },
    }));
  }, []);

  const drawRaffle = useCallback(() => {
    const eligible = orders.filter(
      (order) =>
        order.type === 'order' &&
        order.raffleEntered &&
        order.status !== 'cancelled',
    );
    if (!eligible.length) return null;
    const picked = eligible[Math.floor(Math.random() * eligible.length)];
    const winner = {
      orderId: picked.id,
      code: picked.raffleCode,
      name: picked.customer?.name || '',
      phone: picked.customer?.phone || '',
      city: picked.customer?.city || '',
      total: picked.total,
      entries: eligible.length,
      drawnAt: new Date().toISOString(),
    };
    setSettings((current) => ({
      ...current,
      raffle: { ...current.raffle, winner },
    }));
    return winner;
  }, [orders]);

  const resetRaffleWinner = useCallback(() => {
    setSettings((current) => ({
      ...current,
      raffle: { ...current.raffle, winner: null },
    }));
  }, []);

  const raffleEntries = useMemo(
    () =>
      orders
        .filter((order) => order.type === 'order' && order.raffleEntered)
        .sort(
          (a, b) =>
            new Date(b.raffleEnteredAt || 0) - new Date(a.raffleEnteredAt || 0),
        ),
    [orders],
  );

  const saveProduct = useCallback((product) => {
    setProducts((current) => {
      const exists = current.some((p) => p.id === product.id);
      if (exists) {
        return current.map((p) =>
          p.id === product.id ? { ...p, ...product } : p,
        );
      }
      const nextId = current.reduce((max, p) => Math.max(max, p.id), 0) + 1;
      return [{ ...product, id: nextId }, ...current];
    });
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((current) => current.filter((p) => p.id !== id));
    setCart((current) => current.filter((line) => line.id !== id));
    setWishlist((current) => current.filter((item) => item !== id));
    setOffers((current) => ({
      ...current,
      productIds: (current.productIds || []).filter((item) => item !== id),
      spotlightProductId:
        current.spotlightProductId === id
          ? null
          : current.spotlightProductId,
    }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings((current) => ({
      ...current,
      ...patch,
      social: patch.social
        ? { ...current.social, ...patch.social }
        : current.social,
    }));
  }, []);

  const updateOffers = useCallback((patch) => {
    setOffers((current) => ({ ...current, ...patch }));
  }, []);

  const login = useCallback(
    (password) => {
      const ok = String(password || '').trim() === String(settings.adminPassword);
      if (ok) {
        setIsAdmin(true);
        try {
          sessionStorage.setItem(STORAGE_KEYS.session, '1');
        } catch {
          /* ignore */
        }
      }
      return ok;
    },
    [settings.adminPassword],
  );

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.session);
    } catch {
      /* ignore */
    }
  }, []);

  const resetDemoData = useCallback(() => {
    setProducts(seedProducts);
    setSettings(seedSettings);
    setOffers(seedOffers);
    setOrders([]);
    setCart([]);
    setWishlist([1, 3]);
    // اكتب البيانات الافتراضية مباشرة حتى لا تعتمد على إعادة تصيير المكوّنات.
    writeStorage(STORAGE_KEYS.products, seedProducts);
    writeStorage(STORAGE_KEYS.settings, seedSettings);
    writeStorage(STORAGE_KEYS.offers, seedOffers);
    writeStorage(STORAGE_KEYS.orders, []);
    writeStorage(STORAGE_KEYS.cart, []);
    writeStorage(STORAGE_KEYS.wishlist, [1, 3]);
  }, []);

  const productById = useCallback(
    (id) => products.find((p) => p.id === id),
    [products],
  );

  const value = {
    products,
    settings,
    offers,
    orders,
    cart,
    cartItems,
    cartCount,
    wishlist,
    subtotal,
    discount,
    discountRate: appliedTier?.percent || 0,
    appliedTier,
    discountTiers,
    tax,
    shipping,
    total,
    maxProductPrice,
    isAdmin,
    toasts,
    toast,
    dismissToast,
    addToCart,
    setQty,
    changeQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    placeOrder,
    updateOrderStatus,
    deleteOrder,
    enterRaffle,
    updateRaffle,
    drawRaffle,
    resetRaffleWinner,
    raffleEntries,
    saveProduct,
    deleteProduct,
    updateSettings,
    updateOffers,
    login,
    logout,
    resetDemoData,
    productById,
    categoryLabel,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

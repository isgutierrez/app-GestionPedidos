import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const CartContext = createContext(null);

const storageKey = 'mrfood_cart';

const serializeCart = (items) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // ignore persistence errors
  }
};

const loadCart = () => {
  try {
    const data = window.localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const createCartId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const signCustomization = (productId, customization) =>
  JSON.stringify({ productId, customization });

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() =>
    typeof window === 'undefined' ? [] : loadCart()
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      serializeCart(items);
    }
  }, [items]);

  const addItem = useCallback(({ product, customization }) => {
    if (!product) return;
    setItems((prev) => {
      const signature = signCustomization(product.id, customization);
      const index = prev.findIndex((item) => item.signature === signature);

      if (index >= 0) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + 1
        };
        return updated;
      }

      return [
        ...prev,
        {
          cartId: createCartId(),
          signature,
          productId: product.id,
          title: product.title,
          description: product.description,
          image: product.image,
          currency: product.currency ?? '$',
          unitPrice: Number(product.price) || 0,
          category: product.category,
          discount: product.discount ?? null,
          basePrice: product.basePrice ?? product.price,
          customization,
          quantity: 1
        }
      ];
    });
  }, []);

  const removeItem = useCallback((cartId) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += item.unitPrice * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 }
    );
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems: totals.totalItems,
      totalPrice: totals.totalPrice
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

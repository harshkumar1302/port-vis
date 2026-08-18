import { createContext, useContext, useState, useEffect } from 'react';
import { collectImageUrls, preloadImagesBackground } from '../lib/preloadImages';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('visheshkala_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.filter((item) => !String(item.id).startsWith('dummy-'));
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('visheshkala_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('visheshkala_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('visheshkala_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    preloadImagesBackground(collectImageUrls(cart, 'image_url', 'thumb'));
  }, [cart]);

  useEffect(() => {
    preloadImagesBackground(collectImageUrls(wishlist, 'image_url', 'card'));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const moveToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        moveToCart,
        isInWishlist,
        clearCart,
        cartCount: cart.reduce((total, item) => total + item.quantity, 0),
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

const CartContext = createContext();
const CART_STORAGE_KEY = 'maison_cart';
const COUPON_STORAGE_KEY = 'maison_coupon';

// Default mock coupons for client demo
export const DEMO_COUPONS = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 999,
    description: '10% off on your first order above ₹999',
    isActive: true,
  },
  {
    code: 'FESTIVE15',
    type: 'percentage',
    value: 15,
    minOrder: 2499,
    description: '15% festive discount above ₹2,499',
    isActive: true,
  },
  {
    code: 'LUXE500',
    type: 'flat',
    value: 500,
    minOrder: 3999,
    description: 'Flat ₹500 off on luxury orders above ₹3,999',
    isActive: true,
  },
];

export const CartProvider = ({ children }) => {
  const { showToast } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem(COUPON_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const addToCart = (product, size = null, color = null, quantity = 1) => {
    if (!product) return;
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size');
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard');
    const itemKey = `${product.id}-${selectedSize}-${selectedColor}`;

    const existingItem = cartItems.find((item) => item.cartItemId === itemKey);
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === itemKey ? { ...item, quantity: newQty } : item
        )
      );
      showToast(`Updated "${product.name}" quantity to ${newQty}`, 'success');
    } else {
      const newItem = {
        cartItemId: itemKey,
        productId: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice || product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        sku: product.sku,
        category: product.category,
      };
      setCartItems((prev) => [...prev, newItem]);
      showToast(`Added "${product.name}" to cart`, 'success');
    }
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (item) {
      showToast(`Removed "${item.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.salePrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  // Apply Coupon Discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  // Free shipping threshold ₹1999
  const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
  // Estimated GST (5% for boutique handloom/garments)
  const taxAmount = Math.round((subtotal - discountAmount) * 0.05);
  const total = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

  const applyCoupon = (codeStr) => {
    const code = codeStr.trim().toUpperCase();
    const found = DEMO_COUPONS.find((c) => c.code === code && c.isActive);

    if (!found) {
      showToast('Invalid promo code. Try WELCOME10 or FESTIVE15', 'error');
      return { success: false, message: 'Invalid promo code' };
    }

    if (subtotal < found.minOrder) {
      const msg = `Minimum order of ₹${found.minOrder} required for ${found.code}`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return { success: true };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Hooks del Carrito de Compras
 *
 * Proporciona hooks personalizados para interactuar con el carrito,
 * incluyendo manejo del drawer y estadísticas.
 */

import { useContext, useState } from "react";
import { CartContext } from "../contexts/cart-context-types";

// Hook para usar el contexto del carrito
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

// Hook para manejar el estado del drawer del carrito
export function useCartDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
}

// Hook para estadísticas del carrito
export function useCartStats() {
  const { cart } = useCart();

  return {
    itemCount: cart.summary.itemCount,
    uniqueItems: cart.summary.uniqueItems,
    subtotal: cart.summary.subtotal,
    total: cart.summary.total,
    savings: cart.summary.savings,
  };
}

// Hook para manejar items específicos del carrito
export function useCartItem(productId: string) {
  const {
    getItemQuantity,
    isInCart,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const quantity = getItemQuantity(productId);
  const inCart = isInCart(productId);

  return {
    quantity,
    inCart,
    addToCart,
    updateQuantity: (newQuantity: number) =>
      updateQuantity(productId, newQuantity),
    removeFromCart: () => removeFromCart(productId),
  };
}

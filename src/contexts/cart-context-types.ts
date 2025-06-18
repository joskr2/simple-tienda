/**
 * Contexto y tipos del Carrito de Compras
 *
 * Este archivo contiene solo el contexto y las interfaces,
 * separado de los componentes para mantener compatibilidad con React Fast Refresh.
 */

import { createContext } from "react";
import type { CartState, AddToCartPayload } from "../types/cart";

// Interface del contexto
export interface CartContextValue {
  // Estado
  cart: CartState;

  // Acciones
  addToCart: (payload: AddToCartPayload) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Utilidades
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Crear contexto
export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

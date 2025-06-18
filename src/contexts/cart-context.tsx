/**
 * Proveedor del Carrito de Compras
 *
 * Proporciona funcionalidad completa de carrito con persistencia,
 * cálculos automáticos y manejo de estado optimizado.
 */

import { useReducer, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
  CartState,
  CartItem,
  AddToCartPayload,
  Coupon,
} from "../types/cart";
import {
  CART_CONSTANTS,
  calculateCartSummary,
  generateCartItemId,
} from "../types/cart";
import { CartContext, type CartContextValue } from "./cart-context-types";

// Tipos de acciones del carrito
type CartAction =
  | { type: "ADD_ITEM"; payload: AddToCartPayload }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: { coupon: Coupon } }
  | { type: "REMOVE_COUPON"; payload: { couponCode: string } }
  | { type: "RESTORE_CART"; payload: { cart: CartState } };

// Estado inicial del carrito
const initialCartState: CartState = {
  items: [],
  summary: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    couponDiscount: 0,
    total: 0,
    savings: 0,
    itemCount: 0,
    uniqueItems: 0,
  },
  appliedCoupons: [],
  lastUpdated: new Date().toISOString(),
  sessionId: crypto.randomUUID(),
};

// Reducer del carrito
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, selectedVariant, notes } = action.payload;

      // Generar ID único para el item
      const itemId = generateCartItemId(product.id, selectedVariant?.id);

      // Buscar si el item ya existe
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Actualizar cantidad del item existente
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(
              item.quantity + quantity,
              CART_CONSTANTS.MAX_QUANTITY_PER_ITEM
            );
            const newTotalPrice = item.unitPrice * newQuantity;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: newTotalPrice,
              subtotal: newTotalPrice, // Alias para totalPrice
            };
          }
          return item;
        });
      } else {
        // Agregar nuevo item
        const unitPrice = selectedVariant?.additionalPrice
          ? product.price + selectedVariant.additionalPrice
          : product.price;

        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          product,
          quantity,
          selectedVariant,
          variant: selectedVariant,
          unitPrice,
          priceAtAddTime: unitPrice,
          totalPrice: unitPrice * quantity,
          subtotal: unitPrice * quantity,
          addedAt: new Date().toISOString(),
          notes,
        };

        newItems = [...state.items, newItem];
      }

      // Limitar número máximo de items
      if (newItems.length > CART_CONSTANTS.MAX_ITEMS) {
        newItems = newItems.slice(0, CART_CONSTANTS.MAX_ITEMS);
      }

      const newSummary = calculateCartSummary(newItems);

      return {
        ...state,
        items: newItems,
        summary: newSummary,
        lastUpdated: new Date().toISOString(),
      };
    }

    case "REMOVE_ITEM": {
      const { itemId } = action.payload;
      const newItems = state.items.filter((item) => item.id !== itemId);
      const newSummary = calculateCartSummary(newItems);

      return {
        ...state,
        items: newItems,
        summary: newSummary,
        lastUpdated: new Date().toISOString(),
      };
    }

    case "UPDATE_QUANTITY": {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        const newItems = state.items.filter((item) => item.id !== itemId);
        const newSummary = calculateCartSummary(newItems);

        return {
          ...state,
          items: newItems,
          summary: newSummary,
          lastUpdated: new Date().toISOString(),
        };
      }

      const newItems = state.items.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.min(
            quantity,
            CART_CONSTANTS.MAX_QUANTITY_PER_ITEM
          );
          const newTotalPrice = item.unitPrice * newQuantity;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newTotalPrice,
            subtotal: newTotalPrice, // Alias para totalPrice
          };
        }
        return item;
      });

      const newSummary = calculateCartSummary(newItems);

      return {
        ...state,
        items: newItems,
        summary: newSummary,
        lastUpdated: new Date().toISOString(),
      };
    }

    case "CLEAR_CART": {
      return {
        ...initialCartState,
        sessionId: state.sessionId,
      };
    }

    case "APPLY_COUPON": {
      const { coupon } = action.payload;
      const newSummary = calculateCartSummary(state.items);

      // Calcular descuento del cupón
      let couponDiscount = 0;
      if (coupon.type === "percentage") {
        couponDiscount = (newSummary.subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) {
          couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
        }
      } else if (coupon.type === "fixed") {
        couponDiscount = coupon.value;
      }

      return {
        ...state,
        summary: {
          ...newSummary,
          couponDiscount,
          total:
            newSummary.subtotal +
            newSummary.shipping +
            newSummary.tax -
            couponDiscount,
        },
        appliedCoupons: [...(state.appliedCoupons || []), coupon],
        lastUpdated: new Date().toISOString(),
      };
    }

    case "REMOVE_COUPON": {
      const { couponCode } = action.payload;
      const newAppliedCoupons = (state.appliedCoupons || []).filter(
        (c) => c.code !== couponCode
      );
      const newSummary = calculateCartSummary(state.items);

      return {
        ...state,
        summary: newSummary,
        appliedCoupons: newAppliedCoupons,
        lastUpdated: new Date().toISOString(),
      };
    }

    case "RESTORE_CART": {
      const { cart } = action.payload;
      return {
        ...initialCartState,
        ...cart,
        appliedCoupons: cart.appliedCoupons || [],
        lastUpdated: new Date().toISOString(),
      };
    }

    default:
      return state;
  }
}

// Clave para localStorage
const CART_STORAGE_KEY = "demo-tienda-cart";

// Proveedor del contexto
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const [error, setError] = useState<string | null>(null);

  // Cargar carrito del localStorage al inicializar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Asegurar que el carrito tenga todas las propiedades necesarias
        const validatedCart = {
          ...initialCartState,
          ...parsedCart,
          appliedCoupons: parsedCart.appliedCoupons || [],
        };
        dispatch({ type: "RESTORE_CART", payload: { cart: validatedCart } });
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // Limpiar localStorage corrupto
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Funciones del contexto
  const addToCart = (payload: AddToCartPayload) => {
    dispatch({ type: "ADD_ITEM", payload });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return cart.items.some((item) => item.productId === productId);
  };

  const getTotalItems = (): number => {
    return cart.summary.itemCount;
  };

  const getTotalPrice = (): number => {
    return cart.summary.total;
  };

  const applyCoupon = async (coupon: Coupon) => {
    try {
      setError(null);
      // Validar cupón
      if (!coupon.isActive || !coupon.active) {
        throw new Error("El cupón no está activo");
      }

      if (
        coupon.minOrderAmount &&
        cart.summary.subtotal < coupon.minOrderAmount
      ) {
        throw new Error(`Compra mínima requerida: $${coupon.minOrderAmount}`);
      }

      dispatch({ type: "APPLY_COUPON", payload: { coupon } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aplicar cupón");
    }
  };

  const removeCoupon = (couponCode: string) => {
    dispatch({ type: "REMOVE_COUPON", payload: { couponCode } });
  };

  const clearError = () => {
    setError(null);
  };

  const value: CartContextValue = {
    cart,
    state: cart, // Alias para cart
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    getTotalItems,
    getTotalPrice,
    applyCoupon,
    removeCoupon,
    error,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;

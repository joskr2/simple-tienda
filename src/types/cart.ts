/**
 * Tipos de datos para el carrito de compras
 *
 * Este archivo define todas las interfaces y tipos relacionados con el carrito,
 * items, checkout y procesamiento de órdenes.
 */

import type { Product } from "./product";

// Item individual en el carrito
export interface CartItem {
  id: string; // ID único del item en el carrito
  productId: string; // ID del producto
  product: Product; // Datos completos del producto
  quantity: number; // Cantidad seleccionada
  selectedVariant?: {
    // Variante seleccionada (color, talla, etc.)
    id: string;
    name: string;
    value: string;
    additionalPrice?: number; // Precio adicional por la variante
  };
  unitPrice: number; // Precio unitario al momento de agregar
  totalPrice: number; // Precio total (unitPrice * quantity)
  addedAt: string; // Fecha de agregado al carrito (ISO string)
  notes?: string; // Notas especiales del cliente
}

// Cupón de descuento
export interface Coupon {
  id: string; // ID único del cupón
  code: string; // Código del cupón
  type: "percentage" | "fixed" | "free-shipping"; // Tipo de descuento
  value: number; // Valor del descuento (% o cantidad fija)
  description: string; // Descripción del cupón
  minPurchase?: number; // Compra mínima requerida
  maxDiscount?: number; // Descuento máximo (para porcentajes)
  validFrom: string; // Fecha de inicio (ISO string)
  validUntil: string; // Fecha de expiración (ISO string)
  usageLimit?: number; // Límite de usos totales
  usageCount: number; // Número de veces usado
  userLimit?: number; // Límite de usos por usuario
  applicable: {
    // A qué se aplica el cupón
    categories?: string[]; // Categorías específicas
    products?: string[]; // Productos específicos
    minQuantity?: number; // Cantidad mínima de items
  };
  active: boolean; // Si el cupón está activo
}

// Método de envío
export interface ShippingMethod {
  id: string; // ID único del método
  name: string; // Nombre del método
  description: string; // Descripción detallada
  cost: number; // Costo del envío
  estimatedDays: number; // Días estimados de entrega
  carrier: string; // Empresa transportadora
  tracking: boolean; // Si incluye seguimiento
  insurance: boolean; // Si incluye seguro
  freeThreshold?: number; // Monto para envío gratis
}

// Información de envío
export interface ShippingInfo {
  method: ShippingMethod; // Método seleccionado
  address: {
    // Dirección de envío
    fullName: string;
    email: string;
    phone: string;
    address1: string; // Dirección principal
    address2?: string; // Apartamento, oficina, etc.
    city: string;
    state: string;
    zipCode: string;
    country: string;
    instructions?: string; // Instrucciones especiales
  };
  cost: number; // Costo calculado
  estimatedDelivery: string; // Fecha estimada de entrega (ISO string)
}

// Resumen de costos del carrito
export interface CartSummary {
  subtotal: number; // Subtotal (suma de todos los items)
  shipping: number; // Costo de envío
  tax: number; // Impuestos
  discount: number; // Descuento aplicado
  couponDiscount: number; // Descuento por cupón
  total: number; // Total final
  savings: number; // Total ahorrado (descuentos + ofertas)
  itemCount: number; // Número total de items
  uniqueItems: number; // Número de productos únicos
}

// Estado del carrito
export interface CartState {
  items: CartItem[]; // Items en el carrito
  summary: CartSummary; // Resumen de costos
  appliedCoupon?: Coupon; // Cupón aplicado
  shippingInfo?: ShippingInfo; // Información de envío
  lastUpdated: string; // Última actualización (ISO string)
  sessionId: string; // ID de sesión del carrito
  userId?: string; // ID del usuario (si está logueado)
  expiresAt?: string; // Fecha de expiración (ISO string)
}

// Acciones del carrito
export enum CartActionType {
  ADD_ITEM = "ADD_ITEM",
  REMOVE_ITEM = "REMOVE_ITEM",
  UPDATE_QUANTITY = "UPDATE_QUANTITY",
  CLEAR_CART = "CLEAR_CART",
  APPLY_COUPON = "APPLY_COUPON",
  REMOVE_COUPON = "REMOVE_COUPON",
  SET_SHIPPING = "SET_SHIPPING",
  RESTORE_CART = "RESTORE_CART",
  MERGE_CART = "MERGE_CART",
}

// Payloads para las acciones del carrito
export interface AddToCartPayload {
  product: Product;
  quantity: number;
  selectedVariant?: CartItem["selectedVariant"];
  notes?: string;
}

export interface UpdateQuantityPayload {
  itemId: string;
  quantity: number;
}

export interface ApplyCouponPayload {
  coupon: Coupon;
}

// Acciones del carrito con sus payloads
export type CartAction =
  | { type: CartActionType.ADD_ITEM; payload: AddToCartPayload }
  | { type: CartActionType.REMOVE_ITEM; payload: { itemId: string } }
  | { type: CartActionType.UPDATE_QUANTITY; payload: UpdateQuantityPayload }
  | { type: CartActionType.CLEAR_CART }
  | { type: CartActionType.APPLY_COUPON; payload: ApplyCouponPayload }
  | { type: CartActionType.REMOVE_COUPON }
  | {
      type: CartActionType.SET_SHIPPING;
      payload: { shippingInfo: ShippingInfo };
    }
  | { type: CartActionType.RESTORE_CART; payload: { cart: CartState } }
  | { type: CartActionType.MERGE_CART; payload: { guestCart: CartState } };

// Datos para el proceso de checkout
export interface CheckoutData {
  items: CartItem[];
  summary: CartSummary;
  shipping: ShippingInfo;
  coupon?: Coupon;
  customer: {
    email: string;
    phone: string;
    name: string;
  };
  billing?: {
    sameAsShipping: boolean;
    address?: ShippingInfo["address"];
  };
  payment: {
    method: "card" | "pse" | "cash" | "transfer";
    details?: Record<string, unknown>;
  };
  notes?: string;
}

// Estado del checkout
export interface CheckoutState {
  step: "cart" | "shipping" | "payment" | "review" | "complete";
  data: Partial<CheckoutData>;
  errors: Record<string, string>;
  isProcessing: boolean;
}

// Configuración del carrito
export interface CartConfig {
  maxItems: number; // Máximo de items en el carrito
  maxQuantityPerItem: number; // Máxima cantidad por item
  sessionTimeout: number; // Timeout de sesión en minutos
  saveToLocalStorage: boolean; // Si guardar en localStorage
  autoSave: boolean; // Si auto-guardar cambios
  enableCoupons: boolean; // Si habilitar cupones
  enableWishlist: boolean; // Si habilitar lista de deseos
  currency: string; // Moneda por defecto
  taxRate: number; // Tasa de impuesto por defecto
  shippingCalculation: "flat" | "weight" | "zone"; // Método de cálculo de envío
}

// Constantes del carrito
export const CART_CONSTANTS = {
  MAX_ITEMS: 50,
  MAX_QUANTITY_PER_ITEM: 99,
  TAX_RATE: 0.19, // 19% IVA en Colombia
  FREE_SHIPPING_THRESHOLD: 150000, // Envío gratis desde $150,000 COP
  SESSION_TIMEOUT: 60 * 24, // 24 horas en minutos
} as const;

// Funciones auxiliares para el carrito
export const generateCartItemId = (
  productId: string,
  variantId?: string
): string => {
  return variantId ? `${productId}-${variantId}` : productId;
};

export const calculateItemSubtotal = (item: CartItem): number => {
  const basePrice = item.selectedVariant?.additionalPrice
    ? item.unitPrice + item.selectedVariant.additionalPrice
    : item.unitPrice;
  return basePrice * item.quantity;
};

export const calculateCartSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * CART_CONSTANTS.TAX_RATE;
  const shipping =
    subtotal >= CART_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : 15000; // $15,000 envío
  const discount = 0; // Se calculará con cupones
  const couponDiscount = 0; // Se calculará con cupones aplicados
  const total = subtotal + tax + shipping - discount - couponDiscount;
  const savings = discount + couponDiscount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = items.length;

  return {
    subtotal,
    shipping,
    tax,
    discount,
    couponDiscount,
    total,
    savings,
    itemCount,
    uniqueItems,
  };
};

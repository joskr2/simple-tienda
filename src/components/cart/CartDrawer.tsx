/**
 * Componente CartDrawer - Panel deslizante del carrito de compras
 *
 * CONCEPTOS CLAVE:
 * 1. Drawer Pattern - Panel lateral deslizante
 * 2. State Management - Integración completa con contexto del carrito
 * 3. Interactive Elements - Controles para modificar cantidades
 * 4. Real-time Updates - Actualizaciones en tiempo real
 * 5. Checkout Flow - Flujo hacia el proceso de compra
 * 6. Responsive Design - Adaptable a diferentes pantallas
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  CreditCard,
  ArrowRight,
  Gift,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

import { LoadingButton } from "../ui/loading";

import { useCart } from "../../hooks/use-cart";
import { useUser } from "../../hooks/use-user";

import type { CartItem, Coupon } from "../../types/cart";
import { formatPrice, truncateText } from "../../lib/utils";
import { cn } from "../../lib/utils";

/**
 * Props del CartDrawer
 */
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
  className?: string;
}

/**
 * Cupones de ejemplo (en producción vendrían de la API)
 */
const availableCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "10% de descuento en tu primera compra",
    minPurchase: 50,
    minOrderAmount: 50,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 0,
    applicable: {},
    active: true,
    isActive: true,
  },
  {
    id: "2",
    code: "SHIP5",
    type: "fixed",
    value: 5,
    description: "$5 de descuento en envío",
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 0,
    applicable: {},
    active: true,
    isActive: true,
  },
  {
    id: "3",
    code: "SAVE20",
    type: "percentage",
    value: 20,
    description: "20% de descuento en compras mayores a $100",
    minPurchase: 100,
    minOrderAmount: 100,
    maxDiscount: 50,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: 0,
    applicable: {},
    active: true,
    isActive: true,
  },
];

/**
 * Componente para un item individual del carrito
 */
interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemComponentProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Manejo seguro de imágenes que pueden ser string o objeto
  const getImageData = (
    images: Array<
      | string
      | { url: string; thumbnail?: string; alt?: string; isPrimary?: boolean }
    >
  ) => {
    const primaryImage = images.find(
      (img) => typeof img === "object" && img.isPrimary
    );
    const firstImage = images[0];

    if (typeof primaryImage === "object") {
      return {
        src: primaryImage.thumbnail || primaryImage.url,
        alt: primaryImage.alt || item.product.title || item.product.name,
      };
    }

    if (typeof firstImage === "object") {
      return {
        src: firstImage.thumbnail || firstImage.url,
        alt: firstImage.alt || item.product.title || item.product.name,
      };
    }

    return {
      src: typeof firstImage === "string" ? firstImage : item.product.thumbnail,
      alt: item.product.title || item.product.name,
    };
  };

  const imageData = getImageData(item.product.images);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;

    setIsUpdating(true);
    // Simular un pequeño delay para mejor UX
    await new Promise((resolve) => setTimeout(resolve, 200));
    onUpdateQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 p-4 border-b last:border-b-0"
    >
      {/* Imagen del producto */}
      <div className="flex-shrink-0">
        <img
          src={imageData.src}
          alt={imageData.alt}
          className="w-16 h-16 object-cover rounded-lg bg-muted"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm mb-1 line-clamp-2">
          {truncateText(item.product.title || item.product.name, 60)}
        </h4>

        {/* Variante */}
        {(item.variant || item.selectedVariant) && (
          <p className="text-xs text-muted-foreground mb-2">
            {(item.variant || item.selectedVariant)?.name}
          </p>
        )}

        {/* Precio */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-primary">
            {formatPrice(item.priceAtAddTime || item.unitPrice)}
          </span>

          {/* Precio diferente al original */}
          {(item.priceAtAddTime || item.unitPrice) !== item.product.price && (
            <Badge variant="outline" className="text-xs">
              Precio al agregar
            </Badge>
          )}
        </div>

        {/* Controles de cantidad */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span
              className={cn(
                "w-8 text-center text-sm font-medium",
                isUpdating && "opacity-50"
              )}
            >
              {item.quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= 99}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Botón eliminar */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Subtotal */}
        <div className="mt-2 text-right">
          <span className="text-sm font-medium">
            Subtotal: {formatPrice(item.subtotal || item.totalPrice)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Componente para aplicar cupones
 */
interface CouponSectionProps {
  appliedCoupons: Coupon[];
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: (couponCode: string) => void;
  error: string | null;
  clearError: () => void;
}

function CouponSection({
  appliedCoupons,
  onApplyCoupon,
  onRemoveCoupon,
  error,
  clearError,
}: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplying(true);
    clearError();

    // Buscar cupón en los disponibles
    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (coupon) {
      onApplyCoupon(coupon);
      setCouponCode("");
    } else {
      // Simular error de cupón no válido
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsApplying(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyCoupon();
    }
  };

  return (
    <div className="space-y-4">
      {/* Input para cupón */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Código de cupón"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <LoadingButton
            loading={isApplying}
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim()}
            className="px-6"
          >
            Aplicar
          </LoadingButton>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </div>

      {/* Cupones sugeridos */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-xs text-muted-foreground"
        >
          {showSuggestions ? "Ocultar" : "Ver"} cupones disponibles
        </Button>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-1"
            >
              {availableCoupons.map((coupon) => (
                <button
                  key={coupon.code}
                  onClick={() => {
                    setCouponCode(coupon.code);
                    setShowSuggestions(false);
                  }}
                  className="block w-full text-left p-2 text-xs bg-muted hover:bg-accent rounded"
                >
                  <span className="font-mono font-semibold">{coupon.code}</span>
                  <span className="ml-2 text-muted-foreground">
                    -{" "}
                    {coupon.type === "percentage"
                      ? `${coupon.value}% OFF`
                      : `$${coupon.value} OFF`}
                    {coupon.minOrderAmount &&
                      ` (mín. $${coupon.minOrderAmount})`}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cupones aplicados */}
      {appliedCoupons && appliedCoupons.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Cupones aplicados:</h5>
          {appliedCoupons?.map((coupon) => (
            <div
              key={coupon.code}
              className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{coupon.code}</span>
                <span className="text-xs text-muted-foreground">
                  {coupon.type === "percentage"
                    ? `${coupon.value}% OFF`
                    : `$${coupon.value} OFF`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemoveCoupon(coupon.code)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Componente principal CartDrawer
 */
export function CartDrawer({
  isOpen,
  onClose,
  onCheckout,
  className,
}: CartDrawerProps) {
  const {
    state,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    error,
    clearError,
    getTotalItems,
  } = useCart();

  const { auth } = useUser();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    setIsCheckingOut(true);

    // Simular proceso de checkout
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onCheckout) {
      onCheckout();
    } else {
      // Redirect por defecto al checkout
      console.log("Redirigir a checkout");
    }

    setIsCheckingOut(false);
    onClose();
  };

  const totalItems = getTotalItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed right-0 top-0 h-full w-full sm:w-96 bg-background border-l shadow-xl z-50",
              "flex flex-col",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  Carrito {totalItems > 0 && `(${totalItems})`}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {state.items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                  >
                    Vaciar
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {state.items.length === 0 ? (
                /* Estado vacío */
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Tu carrito está vacío
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Agrega algunos productos para comenzar tu compra
                    </p>
                    <Button onClick={onClose}>Continuar comprando</Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Lista de items */}
                  <div className="flex-1 overflow-y-auto">
                    <AnimatePresence>
                      {state.items.map((item) => (
                        <CartItemComponent
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer con resumen y checkout */}
                  <div className="border-t bg-muted/30 p-4 space-y-4">
                    {/* Sección de cupones */}
                    <CouponSection
                      appliedCoupons={state.appliedCoupons || []}
                      onApplyCoupon={applyCoupon}
                      onRemoveCoupon={removeCoupon}
                      error={error}
                      clearError={clearError}
                    />

                    {/* Resumen de precios */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(state.summary.subtotal)}</span>
                      </div>

                      {state.summary.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Descuento</span>
                          <span>-{formatPrice(state.summary.discount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Envío</span>
                        <span>
                          {state.summary.shipping === 0 ? (
                            <Badge variant="success" className="text-xs">
                              Gratis
                            </Badge>
                          ) : (
                            formatPrice(state.summary.shipping)
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Impuestos</span>
                        <span>{formatPrice(state.summary.tax)}</span>
                      </div>

                      <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatPrice(state.summary.total)}
                        </span>
                      </div>
                    </div>

                    {/* Envío gratis indicator */}
                    {state.summary.shipping === 0 &&
                      state.summary.subtotal >= 50 && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                          <Gift className="h-4 w-4" />
                          ¡Tienes envío gratis!
                        </div>
                      )}

                    {/* Botón de checkout */}
                    <LoadingButton
                      loading={isCheckingOut}
                      onClick={handleCheckout}
                      className="w-full gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      {isCheckingOut ? "Procesando..." : "Proceder al pago"}
                      <ArrowRight className="h-4 w-4" />
                    </LoadingButton>

                    {/* Nota de seguridad */}
                    {!auth.isAuthenticated && (
                      <p className="text-xs text-muted-foreground text-center">
                        Inicia sesión para una experiencia más rápida
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * EJEMPLOS DE USO:
 *
 * 1. Drawer básico:
 * ```tsx
 * import { useCartDrawer } from "../../hooks/use-cart";
 *
 * function App() {
 *   const { isOpen, closeDrawer, toggleDrawer } = useCartDrawer();
 *
 *   return (
 *     <>
 *       <Button onClick={toggleDrawer}>
 *         Abrir carrito
 *       </Button>
 *
 *       <CartDrawer
 *         isOpen={isOpen}
 *         onClose={closeDrawer}
 *         onCheckout={() => navigate('/checkout')}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * 2. Integración en Header:
 * ```tsx
 * import { useCartDrawer } from "../../hooks/use-cart";
 *
 * function Header() {
 *   const { isOpen, openDrawer, closeDrawer } = useCartDrawer();
 *   const { getTotalItems } = useCart();
 *
 *   return (
 *     <header>
 *       <Button onClick={openDrawer}>
 *         Carrito ({getTotalItems()})
 *       </Button>
 *
 *       <CartDrawer isOpen={isOpen} onClose={closeDrawer} />
 *     </header>
 *   );
 * }
 * ```
 */

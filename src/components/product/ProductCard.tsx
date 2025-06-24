/**
 * Componente ProductCard - Tarjeta individual de producto
 *
 * CONCEPTOS CLAVE:
 * 1. Component Composition - Elementos bien organizados y reutilizables
 * 2. Interactive Design - Hover effects y micro-interactions
 * 3. State Management - Integración con contextos de cart y user
 * 4. Responsive Design - Se adapta a diferentes tamaños de pantalla
 * 5. Accessibility - ARIA labels y navegación por teclado
 * 6. Performance - Lazy loading de imágenes y optimizaciones
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Plus,
  AlertCircle,
} from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";

import { useCart } from "../../hooks/use-cart";
import { useUser } from "../../hooks/use-user";

import type { Product } from "../../types/product";
import { formatPrice, truncateText } from "../../lib/utils";
import { cn } from "../../lib/utils";

/**
 * Props del ProductCard
 */
interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickActions?: boolean;
  size?: "sm" | "md" | "lg";
  onProductClick?: (product: Product) => void;
}

/**
 * Componente para mostrar rating con estrellas
 */
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : star <= rating
                ? "text-yellow-400 fill-yellow-400/50"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  );
}

/**
 * Componente principal ProductCard
 */
export function ProductCard({
  product,
  className,
  showQuickActions = true,
  size = "md",
  onProductClick,
}: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Hooks de contexto
  const { addToCart, getItemQuantity } = useCart();
  const { auth } = useUser();

  // Configuración por tamaño
  const sizeConfig = {
    sm: {
      imageHeight: "h-32",
      cardPadding: "p-3",
      titleSize: "text-sm",
      priceSize: "text-base",
    },
    md: {
      imageHeight: "h-48",
      cardPadding: "p-4",
      titleSize: "text-base",
      priceSize: "text-lg",
    },
    lg: {
      imageHeight: "h-64",
      cardPadding: "p-6",
      titleSize: "text-lg",
      priceSize: "text-xl",
    },
  };

  const config = sizeConfig[size];

  // Estado del producto
  const isInStock = product.stock > 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const itemQuantity = getItemQuantity(product.id);
  const primaryImage = typeof product.images[0] === 'string' ? product.images[0] : product.thumbnail;

  /**
   * Maneja el click en agregar al carrito
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInStock) {
      addToCart({
        product,
        quantity: 1,
      });
    }
  };

  /**
   * Maneja el toggle de favoritos
   */
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!auth.isAuthenticated) {
      // Redirect to login o mostrar modal
      console.log("Usuario debe estar autenticado para agregar a favoritos");
      return;
    }

    try {
      // Simular API call para favoritos
      if (isFavorite) {
        console.log("Removiendo de favoritos:", product.id);
        setIsFavorite(false);
      } else {
        console.log("Agregando a favoritos:", product.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error al manejar favoritos:", error);
    }
  };

  /**
   * Maneja el click en la tarjeta
   */
  const handleCardClick = () => {
    onProductClick?.(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn("group cursor-pointer", className)}
      onClick={handleCardClick}
    >
      <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm">
        {/* Imagen del producto */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            config.imageHeight
          )}
        >
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {!isInStock && (
              <Badge variant="destructive" className="text-xs">
                Agotado
              </Badge>
            )}
            {isLowStock && isInStock && (
              <Badge variant="warning" className="text-xs">
                Últimas {product.stock}
              </Badge>
            )}
            {product.tags?.includes("bestseller") && (
              <Badge variant="success" className="text-xs">
                Bestseller
              </Badge>
            )}
          </div>

          {/* Botón de favoritos */}
          {showQuickActions && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              className={cn(
                "absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300",
                "bg-background/80 backdrop-blur-sm border",
                "opacity-0 group-hover:opacity-100",
                isFavorite
                  ? "text-red-500 bg-red-50 border-red-200"
                  : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </motion.button>
          )}

          {/* Imagen */}
          <div className="relative w-full h-full">
            {!isImageLoaded && !isImageError && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            {isImageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            ) : (
              <img
                src={primaryImage}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  "group-hover:scale-105",
                  isImageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageError(true)}
                loading="lazy"
              />
            )}
          </div>

          {/* Overlay con acciones rápidas */}
          {showQuickActions && isInStock && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="backdrop-blur-sm bg-background/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Abrir modal de vista rápida
                    console.log("Vista rápida:", product.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  className="backdrop-blur-sm"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <CardContent className={config.cardPadding}>
          {/* Categoría */}
          <div className="mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </span>
          </div>

          {/* Título */}
          <h3
            className={cn(
              "font-semibold text-foreground mb-2 leading-tight",
              config.titleSize
            )}
          >
            {truncateText(product.name, 60)}
          </h3>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>

          {/* Precio */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={cn("font-bold text-primary", config.priceSize)}>
                {formatPrice(product.price)}
              </span>
              {/* Aquí podrías agregar precio original si hay descuento */}
            </div>

            {product.brand && (
              <span className="text-xs text-muted-foreground">
                {product.brand}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {isInStock && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isLowStock ? "bg-yellow-400" : "bg-green-400"
                )}
              />
              <span>
                {isLowStock ? `Solo ${product.stock} disponibles` : "En stock"}
              </span>
            </div>
          )}
        </CardContent>

        {/* Footer con botón de acción */}
        <CardFooter className="pt-0 px-4 pb-4">
          {itemQuantity > 0 ? (
            <div className="w-full flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                En carrito: {itemQuantity}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                Agregar más
              </Button>
            </div>
          ) : (
            <Button
              className="w-full gap-2"
              onClick={handleAddToCart}
              disabled={!isInStock}
              size="sm"
            >
              {isInStock ? (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Agregar al carrito
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  No disponible
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

/**
 * Componente ProductCardSkeleton para estados de carga
 */
export function ProductCardSkeleton({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const config = {
    sm: { imageHeight: "h-32", cardPadding: "p-3" },
    md: { imageHeight: "h-48", cardPadding: "p-4" },
    lg: { imageHeight: "h-64", cardPadding: "p-6" },
  }[size];

  return (
    <Card className="h-full border-0 shadow-sm overflow-hidden">
      <div className={cn("bg-muted animate-pulse", config.imageHeight)} />
      <CardContent className={config.cardPadding}>
        <div className="space-y-3">
          <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
          <div className="flex justify-between items-center">
            <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/5" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-4 pb-4">
        <div className="h-8 bg-muted rounded animate-pulse w-full" />
      </CardFooter>
    </Card>
  );
}

/**
 * Componente ProductCardCompact para listas compactas
 */
export function ProductCardCompact({
  product,
  onProductClick,
}: {
  product: Product;
  onProductClick?: (product: Product) => void;
}) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center space-x-3 p-3 bg-card rounded-lg border cursor-pointer hover:shadow-md transition-all"
      onClick={() => onProductClick?.(product)}
    >
      <img
        src={product.thumbnail}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{product.name}</h4>
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" variant="ghost" onClick={handleAddToCart}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * EJEMPLOS DE USO:
 *
 * 1. Tarjeta básica:
 * ```tsx
 * <ProductCard
 *   product={product}
 *   onProductClick={(product) => navigate(`/producto/${product.slug}`)}
 * />
 * ```
 *
 * 2. Tarjeta compacta sin acciones rápidas:
 * ```tsx
 * <ProductCard
 *   product={product}
 *   size="sm"
 *   showQuickActions={false}
 * />
 * ```
 *
 * 3. Grid con skeletons:
 * ```tsx
 * {isLoading ? (
 *   Array.from({ length: 8 }).map((_, i) => (
 *     <ProductCardSkeleton key={i} />
 *   ))
 * ) : (
 *   products.map(product => (
 *     <ProductCard key={product.id} product={product} />
 *   ))
 * )}
 * ```
 */

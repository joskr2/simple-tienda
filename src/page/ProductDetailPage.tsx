/**
 * ProductDetailPage - Página de detalle de producto individual
 *
 * CONCEPTOS CLAVE:
 * 1. Product Information Architecture - Arquitectura de información del producto
 * 2. Image Gallery - Galería de imágenes interactiva
 * 3. Specifications Display - Visualización de especificaciones técnicas
 * 4. Reviews System - Sistema de reseñas y calificaciones
 * 5. Related Products - Productos relacionados y recomendaciones
 * 6. Add to Cart Integration - Integración con carrito de compras
 * 7. Social Sharing - Compartir en redes sociales
 * 8. SEO Optimization - Optimización para motores de búsqueda
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Users,
  Package,
  Info,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Spinner } from "../components/ui/loading";
import { Section, PageContainer } from "../components/layout/layout";
import { ProductCard } from "../components/product/ProductCard";

import { useProduct, useProducts } from "../hooks/use-products";
import { useCart } from "../hooks/use-cart";
import type { Product, ProductCategory } from "../types/product";

/**
 * Props de la página de producto
 */
interface ProductDetailPageProps {
  productId: string;
  onNavigateBack: () => void;
  onNavigateToProduct: (productId: string) => void;
}

/**
 * Componente de galería de imágenes
 */
interface ImageGalleryProps {
  images: string[];
  productName: string;
}

function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt={`${productName} - Imagen ${currentImage + 1}`}
          className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Indicador de zoom */}
        {isZoomed && (
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            Click para alejar
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                currentImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground"
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Componente de información del producto
 */
interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
}

function ProductInfo({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: ProductInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.newArrival && (
          <Badge variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            Nuevo
          </Badge>
        )}
        {product.bestseller && (
          <Badge variant="default">
            <Award className="h-3 w-3 mr-1" />
            Bestseller
          </Badge>
        )}
        {product.onSale && (
          <Badge variant="destructive">-{discount}% OFF</Badge>
        )}
        {product.inStock && (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="h-3 w-3 mr-1" />
            En stock
          </Badge>
        )}
      </div>

      {/* Título y marca */}
      <div>
        <div className="text-sm text-muted-foreground mb-1">
          {product.brand}
        </div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="text-muted-foreground">{product.description}</div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="font-medium ml-1">{product.rating}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          ({product.reviewCount} reseñas)
        </div>
      </div>

      {/* Precio */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {discount > 0 && (
          <div className="text-sm text-green-600 font-medium">
            Ahorras {formatPrice(product.originalPrice! - product.price)}
          </div>
        )}
      </div>

      {/* Stock info */}
      <div className="flex items-center gap-2 text-sm">
        <Package className="h-4 w-4" />
        <span>
          {product.stock > 10
            ? "Más de 10 disponibles"
            : `${product.stock} disponibles`}
        </span>
      </div>

      {/* Cantidad y agregar al carrito */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              aria-label="Disminuir cantidad"
              className="p-2 hover:bg-muted transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() =>
                onQuantityChange(Math.min(product.stock, quantity + 1))
              }
              aria-label="Aumentar cantidad"
              className="p-2 hover:bg-muted transition-colors"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            Máximo {product.stock} unidades
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={onAddToCart}
            disabled={!product.inStock}
            className="flex-1"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Agregar al carrito" : "Agotado"}
          </Button>
          <Button size="lg" variant="outline" onClick={onToggleWishlist}>
            <Heart
              className={`h-4 w-4 ${
                isInWishlist ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Button size="lg" variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Información de envío */}
      <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-green-600" />
          <div>
            <div className="font-medium">Envío gratis</div>
            <div className="text-sm text-muted-foreground">
              En pedidos superiores a $150.000
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <div className="font-medium">Garantía incluida</div>
            <div className="text-sm text-muted-foreground">
              {product.specs?.warranty || "1 año de garantía"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="h-5 w-5 text-purple-600" />
          <div>
            <div className="font-medium">Devoluciones fáciles</div>
            <div className="text-sm text-muted-foreground">
              30 días para devoluciones
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de especificaciones técnicas
 */
interface ProductSpecsProps {
  specs?: Record<string, string>;
  product: Product;
}

function ProductSpecs({ specs, product }: ProductSpecsProps) {
  if (!specs || Object.keys(specs).length === 0) {
    return null;
  }

  const specEntries = Object.entries(specs).filter(
    ([, value]) => value && value.trim() !== ""
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Especificaciones Técnicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {specEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-2 border-b border-muted last:border-0"
            >
              <span className="font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
              </span>
              <span className="text-muted-foreground text-right max-w-[60%]">
                {value}
              </span>
            </div>
          ))}

          {/* Información adicional del producto */}
          <div className="flex justify-between py-2 border-b border-muted">
            <span className="font-medium">SKU</span>
            <span className="text-muted-foreground">{product.sku}</span>
          </div>
          {product.weight && (
            <div className="flex justify-between py-2 border-b border-muted">
              <span className="font-medium">Peso</span>
              <span className="text-muted-foreground">{product.weight}g</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="font-medium">Categoría</span>
            <span className="text-muted-foreground capitalize">
              {product.category}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente de reseñas (placeholder)
 */
function ProductReviews({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Reseñas de Clientes ({product.reviewCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Sistema de reseñas próximamente
          </h3>
          <p className="text-muted-foreground">
            Pronto podrás ver y escribir reseñas de este producto.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente de productos relacionados
 */
interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  onNavigateToProduct: (productId: string) => void;
}

function RelatedProducts({
  currentProductId,
  category,
  onNavigateToProduct,
}: RelatedProductsProps) {
  const { products, isLoading } = useProducts({
    category: category as ProductCategory,
    limit: 4,
  });

  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (isLoading || relatedProducts.length === 0) {
    return null;
  }

  return (
    <Section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Productos Relacionados</h2>
        <p className="text-muted-foreground">
          Otros productos que podrían interesarte
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard
              product={product}
              onProductClick={() => onNavigateToProduct(product.id)}
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/**
 * Componente principal de la página de producto
 */
export function ProductDetailPage({
  productId,
  onNavigateBack,
  onNavigateToProduct,
}: ProductDetailPageProps) {
  const { data: product, isLoading, error } = useProduct(productId);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // Aquí podrías mostrar una notificación de éxito
    }
  };

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    // Aquí implementarías la lógica de wishlist
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Button onClick={onNavigateBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <Section padding="sm">
        <PageContainer>
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </button>
        </PageContainer>
      </Section>

      {/* Contenido principal */}
      <Section>
        <PageContainer>
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Galería de imágenes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ImageGallery
                images={product.images}
                productName={product.name}
              />
            </motion.div>

            {/* Información del producto */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProductInfo
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist}
              />
            </motion.div>
          </div>

          {/* Tabs de información adicional */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ProductSpecs specs={product.specs} product={product} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ProductReviews product={product} />
            </motion.div>
          </div>
        </PageContainer>
      </Section>

      {/* Productos relacionados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <PageContainer>
          <RelatedProducts
            currentProductId={product.id}
            category={product.category}
            onNavigateToProduct={onNavigateToProduct}
          />
        </PageContainer>
      </motion.div>
    </div>
  );
}

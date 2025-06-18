/**
 * Tipos de datos para productos
 * 
 * Este archivo define todas las interfaces y tipos relacionados con productos,
 * categorías, filtros y búsquedas.
 */

// Categorías de productos disponibles
export type ProductCategory = 
  | 'electronics' 
  | 'clothing' 
  | 'books' 
  | 'home' 
  | 'sports' 
  | 'toys' 
  | 'beauty' 
  | 'food';

// Opciones de ordenamiento para productos
export type ProductSortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'name-asc' 
  | 'name-desc' 
  | 'date-desc' 
  | 'rating-desc' 
  | 'popularity-desc';

// Estado de disponibilidad del producto
export type ProductStatus = 'available' | 'out-of-stock' | 'discontinued';

// Especificaciones del producto
export interface ProductSpecs {
  brand?: string;          // Marca del producto
  model?: string;          // Modelo
  color?: string;          // Color
  size?: string;           // Talla/tamaño
  weight?: string;         // Peso
  material?: string;       // Material
  warranty?: string;       // Garantía
  dimensions?: string;     // Dimensiones
  [key: string]: string | undefined; // Especificaciones adicionales flexibles
}

// Review/reseña de producto
export interface ProductReview {
  id: string;              // ID único de la reseña
  userId: string;          // ID del usuario que hizo la reseña
  userName: string;        // Nombre del usuario
  rating: number;          // Calificación (1-5)
  title: string;           // Título de la reseña
  comment: string;         // Comentario detallado
  date: string;            // Fecha de la reseña (ISO string)
  verified: boolean;       // Si la compra está verificada
  helpful: number;         // Número de votos "útil"
}

// Variante de producto (para diferentes colores, tallas, etc.)
export interface ProductVariant {
  id: string;              // ID único de la variante
  name: string;            // Nombre de la variante (ej. "Rojo", "M")
  value: string;           // Valor de la variante
  price?: number;          // Precio específico (si difiere del base)
  stock: number;           // Stock disponible para esta variante
  image?: string;          // Imagen específica de la variante
}

// Interface principal de producto
export interface Product {
  id: string;              // ID único del producto
  name: string;            // Nombre del producto
  description: string;     // Descripción detallada
  price: number;           // Precio base en pesos colombianos
  originalPrice?: number;  // Precio original (para mostrar descuentos)
  currency: string;        // Moneda (por defecto "COP")
  category: ProductCategory; // Categoría del producto
  images: string[];        // Array de URLs de imágenes
  thumbnail: string;       // Imagen miniatura principal
  inStock: boolean;        // Si está en stock
  stock: number;           // Cantidad disponible
  status: ProductStatus;   // Estado del producto
  rating: number;          // Calificación promedio (0-5)
  reviewCount: number;     // Número total de reseñas
  reviews?: ProductReview[]; // Reseñas del producto
  tags: string[];          // Etiquetas/tags del producto
  specs?: ProductSpecs;    // Especificaciones técnicas
  variants?: ProductVariant[]; // Variantes del producto
  featured: boolean;       // Si es producto destacado
  bestseller: boolean;     // Si es bestseller
  newArrival: boolean;     // Si es nueva llegada
  onSale: boolean;         // Si está en oferta
  discount?: number;       // Porcentaje de descuento
  sku: string;             // Código SKU
  brand: string;           // Marca
  weight?: number;         // Peso en gramos
  dimensions?: {           // Dimensiones del producto
    length: number;
    width: number;
    height: number;
  };
  shippingInfo?: {         // Información de envío
    freeShipping: boolean;
    estimatedDays: number;
    weight: number;
  };
  seoInfo?: {              // Información SEO
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;       // Fecha de creación (ISO string)
  updatedAt: string;       // Fecha de última actualización (ISO string)
}

// Parámetros de búsqueda de productos
export interface ProductSearchParams {
  query?: string;              // Término de búsqueda
  category?: ProductCategory;  // Filtrar por categoría
  minPrice?: number;           // Precio mínimo
  maxPrice?: number;           // Precio máximo
  inStock?: boolean;           // Solo productos en stock
  tags?: string[];             // Filtrar por tags
  sort?: ProductSortOption;    // Ordenamiento
  page?: number;               // Página actual
  limit?: number;              // Productos por página
  featured?: boolean;          // Solo productos destacados
  onSale?: boolean;            // Solo productos en oferta
  rating?: number;             // Calificación mínima
  brand?: string;              // Filtrar por marca
}

// Resultado de búsqueda de productos
export interface ProductSearchResult {
  products: Product[];         // Productos encontrados
  total: number;               // Total de productos que coinciden
  page: number;                // Página actual
  limit: number;               // Productos por página
  totalPages: number;          // Total de páginas
  hasNext: boolean;            // Si hay página siguiente
  hasPrev: boolean;            // Si hay página anterior
  filters: {                   // Filtros aplicados
    categories: ProductCategory[];
    priceRange: { min: number; max: number };
    brands: string[];
    tags: string[];
  };
}

// Categoría con metadatos
export interface CategoryInfo {
  id: ProductCategory;         // ID de la categoría
  name: string;                // Nombre en español
  description: string;         // Descripción de la categoría
  icon?: string;               // Icono de la categoría
  image?: string;              // Imagen representativa
  productCount: number;        // Número de productos en la categoría
  featured: boolean;           // Si es categoría destacada
  order: number;               // Orden de visualización
}

// Filtros de producto para UI
export interface ProductFilters {
  categories: ProductCategory[];
  priceRange: { min: number; max: number };
  brands: string[];
  ratings: number[];
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
}

// Estadísticas de productos
export interface ProductStats {
  total: number;               // Total de productos
  byCategory: Record<ProductCategory, number>; // Productos por categoría
  avgPrice: number;            // Precio promedio
  avgRating: number;           // Calificación promedio
  outOfStock: number;          // Productos sin stock
  onSale: number;              // Productos en oferta
}
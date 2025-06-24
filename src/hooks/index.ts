/**
 * Barrel Export - Hooks
 *
 * Centraliza todas las exportaciones de hooks para facilitar las importaciones.
 */

// Hooks del carrito
export { useCart, useCartDrawer, useCartStats, useCartItem } from "./use-cart";

// Hooks de productos
export {
  useProducts,
  useProduct,
  useFeaturedProducts,
  useNewProducts,
  useSaleProducts,
} from "./use-products";

// Hooks de categorías
export { useCategoriesData } from "./use-categories";

// Hooks del usuario
export { useUser, usePermissions, useProfile } from "./use-user";

// Hooks de autenticación
export { useAuth } from "./use-auth";

// Hooks de FakeStore API
export {
  useFakeStoreProducts,
  useFakeStoreProduct,
  useFakeStoreProductsByCategory,
  useFakeStoreCategories,
  useFakeStoreFeaturedProducts,
  useFakeStoreHealthCheck,
} from "./use-fakestore";

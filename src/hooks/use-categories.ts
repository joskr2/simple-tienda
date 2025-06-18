/**
 * Hook para gestión de datos de categorías
 * Separado del componente para cumplir con las reglas de Fast Refresh
 */

import {
  Smartphone,
  Shirt,
  BookOpen,
  Home,
  Dumbbell,
  Sparkles,
} from "lucide-react";

import type { ProductCategory } from "../types/product";

/**
 * Información de las categorías con iconos y colores
 */
const categoriesData = [
  {
    id: "electronics" as ProductCategory,
    name: "Electrónicos",
    description: "Smartphones, laptops y más",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    icon: Smartphone,
    color: "from-blue-500 to-blue-600",
    products: 2847,
    trending: true,
  },
  {
    id: "clothing" as ProductCategory,
    name: "Ropa",
    description: "Moda para todos los estilos",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    icon: Shirt,
    color: "from-pink-500 to-rose-600",
    products: 5234,
    trending: false,
  },
  {
    id: "books" as ProductCategory,
    name: "Libros",
    description: "Conocimiento al alcance",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    icon: BookOpen,
    color: "from-amber-500 to-orange-600",
    products: 1829,
    trending: false,
  },
  {
    id: "home" as ProductCategory,
    name: "Hogar",
    description: "Muebles y decoración",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    icon: Home,
    color: "from-green-500 to-emerald-600",
    products: 3156,
    trending: false,
  },
  {
    id: "sports" as ProductCategory,
    name: "Deportes",
    description: "Equipamiento deportivo",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    icon: Dumbbell,
    color: "from-purple-500 to-violet-600",
    products: 1543,
    trending: true,
  },
  {
    id: "beauty" as ProductCategory,
    name: "Belleza",
    description: "Cuidado personal y cosmética",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    icon: Sparkles,
    color: "from-indigo-500 to-purple-600",
    products: 987,
    trending: false,
  },
];

/**
 * Hook para obtener información de categorías
 */
export function useCategoriesData() {
  return {
    categories: categoriesData,
    getCategoryById: (id: ProductCategory) =>
      categoriesData.find((cat) => cat.id === id),
    getTrendingCategories: () => categoriesData.filter((cat) => cat.trending),
    getCategoriesByProducts: () =>
      [...categoriesData].sort((a, b) => b.products - a.products),
  };
}

/**
 * Exportar datos de categorías para uso directo
 */
export { categoriesData };

/**
 * EJEMPLO DE USO:
 *
 * ```tsx
 * import { useCategoriesData } from '../hooks/use-categories';
 *
 * function CategoryPage() {
 *   const { getCategoryById, getTrendingCategories } = useCategoriesData();
 *   const category = getCategoryById(ProductCategory.ELECTRONICS);
 *   const trending = getTrendingCategories();
 *
 *   return (
 *     <div>
 *       <h1>{category?.name}</h1>
 *       <div>Trending: {trending.map(cat => cat.name).join(', ')}</div>
 *     </div>
 *   );
 * }
 * ```
 */

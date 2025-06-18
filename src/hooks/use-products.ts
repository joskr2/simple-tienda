/**
 * Hook para gestión de productos
 *
 * Este hook maneja toda la lógica relacionada con productos:
 * búsqueda, filtrado, ordenamiento y paginación.
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  Product,
  ProductCategory,
  ProductSearchParams,
  ProductSortOption,
} from "../types/product";
import productsData from "../data/products.json";

// Simulamos una función de API
const fetchProducts = async (
  params: ProductSearchParams = {}
): Promise<Product[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Agregar title como alias de name a todos los productos
  let filteredProducts = [...productsData].map((product) => ({
    ...product,
    title: product.name, // Agregar title como alias de name
  })) as Product[];

  // Filtrar por categoría
  if (params.category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === params.category
    );
  }

  // Filtrar por término de búsqueda
  if (params.query) {
    const searchTerm = params.query.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Filtrar por rango de precio
  if (params.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= params.minPrice!
    );
  }
  if (params.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= params.maxPrice!
    );
  }

  // Filtrar por stock
  if (params.inStock) {
    filteredProducts = filteredProducts.filter((p) => p.inStock);
  }

  // Filtrar por tags
  if (params.tags && params.tags.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      params.tags!.some((tag) => p.tags.includes(tag))
    );
  }

  // Filtrar productos destacados
  if (params.featured) {
    filteredProducts = filteredProducts.filter((p) => p.featured);
  }

  // Filtrar productos en oferta
  if (params.onSale) {
    filteredProducts = filteredProducts.filter((p) => p.onSale);
  }

  // Filtrar por calificación mínima
  if (params.rating) {
    filteredProducts = filteredProducts.filter(
      (p) => p.rating >= params.rating!
    );
  }

  // Filtrar por marca
  if (params.brand) {
    filteredProducts = filteredProducts.filter((p) => p.brand === params.brand);
  }

  // Ordenar productos
  if (params.sort) {
    filteredProducts = sortProducts(filteredProducts, params.sort);
  }

  return filteredProducts;
};

// Función para ordenar productos
const sortProducts = (
  products: Product[],
  sortOption: ProductSortOption
): Product[] => {
  const sorted = [...products];

  switch (sortOption) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "date-desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "popularity-desc":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
};

/**
 * Hook principal para manejar productos
 */
export function useProducts(initialParams: ProductSearchParams = {}) {
  const [searchParams, setSearchParams] =
    useState<ProductSearchParams>(initialParams);

  // Sincronizar con cambios externos de initialParams
  useEffect(() => {
    setSearchParams(initialParams);
  }, [JSON.stringify(initialParams)]);

  // Query para obtener productos
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", searchParams],
    queryFn: () => fetchProducts(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Paginación
  const itemsPerPage = searchParams.limit || 12;
  const currentPage = searchParams.page || 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Funciones para actualizar parámetros de búsqueda
  const updateSearchParams = useCallback(
    (newParams: Partial<ProductSearchParams>) => {
      setSearchParams((prev) => ({
        ...prev,
        ...newParams,
        page: newParams.page !== undefined ? newParams.page : 1, // Reset página al cambiar filtros
      }));
    },
    []
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      updateSearchParams({ query, page: 1 });
    },
    [updateSearchParams]
  );

  const setCategory = useCallback(
    (category?: string) => {
      updateSearchParams({ category: category as ProductCategory, page: 1 });
    },
    [updateSearchParams]
  );

  const setSortOption = useCallback(
    (sort: ProductSortOption) => {
      updateSearchParams({ sort });
    },
    [updateSearchParams]
  );

  const setPriceRange = useCallback(
    (minPrice?: number, maxPrice?: number) => {
      updateSearchParams({ minPrice, maxPrice, page: 1 });
    },
    [updateSearchParams]
  );

  const setPage = useCallback(
    (page: number) => {
      updateSearchParams({ page });
    },
    [updateSearchParams]
  );

  const toggleFilter = useCallback(
    (
      filterName: keyof ProductSearchParams,
      value: ProductSearchParams[keyof ProductSearchParams]
    ) => {
      updateSearchParams({ [filterName]: value, page: 1 });
    },
    [updateSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({ page: 1 });
  }, []);

  // Estadísticas de productos
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.inStock).length;
    const onSale = products.filter((p) => p.onSale).length;
    const featured = products.filter((p) => p.featured).length;
    const avgPrice =
      products.length > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length
        : 0;
    const avgRating =
      products.length > 0
        ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
        : 0;

    return {
      total,
      inStock,
      onSale,
      featured,
      avgPrice,
      avgRating,
      outOfStock: total - inStock,
    };
  }, [products]);

  // Categorías disponibles
  const availableCategories = useMemo(() => {
    const categories = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
    }));
  }, [products]);

  // Marcas disponibles
  const availableBrands = useMemo(() => {
    const brands = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(brands).map(([brand, count]) => ({
      brand,
      count,
    }));
  }, [products]);

  // Tags disponibles
  const availableTags = useMemo(() => {
    const allTags = products.flatMap((p) => p.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Productos relacionados (por categoría)
  const getRelatedProducts = useCallback(
    (productId: string, limit: number = 4) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return [];

      return products
        .filter((p) => p.id !== productId && p.category === product.category)
        .slice(0, limit);
    },
    [products]
  );

  // Buscar producto por ID
  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  return {
    // Datos
    products: paginatedProducts,
    allProducts: products,
    isLoading,
    error,

    // Paginación
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    itemsPerPage,

    // Parámetros de búsqueda
    searchParams,

    // Funciones de actualización
    updateSearchParams,
    setSearchQuery,
    setCategory,
    setSortOption,
    setPriceRange,
    setPage,
    toggleFilter,
    clearFilters,

    // Estadísticas y datos auxiliares
    stats,
    availableCategories,
    availableBrands,
    availableTags,

    // Utilidades
    refetch,
    getRelatedProducts,
    getProductById,
  };
}

/**
 * Hook para obtener un producto específico
 */
export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.find((p) => p.id === productId) || null;
    },
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para productos destacados
 */
export function useFeaturedProducts(limit: number = 8) {
  return useQuery({
    queryKey: ["featured-products", limit],
    queryFn: () => fetchProducts({ featured: true }),
    select: (data) => data.slice(0, limit),
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
}

/**
 * Hook para nuevos productos
 */
export function useNewProducts(limit: number = 8) {
  return useQuery({
    queryKey: ["new-products", limit],
    queryFn: () => fetchProducts({ sort: "date-desc" }),
    select: (data) => data.slice(0, limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para productos en oferta
 */
export function useSaleProducts(limit: number = 8) {
  return useQuery({
    queryKey: ["sale-products", limit],
    queryFn: () => fetchProducts({ onSale: true }),
    select: (data) => data.slice(0, limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

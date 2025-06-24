/**
 * Componente ProductGrid - Grid de productos con filtros y paginación
 *
 * CONCEPTOS CLAVE:
 * 1. Responsive Grid - Layout que se adapta a diferentes pantallas
 * 2. Filter System - Sistema de filtros avanzado y búsqueda
 * 3. Pagination - Navegación por páginas de productos
 * 4. Sort Options - Múltiples opciones de ordenamiento
 * 5. Loading States - Estados de carga elegantes
 * 6. Empty States - Estados vacíos informativos
 * 7. View Modes - Cambio entre vista grid y lista
 */

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3X3, List, X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ProductCardSkeleton } from "../ui/loading";

import { ProductCard } from "./ProductCard";
import { useFakeStoreProducts, useFakeStoreProductsByCategory } from "../../hooks/use-fakestore";

import type {
  ProductSearchParams,
  ProductCategory,
  ProductSortOption,
  Product,
} from "../../types/product";
import { cn, debounce } from "../../lib/utils";

/**
 * Props del ProductGrid
 */
interface ProductGridProps {
  initialFilters?: ProductSearchParams;
  showFilters?: boolean;
  showSearch?: boolean;
  showViewToggle?: boolean;
  className?: string;
  onProductClick?: (product: Product) => void;
}

/**
 * Opciones de ordenamiento disponibles
 */
const sortOptions = [
  { value: "relevance" as const, label: "Más relevantes" },
  { value: "price-asc" as const, label: "Precio (menor a mayor)" },
  { value: "price-desc" as const, label: "Precio (mayor a menor)" },
  { value: "rating-desc" as const, label: "Mejor valorados" },
  { value: "date-desc" as const, label: "Más recientes" },
  { value: "popularity-desc" as const, label: "Más populares" },
];

/**
 * Categorías disponibles para FakeStore
 */
const categoryOptions = [
  { value: "electronics", label: "Electrónicos" },
  { value: "jewelery", label: "Joyería" },
  { value: "men's clothing", label: "Ropa de hombre" },
  { value: "women's clothing", label: "Ropa de mujer" },
];

/**
 * Rangos de precio predefinidos
 */
const priceRanges = [
  { min: 0, max: 50, label: "Menos de $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 500, label: "$100 - $500" },
  { min: 500, max: 1000, label: "$500 - $1,000" },
  { min: 1000, max: Infinity, label: "Más de $1,000" },
];

/**
 * Hook personalizado para manejar filtros con debounce
 */
function useProductFilters(initialFilters: ProductSearchParams = {}) {
  const [filters, setFilters] = useState<ProductSearchParams>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || "");

  // Sincronizar con cambios externos de initialFilters
  useEffect(() => {
    setFilters(initialFilters);
    setSearchQuery(initialFilters.query || "");
  }, [initialFilters]);

  // Memoizar el objeto de filtros para evitar re-renders innecesarios
  const memoizedFilters = useMemo(() => filters, [filters]);

  // Debounce de la búsqueda para evitar muchas requests
  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        const query = args[0] as string;
        setFilters((prev) => ({ ...prev, query, page: 1 }));
      }, 300),
    []
  );

  const updateSearch = (query: string) => {
    setSearchQuery(query);
    debouncedUpdateSearch(query);
  };

  const updateFilter = (
    key: keyof ProductSearchParams,
    value: ProductSearchParams[keyof ProductSearchParams]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const removeFilter = (key: keyof ProductSearchParams) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return { ...newFilters, page: 1 };
    });
  };

  const clearAllFilters = () => {
    setFilters({ page: 1 });
    setSearchQuery("");
  };

  return {
    filters: memoizedFilters,
    searchQuery,
    updateSearch,
    updateFilter,
    removeFilter,
    clearAllFilters,
  };
}

/**
 * Componente principal ProductGrid
 */
export function ProductGrid({
  initialFilters = {},
  showFilters = true,
  showSearch = true,
  showViewToggle = true,
  className,
  onProductClick,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const {
    filters,
    searchQuery,
    updateSearch,
    updateFilter,
    removeFilter,
    clearAllFilters,
  } = useProductFilters(initialFilters);

  // Query de productos usando FakeStore
  const fakeStoreParams = {
    limit: filters.limit || 20,
    sort: filters.sort === 'price-asc' ? 'asc' as const : 'desc' as const,
  };
  
  // Always call both hooks to satisfy rules of hooks
  const { data: allProducts = [], isLoading: isLoadingAll, error: errorAll } = useFakeStoreProducts(fakeStoreParams);
  const { data: categoryProducts = [], isLoading: isLoadingCategory, error: errorCategory } = useFakeStoreProductsByCategory(
    filters.category || 'electronics', // Always provide a category
    fakeStoreParams
  );
  
  // Choose which data to use based on filter
  const products = filters.category ? categoryProducts : allProducts;
  const isLoading = filters.category ? isLoadingCategory : isLoadingAll;
  const error = filters.category ? errorCategory : errorAll;

  /**
   * Cuenta los filtros activos
   */
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      count++;
    if (filters.brand) count++;
    if (filters.rating !== undefined) count++;
    return count;
  }, [filters]);

  /**
   * Renderiza los filtros activos como badges
   */
  const renderActiveFilters = () => {
    const activeBadges = [];

    if (filters.query) {
      activeBadges.push(
        <Badge key="query" variant="secondary" className="gap-1">
          Búsqueda: "{filters.query}"
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => {
              updateSearch("");
              removeFilter("query");
            }}
          />
        </Badge>
      );
    }

    if (filters.category) {
      const categoryLabel = categoryOptions.find(
        (c) => c.value === filters.category
      )?.label;
      activeBadges.push(
        <Badge key="category" variant="secondary" className="gap-1">
          {categoryLabel}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => removeFilter("category")}
          />
        </Badge>
      );
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const min = filters.minPrice || 0;
      const max = filters.maxPrice || Infinity;
      const rangeLabel =
        max === Infinity ? `Más de $${min}` : `$${min} - $${max}`;

      activeBadges.push(
        <Badge key="price" variant="secondary" className="gap-1">
          {rangeLabel}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => {
              removeFilter("minPrice");
              removeFilter("maxPrice");
            }}
          />
        </Badge>
      );
    }

    return activeBadges;
  };

  /**
   * Renderiza el panel de filtros
   */
  const renderFiltersPanel = () => (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Filtros
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Limpiar todo
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categorías */}
        <div>
          <h4 className="font-medium mb-3">Categorías</h4>
          <div className="space-y-2">
            {categoryOptions.map((category) => (
              <label
                key={category.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFilter(
                        "category",
                        category.value as ProductCategory
                      );
                    }
                  }}
                  className="text-primary"
                />
                <span className="text-sm">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rango de precios */}
        <div>
          <h4 className="font-medium mb-3">Precio</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="price"
                  checked={
                    filters.minPrice === range.min &&
                    (range.max === Infinity
                      ? !filters.maxPrice
                      : filters.maxPrice === range.max)
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFilter("minPrice", range.min);
                      if (range.max !== Infinity) {
                        updateFilter("maxPrice", range.max);
                      } else {
                        removeFilter("maxPrice");
                      }
                    }
                  }}
                  className="text-primary"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating mínimo */}
        <div>
          <h4 className="font-medium mb-3">Valoración mínima</h4>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFilter("rating", rating);
                    }
                  }}
                  className="text-primary"
                />
                <span className="text-sm">{rating}+ estrellas</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-destructive mb-4">
            <X className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            Error al cargar productos
          </h3>
          <p className="text-muted-foreground mb-4">
            Hubo un problema cargando los productos. Por favor, intenta de
            nuevo.
          </p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header con búsqueda y controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Búsqueda */}
        {showSearch && (
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Controles */}
        <div className="flex items-center gap-2">
          {/* Filtros móvil */}
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="lg:hidden gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 h-5 w-5 p-0 text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Ordenamiento */}
          <select
            value={filters.sort || "relevance"}
            onChange={(e) => {
              updateFilter("sort", e.target.value as ProductSortOption);
            }}
            className="px-3 py-2 text-sm border rounded-md bg-background"
            aria-label="Ordenar productos"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Toggle de vista */}
          {showViewToggle && (
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filtros activos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">
            Filtros activos:
          </span>
          {renderActiveFilters()}
        </div>
      )}

      {/* Resultados info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Mostrando {products.length} productos</span>
      </div>

      {/* Layout principal */}
      <div className="flex gap-6">
        {/* Panel de filtros desktop */}
        {showFilters && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            {renderFiltersPanel()}
          </div>
        )}

        {/* Grid de productos */}
        <div className="flex-1">
          {isLoading ? (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No se encontraron productos
              </h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar los filtros o términos de búsqueda.
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <motion.div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              )}
              layout
            >
              <AnimatePresence>
                {products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                    size={viewMode === "list" ? "sm" : "md"}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Panel de filtros móvil */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 h-full w-80 bg-background border-r p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Filtros</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFiltersOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {renderFiltersPanel()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

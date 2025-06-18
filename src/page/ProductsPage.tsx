/**
 * ProductsPage - Página de listado de productos con filtros
 *
 * CONCEPTOS CLAVE:
 * 1. Search & Filter Interface - Interfaz completa de búsqueda y filtros
 * 2. URL State Management - Estado sincronizado con URL
 * 3. Advanced Filtering - Filtros múltiples y combinables
 * 4. Sort & Pagination - Ordenamiento y paginación
 * 5. Responsive Layout - Layout adaptable con sidebar colapsible
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  X,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
} from "../components/ui/card";

import { ProductGrid } from "../components/product/ProductGrid";
import { CompactCategories } from "../components/product/CategoriesSection";
import { Section, PageContainer } from "../components/layout/layout";

import type { ProductCategory, ProductSearchParams } from "../types/product";

/**
 * Props de la ProductsPage
 */
interface ProductsPageProps {
  initialCategory?: string;
  onNavigateToProduct: (productId: string) => void;
  onNavigateBack: () => void;
}

/**
 * Breadcrumb component para navegación
 */
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    current?: boolean;
  }>;
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-muted-foreground">/</span>}
          {item.current ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <button
              onClick={item.onClick}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/**
 * Header de la página de productos
 */
interface ProductsHeaderProps {
  title: string;
  subtitle?: string;
  category?: ProductCategory;
  onNavigateBack: () => void;
  onCategoryChange: (category?: ProductCategory) => void;
}

function ProductsHeader({
  title,
  subtitle,
  category,
  onNavigateBack,
  onCategoryChange,
}: ProductsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Inicio", onClick: onNavigateBack },
          {
            label: category ? `Categoría: ${category}` : "Productos",
            current: true,
          },
        ]}
      />

      {/* Título y controles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Botón volver */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="outline" onClick={onNavigateBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>
        </motion.div>
      </div>

      {/* Categorías compactas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Filtrar por categoría:
          </span>
          {category && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCategoryChange(undefined)}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <CompactCategories
          activeCategory={category}
          onCategoryClick={onCategoryChange}
          className="flex-wrap"
        />
      </motion.div>
    </div>
  );
}

// Función QuickStats comentada - no utilizada actualmente
// Se mantiene para futura implementación de estadísticas de búsqueda

/**
 * Componente principal ProductsPage
 */
export function ProductsPage({
  initialCategory,
  onNavigateToProduct,
  onNavigateBack,
}: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | undefined
  >(initialCategory as ProductCategory);

  // Configurar filtros iniciales
  const [filters, setFilters] = useState<ProductSearchParams>({
    category: selectedCategory,
    page: 1,
  });

  // Título dinámico basado en la categoría
  const pageTitle = selectedCategory
    ? `Productos - ${
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
      }`
    : "Todos los productos";

  const pageSubtitle = selectedCategory
    ? `Explora nuestra selección en ${selectedCategory}`
    : "Descubre toda nuestra colección de productos premium";

  /**
   * Maneja el cambio de categoría
   */
  const handleCategoryChange = useCallback((category?: ProductCategory) => {
    setSelectedCategory(category);
    setFilters((prev) => ({
      ...prev,
      category,
      page: 1, // Reset página al cambiar categoría
    }));
  }, []);

  /**
   * Efecto para sincronizar categoría inicial
   */
  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      handleCategoryChange(initialCategory as ProductCategory);
    }
  }, [initialCategory, selectedCategory, handleCategoryChange]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <Section padding="lg" className="border-b bg-muted/30">
        <PageContainer>
          <ProductsHeader
            title={pageTitle}
            subtitle={pageSubtitle}
            category={selectedCategory}
            onNavigateBack={onNavigateBack}
            onCategoryChange={handleCategoryChange}
          />
        </PageContainer>
      </Section>

      {/* Main Content */}
      <Section padding="lg">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProductGrid
              initialFilters={filters}
              showFilters={true}
              showSearch={true}
              showViewToggle={true}
              onProductClick={(product) => onNavigateToProduct(product.id)}
            />
          </motion.div>
        </PageContainer>
      </Section>

      {/* Banner promocional */}
      <Section padding="md" background="accent">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
              <CardContent className="p-8">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-2">
                    ¡Oferta especial!
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  ¿No encuentras lo que buscas?
                </h3>

                <p className="text-muted-foreground mb-6">
                  Contáctanos y te ayudaremos a encontrar el producto perfecto.
                  Nuestro equipo de expertos está aquí para ayudarte.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button>Contactar soporte</Button>
                  <Button variant="outline">Solicitar producto</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </PageContainer>
      </Section>
    </main>
  );
}

/**
 * Componente CategoriesSection - Navegación visual por categorías
 *
 * CONCEPTOS CLAVE:
 * 1. Visual Navigation - Navegación intuitiva con imágenes
 * 2. Responsive Cards - Tarjetas que se adaptan al dispositivo
 * 3. Hover Effects - Efectos visuales atractivos
 * 4. Category Management - Manejo dinámico de categorías
 * 5. Performance - Lazy loading y optimizaciones
 */

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import type { ProductCategory } from "../../types/product";
import { categoriesData } from "../../hooks/use-categories";
import { cn } from "../../lib/utils";

/**
 * Props del CategoriesSection
 */
interface CategoriesSectionProps {
  className?: string;
  onCategoryClick?: (category: ProductCategory) => void;
  showTitle?: boolean;
  layout?: "grid" | "horizontal";
}

/**
 * Variantes de animación para las tarjetas
 */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Componente para una tarjeta de categoría individual
 */
interface CategoryCardProps {
  category: (typeof categoriesData)[0];
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  layout?: "vertical" | "horizontal";
}

function CategoryCard({
  category,
  onClick,
  size = "md",
  layout = "vertical",
}: CategoryCardProps) {
  const Icon = category.icon;

  const sizeClasses = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
        <div className="relative">
          {/* Imagen de fondo */}
          <div
            className={cn(
              "relative overflow-hidden",
              layout === "vertical" ? sizeClasses[size] : "h-32"
            )}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay con gradiente */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-80",
                category.color
              )}
            />

            {/* Icono flotante */}
            <div className="absolute top-4 right-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Badge de trending */}
            {category.trending && (
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              </div>
            )}

            {/* Contenido sobre la imagen */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-1 group-hover:text-white/90 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80 mb-2">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70">
                    {category.products.toLocaleString()} productos
                  </span>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center text-white/80"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Componente principal CategoriesSection
 */
export function CategoriesSection({
  className,
  onCategoryClick,
  showTitle = true,
  layout = "grid",
}: CategoriesSectionProps) {
  const handleCategoryClick = (category: ProductCategory) => {
    onCategoryClick?.(category);
  };

  return (
    <section className={cn("space-y-8", className)}>
      {/* Header de la sección */}
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Explora</span> nuestras categorías
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre productos increíbles en cada categoría. Desde tecnología
            hasta moda, tenemos todo lo que necesitas.
          </p>
        </motion.div>
      )}

      {/* Grid de categorías */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
        )}
      >
        {categoriesData.map((category) => (
          <motion.div
            key={category.id}
            variants={cardVariants}
            className={
              layout === "horizontal" ? "flex-shrink-0 w-64 snap-center" : ""
            }
          >
            <CategoryCard
              category={category}
              onClick={() => handleCategoryClick(category.id)}
              size={layout === "horizontal" ? "sm" : "md"}
              layout={layout === "horizontal" ? "horizontal" : "vertical"}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <Button size="lg" variant="outline" className="group">
          Ver todos los productos
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </section>
  );
}

/**
 * Componente compacto de categorías para sidebar o header
 */
interface CompactCategoriesProps {
  onCategoryClick?: (category: ProductCategory) => void;
  activeCategory?: ProductCategory;
  className?: string;
}

export function CompactCategories({
  onCategoryClick,
  activeCategory,
  className,
}: CompactCategoriesProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categoriesData.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryClick?.(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary hover:bg-accent text-secondary-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {category.name}
          </motion.button>
        );
      })}
    </div>
  );
}

/**
 * EJEMPLOS DE USO:
 *
 * 1. Sección completa de categorías:
 * ```tsx
 * <CategoriesSection
 *   onCategoryClick={(category) => navigate(`/categoria/${category}`)}
 * />
 * ```
 *
 * 2. Categorías horizontales en mobile:
 * ```tsx
 * <CategoriesSection
 *   layout="horizontal"
 *   showTitle={false}
 *   className="lg:hidden"
 * />
 * ```
 *
 * 3. Categorías compactas en sidebar:
 * ```tsx
 * <CompactCategories
 *   activeCategory={currentCategory}
 *   onCategoryClick={setCategory}
 * />
 * ```
 */

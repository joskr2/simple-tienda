/**
 * HomePage - Página principal del e-commerce
 *
 * CONCEPTOS CLAVE:
 * 1. Page Composition - Composición de múltiples secciones
 * 2. Data Fetching - Obtención de datos para diferentes secciones
 * 3. User Experience - Flujo de navegación intuitivo
 * 4. Performance - Lazy loading y optimizaciones
 * 5. Responsive Design - Adaptable a todos los dispositivos
 */

import { motion } from "framer-motion";
import { ArrowRight, Star, TrendingUp, Zap, Heart } from "lucide-react";

import { HeroSection } from "../components/common/HeroSection";
import { CategoriesSection } from "../components/product/CategoriesSection";
import { ProductCard } from "../components/product/ProductCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { ProductCardSkeleton } from "../components/ui/loading";
import { Section, PageContainer } from "../components/layout/layout";

import { useFakeStoreFeaturedProducts, useFakeStoreProductsByCategory } from "../hooks/use-fakestore";

/**
 * Props de la HomePage
 */
interface HomePageProps {
  onNavigateToProducts: () => void;
  onNavigateToCategory: (category: string) => void;
  onNavigateToProduct: (productId: string) => void;
}

/**
 * Sección de productos destacados
 */
function FeaturedProductsSection({
  onNavigateToProduct,
  onNavigateToProducts,
}: {
  onNavigateToProduct: (productId: string) => void;
  onNavigateToProducts: () => void;
}) {
  // Obtener productos destacados de FakeStore
  const featuredProducts = useFakeStoreFeaturedProducts(8);
  const products = featuredProducts || [];
  const isLoading = false;

  return (
    <Section padding="lg" className="bg-muted/30">
      <PageContainer>
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">
              <Star className="h-3 w-3 mr-1" />
              Los más populares
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Productos <span className="gradient-text">destacados</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre los productos más amados por nuestros clientes. Calidad
              garantizada y mejores valoraciones.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {products.map((product, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onProductClick={(product) => onNavigateToProduct(product.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center">
          <Button size="lg" onClick={onNavigateToProducts} className="group">
            Ver todos los productos
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </PageContainer>
    </Section>
  );
}

/**
 * Sección de ofertas especiales
 */
function SpecialOffersSection() {
  // Obtener productos en oferta de electrónicos de FakeStore
  const { data: products = [], isLoading } = useFakeStoreProductsByCategory("electronics", { limit: 3 });

  return (
    <Section padding="lg">
      <PageContainer>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido promocional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="destructive" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              ¡Oferta por tiempo limitado!
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hasta <span className="text-destructive">50% OFF</span>
              <br />
              en electrónicos
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              Aprovecha nuestras ofertas especiales en los mejores dispositivos.
              Smartphones, laptops y más con descuentos increíbles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="destructive">
                Ver ofertas
              </Button>
              <Button size="lg" variant="outline">
                Suscribirse a alertas
              </Button>
            </div>

            {/* Características de la oferta */}
            <div className="mt-8 space-y-3">
              {[
                "Envío gratis en todas las ofertas",
                "Garantía extendida incluida",
                "30 días para devoluciones",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Grid de productos en oferta */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : (
              products.slice(0, 3).map((product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-destructive/20">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={typeof product.images[0] === 'string' ? product.images[0] : product.thumbnail}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-destructive">
                              ${(product.price * 0.7).toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.price}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              30% OFF
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </PageContainer>
    </Section>
  );
}

/**
 * Sección de estadísticas y confianza
 */
function TrustSection() {
  const stats = [
    {
      value: "50,000+",
      label: "Clientes satisfechos",
      icon: Heart,
      color: "text-red-500",
    },
    {
      value: "10,000+",
      label: "Productos disponibles",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      value: "4.9/5",
      label: "Valoración promedio",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      value: "24h",
      label: "Envío express",
      icon: Zap,
      color: "text-green-500",
    },
  ];

  return (
    <Section padding="lg" background="accent">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Números que nos <span className="gradient-text">respaldan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Miles de clientes confían en nosotros cada día. Únete a la comunidad
            que ya descubrió la mejor experiencia de compra online.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-background/50 backdrop-blur-sm border">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </PageContainer>
    </Section>
  );
}

/**
 * Componente principal HomePage
 */
export function HomePage({
  onNavigateToProducts,
  onNavigateToCategory,
  onNavigateToProduct,
}: HomePageProps) {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Sección de Categorías */}
      <Section padding="xl">
        <PageContainer>
          <CategoriesSection
            onCategoryClick={(category) => onNavigateToCategory(category)}
          />
        </PageContainer>
      </Section>

      {/* Productos Destacados */}
      <FeaturedProductsSection
        onNavigateToProduct={onNavigateToProduct}
        onNavigateToProducts={onNavigateToProducts}
      />

      {/* Ofertas Especiales */}
      <SpecialOffersSection />

      {/* Sección de Confianza */}
      <TrustSection />

      {/* Newsletter Section */}
      <Section padding="lg" className="bg-primary/5">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿No quieres perderte nada?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Suscríbete a nuestro newsletter y recibe ofertas exclusivas,
              nuevos productos y contenido especial directamente en tu bandeja
              de entrada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg" className="px-8">
                Suscribirse
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              No enviamos spam. Puedes cancelar en cualquier momento.
            </p>
          </motion.div>
        </PageContainer>
      </Section>
    </main>
  );
}

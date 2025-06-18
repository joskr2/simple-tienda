import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Heart, ShoppingBag } from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

/**
 * Props del HeroSection
 */
interface HeroSectionProps {
  className?: string;
}

/**
 * Variantes de animación para Framer Motion
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

/**
 * Estadísticas destacadas
 */
const stats = [
  { label: "Productos", value: "10K+", icon: ShoppingBag },
  { label: "Clientes felices", value: "50K+", icon: Heart },
  { label: "Envíos rápidos", value: "24h", icon: Zap },
];

/**
 * Componente HeroSection principal
 */
export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Background con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

      {/* Elementos decorativos flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos decorativos */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl"
        />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, delay: 4 }}
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent/30 rounded-full blur-xl"
        />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-12">
          {/* Contenido principal */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge de novedad */}
            <motion.div variants={itemVariants} className="mb-6">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm"
              >
                <Sparkles className="h-4 w-4" />
                Nuevos productos cada semana
              </Badge>
            </motion.div>

            {/* Título principal */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              <span className="gradient-text">Descubre</span> tu estilo
              <br />
              <span className="text-foreground">perfecto</span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl lg:max-w-lg"
            >
              Explora nuestra colección curada de productos premium. Desde
              tecnología hasta moda, encuentra exactamente lo que buscas con la
              mejor calidad y precios competitivos.
            </motion.p>

            {/* Botones de acción */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button size="lg" className="group">
                Explorar productos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button variant="outline" size="lg">
                Ver ofertas especiales
              </Button>
            </motion.div>

            {/* Estadísticas */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Imagen/Visual principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Contenedor principal de la imagen */}
            <div className="relative">
              {/* Imagen principal */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden custom-shadow"
              >
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                  alt="Productos destacados"
                  className="w-full h-[500px] object-cover"
                />

                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>

              {/* Tarjetas flotantes de productos */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -left-4 top-20 bg-background/80 backdrop-blur-sm border rounded-lg p-4 shadow-lg max-w-[200px]"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=60&h=60&fit=crop"
                    alt="iPhone"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-sm">iPhone 15 Pro</h4>
                    <p className="text-primary font-bold text-sm">$999</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="absolute -right-4 bottom-20 bg-background/80 backdrop-blur-sm border rounded-lg p-4 shadow-lg max-w-[200px]"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop"
                    alt="Camiseta"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-sm">Camiseta Premium</h4>
                    <p className="text-primary font-bold text-sm">$29</p>
                  </div>
                </div>
              </motion.div>

              {/* Badge de oferta */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="absolute top-4 left-4"
              >
                <Badge variant="destructive" className="animate-pulse">
                  ¡50% OFF!
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-muted-foreground"
        >
          <span className="text-sm mb-2 hidden sm:block">Explora más</span>
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-muted-foreground rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/**
 * CARACTERÍSTICAS DEL HERO:
 *
 * 1. **Visual Impact**: Diseño moderno con gradientes y efectos
 * 2. **Animaciones**: Framer Motion para transiciones suaves
 * 3. **Responsive**: Se adapta perfectamente a todos los dispositivos
 * 4. **Interactive**: Elementos hover y animaciones continuas
 * 5. **Content Hierarchy**: Información organizada por importancia
 * 6. **Call to Actions**: Botones claros que guían al usuario
 * 7. **Social Proof**: Estadísticas que generan confianza
 * 8. **Product Preview**: Tarjetas flotantes con productos destacados
 * 9. **Modern Design**: Glassmorphism y efectos de blur
 * 10. **Performance**: Optimizado para carga rápida
 *
 * EJEMPLO DE USO:
 * ```tsx
 * import { HeroSection } from './components/common/HeroSection';
 *
 * function HomePage() {
 *   return (
 *     <div>
 *       <HeroSection />
 *       // ... resto del contenido
 *     </div>
 *   );
 * }
 * ```
 */

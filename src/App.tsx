/**
 * App.tsx - Componente principal de la aplicación
 *
 * CONCEPTOS CLAVE:
 * 1. Application Structure - Estructura principal de la app
 * 2. Provider Pattern - Múltiples providers anidados
 * 3. Routing - Navegación entre páginas (simulada)
 * 4. Global State - Estado global accesible desde toda la app
 * 5. Error Boundaries - Manejo de errores a nivel aplicación
 */

import { useState } from "react";

// Components
import Layout from "./components/layout/layout";
import { HomePage } from "./page/HomePage";
import { ProductsPage } from "./page/ProductsPage";
import { CartDrawer } from "./components/cart/CartDrawer";
import { useCartDrawer } from "./hooks/use-cart";

// Providers
import { AuthProvider } from "./contexts/auth-context";

// Simulamos un router simple para esta demostración
type Page = "home" | "products" | "category" | "product";

interface AppState {
  currentPage: Page;
  selectedCategory?: string;
  selectedProduct?: string;
}

/**
 * Componente principal de la aplicación
 */
function App() {
  // Estado de navegación simple (en producción usarías React Router)
  const [appState, setAppState] = useState<AppState>({
    currentPage: "home",
  });

  // Hook del carrito drawer
  const { isOpen: isCartOpen, closeDrawer } = useCartDrawer();

  /**
   * Funciones de navegación
   */
  const navigateToHome = () => {
    setAppState({ currentPage: "home" });
  };

  const navigateToProducts = () => {
    setAppState({ currentPage: "products" });
  };

  const navigateToCategory = (category: string) => {
    setAppState({
      currentPage: "category",
      selectedCategory: category,
    });
  };

  const navigateToProduct = (productId: string) => {
    setAppState({
      currentPage: "product",
      selectedProduct: productId,
    });
  };

  // Función para manejar clicks en el carrito del header (comentada por ahora)
  // const handleCartClick = () => {
  //   openCart();
  // };

  /**
   * Función para manejar el checkout
   */
  const handleCheckout = () => {
    console.log("Redirigir a página de checkout");
    // Aquí irías a la página de checkout
    closeDrawer();
  };

  /**
   * Renderiza la página actual basada en el estado
   */
  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case "home":
        return (
          <HomePage
            onNavigateToProducts={navigateToProducts}
            onNavigateToCategory={navigateToCategory}
            onNavigateToProduct={navigateToProduct}
          />
        );

      case "products":
      case "category":
        return (
          <ProductsPage
            initialCategory={appState.selectedCategory}
            onNavigateToProduct={navigateToProduct}
            onNavigateBack={navigateToHome}
          />
        );

      case "product":
        return (
          <div className="container-custom py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">
                Página de Producto: {appState.selectedProduct}
              </h1>
              <p className="text-muted-foreground mb-6">
                Esta sería la página de detalle del producto.
              </p>
              <button
                onClick={navigateToHome}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="container-custom py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Página no encontrada</h1>
              <button
                onClick={navigateToHome}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <Layout>
        {/* Contenido principal de la aplicación */}
        {renderCurrentPage()}

        {/* Drawer del carrito - Siempre presente */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={closeDrawer}
          onCheckout={handleCheckout}
        />

        {/* 
          Aquí podrías agregar otros componentes globales como:
          - Toasts/Notifications
          - Modals globales
          - Loading overlay
          - etc.
        */}
      </Layout>
    </AuthProvider>
  );
}

export default App;

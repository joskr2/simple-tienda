/**
 * Layout principal de la aplicación
 *
 * Proporciona la estructura base con header, footer y área de contenido principal.
 * Incluye todos los providers necesarios para el funcionamiento de la app.
 */

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { CartProvider } from "../../contexts/cart-context";
import { UserProvider } from "../../contexts/user-context";
import { ThemeProvider } from "../../contexts/theme-context";
import Header from "./header";
import Footer from "./footer";

// Crear instancia del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

interface LayoutProps {
  children?: React.ReactNode; // Opcional para compatibilidad con React Router
}

/**
 * Componente Layout principal
 * Soporta tanto children directos como React Router Outlet
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
              <Header />
              <main className="flex-1">
                {/* Si hay children, los usa; si no, usa Outlet para React Router */}
                {children || <Outlet />}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

/**
 * Componente Section - Para secciones de contenido
 */
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "accent" | "card";
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  padding = "md",
  background = "default",
}) => {
  const paddingClasses = {
    none: "",
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
    xl: "py-16",
  };

  const backgroundClasses = {
    default: "",
    muted: "bg-muted/30",
    accent: "bg-accent/5",
    card: "bg-card",
  };

  return (
    <section
      className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
};

/**
 * Componente PageContainer - Container responsive para páginas
 */
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  size = "lg",
}) => {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className={`container mx-auto px-4 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

export default Layout;

/**
 * Header Component - Barra de navegación principal
 *
 * Incluye logo, navegación, búsqueda, usuario y carrito
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Heart,
  Settings,
  LogOut,
  Package,
  Bell,
  MapPin,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { CartDrawer } from "../cart/CartDrawer";

import { useCart, useCartDrawer } from "../../hooks/use-cart";
import { useUser, useProfile } from "../../hooks/use-user";
import { cn } from "../../lib/utils";

interface HeaderProps {
  className?: string;
}

/**
 * Componente de Avatar de Usuario
 */
interface UserAvatarProps {
  user: any;
  getDisplayName: () => string;
  getInitials: () => string;
  getAvatarUrl: () => string | null;
  onLogout: () => void;
}

function UserAvatar({
  user,
  getDisplayName,
  getInitials,
  getAvatarUrl,
  onLogout,
}: UserAvatarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const avatarUrl = getAvatarUrl();

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={getDisplayName()}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {getInitials()}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium">
          {getDisplayName()}
        </span>
      </button>

      {/* Menú dropdown del usuario */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay para cerrar el menú */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-50"
            >
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={getDisplayName()}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-medium">
                      {getInitials()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {getDisplayName()}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="h-4 w-4" />
                  <span>Mi Perfil</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Package className="h-4 w-4" />
                  <span>Mis Pedidos</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Heart className="h-4 w-4" />
                  <span>Lista de Deseos</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <MapPin className="h-4 w-4" />
                  <span>Direcciones</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="h-4 w-4" />
                  <span>Configuración</span>
                </button>
              </div>

              <div className="border-t py-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Componente del Botón del Carrito
 */
interface CartButtonProps {
  itemCount: number;
  onOpenCart: () => void;
}

function CartButton({ itemCount, onOpenCart }: CartButtonProps) {
  return (
    <button
      onClick={onOpenCart}
      className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors"
      aria-label={`Carrito de compras - ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1"
        >
          <Badge
            variant="destructive"
            className="h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        </motion.div>
      )}
    </button>
  );
}

/**
 * Componente de Búsqueda
 */
interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="flex-1 max-w-2xl mx-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
          />
        </div>
      </form>
    </div>
  );
}

/**
 * Componente Principal del Header
 */
const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hooks
  const { getTotalItems } = useCart();
  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useCartDrawer();
  const { auth, getCurrentUser, login, logout } = useUser();
  const { getDisplayName, getInitials, getAvatarUrl } = useProfile();

  // Estados
  const totalItems = getTotalItems();
  const currentUser = getCurrentUser();
  const isAuthenticated = auth.isAuthenticated;

  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
    // Aquí implementarías la lógica de búsqueda
  };

  const handleLogin = async () => {
    try {
      // Login demo para testing
      await login("usuario@demo.com", "demo123");
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <>
      <header className={cn("bg-gray-800 text-white shadow-lg", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold hidden sm:block">
                  Mi Tienda Virtual
                </h1>
              </a>
            </div>

            {/* Barra de búsqueda - Desktop */}
            <div className="hidden md:block flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Acciones del usuario */}
            <div className="flex items-center space-x-2">
              {/* Notificaciones */}
              {isAuthenticated && (
                <button
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors relative"
                  aria-label="Notificaciones"
                >
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </button>
              )}

              {/* Lista de deseos */}
              {isAuthenticated && (
                <button
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  aria-label="Lista de deseos"
                >
                  <Heart className="h-5 w-5" />
                </button>
              )}

              {/* Carrito */}
              <CartButton itemCount={totalItems} onOpenCart={openCart} />

              {/* Usuario */}
              {isAuthenticated && currentUser ? (
                <UserAvatar
                  user={currentUser}
                  getDisplayName={getDisplayName}
                  getInitials={getInitials}
                  getAvatarUrl={getAvatarUrl}
                  onLogout={logout}
                />
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              )}

              {/* Menú móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Barra de búsqueda móvil */}
          <div className="md:hidden pb-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-gray-700 border-t border-gray-600"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {!isAuthenticated ? (
                  <Button
                    onClick={handleLogin}
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                ) : (
                  <>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                      <User className="h-5 w-5" />
                      <span>Mi Perfil</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                      <Package className="h-5 w-5" />
                      <span>Mis Pedidos</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span>Lista de Deseos</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                      <Settings className="h-5 w-5" />
                      <span>Configuración</span>
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition-colors text-red-400 hover:text-white"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Header;

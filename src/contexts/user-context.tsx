/**
 * Proveedor del Usuario
 *
 * Maneja la autenticación y el estado del usuario de forma simplificada.
 * En una aplicación real, aquí integrarías con servicios como Auth0, Firebase Auth, etc.
 */

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user";
import {
  UserContext,
  type AuthState,
  type UserContextValue,
} from "./user-context-types";

// Estado inicial de autenticación
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Usuario demo para testing
const demoUser: User = {
  id: "demo-user-1",
  email: "usuario@demo.com",
  emailVerified: true,
  profile: {
    firstName: "Usuario",
    lastName: "Demo",
    displayName: "Usuario Demo",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    phoneNumber: "+57 300 123 4567",
    preferences: {
      language: "es",
      currency: "COP",
      timezone: "America/Bogota",
      theme: "light",
    },
    interests: ["electronics", "clothing", "books"],
  },
  role: "customer",
  status: "active",
  addresses: [
    {
      id: "addr-1",
      type: "home",
      fullName: "Usuario Demo",
      phone: "+57 300 123 4567",
      address1: "Calle 123 #45-67",
      city: "Bogotá",
      state: "Cundinamarca",
      zipCode: "110111",
      country: "Colombia",
      isDefault: true,
      verified: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  paymentMethods: [],
  privacy: {
    shareProfile: false,
    shareOrders: false,
    allowMarketing: true,
    allowNotifications: true,
    shareReviews: true,
    shareWishlist: false,
  },
  notifications: {
    email: {
      orderUpdates: true,
      promotions: true,
      newProducts: false,
      priceDrops: true,
      newsletter: false,
    },
    push: {
      orderUpdates: true,
      abandonedCart: true,
      backInStock: false,
      promotions: false,
    },
    sms: {
      orderUpdates: true,
      security: true,
      delivery: true,
    },
  },
  stats: {
    totalOrders: 12,
    totalSpent: 850000,
    averageOrderValue: 70833,
    favoriteCategory: "electronics",
    joinDate: "2023-06-15T00:00:00Z",
    lastOrderDate: "2024-01-15T00:00:00Z",
    loyaltyPoints: 425,
    reviewsCount: 8,
    wishlistCount: 15,
  },
  authMethods: ["email"],
  twoFactorEnabled: false,
  lastLogin: "2024-01-20T10:30:00Z",
  lastActivity: "2024-01-20T11:45:00Z",
  createdAt: "2023-06-15T00:00:00Z",
  updatedAt: "2024-01-20T11:45:00Z",
  agreedToTerms: true,
  agreedToPrivacy: true,
  marketingConsent: true,
};

// Proveedor del contexto
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);

  // Simular carga inicial del usuario
  useEffect(() => {
    const checkAuthStatus = () => {
      // En una app real, aquí verificarías el token de autenticación
      const savedAuth = localStorage.getItem("demo-tienda-auth");
      if (savedAuth) {
        try {
          const parsedAuth = JSON.parse(savedAuth);
          setAuth(parsedAuth);
        } catch (error) {
          console.error("Error parsing saved auth:", error);
          localStorage.removeItem("demo-tienda-auth");
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Guardar estado de autenticación
  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem("demo-tienda-auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("demo-tienda-auth");
    }
  }, [auth]);

  // Simular login
  const login = async (email: string, password: string): Promise<void> => {
    setAuth((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validación básica (en una app real usarías un servicio de auth)
      if (email === "usuario@demo.com" && password === "demo123") {
        setAuth({
          isAuthenticated: true,
          user: demoUser,
          loading: false,
          error: null,
        });
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Error de autenticación",
      }));
      throw error;
    }
  };

  // Simular logout
  const logout = async (): Promise<void> => {
    setAuth((prev) => ({ ...prev, loading: true }));

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAuth(initialAuthState);
    } catch (error) {
      console.error("Error during logout:", error);
      // Forzar logout incluso si hay error
      setAuth(initialAuthState);
    }
  };

  // Simular registro
  const register = async (
    email: string,
    _password: string, // Prefijo con underscore para indicar que no se usa
    firstName: string,
    lastName: string
  ): Promise<void> => {
    setAuth((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // En una app real, aquí harías la llamada de registro
      // El password se enviaría al servidor para crear la cuenta
      const newUser: User = {
        ...demoUser,
        id: `user-${Date.now()}`,
        email,
        profile: {
          ...demoUser.profile,
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`,
        },
        stats: {
          ...demoUser.stats,
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          reviewsCount: 0,
          wishlistCount: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAuth({
        isAuthenticated: true,
        user: newUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error de registro",
      }));
      throw error;
    }
  };

  // Utilidades
  const isAuthenticated = (): boolean => {
    return auth.isAuthenticated;
  };

  const getCurrentUser = (): User | null => {
    return auth.user;
  };

  const checkPermission = (permission: string): boolean => {
    // En una app real, aquí verificarías los permisos del usuario
    if (!auth.isAuthenticated || !auth.user) return false;

    // Permisos básicos por rol
    switch (auth.user.role) {
      case "admin":
        return true; // Los admins tienen todos los permisos
      case "customer": {
        // Los clientes tienen permisos básicos
        const customerPermissions = [
          "view_products",
          "add_to_cart",
          "create_order",
          "view_profile",
          "edit_profile",
        ];
        return customerPermissions.includes(permission);
      }
      default:
        return false;
    }
  };

  const value: UserContextValue = {
    auth,
    login,
    logout,
    register,
    isAuthenticated,
    getCurrentUser,
    checkPermission,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;

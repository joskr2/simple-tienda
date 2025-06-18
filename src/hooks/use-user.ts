/**
 * Hooks del Usuario
 *
 * Proporciona hooks personalizados para interactuar con el contexto del usuario,
 * incluyendo autenticación y manejo de permisos.
 */

import { useContext } from "react";
import { UserContext } from "../contexts/user-context-types";

// Hook para usar el contexto del usuario
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

// Hook para verificar autenticación
export function useAuth() {
  const { auth } = useUser();
  return auth;
}

// Hook para verificar permisos
export function usePermissions() {
  const { checkPermission, getCurrentUser } = useUser();

  const hasPermission = (permission: string): boolean => {
    return checkPermission(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => checkPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => checkPermission(permission));
  };

  const isAdmin = (): boolean => {
    const user = getCurrentUser();
    return user?.role === "admin";
  };

  const isCustomer = (): boolean => {
    const user = getCurrentUser();
    return user?.role === "customer";
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isCustomer,
  };
}

// Hook para gestión de perfil
export function useProfile() {
  const { auth, getCurrentUser } = useUser();

  const user = getCurrentUser();
  const isLoading = auth.loading;
  const error = auth.error;

  const getDisplayName = (): string => {
    if (!user) return "Usuario";
    return (
      user.profile.displayName ||
      `${user.profile.firstName} ${user.profile.lastName}`
    );
  };

  const getInitials = (): string => {
    if (!user) return "U";
    const firstName = user.profile.firstName?.[0] || "";
    const lastName = user.profile.lastName?.[0] || "";
    return `${firstName}${lastName}`.toUpperCase() || "U";
  };

  const getAvatarUrl = (): string | null => {
    return user?.profile.avatar || null;
  };

  return {
    user,
    isLoading,
    error,
    getDisplayName,
    getInitials,
    getAvatarUrl,
  };
}

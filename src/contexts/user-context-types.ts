/**
 * Contexto y tipos del Usuario
 *
 * Este archivo contiene solo el contexto y las interfaces,
 * separado de los componentes para mantener compatibilidad con React Fast Refresh.
 */

import { createContext } from "react";
import type { User } from "../types/user";

// Estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Interface del contexto de usuario
export interface UserContextValue {
  // Estado
  auth: AuthState;

  // Acciones de autenticación
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;

  // Utilidades
  isAuthenticated: () => boolean;
  getCurrentUser: () => User | null;
  checkPermission: (permission: string) => boolean;
}

// Crear contexto
export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

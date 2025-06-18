/**
 * Contexto de autenticación
 * Maneja el estado global de autenticación de la aplicación
 */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ResetPasswordData,
  User,
} from "../types/auth";
import { authService, AuthError } from "../services/auth.service";

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Tipos de acciones
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: User };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
}

// Crear contexto
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Hook para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Utilidades para el localStorage
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) =>
    localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),

  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// Provider del contexto
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = storage.getToken();
      const savedUser = storage.getUser();

      if (token && savedUser) {
        try {
          // Verificar si el token sigue siendo válido
          const user = await authService.getCurrentUser(token);
          dispatch({ type: "AUTH_SUCCESS", payload: user });
        } catch (error) {
          // Token inválido, intentar refrescar
          const refreshToken = storage.getRefreshToken();
          if (refreshToken) {
            try {
              const response = await authService.refreshToken(refreshToken);
              storage.setToken(response.token);
              storage.setRefreshToken(response.refreshToken);
              storage.setUser(response.user);
              dispatch({ type: "AUTH_SUCCESS", payload: response.user });
            } catch (refreshError) {
              // Refresh token también inválido, cerrar sesión
              storage.clear();
              dispatch({ type: "AUTH_LOGOUT" });
            }
          } else {
            storage.clear();
            dispatch({ type: "AUTH_LOGOUT" });
          }
        }
      } else {
        dispatch({ type: "AUTH_LOGOUT" });
      }
    };

    initializeAuth();
  }, []);

  // Funciones del contexto
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await authService.login(credentials);

      // Guardar en localStorage
      storage.setToken(response.token);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);

      dispatch({ type: "AUTH_SUCCESS", payload: response.user });
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : "Error al iniciar sesión";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await authService.register(data);

      // Guardar en localStorage
      storage.setToken(response.token);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);

      dispatch({ type: "AUTH_SUCCESS", payload: response.user });
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : "Error al registrarse";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    storage.clear();
    dispatch({ type: "AUTH_LOGOUT" });
  };

  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    if (!state.user) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      const updatedUser = await authService.updateProfile(state.user.id, data);
      storage.setUser(updatedUser);
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : "Error al actualizar perfil";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw error;
    }
  };

  const changePassword = async (data: ChangePasswordData): Promise<void> => {
    if (!state.user) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      await authService.changePassword(state.user.id, data);
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : "Error al cambiar contraseña";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    try {
      await authService.resetPassword(data);
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : "Error al solicitar reset de contraseña";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw error;
    }
  };

  const refreshToken = async (): Promise<void> => {
    const refreshTokenValue = storage.getRefreshToken();
    if (!refreshTokenValue) {
      throw new Error("No hay refresh token");
    }

    try {
      const response = await authService.refreshToken(refreshTokenValue);
      storage.setToken(response.token);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);
      dispatch({ type: "AUTH_SUCCESS", payload: response.user });
    } catch (error) {
      storage.clear();
      dispatch({ type: "AUTH_LOGOUT" });
      throw error;
    }
  };

  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Valor del contexto
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

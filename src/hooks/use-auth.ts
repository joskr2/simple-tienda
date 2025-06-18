/**
 * Hook personalizado para autenticación
 * Re-exporta la funcionalidad del contexto de auth para facilitar su uso
 */

// Re-exportar el hook directamente del contexto
export { useAuth } from "../contexts/auth-context";

// Re-exportar tipos útiles
export type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ResetPasswordData,
} from "../types/auth";

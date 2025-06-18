/**
 * Servicio de autenticación
 * Simula llamadas a API real con datos mock para desarrollo
 */

import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData,
} from "../types/auth";

// Simulación de base de datos en memoria
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@demotienda.com",
    name: "Administrador",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLoginAt: "2024-01-15T10:30:00Z",
    isEmailVerified: true,
    preferences: {
      theme: "system",
      language: "es",
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
    },
  },
  {
    id: "2",
    email: "usuario@example.com",
    name: "Usuario Demo",
    role: "user",
    createdAt: "2024-01-10T00:00:00Z",
    lastLoginAt: "2024-01-14T15:45:00Z",
    isEmailVerified: true,
    preferences: {
      theme: "light",
      language: "es",
      notifications: {
        email: true,
        push: false,
        marketing: true,
      },
    },
  },
];

// Simulación de contraseñas (en producción estarían hasheadas)
const MOCK_PASSWORDS: Record<string, string> = {
  "admin@demotienda.com": "admin123",
  "usuario@example.com": "usuario123",
};

// Utilidades para simular latencia de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Utilidades para generar tokens mock
const generateToken = (): string => {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateRefreshToken = (): string => {
  return `mock_refresh_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

// Utilidades para validación
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una mayúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una minúscula");
  }

  if (!/\d/.test(password)) {
    errors.push("La contraseña debe contener al menos un número");
  }

  return errors;
};

class AuthService {
  private baseURL = "/api/auth"; // En producción sería la URL real de la API

  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800); // Simular latencia de red

    const { email, password } = credentials;

    // Validar formato de email
    if (!validateEmail(email)) {
      throw new AuthError({
        code: "INVALID_EMAIL",
        message: "El formato del email no es válido",
        field: "email",
      });
    }

    // Buscar usuario
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      throw new AuthError({
        code: "USER_NOT_FOUND",
        message: "No existe una cuenta con este email",
        field: "email",
      });
    }

    // Verificar contraseña
    if (MOCK_PASSWORDS[email] !== password) {
      throw new AuthError({
        code: "INVALID_PASSWORD",
        message: "La contraseña es incorrecta",
        field: "password",
      });
    }

    // Actualizar último login
    user.lastLoginAt = new Date().toISOString();

    // Generar tokens
    const token = generateToken();
    const refreshToken = generateRefreshToken();
    const expiresIn = credentials.remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 días o 1 día

    return {
      user,
      token,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1000); // Simular latencia de red

    const { name, email, password, confirmPassword, terms } = data;

    // Validaciones
    if (!name.trim()) {
      throw new AuthError({
        code: "INVALID_NAME",
        message: "El nombre es requerido",
        field: "name",
      });
    }

    if (!validateEmail(email)) {
      throw new AuthError({
        code: "INVALID_EMAIL",
        message: "El formato del email no es válido",
        field: "email",
      });
    }

    // Verificar si el email ya existe
    if (MOCK_USERS.find((u) => u.email === email)) {
      throw new AuthError({
        code: "EMAIL_EXISTS",
        message: "Ya existe una cuenta con este email",
        field: "email",
      });
    }

    // Validar contraseña
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      throw new AuthError({
        code: "WEAK_PASSWORD",
        message: passwordErrors[0] || "Contraseña inválida",
        field: "password",
      });
    }

    // Verificar confirmación de contraseña
    if (password !== confirmPassword) {
      throw new AuthError({
        code: "PASSWORD_MISMATCH",
        message: "Las contraseñas no coinciden",
        field: "confirmPassword",
      });
    }

    // Verificar términos
    if (!terms) {
      throw new AuthError({
        code: "TERMS_NOT_ACCEPTED",
        message: "Debes aceptar los términos y condiciones",
        field: "terms",
      });
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: (MOCK_USERS.length + 1).toString(),
      email,
      name: name.trim(),
      role: "user",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isEmailVerified: false, // En producción se enviaría email de verificación
      preferences: {
        theme: "system",
        language: "es",
        notifications: {
          email: true,
          push: false,
          marketing: false,
        },
      },
    };

    // Agregar a la "base de datos"
    MOCK_USERS.push(newUser);
    MOCK_PASSWORDS[email] = password;

    // Generar tokens
    const token = generateToken();
    const refreshToken = generateRefreshToken();
    const expiresIn = 24 * 60 * 60; // 1 día

    return {
      user: newUser,
      token,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    await delay(300);
    // En producción se invalidaría el token en el servidor
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
    await delay(600);

    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) {
      throw new AuthError({
        code: "USER_NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    // Actualizar datos
    if (data.name) {
      user.name = data.name.trim();
    }

    if (data.email) {
      // Verificar que el nuevo email no esté en uso
      const emailExists = MOCK_USERS.some(
        (u) => u.id !== userId && u.email === data.email
      );
      if (emailExists) {
        throw new AuthError({
          code: "EMAIL_ALREADY_EXISTS",
          message: "Este email ya está en uso",
          field: "email",
        });
      }

      // Actualizar email en el usuario y en el registro de contraseñas
      const oldEmail = user.email;
      user.email = data.email;

      // Mover la contraseña al nuevo email
      if (MOCK_PASSWORDS[oldEmail]) {
        MOCK_PASSWORDS[data.email] = MOCK_PASSWORDS[oldEmail];
        delete MOCK_PASSWORDS[oldEmail];
      }
    }

    if (data.avatar) {
      user.avatar = data.avatar;
    }

    if (data.preferences) {
      user.preferences = { ...user.preferences, ...data.preferences };
    }

    return user;
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(
    userId: string,
    data: ChangePasswordData
  ): Promise<void> {
    await delay(700);

    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) {
      throw new AuthError({
        code: "USER_NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    // Verificar contraseña actual
    if (MOCK_PASSWORDS[user.email] !== data.currentPassword) {
      throw new AuthError({
        code: "INVALID_CURRENT_PASSWORD",
        message: "La contraseña actual es incorrecta",
        field: "currentPassword",
      });
    }

    // Validar nueva contraseña
    const passwordErrors = validatePassword(data.newPassword);
    if (passwordErrors.length > 0) {
      throw new AuthError({
        code: "WEAK_PASSWORD",
        message: passwordErrors[0] || "Contraseña inválida",
        field: "newPassword",
      });
    }

    // Verificar confirmación
    if (data.newPassword !== data.confirmPassword) {
      throw new AuthError({
        code: "PASSWORD_MISMATCH",
        message: "Las contraseñas no coinciden",
        field: "confirmPassword",
      });
    }

    // Actualizar contraseña
    MOCK_PASSWORDS[user.email] = data.newPassword;
  }

  /**
   * Solicitar reset de contraseña
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await delay(500);

    if (!validateEmail(data.email)) {
      throw new AuthError({
        code: "INVALID_EMAIL",
        message: "El formato del email no es válido",
        field: "email",
      });
    }

    const user = MOCK_USERS.find((u) => u.email === data.email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      console.log("Reset password email would be sent to:", data.email);
    }

    // En producción se enviaría un email con link de reset
    console.log("Password reset email sent (mock)");
  }

  /**
   * Refrescar token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    await delay(400);

    // En producción se verificaría el refresh token
    if (!refreshToken.startsWith("mock_refresh_")) {
      throw new AuthError({
        code: "INVALID_REFRESH_TOKEN",
        message: "Token de actualización inválido",
      });
    }

    // Generar nuevos tokens
    const token = generateToken();
    const newRefreshToken = generateRefreshToken();
    const expiresIn = 24 * 60 * 60; // 1 día

    // En este mock, devolvemos el primer usuario
    // En producción se obtendría del token
    const user = MOCK_USERS[0];
    if (!user) {
      throw new AuthError({
        code: "USER_NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    return {
      user,
      token,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  }

  /**
   * Obtener usuario actual por token
   */
  async getCurrentUser(token: string): Promise<User> {
    await delay(300);

    // En producción se verificaría y decodificaría el JWT
    if (!token.startsWith("mock_token_")) {
      throw new AuthError({
        code: "INVALID_TOKEN",
        message: "Token inválido",
      });
    }

    // En este mock, devolvemos el primer usuario
    // En producción se obtendría del token
    const user = MOCK_USERS[0];
    if (!user) {
      throw new AuthError({
        code: "USER_NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }
    return user;
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
// Definir y exportar AuthError
export class AuthError extends Error {
  public field?: string;
  public code: string;

  constructor(error: { code: string; message: string; field?: string }) {
    super(error.message);
    this.name = "AuthError";
    this.code = error.code;
    this.field = error.field;
  }
}

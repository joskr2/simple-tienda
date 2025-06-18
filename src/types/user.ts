/**
 * Tipos de datos para usuarios y autenticación
 * 
 * Este archivo define todas las interfaces y tipos relacionados con usuarios,
 * autenticación, perfiles y preferencias.
 */

// Roles de usuario en el sistema
export type UserRole = 'customer' | 'admin' | 'moderator' | 'vendor';

// Estado del usuario
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';

// Métodos de autenticación soportados
export type AuthMethod = 'email' | 'google' | 'facebook' | 'apple' | 'phone';

// Preferencias de privacidad
export interface PrivacySettings {
  shareProfile: boolean;       // Compartir perfil público
  shareOrders: boolean;        // Compartir historial de compras
  allowMarketing: boolean;     // Permitir emails de marketing
  allowNotifications: boolean; // Permitir notificaciones push
  shareReviews: boolean;       // Mostrar reseñas públicamente
  shareWishlist: boolean;      // Compartir lista de deseos
}

// Preferencias de notificaciones
export interface NotificationPreferences {
  email: {
    orderUpdates: boolean;     // Actualizaciones de pedidos
    promotions: boolean;       // Promociones y ofertas
    newProducts: boolean;      // Nuevos productos
    priceDrops: boolean;       // Bajadas de precio
    newsletter: boolean;       // Newsletter general
  };
  push: {
    orderUpdates: boolean;
    abandonedCart: boolean;    // Carrito abandonado
    backInStock: boolean;      // Producto de nuevo en stock
    promotions: boolean;
  };
  sms: {
    orderUpdates: boolean;
    security: boolean;         // Alertas de seguridad
    delivery: boolean;         // Notificaciones de entrega
  };
}

// Dirección del usuario
export interface UserAddress {
  id: string;                  // ID único de la dirección
  type: 'home' | 'work' | 'other'; // Tipo de dirección
  label?: string;              // Etiqueta personalizada
  fullName: string;            // Nombre completo del destinatario
  email?: string;              // Email de contacto
  phone: string;               // Teléfono de contacto
  address1: string;            // Dirección principal
  address2?: string;           // Apartamento, oficina, etc.
  city: string;                // Ciudad
  state: string;               // Departamento/Estado
  zipCode: string;             // Código postal
  country: string;             // País
  instructions?: string;       // Instrucciones de entrega
  isDefault: boolean;          // Si es la dirección por defecto
  verified: boolean;           // Si la dirección está verificada
  createdAt: string;           // Fecha de creación (ISO string)
  updatedAt: string;           // Última actualización (ISO string)
}

// Método de pago del usuario
export interface PaymentMethod {
  id: string;                  // ID único del método
  type: 'card' | 'bank' | 'digital'; // Tipo de método
  provider: string;            // Proveedor (Visa, MasterCard, PSE, etc.)
  label: string;               // Etiqueta visible (ej. "**** 1234")
  details: {                   // Detalles específicos del método
    lastFour?: string;         // Últimos 4 dígitos (tarjetas)
    expiryMonth?: number;      // Mes de expiración
    expiryYear?: number;       // Año de expiración
    cardType?: string;         // Tipo de tarjeta
    bankName?: string;         // Nombre del banco
    accountType?: string;      // Tipo de cuenta
  };
  isDefault: boolean;          // Si es el método por defecto
  verified: boolean;           // Si está verificado
  active: boolean;             // Si está activo
  createdAt: string;           // Fecha de creación (ISO string)
  lastUsed?: string;           // Última vez usado (ISO string)
}

// Información del perfil del usuario
export interface UserProfile {
  firstName: string;           // Nombre
  lastName: string;            // Apellido
  displayName?: string;        // Nombre de visualización
  avatar?: string;             // URL del avatar
  bio?: string;                // Biografía corta
  dateOfBirth?: string;        // Fecha de nacimiento (ISO string)
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phoneNumber?: string;        // Número de teléfono
  website?: string;            // Sitio web personal
  socialMedia?: {              // Redes sociales
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  preferences: {               // Preferencias generales
    language: string;          // Idioma preferido
    currency: string;          // Moneda preferida
    timezone: string;          // Zona horaria
    theme: 'light' | 'dark' | 'auto'; // Tema de la interfaz
  };
  interests?: string[];        // Intereses/categorías favoritas
  size?: {                     // Tallas del usuario
    clothing?: string;
    shoes?: string;
    measurements?: Record<string, string>;
  };
}

// Estadísticas del usuario
export interface UserStats {
  totalOrders: number;         // Total de pedidos realizados
  totalSpent: number;          // Total gastado en la plataforma
  averageOrderValue: number;   // Valor promedio de pedidos
  favoriteCategory: string;    // Categoría favorita
  joinDate: string;            // Fecha de registro (ISO string)
  lastOrderDate?: string;      // Fecha del último pedido
  loyaltyPoints: number;       // Puntos de lealtad
  reviewsCount: number;        // Número de reseñas escritas
  wishlistCount: number;       // Items en lista de deseos
}

// Usuario principal
export interface User {
  id: string;                  // ID único del usuario
  email: string;               // Email principal
  emailVerified: boolean;      // Si el email está verificado
  profile: UserProfile;        // Información del perfil
  role: UserRole;              // Rol en el sistema
  status: UserStatus;          // Estado de la cuenta
  addresses: UserAddress[];    // Direcciones guardadas
  paymentMethods: PaymentMethod[]; // Métodos de pago
  privacy: PrivacySettings;    // Configuración de privacidad
  notifications: NotificationPreferences; // Preferencias de notificaciones
  stats: UserStats;            // Estadísticas del usuario
  authMethods: AuthMethod[];   // Métodos de autenticación habilitados
  twoFactorEnabled: boolean;   // Si tiene 2FA habilitado
  lastLogin?: string;          // Último login (ISO string)
  lastActivity?: string;       // Última actividad (ISO string)
  createdAt: string;           // Fecha de registro (ISO string)
  updatedAt: string;           // Última actualización (ISO string)
  agreedToTerms: boolean;      // Si aceptó términos y condiciones
  agreedToPrivacy: boolean;    // Si aceptó política de privacidad
  marketingConsent: boolean;   // Si consintió marketing
  sessionId?: string;          // ID de sesión actual
  deviceInfo?: {               // Información del dispositivo
    userAgent: string;
    platform: string;
    lastIpAddress: string;
  };
}

// Estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;    // Si el usuario está autenticado
  user: User | null;           // Datos del usuario actual
  loading: boolean;            // Si está cargando
  error: string | null;        // Error de autenticación
  sessionExpiry?: string;      // Expiración de la sesión (ISO string)
  refreshToken?: string;       // Token de refresco
  accessToken?: string;        // Token de acceso
}

// Credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
}

// Datos de registro
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  marketingConsent?: boolean;
  referralCode?: string;
}

// Datos para restablecer contraseña
export interface PasswordResetData {
  email: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Acciones de autenticación
export enum AuthActionType {
  LOGIN_START = 'LOGIN_START',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  REGISTER_START = 'REGISTER_START',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  ENABLE_2FA = 'ENABLE_2FA',
  DISABLE_2FA = 'DISABLE_2FA'
}

// Acciones del contexto de autenticación
export type AuthAction = 
  | { type: AuthActionType.LOGIN_START }
  | { type: AuthActionType.LOGIN_SUCCESS; payload: { user: User; tokens: { access: string; refresh: string } } }
  | { type: AuthActionType.LOGIN_FAILURE; payload: { error: string } }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.REGISTER_START }
  | { type: AuthActionType.REGISTER_SUCCESS; payload: { user: User } }
  | { type: AuthActionType.REGISTER_FAILURE; payload: { error: string } }
  | { type: AuthActionType.UPDATE_PROFILE; payload: { user: User } }
  | { type: AuthActionType.REFRESH_TOKEN; payload: { tokens: { access: string; refresh: string } } };

// Contexto de autenticación
export interface AuthContextValue {
  // Estado
  auth: AuthState;
  
  // Funciones de autenticación
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  
  // Gestión de perfil
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  
  // Direcciones
  addAddress: (address: Omit<UserAddress, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAddress: (id: string, updates: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  
  // Métodos de pago
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => Promise<void>;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  
  // Configuración
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  
  // Verificación y seguridad
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (data: PasswordResetData) => Promise<void>;
  enable2FA: () => Promise<{ qrCode: string; backupCodes: string[] }>;
  disable2FA: (code: string) => Promise<void>;
  
  // Utilidades
  checkPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isVendor: () => boolean;
  canManageProducts: () => boolean;
  canManageUsers: () => boolean;
}

// Permisos del sistema
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

// Token JWT decodificado
export interface DecodedToken {
  sub: string;                 // Subject (user ID)
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;                 // Issued at
  exp: number;                 // Expires at
  iss: string;                 // Issuer
}
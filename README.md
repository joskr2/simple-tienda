# 🛒 Demo Tienda - E-commerce React + TypeScript

Una aplicación de comercio electrónico moderna construida con React, TypeScript, Vite y TailwindCSS. Incluye sistema de autenticación completo, carrito de compras, filtros avanzados y UI/UX moderna.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Guía de Implementación Paso a Paso](#-guía-de-implementación-paso-a-paso)
- [Estructura de Archivos](#-estructura-de-archivos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Patrones de Diseño](#-patrones-de-diseño)
- [Contribución](#-contribución)

## ✨ Características

### 🔐 Sistema de Autenticación

- Registro e inicio de sesión con validación
- Gestión de tokens JWT con refresh automático
- Persistencia de sesión en localStorage
- Protección de rutas y componentes

### 🛍️ E-commerce

- Catálogo de productos con filtros avanzados
- Carrito de compras persistente
- Búsqueda en tiempo real
- Categorización de productos
- Vista detalle de productos

### 🎨 UI/UX Moderna

- Diseño responsive con TailwindCSS
- Componentes reutilizables con shadcn/ui
- Animaciones fluidas con Framer Motion
- Tema claro/oscuro
- Loading states y error handling

### 🏗️ Arquitectura Robusta

- TypeScript para type safety
- Context API para gestión de estado
- Custom hooks para lógica reutilizable
- Separación clara de responsabilidades

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, shadcn/ui
- **Routing**: React Router v6
- **State Management**: Context API, useReducer
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint
- **Package Manager**: npm

## 🏛️ Arquitectura del Proyecto

### Principios de Diseño

1. **Separación de Responsabilidades**: Cada archivo tiene una responsabilidad específica
2. **Composición sobre Herencia**: Uso de composición de componentes
3. **Inversión de Dependencias**: Contexts y providers para inyección de dependencias
4. **Single Source of Truth**: Estado centralizado en contexts
5. **Principio DRY**: Reutilización de componentes y lógica

### Patrones Implementados

- **Provider Pattern**: Para contexts globales
- **Custom Hooks Pattern**: Para lógica reutilizable
- **Compound Components**: Para componentes complejos
- **Render Props**: Para componentes flexibles
- **Error Boundaries**: Para manejo de errores

## 📚 Guía de Implementación Paso a Paso

### Fase 1: Configuración Base (Archivos de Configuración)

#### 1. `package.json` - Dependencias del Proyecto


```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^6.28.0",
    "typescript": "~5.6.2",
    "tailwindcss": "^3.4.15",
    "@tanstack/react-query": "^5.59.16",
    "framer-motion": "^11.11.17"
  }
}
```

#### 2. `vite.config.ts` - Configuración del Build Tool

**Propósito**: Configura Vite para el desarrollo y build
**Relación**: Se conecta con `package.json` para los scripts

#### 3. `tailwind.config.js` - Configuración de Estilos

**Propósito**: Configura TailwindCSS y tema personalizado
**Relación**: Utilizado por todos los componentes para estilos

#### 4. `tsconfig.json` - Configuración TypeScript

**Propósito**: Configura TypeScript para type checking
**Relación**: Afecta a todos los archivos `.ts` y `.tsx`

### Fase 2: Tipos y Interfaces (Fundación TypeScript)

#### 5. `src/types/` - Definiciones de Tipos

**Orden de creación**:

1. **`src/types/user.ts`** - Tipos base de usuario

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}
```

2. **`src/types/auth.ts`** - Tipos de autenticación

```typescript
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

3. **`src/types/product.ts`** - Tipos de productos

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  description: string;
  stock: number;
  rating: number;
  tags: string[];
}
```

4. **`src/types/cart.ts`** - Tipos del carrito

```typescript
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
```

**Por qué primero**: Los tipos son la base de todo el sistema TypeScript y se necesitan en todos los demás archivos.

### Fase 3: Servicios y Lógica de Negocio

#### 6. `src/services/auth.service.ts` - Servicio de Autenticación

**Propósito**: Maneja todas las operaciones de autenticación
**Dependencias**: Tipos de `auth.ts` y `user.ts`
**Relación**: Utilizado por el AuthContext

```typescript
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulación de API call
    return {
      user: mockUser,
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
    };
  }
}
```

**Por qué aquí**: Los servicios encapsulan la lógica de negocio antes de crear los contexts.

### Fase 4: Contexts (Estado Global)

#### 7. `src/contexts/` - Gestión de Estado Global

**Orden de creación**:

1. **`src/contexts/theme-context.tsx`** - Tema de la aplicación

```typescript
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
```

2. **`src/contexts/auth-context.tsx`** - Autenticación

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}
```

3. **`src/contexts/user-context.tsx`** - Datos del usuario
4. **`src/contexts/cart-context.tsx`** - Carrito de compras

**Relaciones**:

- AuthContext usa `auth.service.ts`
- CartContext usa tipos de `cart.ts`
- UserContext depende de AuthContext

**Por qué este orden**:

- Theme es independiente (primero)
- Auth es base para User (segundo)
- Cart depende de User autenticado (último)

### Fase 5: Custom Hooks (Lógica Reutilizable)

#### 8. `src/hooks/` - Hooks Personalizados

**Orden de creación**:

1. **`src/hooks/use-auth.ts`** - Hook de autenticación

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

2. **`src/hooks/use-cart.ts`** - Hook del carrito
3. **`src/hooks/use-products.ts`** - Hook de productos
4. **`src/hooks/use-categories.ts`** - Hook de categorías

**Relaciones**: Cada hook corresponde a un context específico
**Por qué aquí**: Los hooks simplifican el uso de contexts en componentes

### Fase 6: Componentes UI Base (Sistema de Diseño)

#### 9. `src/components/ui/` - Componentes Base

**Orden de creación**:

1. **`src/lib/utils.ts`** - Utilidades (cn function)

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

2. **`src/components/ui/button.tsx`** - Componente Button
3. **`src/components/ui/input.tsx`** - Componente Input
4. **`src/components/ui/card.tsx`** - Componente Card
5. **`src/components/ui/badge.tsx`** - Componente Badge

**Por qué primero**: Son la base de todos los demás componentes

### Fase 7: Componentes de Layout (Estructura)

#### 10. `src/components/layout/` - Componentes de Layout

**Orden de creación**:

1. **`src/components/layout/layout.tsx`** - Layout principal

```typescript
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <CartProvider>{/* Estructura de la app */}</CartProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
```

2. **`src/components/layout/header.tsx`** - Header
3. **`src/components/layout/footer.tsx`** - Footer
4. **`src/components/layout/PageWrappers.tsx`** - Wrappers de páginas

**Relaciones**:

- Layout envuelve toda la aplicación con providers
- Header usa AuthContext y CartContext
- PageWrappers conectan con React Router

### Fase 8: Componentes de Funcionalidad

#### 11. `src/components/auth/` - Componentes de Autenticación

**Orden de creación**:

1. **`src/components/auth/LoginForm.tsx`** - Formulario de login
2. **`src/components/auth/RegisterForm.tsx`** - Formulario de registro
3. **`src/components/auth/AuthModal.tsx`** - Modal de autenticación
4. **`src/components/auth/UserMenu.tsx`** - Menú de usuario

**Dependencias**:

- Usan `useAuth` hook
- Utilizan componentes UI base
- Implementan validación de formularios

#### 12. `src/components/product/` - Componentes de Productos

**Orden de creación**:

1. **`src/components/product/ProductCard.tsx`** - Tarjeta de producto
2. **`src/components/product/ProductGrid.tsx`** - Grid de productos
3. **`src/components/product/CategoriesSection.tsx`** - Sección de categorías

#### 13. `src/components/cart/` - Componentes del Carrito

**Orden de creación**:

1. **`src/components/cart/CartDrawer.tsx`** - Drawer del carrito

**Dependencias**: Usa `useCart` hook y componentes UI

#### 14. `src/components/common/` - Componentes Comunes

1. **`src/components/common/HeroSection.tsx`** - Sección hero

### Fase 9: Páginas (Vistas Principales)

#### 15. `src/page/` - Páginas de la Aplicación

**Orden de creación**:

1. **`src/page/HomePage.tsx`** - Página de inicio
2. **`src/page/ProductsPage.tsx`** - Página de productos
3. **`src/page/ProductDetailPage.tsx`** - Detalle de producto
4. **`src/page/ProfilePage.tsx`** - Perfil de usuario

**Dependencias**: Cada página usa múltiples componentes y hooks

### Fase 10: Configuración de Routing

#### 16. `src/main.tsx` - Punto de Entrada

**Propósito**: Configura React Router y renderiza la aplicación
**Relaciones**: Conecta todas las páginas con rutas

```typescript
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePageWrapper /> },
      { path: "productos", element: <ProductsPageWrapper /> },
      { path: "producto/:id", element: <ProductPageWrapper /> },
    ],
  },
]);
```

### Fase 11: Datos y Configuración

#### 17. `src/data/products.json` - Datos de Productos

**Propósito**: Datos mock para desarrollo
**Relación**: Utilizado por hooks de productos

#### 18. `src/index.css` - Estilos Globales

**Propósito**: Estilos base de TailwindCSS y personalizaciones

## 📁 Estructura de Archivos Detallada

```
demo-tienda/
├── 📄 package.json                 # Dependencias y scripts
├── 📄 vite.config.ts              # Configuración Vite
├── 📄 tailwind.config.js          # Configuración TailwindCSS
├── 📄 tsconfig.json               # Configuración TypeScript
├── 📄 components.json             # Configuración shadcn/ui
├── 📄 eslint.config.js            # Configuración ESLint
├── 📄 index.html                  # HTML base
├── 📄 README.md                   # Documentación del proyecto
│
├── 📁 public/                     # Archivos estáticos
│   └── 📄 vite.svg
│
└── 📁 src/                        # Código fuente
    ├── 📄 main.tsx                # Punto de entrada + Router
    ├── 📄 App.tsx                 # Componente App legacy
    ├── 📄 index.css               # Estilos globales
    ├── 📄 vite-env.d.ts          # Tipos de Vite
    │
    ├── 📁 types/                  # Definiciones TypeScript
    │   ├── 📄 auth.ts             # Tipos de autenticación
    │   ├── 📄 user.ts             # Tipos de usuario
    │   ├── 📄 product.ts          # Tipos de productos
    │   └── 📄 cart.ts             # Tipos del carrito
    │
    ├── 📁 services/               # Lógica de negocio
    │   └── 📄 auth.service.ts     # Servicio de autenticación
    │
    ├── 📁 contexts/               # Estado global
    │   ├── 📄 theme-context.tsx   # Context del tema
    │   ├── 📄 auth-context.tsx    # Context de autenticación
    │   ├── 📄 user-context.tsx    # Context del usuario
    │   ├── 📄 user-context-types.ts # Tipos del user context
    │   ├── 📄 cart-context.tsx    # Context del carrito
    │   └── 📄 cart-context-types.ts # Tipos del cart context
    │
    ├── 📁 hooks/                  # Custom hooks
    │   ├── 📄 index.ts            # Barrel export
    │   ├── 📄 use-auth.ts         # Hook de autenticación
    │   ├── 📄 use-user.ts         # Hook de usuario
    │   ├── 📄 use-cart.ts         # Hook del carrito
    │   ├── 📄 use-products.ts     # Hook de productos
    │   └── 📄 use-categories.ts   # Hook de categorías
    │
    ├── 📁 lib/                    # Utilidades
    │   └── 📄 utils.ts            # Funciones utilitarias (cn)
    │
    ├── 📁 components/             # Componentes React
    │   ├── 📁 ui/                 # Sistema de diseño base
    │   │   ├── 📄 button.tsx      # Componente Button
    │   │   ├── 📄 input.tsx       # Componente Input
    │   │   ├── 📄 card.tsx        # Componente Card
    │   │   ├── 📄 badge.tsx       # Componente Badge
    │   │   ├── 📄 label.tsx       # Componente Label
    │   │   ├── 📄 form.tsx        # Componente Form
    │   │   ├── 📄 carousel.tsx    # Componente Carousel
    │   │   ├── 📄 loading.tsx     # Componente Loading
    │   │   ├── 📄 loading.css     # Estilos del loading
    │   │   └── 📄 loading-variants.ts # Variantes del loading
    │   │
    │   ├── 📁 layout/             # Componentes de layout
    │   │   ├── 📄 layout.tsx      # Layout principal + Providers
    │   │   ├── 📄 header.tsx      # Header con navegación
    │   │   ├── 📄 footer.tsx      # Footer
    │   │   └── 📄 PageWrappers.tsx # Wrappers para React Router
    │   │
    │   ├── 📁 auth/               # Autenticación
    │   │   ├── 📄 AuthModal.tsx   # Modal de auth
    │   │   ├── 📄 LoginForm.tsx   # Formulario de login
    │   │   ├── 📄 RegisterForm.tsx # Formulario de registro
    │   │   └── 📄 UserMenu.tsx    # Menú de usuario
    │   │
    │   ├── 📁 product/            # Productos
    │   │   ├── 📄 ProductCard.tsx # Tarjeta de producto
    │   │   ├── 📄 ProductGrid.tsx # Grid con filtros
    │   │   └── 📄 CategoriesSection.tsx # Sección de categorías
    │   │
    │   ├── 📁 cart/               # Carrito de compras
    │   │   └── 📄 CartDrawer.tsx  # Drawer del carrito
    │   │
    │   ├── 📁 common/             # Componentes comunes
    │   │   └── 📄 HeroSection.tsx # Sección hero
    │   │
    │   └── 📁 custom/             # Componentes personalizados
    │       ├── 📄 hero.tsx        # Hero personalizado
    │       ├── 📄 product-grid.tsx # Grid personalizado
    │       └── 📄 search.tsx      # Búsqueda personalizada
    │
    ├── 📁 page/                   # Páginas principales
    │   ├── 📄 HomePage.tsx        # Página de inicio
    │   ├── 📄 ProductsPage.tsx    # Página de productos
    │   ├── 📄 ProductDetailPage.tsx # Detalle del producto
    │   └── 📄 ProfilePage.tsx     # Perfil de usuario
    │
    ├── 📁 data/                   # Datos mock
    │   └── 📄 products.json       # Productos de ejemplo
    │
    └── 📁 assets/                 # Assets estáticos
        └── 📄 react.svg
```

## 🔗 Relaciones Entre Archivos

### Flujo de Dependencias

```
main.tsx (Entry Point)
    ↓
Layout.tsx (Providers Stack)
    ↓
Header/Footer (Navigation)
    ↓
Pages (Views)
    ↓
Components (UI Elements)
    ↓
Hooks (Logic)
    ↓
Contexts (State)
    ↓
Services (Business Logic)
    ↓
Types (TypeScript Definitions)
```

### Jerarquía de Providers

```typescript
// Layout.tsx - Jerarquía de contexts
<QueryClientProvider>
  {" "}
  // React Query
  <ThemeProvider>
    {" "}
    // Tema claro/oscuro
    <AuthProvider>
      {" "}
      // Autenticación ← CRÍTICO
      <UserProvider>
        {" "}
        // Datos del usuario
        <CartProvider>
          {" "}
          // Carrito de compras
          <App />
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>
```

### Dependencias de Componentes

1. **Header** depende de:

   - `useAuth` (autenticación)
   - `useCart` (carrito)
   - Componentes UI (Button, etc.)

2. **ProductGrid** depende de:

   - `useProducts` (datos)
   - `useCategories` (filtros)
   - ProductCard component

3. **AuthModal** depende de:
   - `useAuth` (autenticación)
   - LoginForm/RegisterForm
   - Componentes UI

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd demo-tienda
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno** (opcional)

```bash
cp .env.example .env
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

5. **Abrir en el navegador**

```
http://localhost:5174
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Vista previa del build

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de ESLint automáticamente

# Utilidades
npm run type-check   # Verifica tipos de TypeScript
```

## 🎯 Patrones de Diseño Implementados

### 1. Provider Pattern

**Archivos**: `src/contexts/*.tsx`
**Propósito**: Gestión de estado global

```typescript
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
```

### 2. Custom Hooks Pattern

**Archivos**: `src/hooks/*.ts`
**Propósito**: Lógica reutilizable

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

### 3. Compound Components

**Archivos**: `src/components/ui/*.tsx`
**Propósito**: Componentes flexibles

```typescript
const Card = ({ children, ...props }) => (
  <div className="card" {...props}>
    {children}
  </div>
);
Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;
```

### 4. Error Boundaries

**Archivos**: Layout y componentes principales
**Propósito**: Manejo de errores

```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
}
```

## 🔍 Decisiones de Arquitectura

### ¿Por qué Context API en lugar de Redux?

- **Simplicidad**: Para este proyecto, Context API es suficiente
- **Menos boilerplate**: Menos código para mantener
- **TypeScript integration**: Mejor integración nativa con TS

### ¿Por qué Custom Hooks?

- **Reutilización**: Lógica compartida entre componentes
- **Separación de responsabilidades**: UI separada de lógica
- **Testing**: Más fácil de testear la lógica por separado

### ¿Por qué TailwindCSS?

- **Utility-first**: Desarrollo más rápido
- **Consistencia**: Sistema de diseño coherente
- **Performance**: CSS optimizado en producción

### ¿Por qué Vite?

- **Velocidad**: Hot reload instantáneo
- **Modern**: Soporte nativo para ES modules
- **TypeScript**: Soporte de primera clase para TS

## 🧪 Testing (Futuro)

### Estructura de Testing Recomendada

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── contexts/
│   └── services/
├── __mocks__/
└── test-utils.tsx
```

### Herramientas Recomendadas

- **Vitest**: Testing framework
- **Testing Library**: Testing de componentes
- **MSW**: Mocking de APIs

## 🚀 Deployment

### Build para Producción

```bash
npm run build
```

### Opciones de Deploy

- **Vercel**: Deploy automático desde Git
- **Netlify**: Deploy con CI/CD
- **GitHub Pages**: Para proyectos estáticos

## 🤝 Contribución

### Flujo de Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código

- **TypeScript**: Tipado estricto
- **ESLint**: Seguir las reglas configuradas
- **Prettier**: Formateo consistente
- **Conventional Commits**: Mensajes de commit descriptivos

## 📝 Credenciales de Demo

Para probar la autenticación:

- **Email**: `demo@tienda.com`
- **Password**: `demo123`

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ usando React + TypeScript + TailwindCSS**

# 🛒 Demo Tienda - E-commerce React + TypeScript

Una aplicación de e-commerce moderna construida con React, TypeScript, TailwindCSS y Context API para gestión de estado.

## 🚀 Características

- ✅ **Autenticación completa** - Login, registro y gestión de usuarios
- 🛍️ **Carrito de compras** - Agregar, eliminar y gestionar productos
- 📱 **Diseño responsive** - Optimizado para móviles y desktop
- 🎨 **Tema personalizable** - Modo claro y oscuro
- 🔍 **Búsqueda y filtros** - Encuentra productos fácilmente
- 📦 **Gestión de categorías** - Organización por categorías
- 💾 **Persistencia local** - Datos guardados en localStorage
- 🎯 **TypeScript** - Tipado estricto para mejor desarrollo

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework CSS utilitario
- **Context API** - Gestión de estado global
- **React Router** - Navegación SPA
- **Lucide React** - Iconografía

## 📦 Instalación

```bash
# Clonar repositorio
git clone [url-del-repo]
cd demo-tienda

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── cart/           # Componentes del carrito
│   ├── common/         # Componentes comunes
│   ├── custom/         # Componentes específicos
│   ├── layout/         # Componentes de layout
│   ├── product/        # Componentes de productos
│   └── ui/             # Sistema de diseño base
├── contexts/           # Context providers
├── hooks/              # Custom hooks
├── services/           # Servicios y APIs
├── types/              # Definiciones TypeScript
├── data/               # Datos estáticos
├── lib/                # Utilidades
└── page/               # Páginas principales
```

## 🔧 Guía de Implementación

### Fase 1: Configuración Base

Los archivos de configuración fueron creados primero para establecer el entorno:

1. **package.json** - Dependencias y scripts
2. **vite.config.ts** - Configuración de Vite
3. **tsconfig.json** - Configuración TypeScript
4. **tailwind.config.js** - Configuración TailwindCSS

### Fase 2: Definición de Tipos

Se crearon los tipos TypeScript para establecer contratos de datos:

- `types/user.ts` - Tipos de usuario y autenticación
- `types/auth.ts` - Estados de autenticación
- `types/product.ts` - Estructura de productos
- `types/cart.ts` - Gestión del carrito

### Fase 3: Servicios

Implementación de la lógica de negocio:

- `services/auth.service.ts` - Servicio de autenticación

### Fase 4: Context Providers

Gestión de estado global con Context API:

1. `contexts/theme-context.tsx` - Gestión de temas
2. `contexts/auth-context.tsx` - Estado de autenticación
3. `contexts/user-context.tsx` - Datos de usuario
4. `contexts/cart-context.tsx` - Estado del carrito

### Fase 5: Custom Hooks

Hooks personalizados para encapsular lógica:

- `hooks/use-auth.ts` - Hook de autenticación
- `hooks/use-cart.ts` - Hook del carrito
- `hooks/use-products.ts` - Hook de productos
- `hooks/use-categories.ts` - Hook de categorías

### Fase 6: Sistema de Diseño

Componentes UI base reutilizables:

- `components/ui/button.tsx` - Componente Button
- `components/ui/input.tsx` - Componente Input
- `components/ui/card.tsx` - Componente Card
- `components/ui/loading.tsx` - Estados de carga

### Fase 7: Layout

Estructura de la aplicación:

- `components/layout/layout.tsx` - Layout principal con providers
- `components/layout/header.tsx` - Header con navegación
- `components/layout/footer.tsx` - Footer de la aplicación

### Fase 8: Componentes Funcionales

Componentes específicos de funcionalidad:

- `components/auth/` - Login, registro, menú usuario
- `components/product/` - Cards, grid, categorías
- `components/cart/` - Drawer del carrito

### Fase 9: Páginas

Páginas principales de la aplicación:

- `page/HomePage.tsx` - Página principal
- `page/ProductsPage.tsx` - Catálogo de productos
- `page/ProductDetailPage.tsx` - Detalle del producto
- `page/ProfilePage.tsx` - Perfil de usuario

### Fase 10: Configuración de Routing

- `main.tsx` - Punto de entrada con providers y rutas

## 🔄 Flujo de Datos

### Jerarquía de Providers

```tsx
<QueryClientProvider>
  <ThemeProvider>
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>
```

### Relaciones entre Contextos

1. **ThemeProvider** - Independiente, gestiona tema visual
2. **AuthProvider** - Gestiona estado de autenticación
3. **UserProvider** - Depende de AuthProvider para datos de usuario
4. **CartProvider** - Puede usar UserProvider para persistencia

## 🎯 Patrones de Diseño

### Provider Pattern

Usado para gestión de estado global sin Redux:

```tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### Custom Hooks

Encapsulan lógica de contextos:

```tsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### Compound Components

Para componentes complejos como modales y formularios.

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 🚀 Próximos Pasos

- [ ] Implementar backend con API REST
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar PWA capabilities
- [ ] Agregar sistema de pagos
- [ ] Optimizar performance con lazy loading
- [ ] Implementar SSR con Next.js o similar

## 📝 Notas de Desarrollo

### Decisiones de Arquitectura

1. **Context API vs Redux**: Se eligió Context API por simplicidad y tamaño del proyecto
2. **TailwindCSS**: Para desarrollo rápido y consistencia visual
3. **Vite**: Build tool moderno y rápido
4. **TypeScript**: Para mejor DX y menos errores en runtime

### Problemas Resueltos

- **AuthProvider Error**: Se solucionó agregando AuthProvider en la jerarquía de providers
- **Persistencia**: Se implementó localStorage para mantener estado entre sesiones
- **Responsive Design**: Se usó TailwindCSS para diseño adaptativo

---

Desarrollado con ❤️ usando React + TypeScript

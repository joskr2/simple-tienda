# 🛍️ Demo Tienda - E-commerce Moderno

Una aplicación de e-commerce moderna construida con **React 19**, **TypeScript**, **Vite** y **TailwindCSS**. Diseñada con las mejores prácticas de desarrollo frontend, arquitectura escalable y experiencia de usuario excepcional.

## ✨ Características Principales

### 🎯 Funcionalidades Core

- **Catálogo de Productos** - Navegación y filtrado avanzado de productos
- **Sistema de Categorías** - Filtros dinámicos por categorías (Electrónicos, Ropa, Libros, Hogar, Deportes, Belleza)
- **Carrito de Compras** - Gestión completa del carrito con persistencia local
- **Página de Detalles** - Vista detallada de productos con galería de imágenes
- **Búsqueda Avanzada** - Búsqueda en tiempo real con filtros múltiples
- **Responsive Design** - Completamente adaptable a todos los dispositivos

### 🎨 Experiencia de Usuario

- **Animaciones Fluidas** - Transiciones suaves con Framer Motion
- **Carga Optimizada** - Estados de carga inteligentes y skeleton screens
- **Navegación Intuitiva** - Breadcrumbs y navegación clara
- **Tema Moderno** - Diseño clean con TailwindCSS
- **Accesibilidad** - Cumple estándares WCAG 2.1

### ⚡ Rendimiento

- **Lazy Loading** - Carga bajo demanda de componentes
- **Optimización de Imágenes** - Gestión eficiente de assets
- **Bundle Splitting** - División inteligente del código
- **Caché Inteligente** - Estrategias de caché optimizadas

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/demo-tienda.git

# Navegar al directorio
cd demo-tienda

# Instalar dependencias
npm install
# o
yarn install

# Iniciar servidor de desarrollo
npm run dev
# o
yarn dev
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción
npm run lint         # Ejecuta el linter ESLint
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
demo-tienda/
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/            # Componentes base del sistema de diseño
│   │   ├── layout/        # Componentes de layout
│   │   ├── product/       # Componentes específicos de productos
│   │   ├── cart/          # Componentes del carrito
│   │   ├── common/        # Componentes comunes
│   │   └── custom/        # Componentes personalizados
│   ├── contexts/          # Context providers (Carrito, Usuario, Tema)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilidades y configuraciones
│   ├── page/              # Páginas principales
│   ├── types/             # Definiciones de TypeScript
│   ├── data/              # Datos estáticos y mock
│   └── assets/            # Recursos de la aplicación
├── components.json        # Configuración de shadcn/ui
├── tailwind.config.js     # Configuración de TailwindCSS
├── tsconfig.json          # Configuración de TypeScript
└── vite.config.ts         # Configuración de Vite
```

### Tecnologías Utilizadas

#### Frontend Core

- **React 19** - Biblioteca de UI con las últimas características
- **TypeScript 5.8** - Tipado estático para JavaScript
- **Vite 6.3** - Build tool ultrarrápido
- **React Router 7.6** - Enrutamiento declarativo

#### Styling & UI

- **TailwindCSS 4.1** - Framework de CSS utilitario
- **Radix UI** - Componentes accesibles sin estilos
- **Lucide React** - Iconos SVG optimizados
- **Framer Motion** - Animaciones fluidas

#### Estado y Datos

- **React Context** - Gestión de estado global
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **TanStack Query** - Gestión de estado del servidor

#### Desarrollo

- **ESLint** - Linting de código
- **TypeScript ESLint** - Reglas específicas de TS
- **Vite Plugin React** - Hot Module Replacement

## 📱 Páginas y Funcionalidades

### 🏠 Página Principal (`/`)

- Hero section con llamadas a la acción
- Grid de productos destacados
- Secciones de categorías
- Testimonios y información de la empresa

### 🛍️ Página de Productos (`/productos`)

- Listado completo de productos
- Filtros por categoría, precio, nombre
- Búsqueda en tiempo real
- Ordenamiento múltiple
- Paginación optimizada
- Vista de grid/lista

### 📦 Detalle de Producto (`/producto/:id`)

- Galería de imágenes interactiva
- Información detallada del producto
- Especificaciones técnicas
- Reseñas y calificaciones
- Productos relacionados
- Botones de acción (agregar al carrito)

### 🛒 Carrito de Compras

- Gestión completa del carrito
- Persistencia en localStorage
- Cálculos automáticos
- Modificación de cantidades
- Resumen de compra

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Colores principales */
--primary: #3b82f6      /* Azul principal */
--secondary: #64748b    /* Gris secundario */
--accent: #f59e0b       /* Amarillo de acento */
--background: #ffffff   /* Fondo principal */
--foreground: #0f172a   /* Texto principal */
```

### Tipografía

- **Familia**: Inter (sistema de fuentes moderno)
- **Pesos**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Escalas**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl

### Componentes Base

- **Button** - Botones con múltiples variantes
- **Card** - Tarjetas de contenido
- **Input** - Campos de entrada
- **Badge** - Etiquetas y estados
- **Modal** - Ventanas modales
- **Loading** - Estados de carga

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# Desarrollo
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Demo Tienda
VITE_APP_VERSION=1.0.0

# Producción
VITE_API_URL=https://api.demotienda.com
VITE_ANALYTICS_ID=GA-XXXXXXXXX
```

### Configuración de TailwindCSS

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
```

### Configuración de TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🧪 Testing

### Estrategia de Testing

- **Unit Tests** - Componentes individuales
- **Integration Tests** - Flujos de usuario
- **E2E Tests** - Pruebas de extremo a extremo

### Herramientas

```bash
# Instalar dependencias de testing
npm install -D @testing-library/react @testing-library/jest-dom vitest

# Ejecutar tests
npm run test
npm run test:watch
npm run test:coverage
```

## 🚀 Deployment

### Build de Producción

```bash
# Generar build optimizada
npm run build

# Previsualizar build
npm run preview
```

### Opciones de Deployment

- **Vercel** - Deployment automático desde Git
- **Netlify** - Hosting con CI/CD integrado
- **GitHub Pages** - Hosting gratuito
- **Docker** - Containerización para cualquier plataforma

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🔄 Roadmap

### Próximas Características

- [ ] **Autenticación de Usuarios** - Login/Register
- [ ] **Wishlist** - Lista de deseos
- [ ] **Comparador de Productos** - Comparación lado a lado
- [ ] **Reseñas y Ratings** - Sistema de calificaciones
- [ ] **Checkout Completo** - Proceso de compra
- [ ] **Panel de Admin** - Gestión de productos
- [ ] **PWA** - Aplicación web progresiva
- [ ] **Internacionalización** - Múltiples idiomas
- [ ] **Tema Oscuro** - Modo oscuro/claro
- [ ] **Notificaciones Push** - Alertas en tiempo real

### Mejoras Técnicas

- [ ] **Tests Automatizados** - Cobertura completa
- [ ] **Storybook** - Documentación de componentes
- [ ] **Performance Monitoring** - Métricas de rendimiento
- [ ] **Error Tracking** - Monitoreo de errores
- [ ] **Analytics** - Seguimiento de eventos
- [ ] **SEO Optimization** - Mejoras de SEO

## 🤝 Contribución

### Cómo Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usar **TypeScript** para todo el código
- Seguir las reglas de **ESLint**
- Escribir **tests** para nuevas funcionalidades
- Documentar **componentes complejos**
- Usar **commits convencionales**

### Commits Convencionales

```
feat: añadir nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de formato
refactor: refactorización de código
test: añadir tests
chore: tareas de mantenimiento
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal** - [@tu-usuario](https://github.com/tu-usuario)
- **Diseño UI/UX** - Equipo de diseño
- **QA Testing** - Equipo de calidad

## 📞 Soporte

¿Tienes preguntas o necesitas ayuda?

- 📧 **Email**: soporte@demotienda.com
- 💬 **Discord**: [Servidor de la comunidad](https://discord.gg/demotienda)
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/demo-tienda/issues)
- 📖 **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/demo-tienda/wiki)

## 🙏 Agradecimientos

- **React Team** - Por la increíble biblioteca
- **Vite Team** - Por la herramienta de build ultrarrápida
- **TailwindCSS** - Por el framework de CSS
- **Radix UI** - Por los componentes accesibles
- **Comunidad Open Source** - Por las increíbles herramientas

---

<div align="center">
  <p>Hecho con ❤️ por el equipo de Demo Tienda</p>
  <p>
    <a href="#-demo-tienda---e-commerce-moderno">Volver arriba</a>
  </p>
</div>

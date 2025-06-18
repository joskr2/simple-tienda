/**
 * Contexto de Tema - Maneja el modo claro/oscuro
 *
 * CONCEPTOS CLAVE:
 * 1. React Context - Para compartir estado entre componentes sin prop drilling
 * 2. Custom Hook - Para encapsular la lógica del tema
 * 3. LocalStorage - Para persistir la preferencia del usuario
 * 4. Principio SOLID: Single Responsibility - Solo maneja el tema
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Tipos para el contexto del tema
type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  // Estado actual
  theme: Theme; // Tema seleccionado por el usuario
  effectiveTheme: "light" | "dark"; // Tema que se está aplicando realmente

  // Acciones
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void; // Alterna entre light y dark

  // Utilidades
  isSystemTheme: boolean; // Si está usando tema del sistema
  isDarkMode: boolean; // Si el tema efectivo es oscuro
}

// Crear el contexto con valor inicial undefined
// Esto nos fuerza a usar el hook useTheme en lugar del contexto directamente
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Props del proveedor
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

/**
 * Proveedor del contexto de tema
 *
 * PATRÓN PROVIDER:
 * - Encapsula toda la lógica del tema
 * - Proporciona una API limpia para los consumidores
 * - Maneja la persistencia automáticamente
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ecommerce-theme",
}: ThemeProviderProps) {
  // Estado del tema seleccionado por el usuario
  const [theme, setThemeState] = useState<Theme>(() => {
    // Intentar cargar desde localStorage al inicializar
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (
        stored &&
        (stored === "light" || stored === "dark" || stored === "system")
      ) {
        return stored as Theme;
      }
    }
    return defaultTheme;
  });

  // Estado para detectar la preferencia del sistema
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  /**
   * Detecta y escucha cambios en la preferencia del sistema
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Función para actualizar el tema del sistema
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Establecer el tema inicial del sistema
    updateSystemTheme(mediaQuery);

    // Escuchar cambios en la preferencia del sistema
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateSystemTheme);
    } else {
      // Fallback para navegadores más antiguos
      mediaQuery.addListener(updateSystemTheme);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateSystemTheme);
      } else {
        mediaQuery.removeListener(updateSystemTheme);
      }
    };
  }, []);

  /**
   * Calcula el tema efectivo basado en la selección del usuario
   */
  const effectiveTheme: "light" | "dark" =
    theme === "system" ? systemTheme : theme;

  /**
   * Aplica el tema al documento
   */
  useEffect(() => {
    const root = window.document.documentElement;

    // Remover clases de tema anteriores
    root.classList.remove("light", "dark");

    // Aplicar el tema efectivo
    root.classList.add(effectiveTheme);

    // También establecer el atributo data-theme para compatibilidad
    root.setAttribute("data-theme", effectiveTheme);
  }, [effectiveTheme]);

  /**
   * Cambia el tema y lo persiste en localStorage
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    // Persistir en localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {
        console.warn("No se pudo guardar el tema en localStorage:", error);
      }
    }
  };

  /**
   * Alterna entre tema claro y oscuro
   * Si está en modo sistema, cambia al opuesto del tema actual del sistema
   */
  const toggleTheme = () => {
    if (theme === "system") {
      // Si está en modo sistema, cambiar al opuesto del tema actual
      setTheme(systemTheme === "dark" ? "light" : "dark");
    } else {
      // Si no está en modo sistema, alternar entre light y dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // Valores calculados
  const isSystemTheme = theme === "system";
  const isDarkMode = effectiveTheme === "dark";

  // Valor del contexto
  const contextValue: ThemeContextValue = {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    isSystemTheme,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de tema
 *
 * VENTAJAS DE ESTE PATRÓN:
 * 1. Type Safety - TypeScript nos garantiza que el contexto existe
 * 2. Error Handling - Mensaje claro si se usa fuera del Provider
 * 3. API Limpia - Los componentes solo ven lo que necesitan
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useTheme debe ser usado dentro de un ThemeProvider. " +
        "Asegúrate de envolver tu componente con <ThemeProvider>."
    );
  }

  return context;
}

/**
 * Componente de ejemplo para mostrar cómo usar el tema
 * Este componente lo podemos usar en cualquier parte de la app
 */
export function ThemeToggleButton() {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-secondary hover:bg-accent
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      `}
      aria-label={isDarkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={`Tema actual: ${theme}`}
    >
      {isDarkMode ? (
        // Icono de sol para modo oscuro
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Icono de luna para modo claro
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * EJEMPLO DE USO:
 *
 * 1. En tu App.tsx:
 * ```tsx
 * import { ThemeProvider } from './contexts/theme-context';
 *
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="system">
 *       <YourAppComponents />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * 2. En cualquier componente:
 * ```tsx
 * import { useTheme } from './contexts/theme-context';
 *
 * function MyComponent() {
 *   const { isDarkMode, setTheme } = useTheme();
 *
 *   return (
 *     <div className={isDarkMode ? 'dark-styles' : 'light-styles'}>
 *       <button onClick={() => setTheme('dark')}>Modo Oscuro</button>
 *     </div>
 *   );
 * }
 * ```
 */

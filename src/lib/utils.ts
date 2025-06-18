import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Función utilitaria para combinar clases de CSS con Tailwind
 * Combina clsx y tailwind-merge para resolver conflictos de clases
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un precio en pesos colombianos
 * @param price - Precio a formatear
 * @param currency - Moneda (por defecto COP)
 * @returns Precio formateado con símbolo de moneda
 */
export function formatPrice(price: number, currency: string = "COP"): string {
  // Validar que el precio sea un número válido
  if (typeof price !== "number" || isNaN(price)) {
    return "$0";
  }

  // Configuración de formato para pesos colombianos
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(price);
}

/**
 * Trunca un texto a una longitud específica
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @param suffix - Sufijo a agregar (por defecto "...")
 * @returns Texto truncado
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Genera un ID único simple basado en timestamp y random
 * @param prefix - Prefijo opcional para el ID
 * @returns ID único generado
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  const id = `${timestamp}${randomPart}`;

  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Función de debounce para optimizar búsquedas y llamadas a API
 * @param func - Función a ejecutar con delay
 * @param wait - Tiempo de espera en milisegundos
 * @param immediate - Si ejecutar inmediatamente en el primer call
 * @returns Función debounced
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * Convierte una cadena a formato slug (URL friendly)
 * @param text - Texto a convertir
 * @returns Slug generado
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Normaliza caracteres especiales
    .replace(/[\u0300-\u036f]/g, "") // Remueve acentos
    .replace(/[^\w\s-]/g, "") // Remueve caracteres especiales
    .trim()
    .replace(/[\s_-]+/g, "-") // Reemplaza espacios y guiones múltiples
    .replace(/^-+|-+$/g, ""); // Remueve guiones al inicio y final
}

/**
 * Valida si un email tiene formato válido
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si un número de teléfono colombiano es válido
 * @param phone - Número a validar
 * @returns true si el teléfono es válido
 */
export function isValidColombianPhone(phone: string): boolean {
  // Acepta formatos: +57, 57, números de 10 dígitos, números de 7 dígitos
  const phoneRegex = /^(\+?57)?[\s-]?[1-9]\d{6,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Calcula el porcentaje de descuento entre dos precios
 * @param originalPrice - Precio original
 * @param salePrice - Precio de venta
 * @returns Porcentaje de descuento
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0 || salePrice <= 0) return 0;
  if (salePrice >= originalPrice) return 0;

  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Formatea una fecha en formato colombiano
 * @param date - Fecha a formatear
 * @param includeTime - Si incluir la hora
 * @returns Fecha formateada
 */
export function formatDate(
  date: string | Date,
  includeTime: boolean = false
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Fecha inválida";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Bogota",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Intl.DateTimeFormat("es-CO", options).format(dateObj);
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param text - Texto a capitalizar
 * @returns Texto capitalizado
 */
export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Calcula el tiempo transcurrido desde una fecha (formato "hace X tiempo")
 * @param date - Fecha desde la cual calcular
 * @returns Tiempo transcurrido en formato humano
 */
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Definir intervalos en segundos
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
  };

  // Encontrar el intervalo apropiado
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `hace ${interval} ${unit}${interval > 1 ? "s" : ""}`;
    }
  }

  return "hace un momento";
}

/**
 * Convierte bytes a formato legible (KB, MB, GB)
 * @param bytes - Número de bytes
 * @param decimals - Número de decimales
 * @returns Tamaño formateado
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Extrae las iniciales de un nombre completo
 * @param fullName - Nombre completo
 * @param maxInitials - Máximo número de iniciales
 * @returns Iniciales extraídas
 */
export function getInitials(fullName: string, maxInitials: number = 2): string {
  return fullName
    .split(" ")
    .filter((name) => name.length > 0)
    .slice(0, maxInitials)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
}

/**
 * Verifica si una URL es válida
 * @param url - URL a verificar
 * @returns true si la URL es válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convierte un color hexadecimal a RGB
 * @param hex - Color en formato hexadecimal
 * @returns Objeto con valores RGB o null si el formato es inválido
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result || !result[1] || !result[2] || !result[3]) {
    return null;
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Genera un color aleatorio en formato hexadecimal
 * @returns Color hexadecimal aleatorio
 */
export function randomColor(): string {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

/**
 * Remueve caracteres especiales de un string, útil para nombres de archivo
 * @param str - String a limpiar
 * @returns String limpio
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/[^\w\s-.]/gi, "") // Mantener solo letras, números, espacios, guiones y puntos
    .replace(/\s+/g, "_") // Reemplazar espacios con guiones bajos
    .toLowerCase();
}

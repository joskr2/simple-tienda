/**
 * Componentes de Loading - Estados de carga y skeletons
 *
 * Colección de componentes para mostrar estados de carga,
 * incluyendo spinners, skeletons y placeholders.
 */

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { spinnerVariants } from "./loading-variants";
import "./loading.css";

// ================================
// SPINNER COMPONENT
// ================================

interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string; // Para accesibilidad
}

/**
 * Spinner - Indicador de carga circular
 */
function Spinner({
  className,
  size,
  variant,
  label = "Cargando...",
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, variant }), className)}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

// ================================
// LOADING BUTTON
// ================================

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

/**
 * LoadingButton - Botón con estado de carga
 */
function LoadingButton({
  loading = false,
  loadingText = "Cargando...",
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" variant="white" />}
      {loading ? loadingText : children}
    </button>
  );
}

// ================================
// SKELETON COMPONENTS
// ================================

/**
 * Skeleton - Placeholder básico con animación
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  );
}

/**
 * SkeletonText - Skeleton para texto
 */
interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

function SkeletonText({ lines = 1, className, ...props }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full" // Última línea más corta
          )}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonAvatar - Skeleton para avatares
 */
interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

function SkeletonAvatar({
  size = "default",
  className,
  ...props
}: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Skeleton
      className={cn("rounded-full", sizeClasses[size], className)}
      {...props}
    />
  );
}

/**
 * SkeletonCard - Skeleton para tarjetas de producto
 */
function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4 p-4", className)} {...props}>
      {/* Imagen */}
      <Skeleton className="aspect-video w-full rounded-lg" />

      {/* Contenido */}
      <div className="space-y-2">
        {/* Título */}
        <Skeleton className="h-4 w-3/4" />

        {/* Descripción */}
        <SkeletonText lines={2} />

        {/* Precio */}
        <Skeleton className="h-6 w-1/3" />
      </div>

      {/* Botón */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// ================================
// FULL PAGE LOADING
// ================================

interface LoadingPageProps {
  message?: string;
  showSpinner?: boolean;
}

/**
 * LoadingPage - Pantalla de carga completa
 */
function LoadingPage({
  message = "Cargando...",
  showSpinner = true,
}: LoadingPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        {showSpinner && <Spinner size="xl" />}
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// ================================
// LOADING OVERLAY
// ================================

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  backdrop?: boolean; // Si mostrar fondo oscuro
}

/**
 * LoadingOverlay - Overlay de carga sobre contenido existente
 */
function LoadingOverlay({
  show,
  message = "Cargando...",
  backdrop = true,
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        backdrop && "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="text-center space-y-4">
        <Spinner size="xl" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

// ================================
// PRODUCT CARD SKELETON
// ================================

/**
 * ProductCardSkeleton - Skeleton específico para tarjetas de producto
 */
function ProductCardSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 space-y-4 animate-pulse",
        className
      )}
      {...props}
    >
      {/* Imagen del producto */}
      <Skeleton className="aspect-square w-full rounded-md" />

      {/* Badge */}
      <Skeleton className="h-5 w-16 rounded-full" />

      {/* Título */}
      <Skeleton className="h-5 w-full" />

      {/* Descripción */}
      <SkeletonText lines={2} />

      {/* Rating */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Precio */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}

// ================================
// PROGRESS BAR
// ================================

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  showLabel?: boolean;
  label?: string;
}

/**
 * ProgressBar - Barra de progreso
 */
function ProgressBar({
  value,
  showLabel = false,
  label,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  // Mapear el valor a clases de Tailwind CSS
  const getWidthClass = (val: number): string => {
    if (val === 0) return "w-0";
    if (val <= 5) return "w-1/20"; // 5%
    if (val <= 10) return "w-1/10"; // 10%
    if (val <= 12.5) return "w-1/8"; // 12.5%
    if (val <= 16.67) return "w-1/6"; // 16.67%
    if (val <= 20) return "w-1/5"; // 20%
    if (val <= 25) return "w-1/4"; // 25%
    if (val <= 33.33) return "w-1/3"; // 33.33%
    if (val <= 37.5) return "w-3/8"; // 37.5%
    if (val <= 40) return "w-2/5"; // 40%
    if (val <= 50) return "w-1/2"; // 50%
    if (val <= 60) return "w-3/5"; // 60%
    if (val <= 62.5) return "w-5/8"; // 62.5%
    if (val <= 66.67) return "w-2/3"; // 66.67%
    if (val <= 75) return "w-3/4"; // 75%
    if (val <= 80) return "w-4/5"; // 80%
    if (val <= 83.33) return "w-5/6"; // 83.33%
    if (val <= 87.5) return "w-7/8"; // 87.5%
    if (val <= 90) return "w-9/10"; // 90%
    if (val < 100) return "w-19/20"; // 95%
    return "w-full"; // 100%
  };

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={cn(
            "bg-primary h-2 rounded-full transition-all duration-500 ease-out",
            getWidthClass(clampedValue)
          )}
        />
      </div>
    </div>
  );
}

// ================================
// DOTS LOADING
// ================================

interface DotsLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pulse" | "bounce";
}

/**
 * DotsLoading - Animación de puntos
 */
function DotsLoading({
  variant = "pulse",
  className,
  ...props
}: DotsLoadingProps) {
  if (variant === "bounce") {
    return (
      <div
        className={cn("flex space-x-1 dots-loading-bounce", className)}
        {...props}
      >
        <div className="h-2 w-2 bg-current rounded-full dots-loading-dot-1" />
        <div className="h-2 w-2 bg-current rounded-full dots-loading-dot-2" />
        <div className="h-2 w-2 bg-current rounded-full dots-loading-dot-3" />
      </div>
    );
  }

  return (
    <div className={cn("flex space-x-1", className)} {...props}>
      <div className="h-2 w-2 bg-current rounded-full dots-loading-dot-1" />
      <div className="h-2 w-2 bg-current rounded-full dots-loading-dot-2" />
      <div className="h-2 w-2 bg-current rounded-full dots-loading-dot-3" />
    </div>
  );
}

// Exportaciones de componentes únicamente
export {
  Spinner,
  LoadingButton,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  LoadingPage,
  LoadingOverlay,
  ProductCardSkeleton,
  ProgressBar,
  DotsLoading,
};

/**
 * EJEMPLOS DE USO:
 *
 * // Spinner básico
 * <Spinner />
 * <Spinner size="lg" variant="secondary" />
 *
 * // Botón con loading
 * <LoadingButton loading={isLoading} loadingText="Guardando...">
 *   Guardar
 * </LoadingButton>
 *
 * // Skeletons
 * <Skeleton className="h-4 w-48" />
 * <SkeletonText lines={3} />
 * <SkeletonCard />
 * <ProductCardSkeleton />
 *
 * // Página de carga
 * <LoadingPage message="Cargando productos..." />
 *
 * // Overlay
 * <LoadingOverlay show={isLoading} message="Procesando pago..." />
 *
 * // Barra de progreso
 * <ProgressBar value={75} showLabel label="Progreso" />
 *
 * // Dots loading
 * <DotsLoading />
 * <DotsLoading variant="bounce" />
 */

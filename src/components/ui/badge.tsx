/**
 * Componente Badge - Etiqueta para mostrar estados, categorías o información adicional
 * 
 * Componente versátil para mostrar información de estado, categorías,
 * contadores y otros datos de manera visual y compacta.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

// Definición de variantes usando class-variance-authority
const badgeVariants = cva(
  // Clases base que siempre se aplican
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      // Variantes de color/estilo
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: 
          "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-yellow-900 hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        muted:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },
      // Variantes de tamaño
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Props del componente Badge
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
}

/**
 * Componente Badge principal
 * 
 * @param variant - Estilo visual del badge
 * @param size - Tamaño del badge
 * @param className - Clases CSS adicionales
 * @param children - Contenido del badge
 * @param props - Props HTML adicionales
 */
function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Badge con icono - Versión que incluye un icono al lado del texto
 */
interface BadgeWithIconProps extends BadgeProps {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

function BadgeWithIcon({ 
  icon, 
  iconPosition = 'left', 
  children, 
  className,
  ...props 
}: BadgeWithIconProps) {
  return (
    <Badge className={cn("gap-1", className)} {...props}>
      {iconPosition === 'left' && icon}
      {children}
      {iconPosition === 'right' && icon}
    </Badge>
  )
}

/**
 * Badge con contador - Para mostrar números o contadores
 */
interface CounterBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number
  max?: number // Número máximo antes de mostrar "+"
  showZero?: boolean // Si mostrar cuando el contador es 0
}

function CounterBadge({ 
  count, 
  max = 99, 
  showZero = false, 
  className,
  ...props 
}: CounterBadgeProps) {
  // No mostrar el badge si el contador es 0 y showZero es false
  if (count === 0 && !showZero) {
    return null
  }

  // Determinar el texto a mostrar
  const displayText = count > max ? `${max}+` : count.toString()

  return (
    <Badge 
      className={cn("min-w-[1.25rem] justify-center", className)} 
      variant="destructive"
      {...props}
    >
      {displayText}
    </Badge>
  )
}

/**
 * Badge de estado - Para mostrar estados específicos con colores predefinidos
 */
interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning'
  label?: string // Texto personalizado, si no se proporciona usa el status
}

function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  // Mapeo de estados a variantes y textos por defecto
  const statusConfig = {
    active: { variant: 'success' as const, text: 'Activo' },
    inactive: { variant: 'muted' as const, text: 'Inactivo' },
    pending: { variant: 'warning' as const, text: 'Pendiente' },
    success: { variant: 'success' as const, text: 'Exitoso' },
    error: { variant: 'destructive' as const, text: 'Error' },
    warning: { variant: 'warning' as const, text: 'Advertencia' },
  }

  const config = statusConfig[status]
  const displayText = label || config.text

  return (
    <Badge 
      variant={config.variant} 
      className={className} 
      {...props}
    >
      {displayText}
    </Badge>
  )
}

/**
 * Badge removible - Con botón X para remover
 */
interface RemovableBadgeProps extends BadgeProps {
  onRemove?: () => void
  removeLabel?: string // Texto del aria-label para accesibilidad
}

function RemovableBadge({ 
  children, 
  onRemove, 
  removeLabel = "Remover", 
  className,
  ...props 
}: RemovableBadgeProps) {
  return (
    <Badge className={cn("gap-1 pr-1", className)} {...props}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-white/20 p-0.5 transition-colors"
          aria-label={removeLabel}
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </Badge>
  )
}

// Exportaciones
export { 
  Badge, 
  BadgeWithIcon, 
  CounterBadge, 
  StatusBadge, 
  RemovableBadge,
  badgeVariants 
}

/**
 * EJEMPLOS DE USO:
 * 
 * // Badge básico
 * <Badge>Nuevo</Badge>
 * <Badge variant="secondary">En stock</Badge>
 * <Badge variant="destructive">Agotado</Badge>
 * 
 * // Badge con icono
 * <BadgeWithIcon icon={<StarIcon />}>Destacado</BadgeWithIcon>
 * 
 * // Badge contador
 * <CounterBadge count={5} />
 * <CounterBadge count={150} max={99} /> // Muestra "99+"
 * 
 * // Badge de estado
 * <StatusBadge status="success" />
 * <StatusBadge status="pending" label="En proceso" />
 * 
 * // Badge removible
 * <RemovableBadge onRemove={() => console.log('removed')}>
 *   Filtro aplicado
 * </RemovableBadge>
 */
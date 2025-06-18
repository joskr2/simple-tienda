/**
 * Formulario de registro de usuario
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Check,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { useAuth } from "../../hooks/use-auth";
import { AuthError } from "../../services/auth.service";
import type { RegisterData, ValidationErrors } from "../../types/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  // Validación de contraseña en tiempo real
  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Limpiar errores cuando el usuario empiece a escribir
  const handleInputChange = (
    field: keyof RegisterData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error del campo específico
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Limpiar error general
    if (error) {
      clearError();
    }
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "El formato del email no es válido";
    }

    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (passwordStrength.score < 4) {
      errors.password = "La contraseña debe cumplir todos los requisitos";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Debes confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.terms) {
      errors.terms = "Debes aceptar los términos y condiciones";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      onSuccess?.();
    } catch (error) {
      // Los errores específicos del campo se manejan en el contexto
      if (error instanceof AuthError && error.field) {
        setFieldErrors((prev) => ({
          ...prev,
          [error.field!]: error.message,
        }));
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Crear Cuenta
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Completa tus datos para crear una nueva cuenta
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error general */}
          {error && !Object.values(fieldErrors).some(Boolean) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Campo Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`pl-10 ${
                  fieldErrors.name ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {fieldErrors.name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {fieldErrors.name}
              </motion.p>
            )}
          </div>

          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${
                  fieldErrors.email ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {fieldErrors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {fieldErrors.email}
              </motion.p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crea una contraseña segura"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 pr-10 ${
                  fieldErrors.password ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Indicador de fortaleza de contraseña */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        level <= passwordStrength.score
                          ? passwordStrength.score < 3
                            ? "bg-red-500"
                            : passwordStrength.score < 4
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs space-y-1">
                  {Object.entries(passwordStrength.checks).map(
                    ([key, passed]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1 ${
                          passed ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            passed ? "opacity-100" : "opacity-30"
                          }`}
                        />
                        <span>
                          {key === "length" && "Al menos 8 caracteres"}
                          {key === "uppercase" && "Una mayúscula"}
                          {key === "lowercase" && "Una minúscula"}
                          {key === "number" && "Un número"}
                          {key === "special" && "Un símbolo especial"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {fieldErrors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {fieldErrors.password}
              </motion.p>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`pl-10 pr-10 ${
                  fieldErrors.confirmPassword ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {fieldErrors.confirmPassword}
              </motion.p>
            )}
          </div>

          {/* Términos y condiciones */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <input
                id="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => handleInputChange("terms", e.target.checked)}
                className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5 ${
                  fieldErrors.terms ? "border-destructive" : ""
                }`}
                disabled={isLoading}
                aria-label="Aceptar términos y condiciones"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                Acepto los{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    // Aquí se abriría un modal o página con los términos
                    console.log("Mostrar términos y condiciones");
                  }}
                >
                  términos y condiciones
                </button>{" "}
                y la{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    // Aquí se abriría un modal o página con la política de privacidad
                    console.log("Mostrar política de privacidad");
                  }}
                >
                  política de privacidad
                </button>
              </Label>
            </div>
            {fieldErrors.terms && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {fieldErrors.terms}
              </motion.p>
            )}
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || passwordStrength.score < 4}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>

          {/* Enlace a login */}
          {onSwitchToLogin && (
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
              </span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Inicia sesión aquí
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

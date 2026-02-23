"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail, // Remplacé Phone par Mail
  Lock,
  ArrowRight,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginDto } from "../../application/dtos/login-dto";

export default function LoginUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginDto>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const router = useRouter();
  const { login } = useAuth();

  const validateForm = (): boolean => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    // Validation Email
    if (!formData.email.trim()) {
      newErrors.email = " L'adresse email est requise";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      const loggedUser = await login(formData.email, formData.password);

      // Redirection selon le rôle
      switch (loggedUser.user.role) {
        case "CLIENT":
          router.push("/order/cart");
          break;
        case "ADMIN":
          router.push("/admin");
          break;
        case "DELIVRY":
          router.push("/profile");
      }
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        general: "Identifiants incorrects. Veuillez réessayer.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <span>Accueil</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg border border-orange-100 dark:border-gray-700">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-3">
              <ShieldCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Connexion sécurisée
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Error général */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                {errors.general}
              </p>
            </div>
          )}

          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.email
                      ? "border-red-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-orange-300"
                  } dark:text-white`}
                  placeholder="votre@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.password
                      ? "border-red-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-orange-300"
                  } dark:text-white`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-orange-200 hover:shadow-orange-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
          {/* Sign Up Link */}
          <div className="flex flex-col pt-6 items-center space-y-4">
            <Link href="/backend/module/users/ui/register" className="w-full">
              <button
                type="button"
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center space-x-3 px-6 py-3 border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out disabled:opacity-50"
              >
                <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Créer mon compte gratuitement</span>
              </button>
            </Link>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Connectez-vous pour passer votre commande en toute sécurité.
            </p>
          </div>
        </div>
        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          © 2026 wingi Connect. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}

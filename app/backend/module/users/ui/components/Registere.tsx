"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserRole } from "../../domain/enums/role.enum";
import { RegisterDto } from "../../application/dtos/registere.dto";
import { UserRepository } from "../../infrastructure/user-repository.impl";
import { CreateUserUseCase } from "../../application/usecases/create-user.usecase";

export default function RegisterForm() {
  // 1. État initial aligné sur le DTO
  const [formData, setFormData] = useState<RegisterDto>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    role: UserRole.CUSTOMER,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterDto, string>>
  >({});

  const userRepo = new UserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepo);

  // 2. Validation mise à jour
  const validateField = (name: keyof RegisterDto, value: any) => {
    let error = "";
    const stringValue = String(value || "").trim();

    switch (name) {
      case "firstName":
      case "lastName":
        if (stringValue.length < 2) {
          error = "Ce champ doit contenir au moins 2 caractères";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) {
          error = "Email invalide";
        }
        break;
      case "password":
        if (stringValue.length < 6) {
          error = "Le mot de passe doit contenir au moins 6 caractères";
        }
        break;
      case "phone":
        const phoneRegex = /^[0-9]{8,15}$/;
        if (stringValue && !phoneRegex.test(stringValue.replace(/\s/g, ""))) {
          error = "Numéro invalide (8 à 15 chiffres)";
        }
        break;
      case "address":
        if (stringValue.length < 5) {
          error = "Veuillez renseigner une adresse complète";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (message) {
      setMessage("");
      setMessageType("");
    }
    validateField(name as keyof RegisterDto, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation globale
    const isFirstValid = validateField("firstName", formData.firstName);
    const isLastValid = validateField("lastName", formData.lastName);
    const isEmailValid = validateField("email", formData.email);
    const isPassValid = validateField("password", formData.password);
    const isAddrValid = validateField("address", formData.address);

    if (
      !isFirstValid ||
      !isLastValid ||
      !isEmailValid ||
      !isPassValid ||
      !isAddrValid
    ) {
      toast.error("Veuillez corriger les erreurs.");
      setLoading(false);
      return;
    }

    try {
      const response = await createUserUseCase.execute(formData);

      if (response.token) {
        localStorage.setItem("accessToken", response.token.accessToken);
        localStorage.setItem("refreshToken", response.token.refreshToken);
      }

      toast.success(`Bienvenue ${formData.firstName} !`);
      setMessageType("success");
      setMessage("Compte créé avec succès ! Redirection...");

      // Reset form
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        role: UserRole.CUSTOMER,
        isActive: true,
      });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name: keyof RegisterDto) => `
    w-full pl-11 pr-4 text-gray-800 py-3 border rounded-xl transition-all duration-300
    ${errors[name] ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-400"}
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-block mb-4 px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-100 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700">
            Inscription
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prénom & Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">
                Prénom
              </label>
              <User className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass("firstName")}
                placeholder="Jean"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">
                Nom
              </label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass("lastName").replace("pl-11", "pl-4")}
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">
              Email
            </label>
            <Mail className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass("email")}
              placeholder="jean@mail.com"
              required
            />
          </div>

          {/* Téléphone */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">
              Téléphone
            </label>
            <Phone className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
            <input
              name="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={handleChange}
              className={inputClass("phone")}
              placeholder="0700000000"
            />
          </div>

          {/* Adresse */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">
              Adresse complète
            </label>
            <MapPin className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={inputClass("address")}
              placeholder="123 rue des Lilas, Paris"
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">
              Mot de passe
            </label>
            <Lock className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={inputClass("password") + " pr-12"}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 p-1 text-gray-400 hover:text-teal-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-sm ${messageType === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {messageType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà inscrit ?{" "}
          <Link
            href="/users/ui/login"
            className="text-teal-600 font-bold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

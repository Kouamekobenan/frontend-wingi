"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { User } from "../backend/module/users/domain/entities/user.entity";
import { api } from "../backend/api/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ user: User; accessToken: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // Sauvegarde simple du token
  const saveSession = (accessToken: string, userId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user_id", userId);
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string }> => {
    try {
      const res = await api.post(`/auth/login`, { email, password });
       console.log("📦 Réponse complète du backend:", res.data);


      // ✅ Mapping précis sur ton Swagger : res.data.data
      const responseBody = res.data.data;

      const userData = responseBody.user;
      const accessToken = responseBody.access_token; // Clé snake_case du Swagger

       console.log("👤 User extrait:", userData);
       console.log("🔑 Access Token extrait:", accessToken);

      if (!accessToken || !userData) {
        throw new Error(
          "Réponse du serveur incomplète (token ou user manquant)",
        );
      }

      // 🔹 Sauvegarde et Mise à jour du state
      saveSession(accessToken, userData.id);
      setUser(userData);
      setIsAuthenticated(true);

      return { user: userData, accessToken };
    } catch (error: any) {
      console.error("❌ Erreur login:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Identifiants incorrects",
      );
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  // Vérification de la session au chargement (sans refresh token)
  const checkSession = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // On récupère les infos de l'utilisateur avec le token stocké
      const res = await api.get(`/auth/me`);
      if (isMounted.current) {
        // On adapte ici aussi si /auth/me renvoie { data: user }
        const userData = res.data.data || res.data;
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Session expirée ou invalide");
      logout();
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    checkSession();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {!loading ? (
        children
      ) : (
        <div className="flex h-screen flex-col items-center justify-center bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-orange-600 font-medium">Chargement...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};

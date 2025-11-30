import type { User } from "../types";
import { socket } from "../api/socket";
import { api } from "../api/api";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login as loginService } from "../services/authService";
import { refresh as RefreshService } from "../services/authService";
import { logout as logoutService } from "../services/authService";
import { register as registerService } from "../services/authService";


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storeUser = localStorage.getItem("user_data");

    if (token && storeUser) {
      setUser(JSON.parse(storeUser));

      api.defaults.headers.Authorization = `Bearer ${token}`;

      socket.auth = { token: token }
      socket.connect();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await refresh();
            return api(originalRequest);
          } catch {
            await logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await loginService({ email, password });

    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));

    setUser(user);

    socket.auth = { token: token }
    socket.connect();
  };

  const refresh = async () => {
    try {
      const tokensExist = localStorage.getItem("auth_token")
      if (!tokensExist) return

      const { token, user } = await RefreshService();

      localStorage.setItem("auth_token", token);

      if (user) {
        localStorage.setItem("user_data", JSON.stringify(user));
        setUser(user);
      }

      socket.auth = { token }
      if (!socket.connected) socket.connect();

    } catch {
      await logout();
    }
  };

  const register = async (name: string, email: string, password: string) => {
    return await registerService({ name, email, password })
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch { }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");

    socket.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, refresh, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

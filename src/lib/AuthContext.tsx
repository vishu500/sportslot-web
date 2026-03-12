"use client";
// src/lib/AuthContext.tsx
// Global auth state — wraps the whole app so any component can access login state

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  user: { name: string; email: string } | null;
  isLoggedIn: boolean;
  login: (token: string, user: { name: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // On first load, restore from cookie if present
  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (newToken: string, newUser: { name: string; email: string }) => {
    Cookies.set("token", newToken, { expires: 1 }); // 1 day
    Cookies.set("user", JSON.stringify(newUser), { expires: 1 });
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setToken(null);
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any component: const { user, isLoggedIn } = useAuth()
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

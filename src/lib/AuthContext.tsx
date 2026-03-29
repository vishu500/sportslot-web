"use client";
// src/lib/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  loading: boolean;  // ← properly typed, not optional
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // ← starts TRUE until cookies are checked

  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // ← set FALSE after cookie check is done
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    Cookies.set("token", newToken, { expires: 1 });
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
    <AuthContext.Provider value={{
      token, user, loading,
      isLoggedIn: !!token,
      isOwner: user?.role === "VENUE_OWNER" || user?.role === "ADMIN",
      isAdmin: user?.role === "ADMIN",
      login, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

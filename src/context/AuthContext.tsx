"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken, removeToken, isAdmin } from "../utils/auth";

type AuthContextType = {
  loggedIn: boolean;
  admin: boolean;
  username: string;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [username, setUsername] = useState("");

  // Run on mount: check if token exists (page reload scenario)
  useEffect(() => {
    const token = getToken();
    if (token) {
      setLoggedIn(true);
      setAdmin(isAdmin());
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.sub || "");
    }
  }, []);

  // Call this after a successful login
  const login = (token: string) => {
    setToken(token); // store token
    setLoggedIn(true);
    setAdmin(isAdmin());
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUsername(payload.sub || "");
  };

  const logout = () => {
    removeToken();
    setLoggedIn(false);
    setAdmin(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ loggedIn, admin, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

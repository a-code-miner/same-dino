// src/contexts/AuthContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // بارگذاری اطلاعات کاربر از localStorage هنگام لود اولیه
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    if (role && username) {
      setUser({ role, username });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("role", userData.role);
    localStorage.setItem("username", userData.name);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

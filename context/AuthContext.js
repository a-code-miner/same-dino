// src/contexts/AuthContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getItemWithExpiry, setItemWithExpiry } from "@/utils/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // بارگذاری اطلاعات کاربر از localStorage با بررسی انقضا
    const role = getItemWithExpiry("role");
    const username = getItemWithExpiry("username");

    if (role && username) {
      setUser({ role, username });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // استفاده از تابع جدید برای ذخیره با انقضا
    setItemWithExpiry("role", userData.role);
    setItemWithExpiry("username", userData.name);
    setUser({ role: userData.role, username: userData.name });
  };

  const logout = () => {
    // پاک کردن همه اطلاعات از localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

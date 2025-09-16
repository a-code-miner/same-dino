"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getItemWithExpiry, setItemWithExpiry } from "@/utils/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = getItemWithExpiry("role");
    const username = getItemWithExpiry("username");
    const accessToken = getItemWithExpiry("accessToken");

    if (accessToken && role && username) {
      setUser({ role, username });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setItemWithExpiry("role", userData.role);
    setItemWithExpiry("username", userData.name);
    setItemWithExpiry("accessToken", userData.token);
    setUser({ role: userData.role, username: userData.name });
  };

  const logout = () => {
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
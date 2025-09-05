// src/hooks/useRoleAccess.js
"use client";
import { useAuth } from "@/context/AuthContext";
import { ROLE_ACCESS } from "@/app/constants/roles";

export const useRoleAccess = () => {
  const { user, loading } = useAuth();

  const hasAccess = (path) => {
    if (!user?.role) return false;
    return ROLE_ACCESS[user.role]?.includes(path);
  };

  return {
    role: user?.role,
    loading,
    hasAccess,
  };
};

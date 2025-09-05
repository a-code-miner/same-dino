// src/components/RoleGuard.js
"use client";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Unauthorized from "@/app/unauthorized/page";

const PUBLIC_PATHS = ["/", "/login", "/register", "/unauthorized"];

export default function RoleGuard({ children }) {
  const { role, hasAccess, loading } = useRoleAccess();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (PUBLIC_PATHS.includes(pathName)) {
      return;
    }

    if (!role || !hasAccess(pathName)) {
      router.push("/unauthorized");
    }
  }, [loading, role, pathName, hasAccess, router]);

  if (loading) return <p>در حال بررسی دسترسی...</p>;

  if (PUBLIC_PATHS.includes(pathName)) {
    return <>{children}</>;
  }

  if (!role || !hasAccess(pathName)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
}

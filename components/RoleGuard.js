"use client";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Unauthorized from "@/app/unauthorized/page";

const PUBLIC_PATHS = ["/", "/login", "/register", "/unauthorized"];

export default function RoleGuard({ children }) {
  const { role, hasAccess, loading } = useRoleAccess();
  const pathName = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (PUBLIC_PATHS.includes(pathName)) {
      setIsChecking(false);
      return;
    }

    if (!role) {
      router.push("/login");
      return;
    }

    if (!hasAccess(pathName)) {
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [loading, role, pathName, hasAccess, router]);

  if (loading || isChecking) {
    return <p>در حال بررسی دسترسی...</p>;
  }

  if (PUBLIC_PATHS.includes(pathName)) {
    return <>{children}</>;
  }

  // اگر کاربر لاگین نیست، ریدایرکت انجام می‌شود (در useEffect)
  if (!role) {
    return null;
  }

  // اگر کاربر لاگین است اما دسترسی ندارد، صفحه Unauthorized نمایش داده شود
  if (!hasAccess(pathName)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
}
// app/layout.js
"use client";
import RoleGuard from "@/components/RoleGuard";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const noSidebarRoutes = ["/", "/login", "/register", "/unauthorized"];

  const showSidebar = !noSidebarRoutes.includes(pathName);

  return (
    <html lang="fa" dir="rtl">
      <body>
        <AuthProvider>
          {showSidebar && <Sidebar />}
          {showSidebar && <TopBar />}
          <main className={`${showSidebar ? "mt-14" : "mt-0"} h-full`}>
            <RoleGuard>{children}</RoleGuard>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

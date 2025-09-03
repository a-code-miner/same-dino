"use client";
import { usePathname } from "next/navigation";

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function RootLayout({ children }) {
  const pathName = usePathname();

  const noSidebarRoutes = ["/", "/login", "/register"];
  const showSidebar = !noSidebarRoutes.includes(pathName);

  return (
    <html lang="fa" dir="rtl">
      <body className="">
        {showSidebar && <Sidebar />}
        {showSidebar && <TopBar />}
        <main
          className={`${showSidebar ? "mt-14" : "mt-0"} h-full overflow-auto`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

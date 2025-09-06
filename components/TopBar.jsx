"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";

import { logout } from "@/lib/api";
import { getItemWithExpiry } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";

const TopBar = () => {
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // استفاده از هوک useAuth برای دریافت نام کاربر
    if (user && user.username) {
      setUsername(user.username);
    } else {
      // اگر از context در دسترس نیست، از localStorage با سیستم انقضا بگیر
      const storedUsername = getItemWithExpiry("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      // ابتدا از سرور logout کنید
      await logout();

      // سپس وضعیت احراز هویت را در context به روز کنید
      authLogout();

      // در نهایت به صفحه اصلی هدایت کنید
      router.push("/");
    } catch (err) {
      console.log("Failed to logout: ", err);
    }
  };

  return (
    <div className="fixed right-0 left-0 top-0 h-14 bg-gray-200">
      <div className="flex justify-between items-center my-2 mx-5">
        <h2 className="text-lg">سلام {username}</h2>
        <button
          className="flex justify-center items-center gap-1 text-sm bg-red-200 px-3 py-2 rounded-lg"
          onClick={handleLogout}
        >
          <IoIosLogOut />
          خروج
        </button>
      </div>
    </div>
  );
};

export default TopBar;

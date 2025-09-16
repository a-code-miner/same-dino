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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user && user.username) {
      setUsername(user.username);
    } else {
      const storedUsername = getItemWithExpiry("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      authLogout();
      router.push("/login");
      router.refresh(); // اضافه کردن این خطا برای رفرش صفحه
    } catch (err) {
      console.log("Failed to logout: ", err);

      // مدیریت خطاهای مختلف
      let message = "خطای ناشناخته ای رخ داد";

      switch (err.status) {
        case 400:
          message = "هیچ توکنی ارسال نشده است";
          break;
        case 401:
          message = "توکن نامعتبر است";
          break;
        case 403:
          message = "توکن منقضی شده است";
          break;
        case 500:
          message = "خطای داخلی سرور رخ داد";
          break;
        default:
          message = err.message || "خطای ناشناخته ای رخ داد";
      }

      setErrorMessage(message);
      setShowErrorModal(true);
    }
  };

  const closeModal = () => {
    setShowErrorModal(false);
    // در صورت خطای احراز هویت، کاربر را به صفحه لاگین هدایت می‌کنیم
    if (errorMessage.includes("توکن")) {
      authLogout();
      router.push("/login");
    }
  };

  return (
    <>
      <div className="fixed right-0 left-0 top-0 h-14 bg-gray-200 z-40">
        <div className="flex justify-between items-center my-2 mx-5">
          <h2 className="text-lg">سلام {username}</h2>
          <button
            className="flex justify-center items-center gap-1 text-sm bg-red-200 px-3 py-2 rounded-lg hover:bg-red-300 transition-colors"
            onClick={handleLogout}
          >
            <IoIosLogOut />
            خروج
          </button>
        </div>
      </div>

      {/* مدال نمایش خطا */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-red-600 mb-4">خطا</h2>
            <p className="mb-4">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={closeModal}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;

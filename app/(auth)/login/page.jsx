// app/(auth)/login/page.js
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { user, loading, login: authLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // اگر کاربر قبلاً لاگین کرده باشد، به صفحه مربوطه هدایت می‌شود
  useEffect(() => {
    if (user && !loading) {
      redirectBasedOnRole(user.role);
    }
  }, [user, loading, router]);

  const redirectBasedOnRole = (role) => {
    if (role === "super_admin") {
      router.push("/super_admin");
    } else if (role === "staff") {
      router.push("/staff");
    } else if (role === "parent") {
      router.push("/parent");
    } else if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(""); // پاک کردن خطاهای قبلی
    setErrors({}); // پاک کردن خطاهای فرم

    // اعتبارسنجی اولیه
    let newErrors = {};
    if (!form.email.includes("@")) {
      newErrors.email = "لطفاً یک ایمیل معتبر وارد کنید.";
    }
    if (!form.password) {
      newErrors.password = "رمز عبور الزامی است.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const loginResult = await login(form.email, form.password);

      if (loginResult.user) {
        authLogin(loginResult.user);
        redirectBasedOnRole(loginResult.user.role);
      }
    } catch (err) {
      console.log("خطا در لاگین:", err);

      // مدیریت خطاهای مختلف
      switch (err.status) {
        case 400:
          setSubmitError("ایمیل و رمز عبور الزامی است");
          break;
        case 401:
          setSubmitError("ایمیل یا رمز عبور اشتباه است");
          break;
        case 403:
          setSubmitError("حساب شما غیر فعال شده است");
          break;
        case 500:
          setSubmitError("خطای داخلی سرور رخ داد");
          break;
        default:
          setSubmitError(err.message || "خطای ناشناخته ای رخ داد");
      }
    }
  };
  // اگر در حال بررسی وضعیت احراز هویت هستیم، نمایش پیام loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">در حال بررسی وضعیت احراز هویت...</div>
      </div>
    );
  }

  // اگر کاربر قبلاً لاگین کرده، نمایش پیام و هدایت
  if (user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">شما قبلاً وارد شده‌اید، در حال هدایت...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">ورود</h1>

        {/* نمایش خطای کلی */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-lg">
          <div>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ایمیل..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="رمز عبور..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-200 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ورود
          </button>
        </form>
        <Link href="/register" className="mt-4 block text-center text-blue-600 hover:underline">
          حساب کاربری ندارید؟ ثبت نام کنید
        </Link>
      </div>
    </div>
  );
};

export default Login;

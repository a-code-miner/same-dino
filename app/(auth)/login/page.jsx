"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      if (loginResult.user && loginResult.user.role === "super_admin") {
        router.push("/super_admin");
      } else {
        console.log("کاربر دسترسی ندارد یا اطلاعات اشتباه است!");
      }
    } catch (err) {
      console.log("خطا در لاگین:", err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">ورود</h1>

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
      </div>
    </div>
  );
};

export default Login;


"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import Link from "next/link";

const Register = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "parent",
        school_id: ""
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        setErrors({});
        setSuccess(false);

        // Simple validation
        let newErrors = {};
        if (!form.name) newErrors.name = "نام الزامی است.";
        if (!form.email.includes("@")) newErrors.email = "ایمیل معتبر وارد کنید.";
        if (!form.password) newErrors.password = "رمز عبور الزامی است.";
        if (!form.role) newErrors.role = "نقش الزامی است.";
        // if (!form.school_id) newErrors.school_id = "شناسه مدرسه الزامی است.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            // school_id should be number
            const payload = { ...form, school_id: Number(form.school_id) };
            await register(payload.name, payload.email, payload.password, payload.role, payload.school_id);
            setSuccess(true);
            setTimeout(() => router.push("/login"), 1500);
        } catch (err) {
            if (err.errors) setErrors(err.errors);
            setSubmitError(err.message || "خطایی رخ داد");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
                <h1 className="text-2xl font-semibold text-center mb-6">ثبت نام</h1>

                {submitError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                        {submitError}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                        ثبت نام با موفقیت انجام شد! در حال انتقال به صفحه ورود...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-lg">
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="نام..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ایمیل..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">انتخاب نقش...</option>
                            <option value="parent">والد</option>
                            <option value="staff">مسئول کانتین</option>
                            <option value="admin">مدیر مکتب</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            name="school_id"
                            value={form.school_id}
                            onChange={handleChange}
                            placeholder="شناسه مکتب..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.school_id && <p className="text-red-500 text-sm mt-1">{errors.school_id}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-200 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-300 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "در حال ثبت نام..." : "ثبت نام"}
                    </button>
                </form>
                <Link href="/login" className="mt-4 block text-center text-blue-600 hover:underline">
                    حساب کاربری دارید؟ وارد شوید
                </Link>
            </div>
        </div>
    );
};

export default Register;

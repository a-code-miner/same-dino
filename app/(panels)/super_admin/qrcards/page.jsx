"use client";
import React from "react";
import { useState, useEffect } from "react";

import { createStudentQRCode } from "@/lib/api";

const InputField = ({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  options,
  inputRef,
}) => (
  <div className="flex flex-col mb-5">
    <label htmlFor={id} className="text-right mb-2 font-medium text-gray-700">
      {label}
    </label>
    {type === "select" ? (
      <select
        id={id}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="border border-gray-300 p-3 rounded-xl w-full h-12 text-base outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        ref={inputRef}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 p-3 rounded-xl w-full h-12 text-base outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        placeholder={placeholder}
      />
    )}
  </div>
);

const QRCardsGen = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    setLoading(false);
  }, []);
  const [formStudentQRCode, setFormStudentQRCode] = useState({
    student_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createStudentQRCode(formStudentQRCode.student_id);
    console.log(formStudentQRCode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormStudentQRCode((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return null;
  if (!token) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="bg-red-500/10 p-8 rounded-lg text-center">
          <h1 className="text-4xl text-red-700 mb-4">دسترسی غیرمجاز!</h1>
          <h4 className="text-2xl text-red-700">
            شما اجازه ورود به این صفحه را ندارید!
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit}>
          <InputField
            type="number"
            label="آیدی شاگرد"
            id="student_id"
            name="student_id"
            value={formStudentQRCode.student_id}
            onChange={handleChange}
            placeholder="آیدی شاگرد را وارد کنید..."
          />
          <button
            type="submit"
            className="px-6 py-3 w-32 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            بساز
          </button>
        </form>
      </div>
    </div>
  );
};

export default QRCardsGen;

"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  FaEdit,
  FaPlus,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { getUsers, addUser, updateUser, deleteUser } from "@/lib/api";

const ModalOverlay = ({ children, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300">
    {children}
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-2xl transform transition-transform duration-300 scale-100 opacity-100">
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
      >
        <FaTimes size={20} />
      </button>
    </div>
    {children}
  </div>
);

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

const UsersManagement = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    setLoading(false);
  }, []);

  const nameInputRef = useRef();

  const roles = [
    { value: "super_admin", label: "مدیر کل" },
    { value: "school_manager", label: "مدیر مکتب" },
    { value: "canteen", label: "مسئول کانتین" },
    { value: "parents", label: "والدین" },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "super_admin",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [deleteForm, setDeleteForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (user) => {
    setEditForm({
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      role: user.role || "super_admin",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateUser(editForm.id, editForm);
    console.log("User updated: ", editForm);
    setIsEditModalOpen(false);
    fetchUsers(pagination.current_page);
  };

  const openDeleteModal = (user) => {
    setDeleteForm({
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      role: user.role || "",
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    await deleteUser(deleteForm.id);
    console.log("User deleted: ", deleteForm);
    setIsDeleteModalOpen(false);
    fetchUsers(pagination.current_page);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser(form);
    console.log(form);
    setIsAddModalOpen(false);
    fetchUsers(pagination.current_page);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "super_admin",
    });
  };

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getUsers(page);
      setUsers(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchUsers(page);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isAddModalOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isAddModalOpen]);

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

  // تابع برای تولید دکمه‌های صفحه‌بندی
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.current_page - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.last_page,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // دکمه قبلی
    buttons.push(
      <button
        key="prev"
        onClick={() => changePage(pagination.current_page - 1)}
        disabled={pagination.current_page === 1}
        className={`px-3 py-1 rounded-lg ${
          pagination.current_page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <FaChevronRight />
      </button>
    );

    // دکمه‌های شماره صفحات
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => changePage(i)}
          className={`px-3 py-1 rounded-lg ${
            i === pagination.current_page
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    // دکمه بعدی
    buttons.push(
      <button
        key="next"
        onClick={() => changePage(pagination.current_page + 1)}
        disabled={pagination.current_page === pagination.last_page}
        className={`px-3 py-1 rounded-lg ${
          pagination.current_page === pagination.last_page
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <FaChevronLeft />
      </button>
    );

    return buttons;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">مدیریت کاربران</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus />
            کاربر جدید
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 uppercase text-sm">
                  <tr className="text-nowrap">
                    <th className="px-6 py-4 font-semibold">آیدی</th>
                    <th className="px-6 py-4 font-semibold">نام</th>
                    <th className="px-6 py-4 font-semibold">ایمیل</th>
                    <th className="px-6 py-4 font-semibold">نقش</th>
                    <th className="px-6 py-4 font-semibold">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors text-nowrap"
                      >
                        <td className="px-6 py-4">{user.id}</td>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "super_admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "school_manager"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "canteen"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {roles.find((r) => r.value === user.role)?.label ||
                              user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="ویرایش"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <MdDelete size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        کاربری یافت نشد!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {pagination.last_page > 1 && (
                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    نمایش{" "}
                    {(pagination.current_page - 1) * pagination.per_page + 1} تا{" "}
                    {Math.min(
                      pagination.current_page * pagination.per_page,
                      pagination.total
                    )}{" "}
                    از {pagination.total} نتیجه
                  </div>
                  <div className="flex gap-2">{renderPaginationButtons()}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <ModalOverlay onClose={closeAddModal}>
          <Modal title="ایجاد کاربر جدید" onClose={closeAddModal}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <InputField
                  label="نام"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="نام را وارد کنید..."
                  inputRef={nameInputRef}
                />
                <InputField
                  label="ایمیل"
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ایمیل را وارد کنید..."
                />
                <InputField
                  label="رمز عبور"
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="رمز عبور را وارد کنید..."
                />
                <InputField
                  label="نقش"
                  id="role"
                  name="role"
                  type="select"
                  value={form.role}
                  onChange={handleChange}
                  options={roles}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 w-32 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                  ثبت کاربر
                </button>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-6 py-3 w-32 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  لغو
                </button>
              </div>
            </form>
          </Modal>
        </ModalOverlay>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <ModalOverlay onClose={closeEditModal}>
          <Modal title="ویرایش اطلاعات کاربر" onClose={closeEditModal}>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <InputField
                  label="نام"
                  id="edit-name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="نام"
                />
                <InputField
                  label="ایمیل"
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  placeholder="ایمیل"
                />
                <InputField
                  label="رمز عبور"
                  id="edit-password"
                  name="password"
                  type="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  placeholder="رمز عبور"
                />
                <InputField
                  label="نقش"
                  id="edit-role"
                  name="role"
                  type="select"
                  value={editForm.role}
                  onChange={handleEditChange}
                  options={roles}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 w-full">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                  ذخیره تغییرات
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  لغو
                </button>
              </div>
            </form>
          </Modal>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ModalOverlay onClose={closeDeleteModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-transform duration-300 scale-100 opacity-100">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h2 className="text-xl font-bold text-red-600">حذف کاربر</h2>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="my-6">
              <p className="text-gray-700 mb-4">
                آیا از حذف کاربر{" "}
                <span className="font-semibold">{deleteForm.name}</span> مطمئن
                هستید؟ این عمل غیرقابل بازگشت است.
              </p>

              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">نام:</span> {deleteForm.name}
                  </p>
                  <p>
                    <span className="font-medium">ایمیل:</span>{" "}
                    {deleteForm.email}
                  </p>
                  <p>
                    <span className="font-medium">نقش:</span>{" "}
                    {roles.find((r) => r.value === deleteForm.role)?.label ||
                      deleteForm.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                لغو
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-md"
              >
                بله، حذف کن
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};

export default UsersManagement;

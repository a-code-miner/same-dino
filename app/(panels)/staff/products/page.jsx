"use client";
import React, { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct } from "@/lib/api";
import {
  FaChevronRight,
  FaChevronLeft,
  FaPlus,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    available: "",
  });

  // State برای مدال‌ها
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_quantity: "",
    image_url: "",
    available: true,
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit,
      };
      const data = await getProducts(params);

      const productsData = Array.isArray(data?.data) ? data.data : [];
      setProducts(productsData);
      setPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      handleApiError(err, "دریافت لیست اجناس");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts(1);
    }
  }, [token, filters]);

  const handleApiError = (err, action) => {
    let errorMessage = "";

    switch (err.status) {
      case 400:
        errorMessage = err.message || "داده‌های ورودی معتبر نیستند";
        break;
      case 401:
        errorMessage = "ابتدا باید وارد شوید";
        break;
      case 403:
        errorMessage = `شما مجوز ${action} را ندارید`;
        break;
      case 404:
        errorMessage = "محصول یافت نشد";
        break;
      case 500:
        errorMessage = "خطای داخلی سرور رخ داد";
        break;
      default:
        errorMessage = err.message || "خطای ناشناخته رخ داد";
    }

    setError(errorMessage);
    setIsErrorModalOpen(true);
  };

  const showSuccessMessage = (message) => {
    setSuccess(message);
    setIsSuccessModalOpen(true);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccess(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      fetchProducts(newPage);
    }
  };

  // توابع مدال اضافه کردن محصول
  const openAddModal = () => {
    setFormData({
      name: "",
      price: "",
      stock_quantity: "",
      image_url: "",
      available: true,
    });
    setError(null);
    setSuccess(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // توابع مدال ویرایش محصول
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url || "",
      available: product.available,
    });
    setError(null);
    setSuccess(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      await addProduct(productData);
      showSuccessMessage("محصول با موفقیت اضافه شد");
      closeAddModal();
      fetchProducts(pagination.page);
    } catch (err) {
      console.error("Error adding product:", err);
      handleApiError(err, "افزودن محصول");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setFormLoading(true);
    setError(null);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      await updateProduct(selectedProduct.id, productData);
      showSuccessMessage("محصول با موفقیت ویرایش شد");
      closeEditModal();
      fetchProducts(pagination.page);
    } catch (err) {
      console.error("Error updating product:", err);
      handleApiError(err, "ویرایش محصول");
    } finally {
      setFormLoading(false);
    }
  };

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">لیست اجناس</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> افزودن جنس جدید
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">فیلترها</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وضعیت موجودی
              </label>
              <select
                name="available"
                value={filters.available}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">همه</option>
                <option value="true">موجود</option>
                <option value="false">ناموجود</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
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
                    <th className="px-6 py-4 font-semibold">نام جنس</th>
                    <th className="px-6 py-4 font-semibold">قیمت</th>
                    <th className="px-6 py-4 font-semibold">عکس</th>
                    <th className="px-6 py-4 font-semibold">تعداد</th>
                    <th className="px-6 py-4 font-semibold">وضعیت</th>
                    <th className="px-6 py-4 font-semibold">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors text-nowrap"
                      >
                        <td className="px-6 py-4">{product.id}</td>
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">
                          {product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            "بدون عکس"
                          )}
                        </td>
                        <td className="px-6 py-4">{product.stock_quantity}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.available ? "موجود" : "ناموجود"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        جنسی یافت نشد!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              نمایش {(pagination.page - 1) * pagination.limit + 1} تا{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              از {pagination.total} جنس
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-lg ${
                  pagination.page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaChevronRight />
              </button>
              {Array.from(
                { length: Math.ceil(pagination.total / pagination.limit) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg ${
                    page === pagination.page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={
                  pagination.page ===
                  Math.ceil(pagination.total / pagination.limit)
                }
                className={`px-3 py-1 rounded-lg ${
                  pagination.page ===
                  Math.ceil(pagination.total / pagination.limit)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaChevronLeft />
              </button>
            </div>
          </div>
        )}

        {/* مدال اضافه کردن محصول */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-90vh overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">افزودن محصول جدید</h2>
              <form onSubmit={handleAddProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام محصول
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      قیمت
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تعداد موجودی
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آدرس عکس
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      محصول موجود است
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    لغو
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {formLoading ? "در حال افزودن..." : "افزودن"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* مدال ویرایش محصول */}
        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-90vh overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">ویرایش محصول</h2>
              <form onSubmit={handleUpdateProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام محصول
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      قیمت
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تعداد موجودی
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آدرس عکس
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      محصول موجود است
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    لغو
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {formLoading ? "در حال ویرایش..." : "ویرایش"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* مدال خطا */}
        {isErrorModalOpen && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-red-600">خطا</h2>
                <button
                  onClick={closeErrorModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700">{error}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeErrorModal}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  متوجه شدم
                </button>
              </div>
            </div>
          </div>
        )}

        {/* مدال موفقیت */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-600">موفقیت</h2>
                <button
                  onClick={closeSuccessModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700">{success}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeSuccessModal}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  باشه
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

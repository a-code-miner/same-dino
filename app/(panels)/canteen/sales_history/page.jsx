"use client";
import React, { useState, useEffect } from "react";
import {
  getSalesHistory,
  getMySalesHistory,
  addSale,
  refundSale,
  printReceipt,
} from "@/lib/api";
import {
  FaChevronRight,
  FaChevronLeft,
  FaPlus,
  FaPrint,
  FaUndo,
  FaTimes,
} from "react-icons/fa";

const SalesHistory = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    student_id: "",
  });
  const [viewMode, setViewMode] = useState("all"); // 'all' یا 'my'

  // State برای مدال‌ها
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [formData, setFormData] = useState({
    student_id: "",
    product_id: "",
    quantity: 1,
  });
  const [refundData, setRefundData] = useState({
    reason: "",
    approved: true,
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  const fetchSalesHistory = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit,
      };

      let data;
      if (viewMode === "my") {
        data = await getMySalesHistory(params);
      } else {
        data = await getSalesHistory(params);
      }

      const salesData = Array.isArray(data?.data) ? data.data : [];
      setSalesHistory(salesData);
      setPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
      });
    } catch (err) {
      console.log("Error fetching sales history: ", err);
      handleApiError(err, "دریافت تاریخچه فروش‌ها");
      setSalesHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSalesHistory(1);
    }
  }, [token, filters, viewMode]);

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
        errorMessage = "فروش مورد نظر یافت نشد";
        break;
      case 409:
        errorMessage = err.message || "عملیات ممکن نیست";
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

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      fetchSalesHistory(newPage);
    }
  };

  // توابع مدال اضافه کردن فروش
  const openAddModal = () => {
    setFormData({
      student_id: "",
      product_id: "",
      quantity: 1,
    });
    setError(null);
    setSuccess(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // توابع مدال بازگشت وجه
  const openRefundModal = (sale) => {
    setSelectedSale(sale);
    setRefundData({
      reason: "",
      approved: true,
    });
    setError(null);
    setSuccess(null);
    setIsRefundModalOpen(true);
  };

  const closeRefundModal = () => {
    setIsRefundModalOpen(false);
    setSelectedSale(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRefundInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRefundData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const saleData = {
        ...formData,
        quantity: parseInt(formData.quantity),
      };

      await addSale(saleData);
      showSuccessMessage("فروش با موفقیت ثبت شد");
      closeAddModal();
      fetchSalesHistory(pagination.page);
    } catch (err) {
      console.log("Error adding sale:", err);
      handleApiError(err, "ثبت فروش");
    } finally {
      setFormLoading(false);
    }
  };

  const handleRefundSale = async (e) => {
    e.preventDefault();
    if (!selectedSale) return;

    setFormLoading(true);
    setError(null);

    try {
      await refundSale(selectedSale.id, refundData);
      showSuccessMessage("بازگشت وجه با موفقیت انجام شد");
      closeRefundModal();
      fetchSalesHistory(pagination.page);
    } catch (err) {
      console.log("Error refunding sale:", err);
      handleApiError(err, "بازگشت وجه");
    } finally {
      setFormLoading(false);
    }
  };

  const handlePrintReceipt = async (saleId) => {
    setFormLoading(true);
    setError(null);

    try {
      await printReceipt(saleId);
      showSuccessMessage("رسید با موفقیت چاپ شد");
      fetchSalesHistory(pagination.page);
    } catch (err) {
      console.log("Error printing receipt:", err);
      handleApiError(err, "چاپ رسید");
    } finally {
      setFormLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    const date = new Date(dateTimeString);
    return date.toLocaleString("fa-IR");
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
          <h1 className="text-3xl font-bold text-gray-800">تاریخچه فروش‌ها</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> ثبت فروش جدید
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">فیلترها و تنظیمات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                از تاریخ
              </label>
              <input
                type="date"
                name="from"
                value={filters.from}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تا تاریخ
              </label>
              <input
                type="date"
                name="to"
                value={filters.to}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                آیدی شاگرد
              </label>
              <input
                type="number"
                name="student_id"
                value={filters.student_id}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="آیدی شاگرد"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حالت نمایش
              </label>
              <select
                value={viewMode}
                onChange={(e) => handleViewModeChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">همه فروش‌ها</option>
                <option value="my">فروش‌های من</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 uppercase text-sm">
                  <tr className="text-nowrap">
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      آیدی
                    </th>
                    <th
                      className="px-4 py-4 font-semibold border border-blue-200"
                      colSpan="2"
                    >
                      خریدار
                    </th>
                    <th
                      className="px-4 py-4 font-semibold border border-blue-200"
                      colSpan="3"
                    >
                      جنس
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      تعداد
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      قیمت مجموعی
                    </th>
                    <th
                      className="px-4 py-4 font-semibold border border-blue-200"
                      colSpan="2"
                    >
                      فروشنده
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      تاریخ فروش
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      چاپ رسید
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      وضعیت
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      عملیات
                    </th>
                  </tr>
                  <tr className="bg-blue-50 text-nowrap">
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی خریدار
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام خریدار
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی جنس
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام جنس
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      قیمت
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی فروشنده
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام فروشنده
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesHistory.length > 0 ? (
                    salesHistory.map((sale, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors text-nowrap"
                      >
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.id || sale.sale_id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.student?.id || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.student?.name || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product?.id || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product?.name || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product?.price || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.quantity}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.total_price}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.seller?.id || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.seller?.name || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {formatDateTime(sale.sale_date_time)}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.receipt_printed ? "بله" : "خیر"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sale.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : sale.status === "refunded"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {sale.status === "completed"
                              ? "تکمیل شده"
                              : sale.status === "refunded"
                              ? "عودت شده"
                              : sale.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          <div className="flex gap-2">
                            {!sale.receipt_printed && (
                              <button
                                onClick={() =>
                                  handlePrintReceipt(sale.id || sale.sale_id)
                                }
                                className="text-blue-600 hover:text-blue-800"
                                title="چاپ رسید"
                              >
                                <FaPrint size={16} />
                              </button>
                            )}
                            {sale.status === "completed" && (
                              <button
                                onClick={() => openRefundModal(sale)}
                                className="text-red-600 hover:text-red-800"
                                title="بازگشت وجه"
                              >
                                <FaUndo size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={14}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        تاریخچه فروش‌ها خالی است.
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
              از {pagination.total} فروش
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

        {/* مدال اضافه کردن فروش */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">ثبت فروش جدید</h2>
              <form onSubmit={handleAddSale}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آیدی شاگرد
                    </label>
                    <input
                      type="number"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آیدی محصول
                    </label>
                    <input
                      type="number"
                      name="product_id"
                      value={formData.product_id}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تعداد
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
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
                    {formLoading ? "در حال ثبت..." : "ثبت فروش"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* مدال بازگشت وجه */}
        {isRefundModalOpen && selectedSale && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">بازگشت وجه</h2>
              <form onSubmit={handleRefundSale}>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      فروش شماره: {selectedSale.id || selectedSale.sale_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      مبلغ: {selectedSale.total_price}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      دلیل بازگشت وجه
                    </label>
                    <textarea
                      name="reason"
                      value={refundData.reason}
                      onChange={handleRefundInputChange}
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="علت بازگشت وجه را توضیح دهید"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="approved"
                      checked={refundData.approved}
                      onChange={handleRefundInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      تأیید بازگشت وجه
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={closeRefundModal}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    لغو
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {formLoading ? "در حال پردازش..." : "بازگشت وجه"}
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

export default SalesHistory;

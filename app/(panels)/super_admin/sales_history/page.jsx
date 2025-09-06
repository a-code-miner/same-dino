"use client";
import React, { useState, useEffect } from "react";
import { getSalesHistory } from "@/lib/api";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const SalesHistory = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  const fetchSalesHistory = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit,
      };
      const data = await getSalesHistory(params);

      // بررسی وجود data.data و اینکه آرایه است
      const salesData = Array.isArray(data?.data) ? data.data : [];

      setSalesHistory(salesData);
      setPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
      });
    } catch (err) {
      console.log("Error fetching sales history: ", err);
      setSalesHistory([]);
      setPagination({
        page: 1,
        limit: 20,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSalesHistory(1);
    }
  }, [token, filters]);

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
      fetchSalesHistory(newPage);
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
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">فیلترها</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      چاپ شدن رسید؟
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      وضعیت
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
                          {sale.id}
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
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {sale.status === "completed"
                              ? "تکمیل شده"
                              : sale.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={13}
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
      </div>
    </div>
  );
};

export default SalesHistory;

"use client";
import React, { useEffect, useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

import { getOrdersHistory, ordersDeliveryUpdate } from "@/lib/api";

const OrdersHistory = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [ordersHistory, setOrdersHistory] = useState([]);
  const [ordersHistory, setOrdersHistory] = useState([
    {
      order_id: 1,
      parent: { id: 101, name: "والدین 1" },
      student: { id: 201, name: "شاگرد 1" },
      product: { product_id: 301, name: "شیر", price: 5000, quantity: 2 },
      total_price: 10000,
      status: "delivered",
      order_date_time: "2023-10-01T10:00:00Z",
      delivered_at: "2023-10-01T10:30:00Z",
      seller: { id: 401, name: "فروشنده 1" },
    },
    {
      order_id: 2,
      parent: { id: 102, name: "والدین 2" },
      student: { id: 202, name: "شاگرد 2" },
      product: { product_id: 302, name: "ساندویچ", price: 15000, quantity: 1 },
      total_price: 15000,
      status: "pending",
      order_date_time: "2023-10-02T11:00:00Z",
      delivered_at: null,
      seller: { id: 402, name: "فروشنده 2" },
    },
  ]);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    student_id: "",
    status: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  const fetchOrdersHistory = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit,
      };
      const data = await getOrdersHistory(params);

      const ordersData = Array.isArray(data?.data) ? data.data : [];
      const flattenedData = ordersData.flatMap((order) =>
        Array.isArray(order?.items)
          ? order.items.map((item) => ({
              order_id: order.id,
              parent: order.parent || {},
              student: order.student || {},
              product: item,
              total_price: order.total_price,
              status: order.status,
              order_date_time: order.order_date_time,
              delivered_at: order.delivered_at,
              seller: order.seller || {},
            }))
          : []
      );

      // setOrdersHistory(flattenedData);
      setPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 10,
        total: data.pagination?.total || 0,
      });
    } catch (err) {
      console.log("Error fetching orders history: ", err);
      setError(err.message || "خطا در دریافت تاریخچه سفارش‌ها");
      setOrdersHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrdersHistory(1);
    }
  }, [token, filters]);

  const toggleDeliveryModal = (orderId = null) => {
    setSelectedOrderId(orderId);
    setIsDeliveryModalOpen(!isDeliveryModalOpen);
  };

  const confirmDeliveryStatus = async () => {
    if (!selectedOrderId) return;
    try {
      await ordersDeliveryUpdate(selectedOrderId, true);
      fetchOrdersHistory(pagination.page);
      toggleDeliveryModal();
    } catch (err) {
      console.log("Error updating delivery status: ", err);

      // مدیریت خطاهای مختلف
      switch (err.status) {
        case 400:
          setError("داده ورودی معتبر نیست");
          break;
        case 401:
          setError("ابتدا باید وارد شوید");
          break;
        case 403:
          setError("شما مجوز تحویل این سفارش را ندارید");
          break;
        case 404:
          setError("سفارش یافت نشد");
          break;
        case 409:
          setError("این سفارش قبلاً تحویل داده شده است");
          break;
        case 500:
          setError("خطای داخلی سرور رخ داد");
          break;
        default:
          setError(err.message || "خطای ناشناخته رخ داد");
      }
    }
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
      fetchOrdersHistory(newPage);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "تحویل شده";
      case "pending":
        return "در انتظار";
      case "cancelled":
        return "لغو شده";
      default:
        return status;
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
          <h1 className="text-3xl font-bold text-gray-800">تاریخچه سفارش‌ها</h1>
        </div>

        {/* نمایش خطا */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-800 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">فیلترها</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                وضعیت
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">همه</option>
                <option value="delivered">تحویل شده</option>
                <option value="pending">در انتظار</option>
                <option value="cancelled">لغو شده</option>
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
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-red-500 text-lg">{error}</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 uppercase text-sm">
                  <tr className="text-nowrap">
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      آیدی سفارش
                    </th>
                    <th
                      className="px-4 py-4 font-semibold border border-blue-200"
                      colSpan="2"
                    >
                      والدین
                    </th>
                    <th
                      className="px-4 py-4 font-semibold border border-blue-200"
                      colSpan="2"
                    >
                      شاگرد
                    </th>
                    <th
                      className="px-4 py-4 font-semibold border border-blue-200"
                      colSpan={4}
                    >
                      اجناس
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      قیمت مجموعی
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      وضعیت
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      زمان سفارش
                    </th>
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      زمان تحویل
                    </th>
                    {/* <th
                      className="px-4 py-4 font-semibold border border-blue-200"
                      colSpan={2}
                    >
                      فروشنده
                    </th> */}
                    <th className="px-4 py-4 font-semibold border border-blue-200">
                      عملیات
                    </th>
                  </tr>
                  <tr className="bg-blue-50 text-nowrap">
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی والدین
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام والدین
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی شاگرد
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام شاگرد
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی جنس
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام جنس
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      قیمت جنس
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      تعداد جنس
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    {/* <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی فروشنده
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام فروشنده
                    </th> */}
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ordersHistory.length > 0 ? (
                    ordersHistory.map((sale, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors text-nowrap"
                      >
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.order_id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.parent?.id || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.parent?.name || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.student?.id || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.student?.name || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product?.product_id || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product?.name || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product?.price || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product?.quantity || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.total_price}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {getStatusText(sale.status)}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {formatDateTime(sale.order_date_time)}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {formatDateTime(sale.delivered_at)}
                        </td>
                        {/* <td className="px-4 py-4 border border-gray-200">
                          {sale.seller?.id || "-"}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.seller?.name || "-"}
                        </td> */}
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.status === "delivered" ? (
                            <span className="text-green-600 font-semibold">
                              سفارش تحویل داده شده است
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  toggleDeliveryModal(sale.order_id)
                                }
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                              >
                                تحویل سفارش
                              </button>

                              {isDeliveryModalOpen &&
                                selectedOrderId === sale.order_id && (
                                  <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg p-6 w-96">
                                      <h2 className="text-xl font-semibold mb-4">
                                        تأیید تحویل سفارش
                                      </h2>
                                      <p className="mb-4">
                                        آیا از تحویل سفارش با آیدی{" "}
                                        {selectedOrderId} مطمئن هستید؟
                                      </p>
                                      <div className="flex justify-end gap-4">
                                        <button
                                          onClick={toggleDeliveryModal}
                                          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                                        >
                                          لغو
                                        </button>
                                        <button
                                          onClick={confirmDeliveryStatus}
                                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                          تأیید
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={15}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        تاریخچه سفارش‌ها خالی است.
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
              از {pagination.total} سفارش
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

export default OrdersHistory;

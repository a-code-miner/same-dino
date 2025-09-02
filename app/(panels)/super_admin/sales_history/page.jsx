"use client";
import React, { useState, useEffect } from "react";
import { getSalesHistory } from "@/lib/api";

const SalesHistory = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    setLoading(false);
  }, []);

  // const [salesHistory, setSalesHistory] = useState([{ id: 10, student: { id: 12, name: 'Ali' }, product: { id: 3, name: 'برگر', price: 100 }, quantity: 2, total_price: 200, seller: { id: 13, name: 'seifhie' }, sale_date_time: '2025-10-04 09:34:54', receipt_printed: true, status: 'completed' }])
  const [salesHistory, setSalesHistory] = useState([]);

  const fetchSalesHistory = async () => {
    setLoading(true);
    try {
      const data = await getSalesHistory();
      setSalesHistory(data);
    } catch (err) {
      console.log("Error fetching sales history: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesHistory();
  }, []);

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">تاریخچه سفارش‌ها</h1>
        </div>
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

                    {/* زیرستون‌های خریدار */}
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی خریدار
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام خریدار
                    </th>

                    {/* زیرستون‌های جنس */}
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

                    {/* زیرستون‌های فروشنده */}
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
                  {Array.isArray(salesHistory) && salesHistory.length > 0 ? (
                    salesHistory.map((sale, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors text-nowrap"
                      >
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.id}
                        </td>

                        {/* اطلاعات خریدار */}
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.student.id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.student.name}
                        </td>

                        {/* اطلاعات جنس */}
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product.id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product.name}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.product.price}
                        </td>

                        <td className="px-4 py-4 border border-gray-200">
                          {sale.quantity}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.total_price}
                        </td>

                        {/* اطلاعات فروشنده */}
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.seller.id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.seller.name}
                        </td>

                        <td className="px-4 py-4 border border-gray-200">
                          {sale.sale_date_time}
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
      </div>
    </div>
  );
};

export default SalesHistory;

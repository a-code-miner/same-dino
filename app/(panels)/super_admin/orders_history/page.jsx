"use client";
import { getOrdersHistory } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const OrdersHistory = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    setLoading(false);
  }, []);

  const [ordersHistory, setOrdersHistory] = useState([]);

  const fetchOrdersHistory = async () => {
    setLoading(true);
    try {
      const data = await getOrdersHistory();
      setOrdersHistory(data);
    } catch (err) {
      console.log("Error fetching orders history: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersHistory();
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
                    <th
                      className="px-4 py-4 font-semibold border border-blue-200"
                      colSpan={2}
                    >
                      فروشنده
                    </th>
                  </tr>
                  <tr className="bg-blue-50 text-nowrap">
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>

                    {/* زیرستون‌های خریدار */}
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی والدین
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام والدین
                    </th>

                    {/* زیرستون‌های جنس */}
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

                    {/* زیرستون‌های فروشنده */}
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>
                    <th className="px-4 py-3 font-medium border border-blue-200"></th>

                    <th className="px-4 py-3 font-medium border border-blue-200">
                      آیدی فروشنده
                    </th>
                    <th className="px-4 py-3 font-medium border border-blue-200">
                      نام فروشنده
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(ordersHistory) && ordersHistory.length > 0 ? (
                    ordersHistory.map((sale, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors text-nowrap"
                      >
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.id}
                        </td>

                        {/* اطلاعات خریدار */}
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.parents.id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.parents.name}
                        </td>

                        {/* اطلاعات جنس */}
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.student.id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.student.name}
                        </td>

                        <td className="px-4 py-4 border border-gray-200">
                          {sale.products.id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.products.name}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.products.price}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.products.quantity}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.total_price}
                        </td>

                        {/* اطلاعات فروشنده */}
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.status}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.order_date_time}
                        </td>

                        <td className="px-4 py-4 border border-gray-200">
                          {sale.sale_date_time}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.seller.id}
                        </td>
                        <td className="px-4 py-4 border border-gray-200">
                          {sale.seller.name}
                        </td>
                        {/* <td className="px-4 py-4 border border-gray-200">
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
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={13}
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
      </div>
    </div>
  );
};

export default OrdersHistory;

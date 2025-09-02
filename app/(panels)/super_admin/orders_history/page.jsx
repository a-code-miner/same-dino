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
              <table className="w-full text-right">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 uppercase text-sm">
                  <tr className="text-nowrap">
                    <th className="px-6 py-4 font-semibold">آیدی</th>
                    <th className="px-6 py-4 font-semibold">تاریخ</th>
                    <th className="px-6 py-4 font-semibold">ساعت</th>
                    <th className="px-6 py-4 font-semibold">نام جنس</th>
                    <th className="px-6 py-4 font-semibold">قیمت</th>
                    <th className="px-6 py-4 font-semibold">مقدار</th>
                    <th className="px-6 py-4 font-semibold">نام سفارش‌دهنده</th>
                    <th className="px-6 py-4 font-semibold">فروشنده</th>
                    <th className="px-6 py-4 font-semibold">نام فرزند</th>
                    <th className="px-6 py-4 font-semibold">آیدی فرزند</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(ordersHistory) && ordersHistory.length > 0 ? (
                    ordersHistory.map((orderHistory, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors text-nowrap"
                      >
                        <td className="px-6 py-4">{orderHistory.id}</td>
                        <td className="px-6 py-4">{orderHistory.order_date}</td>
                        <td className="px-6 py-4">{orderHistory.hour}</td>
                        <td className="px-6 py-4">{orderHistory.product}</td>
                        <td className="px-6 py-4">{orderHistory.price}</td>
                        <td className="px-6 py-4">{orderHistory.quantity}</td>
                        <td className="px-6 py-4">
                          {orderHistory.orderer_name}
                        </td>
                        <td className="px-6 py-4">{orderHistory.seller}</td>
                        <td className="px-6 py-4">{orderHistory.child_name}</td>
                        <td className="px-6 py-4">{orderHistory.child_id}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
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

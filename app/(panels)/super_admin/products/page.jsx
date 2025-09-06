"use client";
import React from "react";
import { useState, useEffect } from "react";
import { getProducts } from "@/lib/api";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    available: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit,
      };
      const data = await getProducts(params);

      // بررسی وجود data.data و اینکه آرایه است
      const productsData = Array.isArray(data?.data) ? data.data : [];

      setProducts(productsData);
      setPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
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
      fetchProducts(1);
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
      fetchProducts(newPage);
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
                        <td className="px-6 py-4">{product.price}</td>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
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
      </div>
    </div>
  );
};

export default Products;

// lib/api.js
import { setItemWithExpiry, getItemWithExpiry } from "@/utils/storage";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// تابع کمکی برای مدیریت پاسخ‌های غیر موفق
const handleApiResponse = async (res) => {
  const result = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      error: result.error,
      message: result.message,
      errors: result.errors, // اضافه کردن خطاهای اعتبارسنجی
    };
  }

  return result;
};

export const login = async (email, password) => {
  try {
    let url = `${baseURL}/auth/login`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      // پرتاب خطا با اطلاعات کامل پاسخ سرور
      throw {
        status: res.status,
        error: result.error,
        message: result.message,
      };
    }

    // ذخیره اطلاعات در صورت موفقیت
    setItemWithExpiry("accessToken", result.access_token);
    setItemWithExpiry("username", result.user.name);
    setItemWithExpiry("role", result.user.role);

    return result;
  } catch (err) {
    if (err.status) {
      // خطای برگشتی از سرور
      throw err;
    } else {
      // خطای شبکه یا دیگر خطاها
      throw {
        status: 500,
        error: "network_error",
        message: "خطا در اتصال به سرور",
      };
    }
  }
};

export const logout = async () => {
  const token = getItemWithExpiry("accessToken");

  try {
    let url = `${baseURL}/auth/logout`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      // پرتاب خطا با اطلاعات کامل پاسخ سرور
      throw {
        status: res.status,
        error: result.error,
        message: result.message,
      };
    }

    // پاک کردن همه اطلاعات از localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    return result;
  } catch (err) {
    if (err.status) {
      // خطای برگشتی از سرور
      throw err;
    } else {
      // خطای شبکه یا دیگر خطاها
      throw {
        status: 500,
        error: "network_error",
        message: "خطا در اتصال به سرور",
      };
    }
  }
};

export const getUsers = async (page = 1, role = null, limit = 15) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }

  let url = `${baseURL}/users?page=${page}&limit=${limit}`;
  // فقط اگر role مقدار داشته و خالی نباشد، به URL اضافه شود
  if (role && role !== "") {
    url += `&role=${role}`;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleApiResponse(res);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw {
        status: 500,
        error: "network_error",
        message: "خطا در اتصال به سرور",
      };
    }
  }
};

export const addUser = async (userData) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }

  try {
    let url = `${baseURL}/users`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    return await handleApiResponse(res);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw {
        status: 500,
        error: "network_error",
        message: "خطا در اتصال به سرور",
      };
    }
  }
};

export const updateUser = async (userId, userData) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    const url = `${baseURL}/users/${userId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    return await handleApiResponse(res);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw {
        status: 500,
        error: "network_error",
        message: "خطا در اتصال به سرور",
      };
    }
  }
};

export const deleteUser = async (userId) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    const url = `${baseURL}/users/${userId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleApiResponse(res);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw {
        status: 500,
        error: "network_error",
        message: "خطا در اتصال به سرور",
      };
    }
  }
};

export const getOrdersHistory = async (params = {}) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    // ساخت query string از پارامترها
    const queryString = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        queryString.append(key, params[key]);
      }
    });

    const url = `${baseURL}/orders/history?${queryString}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to get orders history!");
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
  }
};

export const getSalesHistory = async (params = {}) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    // ساخت query string از پارامترها
    const queryString = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        queryString.append(key, params[key]);
      }
    });

    const url = `${baseURL}/sales/history?${queryString}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to get sales history!");
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
  }
};

export const getProducts = async (params = {}) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    // ساخت query string از پارامترها
    const queryString = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        queryString.append(key, params[key]);
      }
    });

    const url = `${baseURL}/products?${queryString}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get products list!");
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.log("Server Error: ", err);
    throw new Error("Server Error: ", err);
  }
};

export const createStudentQRCode = async (studentId) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    const url = `${baseURL}/students/${studentId}/qr`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create QR Code!");
    }
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.log("Server Error: ", err);
    throw new Error("Server Error: ", err);
  }
};

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

export const register = async (name, email, password, role) => {
  try {
    let url = `${baseURL}/register`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });
    const result = await res.json();
    if (!res.ok) {
      // پرتاب خطا با اطلاعات کامل پاسخ سرور
      throw {
        status: res.status,
        error: result.error,
        message: result.message,
        errors: result.errors, // اضافه کردن خطاهای اعتبارسنجی
      };
    }
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
}

export const login = async (email, password) => {
  try {
    let url = `${baseURL}/login`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    console.log(result)

    if (!res.ok) {
      throw {
        status: res.status,
        error: result.error,
        message: result.message,
      };
    }

    // ذخیره اطلاعات در صورت موفقیت
    setItemWithExpiry("accessToken", result.token);
    setItemWithExpiry("username", result.user.name);
    setItemWithExpiry("role", result.user.role);

    return {
      user: {
        role: result.user.role,
        name: result.user.name
      },
      token: result.token
    };
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

export const logout = async () => {
  const token = getItemWithExpiry("accessToken");

  try {
    let url = `${baseURL}/logout`;
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
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        error: errorData.error || "unknown_error",
        message: errorData.message || "خطای ناشناخته رخ داد",
      };
    }

    return await res.json();
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

export const ordersDeliveryUpdate = async (orderId, delivered = true) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
    const url = `${baseURL}/orders/${orderId}/deliver`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ delivered }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        error: errorData.error || "unknown_error",
        message: errorData.message || "خطای ناشناخته رخ داد",
      };
    }

    return await res.json();
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

export const getSalesHistory = async (params = {}) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
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

export const getMySalesHistory = async (params = {}) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
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

    const url = `${baseURL}/sales/history/me?${queryString}`;
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

export const addSale = async (saleData) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
    const url = `${baseURL}/sales`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(saleData),
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

export const refundSale = async (saleId, refundData) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
    const url = `${baseURL}/sales/${saleId}/refund`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(refundData),
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

export const printReceipt = async (saleId) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
    const url = `${baseURL}/sales/${saleId}/receipt`;
    const res = await fetch(url, {
      method: "POST",
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

export const getProducts = async (params = {}) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
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

export const addProduct = async (productData) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
    const url = `${baseURL}/products`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
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

export const updateProduct = async (productId, productData) => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "ابتدا باید وارد شوید",
    };
  }
  try {
    const url = `${baseURL}/products/${productId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
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

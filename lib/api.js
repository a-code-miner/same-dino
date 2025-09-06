// lib/api.js
import { setItemWithExpiry, getItemWithExpiry } from "@/utils/storage";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

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

    // ذخیره اطلاعات با زمان انقضا (پیش‌فرض 24 ساعت)
    setItemWithExpiry("accessToken", result.access_token);
    setItemWithExpiry("username", result.user.name);
    setItemWithExpiry("role", result.user.role);

    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
  }
};

export const logout = async () => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    let url = `${baseURL}/auth/logout`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    console.log(result);

    // پاک کردن همه اطلاعات از localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
  }
};

export const getUsers = async () => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    let url = `${baseURL}/users`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to get users!");
    const result = await res.json();
    console.log(result);
    return Array.isArray(result.data) ? result.data : [];
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
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
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
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
    if (!res.ok) throw new Error("Failed to update user!");
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
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
    if (!res.ok) throw new Error("Failed to delete user!");
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
  }
};

export const getOrdersHistory = async () => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    const url = `${baseURL}/orders/history`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to get orders history!");
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
  }
};

export const getSalesHistory = async () => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    const url = `${baseURL}/sales/history`;
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

export const getProducts = async () => {
  const token = getItemWithExpiry("accessToken");
  if (!token) {
    throw new Error("Unauthorized access!");
  }
  try {
    const url = `${baseURL}/products`;
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

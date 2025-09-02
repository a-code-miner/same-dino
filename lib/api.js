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
    localStorage.setItem("accessToken", result.access_token);
    localStorage.setItem("username", result.user.name);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
  }
};

export const logout = async () => {
  const token = localStorage.getItem("accessToken");
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
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error: ", err);
  }
};

export const getUsers = async () => {
  const token = localStorage.getItem("accessToken");
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
  const token = localStorage.getItem("accessToken");
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
  const token = localStorage.getItem("accessToken");
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
  const token = localStorage.getItem("accessToken");
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
  try {
    const url = `https://68ad881ca0b85b2f2cf3b32d.mockapi.io/api/orders_history`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const url = `https://68ad881ca0b85b2f2cf3b32d.mockapi.io/api/sales_history`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

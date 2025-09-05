"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";

import { logout } from "@/lib/api";

const TopBar = () => {
  const router = useRouter();
  const [username, setUsername] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const logOutResult = await logout();
      if (logOutResult) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        router.push("/");
      }
      return;
    } catch (err) {
      console.log("Failed to logout: ", err);
      return;
    }
  };
  return (
    <div className="fixed right-0 left-0 top-0 h-14 bg-gray-200">
      <div className="flex justify-between items-center my-2 mx-5">
        <h2 className="text-lg">سلام {username}</h2>
        <button
          className="flex justify-center items-center gap-1 text-sm bg-red-200 px-3 py-2 rounded-lg"
          onClick={handleLogout}
        >
          <IoIosLogOut />
          خروج
        </button>
      </div>
    </div>
  );
};

export default TopBar;

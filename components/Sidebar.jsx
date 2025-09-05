"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { FiUsers } from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";
import { FaSellsy } from "react-icons/fa6";
import { PiShippingContainerFill } from "react-icons/pi";
import { ImQrcode } from "react-icons/im";

const Sidebar = () => {
  const pathName = usePathname();

  return (
    <div className="fixed top-14 bottom-0 right-0 w-64 h-full bg-gray-200/55 flex flex-col gap-4 items-start p-5">
      <Link
        className={
          pathName === "/super_admin/users"
            ? `flex justify-start items-center gap-2 w-full text-blue-800 bg-blue-100 px-4 py-3 rounded-lg`
            : "flex items-center justify-start gap-2 w-full"
        }
        href={"/super_admin/users"}
      >
        <FiUsers />
        مدیریت کاربران
      </Link>
      <Link
        className={
          pathName === "/super_admin/orders_history"
            ? `flex justify-start items-center gap-2 w-full text-blue-800 bg-blue-100 px-4 py-3 rounded-lg`
            : "flex items-center justify-start gap-2 w-full"
        }
        href={"/super_admin/orders_history"}
      >
        <BsClockHistory />
        تاریخچه سفارش‌ها
      </Link>
      <Link
        className={
          pathName === "/super_admin/sales_history"
            ? `flex justify-start items-center gap-2 w-full text-blue-800 bg-blue-100 px-4 py-3 rounded-lg`
            : "flex items-center justify-start gap-2 w-full"
        }
        href={"/super_admin/sales_history"}
      >
        <FaSellsy />
        تاریخچه فروش‌ها
      </Link>
      <Link
        className={
          pathName === "/super_admin/products"
            ? `flex justify-start items-center gap-2 w-full text-blue-800 bg-blue-100 px-4 py-3 rounded-lg`
            : "flex items-center justify-start gap-2 w-full"
        }
        href={"/super_admin/products"}
      >
        <PiShippingContainerFill />
        مشاهده اجناس
      </Link>
      <Link
        className={
          pathName === "/super_admin/qrcards"
            ? `flex justify-start items-center gap-2 w-full text-blue-800 bg-blue-100 px-4 py-3 rounded-lg`
            : "flex items-center justify-start gap-2 w-full"
        }
        href={"/super_admin/qrcards"}
      >
        <ImQrcode />
        ساخت کد QR
      </Link>
    </div>
  );
};

export default Sidebar;

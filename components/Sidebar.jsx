"use client";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { ROLE_ACCESS } from "@/app/constants/roles";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiUsers } from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";
import { FaSellsy } from "react-icons/fa";
import { PiShippingContainerFill } from "react-icons/pi";
import { ImQrcode } from "react-icons/im";

const Sidebar = () => {
  const { role } = useRoleAccess();
  const pathName = usePathname();

  const allLinks = [
    { href: "/super_admin/users", label: "مدیریت کاربران", icon: <FiUsers /> },
    {
      href: "/super_admin/orders_history",
      label: "تاریخچه سفارش‌ها",
      icon: <BsClockHistory />,
    },
    {
      href: "/super_admin/sales_history",
      label: "تاریخچه فروش‌ها",
      icon: <FaSellsy />,
    },
    {
      href: "/super_admin/products",
      label: "مشاهده اجناس",
      icon: <PiShippingContainerFill />,
    },
    { href: "/super_admin/qrcards", label: "ساخت کد QR", icon: <ImQrcode /> },
    { href: "/canteen", label: "داشبورد", icon: <PiShippingContainerFill /> },
    {
      href: "/parents",
      label: "داشبورد والدین",
      icon: <PiShippingContainerFill />,
    },
    {
      href: "/school_manager",
      label: "داشبورد مدیر مدرسه",
      icon: <PiShippingContainerFill />,
    },
  ];

  const allowedLinks = allLinks.filter((link) =>
    ROLE_ACCESS[role]?.includes(link.href)
  );

  return (
    <div className="fixed top-14 bottom-0 right-0 w-64 h-full bg-gray-200/55 flex flex-col gap-4 items-start p-5">
      {allowedLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathName === link.href
              ? `flex justify-start items-center gap-2 w-full text-blue-800 bg-blue-100 px-4 py-3 rounded-lg`
              : "flex items-center justify-start gap-2 w-full"
          }
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;

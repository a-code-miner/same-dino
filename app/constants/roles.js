// src/constants/roles.js
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  CANTEEN: "canteen",
  PARENTS: "parents",
  SCHOOL_MANAGER: "school_manager",
};

export const ROLE_ACCESS = {
  [ROLES.SUPER_ADMIN]: [
    "/super_admin",
    "/super_admin/users",
    "/super_admin/orders_history",
    "/super_admin/sales_history",
    "/super_admin/products",
    "/super_admin/qrcards",
  ],
  [ROLES.CANTEEN]: [
    "/canteen",
    "/canteen/orders_history",
    "/canteen/sales_history",
    "/canteen/products",
  ],
  [ROLES.PARENTS]: ["/parents", "/parents/orders_history"],
  [ROLES.SCHOOL_MANAGER]: ["/school_manager"],
};

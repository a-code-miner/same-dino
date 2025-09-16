// src/constants/roles.js
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  STAFF: "staff",
  PARENT: "parent",
  ADMIN: "admin",
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
  [ROLES.STAFF]: [
    "/staff",
    "/staff/orders_history",
    "/staff/sales_history",
    "/staff/products",
    "staff/sales_management",
    "staff/orders_management",
  ],
  [ROLES.PARENT]: ["/parent", "/parent/orders_history"],
  [ROLES.ADMIN]: ["/admin"],
};

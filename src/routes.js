import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  MdDashboard,
  MdInventory2,
  MdCategory,
  MdShoppingCart,
  MdRequestQuote,
  MdNotifications,
  MdPeople,
  MdHistory,
} from "react-icons/md";

// Admin Imports
import Dashboard from "views/admin/dashboard";
import Products from "views/admin/products";
import Categories from "views/admin/categories";
import Orders from "views/admin/orders";
import Quotes from "views/admin/quotes";
import Notifications from "views/admin/notifications";
import Customers from "views/admin/customers";
import Logs from "views/admin/logs";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/dashboard",
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: <Dashboard />,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "/products",
    icon: <Icon as={MdInventory2} width="20px" height="20px" color="inherit" />,
    component: <Products />,
  },
  {
    name: "Categories",
    layout: "/admin",
    path: "/categories",
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    component: <Categories />,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "/orders",
    icon: (
      <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />
    ),
    component: <Orders />,
  },
  {
    name: "Quotes",
    layout: "/admin",
    path: "/quotes",
    icon: (
      <Icon as={MdRequestQuote} width="20px" height="20px" color="inherit" />
    ),
    component: <Quotes />,
  },
  {
    name: "Notifications",
    layout: "/admin",
    path: "/notifications",
    icon: (
      <Icon as={MdNotifications} width="20px" height="20px" color="inherit" />
    ),
    component: <Notifications />,
  },
  {
    name: "Customers",
    layout: "/admin",
    path: "/customers",
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <Customers />,
  },
  {
    name: "Logs",
    layout: "/admin",
    path: "/logs",
    icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
    component: <Logs />,
  },
];

export default routes;

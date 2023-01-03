import {
  AiFillGift,
  AiOutlineBars,
  AiOutlineDashboard,
  AiOutlineUser,
  AiTwotoneCustomerService,
} from "react-icons/ai";
import { RiProductHuntFill } from "react-icons/ri";
import { FaBlogger, FaHome, FaInfoCircle, FaUsers } from "react-icons/fa";

export const menus = [
  {
    path: "/admin",
    name: "Dashboard",
    icon: <AiOutlineDashboard />,
  },
  {
    path: "/#",
    name: "Home",
    icon: <FaHome />,
    highlight: [
      "/admin/home",
      "/admin/home/subcategory",
      "/admin/home/brand",
      "/admin/home/slider",
      "/admin/home/banner",
      "/admin/home/adv",
      "/admin/home/offer",
      "/admin/home/prosubcategory",
      "/admin/home/faq",
    ],
    subRoutes: [
      {
        path: "/admin/home",
        name: "Category",
      },
      {
        path: "/admin/home/subcategory",
        name: "Sub Category",
      },
      {
        path: "/admin/home/prosubcategory",
        name: "Pro Sub Category",
      },
      {
        path: "/admin/home/brand",
        name: "Brand",
      },
      {
        path: "/admin/home/slider",
        name: "Slider ",
      },
      {
        path: "/admin/home/banner",
        name: "Banner ",
      },
      {
        path: "/admin/home/adv",
        name: "ADV ",
      },
      {
        path: "/admin/home/offer",
        name: "Special Offer",
      },
      {
        path: "/admin/home/faq",
        name: "FAQ",
      },
    ],
  },
  {
    path: "/#",
    name: "Products",
    icon: <RiProductHuntFill />,
    highlight: ["/admin/product", "/admin/product/add-product"],
    subRoutes: [
      {
        path: "/admin/product",
        name: "All Products",
      },
      {
        path: "/admin/product/addproduct",
        name: "Add Product",
      },
    ],
  },
  {
    path: "/admin/customer",
    name: "Customer",
    icon: <AiTwotoneCustomerService />,
    highlight: ["/admin/customer", "/admin/customer/order"],
    subRoutes: [
      {
        path: "/admin/customer",
        name: "ALL Customer",
      },
      {
        path: "/admin/customer/order",
        name: "Order",
      },
    ],
  },
  {
    path: "/admin/cupon",
    name: "Coupon",
    icon: <AiFillGift />,
    highlight: ["/admin/coupon"],
    subRoutes: [
      {
        path: "/admin/coupon",
        name: "Coupon Code",
      },
    ],
  },
  {
    path: "/#",
    name: "User Role",
    icon: <AiOutlineUser />,
    highlight: ["/admin/user"],
    subRoutes: [
      {
        path: "/admin/user",
        name: "User",
      },
    ],
  },
  {
    path: "/#",
    name: "Vendor",
    icon: <FaUsers />,
    highlight: ["/admin/vandor"],
    subRoutes: [
      {
        path: "/admin/vandor",
        name: "All Vendor",
      },
    ],
  },
  {
    path: "/#",
    name: "Blog",
    icon: <FaBlogger />,
    highlight: ["/admin/blog"],
    subRoutes: [
      {
        path: "/admin/blog",
        name: "All Blog",
      },
      {
        path: "/admin/blog/addblog",
        name: "Add Blog",
      },
    ],
  },
  {
    path: "/footer",
    name: "Footer",
    icon: <AiOutlineBars />,
    highlight: [
      "/admin/footer",
      "/admin/footer/about",
      "/admin/footer/privacy",
      "/admin/footer/terms",
    ],
    subRoutes: [
      {
        path: "/admin/footer",
        name: "Important Links",
      },
      {
        path: "/admin/footer/about",
        name: "About Company",
      },
      {
        path: "/admin/footer/privacy",
        name: "Privacy Policy",
      },
      {
        path: "/admin/footer/terms",
        name: "Terms of Service",
      },
    ],
  },
  {
    path: "/report",
    name: "Report",
    icon: <FaInfoCircle />,
    highlight: [
      "/admin/report",
      "/admin/report/proccessing",
      "/admin/report/shipping",
      "/admin/report/cancel",
    ],
    subRoutes: [
      {
        path: "/admin/report",
        name: "Sale",
      },
      {
        path: "/admin/report/proccessing",
        name: "Processing",
      },
      {
        path: "/admin/report/shipping",
        name: "Shipping",
      },
      {
        path: "/admin/report/cancel",
        name: "Cancel",
      },
    ],
  },
];

export const vendorMenu = [
  {
    path: "/#",
    name: "Products",
    icon: <RiProductHuntFill />,
    highlight: ["/admin/product", "/admin/product/add-product"],
    subRoutes: [
      {
        path: "/admin/product",
        name: "All Products",
      },
      {
        path: "/admin/product/addproduct",
        name: "Add Product",
      },
    ],
  },
  {
    path: "/#",
    name: "Coupon",
    icon: <AiFillGift />,
    highlight: ["/admin/coupon"],
    subRoutes: [
      {
        path: "/admin/coupon",
        name: "Coupon Code",
      },
    ],
  },
  {
    path: "/#",
    name: "Blog",
    icon: <FaBlogger />,
    highlight: ["/admin/blog"],
    subRoutes: [
      {
        path: "/admin/blog",
        name: "All Blog",
      },
      {
        path: "/admin/blog/addblog",
        name: "Add Blog",
      },
    ],
  },
];

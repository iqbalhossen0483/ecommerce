import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useStore from "../context/useStore";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const store = useStore();
  const vendorRoute =
    /\/admin\/product|^\/admin\/product\/editproduct|\/admin\/product\/addproduct|\/admin\/coupon|\/admin\/coupon\/addcoupon|^\/admin\/coupon\/editcoupon|\/admin\/blog|\/admin\/blog\/addblog|^\/adming\/blog\/editbolg/;

  useEffect(() => {
    if (!store.loading && !store.user) {
      router.push("/login");
      store.setRedirect("/admin");
    } else if (!store.loading && /vendor|uploader/.test(store.user.user_role)) {
      if (!vendorRoute.test(router.pathname)) {
        router.push("/admin/product");
      } else setLoading(false);
    } else if (!store.loading && store.user.user_role === "owner") {
      setLoading(false);
    }
  }, [store.loading, store.user, router.pathname]);

  return (
    <>
      {loading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default AdminRoute;

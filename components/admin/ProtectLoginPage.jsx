import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useStore from "../context/useStore";

const ProtectLoginPage = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    if (!store.loading && store.user) {
      router.push(store?.redirect);
    } else if (!store.loading && !store.user) {
      setLoading(false);
    }
  }, [store.loading, store.user]);

  return <>{loading ? null : children}</>;
};

export default ProtectLoginPage;

import React, { useEffect } from "react";
import useStore from "../context/useStore";

const Alert = () => {
  const store = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      store?.setAlert(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [store.alert.msg]);

  if (!store?.alert.msg) return null;
  return (
    <div className="alertContainer">
      <div className={store?.alert.type}>{store?.alert.msg}</div>
    </div>
  );
};

export default Alert;

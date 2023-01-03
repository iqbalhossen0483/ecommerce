import { useEffect, useState } from "react";

const Store = () => {
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState("/");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch(`/api/login?token=${token}`);
          const result = await res.json();
          if (res.ok) {
            setUser(result.user);
            localStorage.setItem("token", result.token);
          } else throw result;
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    })();
  }, []);

  async function fetchData(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        if (data) return { data, error: null };
        else throw { message: "No data found" };
      } else throw data;
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async function deleteData(url, formData) {
    try {
      const res = await fetch(url, {
        method: "DELETE",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) return { error: false, message: result.message };
      else throw result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async function addOrEditData(url, formData, method) {
    try {
      const res = await fetch(url, {
        method: method,
        body: formData,
      });
      const result = await res.json();
      if (res.ok) return { error: false, message: result.message };
      else throw result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  return {
    alert,
    setAlert,
    fetchData,
    deleteData,
    addOrEditData,
    user,
    setUser,
    redirect,
    setRedirect,
    loading,
  };
};

export default Store;

import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBlogger } from "react-icons/fa";
import { PageInfo } from "../../../components/admin/common/common";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";
const TextEditor = dynamic(
  () => import("../../../components/admin/common/TextEditor"),
  {
    ssr: false,
  }
);

const Addblog = () => {
  const { handleSubmit, register, reset } = useForm();
  const [subCategory, setSubCategory] = useState(null);
  const [showProsub, setShowProSub] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSub, setShowSub] = useState(null);
  const [prosub, setProSub] = useState(null);
  const body = useRef(null);
  const store = useStore();

  //get category , sub category, pro sub category info;
  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData("/api/category");
      if (data) setCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
    (async function () {
      const { data, error } = await store?.fetchData("/api/subcategory");
      if (data) setSubCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
    (async function () {
      const { data, error } = await store?.fetchData("/api/prosub");
      if (data) setProSub(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []); //till;

  //handle sub category based on category;
  function handleSubCategory(id) {
    if (id) {
      const sub = subCategory?.filter((item) => item.category_id == id);
      if (sub.length) setShowSub(sub);
      else setShowSub(null);
    } else setShowSub(null);
  } //till;
  //handle pro sub category based on sub category;
  function handleProSub(id) {
    if (id) {
      const sub = prosub?.filter((item) => item.sub_category_id == id);
      if (sub.length) setShowProSub(sub);
      else setShowProSub(null);
    } else setShowProSub(null);
  } //till;

  async function onsubmit(data) {
    if (!store.user) return;
    setLoading(true);
    try {
      data.body = body.current?.value;
      data.user_id = store.user.id;
      data.user_type = store.user.user_role;
      if (!data.body) {
        body.current?.focus();
        return store?.setAlert({ msg: "Give the body info", type: "info" });
      }
      data.category_name = category?.find(
        (item) => item.id == data.category_id
      )?.name;
      data.sub_category_name = subCategory?.find(
        (item) => item.id == data.sub_category_id
      )?.name;
      data.pro_sub_name = prosub?.find(
        (item) => item.id == data.pro_sub_id
      )?.name;

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        reset();
        store?.setAlert({ msg: result.message, type: "success" });
      } else throw result;
    } catch (error) {
      store?.setAlert({ msg: error.message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <div>
        <PageInfo title="Blog" type="Add" icon={<FaBlogger />} />
        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Blog Title</label>
              <textarea
                {...register("title", { required: true })}
                required
                rows={1}
                placeholder="Blog Title"
              />
            </div>
            <div>
              <label>Product Category</label>
              <select
                {...register("category_id", { required: true })}
                className="w-full"
                required
                onChange={(e) => handleSubCategory(e.target.value)}
              >
                <option value="">select</option>
                {category &&
                  category.length &&
                  category.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Product Sub Category</label>
              <select
                {...register("sub_category_id", { required: showSub })}
                onChange={(e) => handleProSub(e.target.value)}
                className="w-full"
                required={showSub}
              >
                <option value="">select</option>
                {showSub &&
                  showSub.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label>Product Pro Sub Category</label>
              <select
                {...register("pro_sub_id", { required: showProsub })}
                className="w-full"
                required={showProsub}
              >
                <option value="">select</option>
                {showProsub &&
                  showProsub.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="z-40">
              <label>Blog body</label>
              <TextEditor editorRef={body} page="blog" />
            </div>

            <div className="flex justify-between">
              <button
                disabled={loading}
                type="submit"
                className="btn active text-sm"
              >
                SAVE
              </button>
              <Link href="/admin/home/faq">
                <button
                  type="button"
                  className="btn text-sm"
                  style={{ backgroundColor: "#dc3545", color: "#fff" }}
                >
                  GO BACK
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Addblog;

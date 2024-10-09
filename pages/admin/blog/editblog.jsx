import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
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

const Editblog = () => {
  const [subCategory, setSubCategory] = useState(null);
  const [showProsub, setShowProSub] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showSub, setShowSub] = useState(null);
  const [prosub, setProSub] = useState(null);
  const { handleSubmit, register } = useForm();
  const [blog, setBlog] = useState(null);
  const body = useRef(null);
  const store = useStore();
  const router = useRouter();

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

  //set initial sub category and pro sub categoyr;
  useEffect(() => {
    if (blog && subCategory) {
      const sub = subCategory.filter(
        (item) => item.category_id === blog.category_id
      );
      if (sub && sub.length) setShowSub(sub);
    }
    if (blog && prosub) {
      const sub = prosub.filter((item) => item.id === blog.pro_sub_id);
      console.log(sub);
      if (sub && sub.length) setShowProSub(sub);
    }
  }, [blog, subCategory]); //till;

  //get product info from db;
  useEffect(() => {
    if (router.query.id) {
      (async function () {
        const { data, error } = await store?.fetchData(
          `/api/blog?id=${router.query.id}`
        );
        if (data) setBlog(data[0]);
        else {
          store?.setAlert({ msg: error, type: "error" });
          router.push("/admin/blog");
        }
      })();
    }
  }, [router.query.id, update]); //till;

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
    if (!store.user || !router.query.id) return;
    setLoading(true);
    try {
      data.body = body.current?.value;
      data.user_id = store.user.id;
      data.user_type = store.user.user_role;

      const res = await fetch(`/api/blog?id=${router.query.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setUpdate((prev) => !prev);
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
        <PageInfo title='Blog' type='Add' icon={<FaBlogger />} />
        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Blog Title</label>
              <textarea
                {...register("title")}
                defaultValue={blog?.title || ""}
                rows={1}
                placeholder='Blog Title'
              />
            </div>
            <div>
              <label>Product Category</label>
              <select
                {...register("category_id")}
                className='w-full'
                onChange={(e) => handleSubCategory(e.target.value)}
              >
                <option value=''>select</option>
                {category &&
                  category.length &&
                  category.map((item) => (
                    <option
                      selected={blog?.category_id === item.id}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Product Sub Category</label>
              <select
                {...register("sub_category_id")}
                onChange={(e) => handleProSub(e.target.value)}
                className='w-full'
              >
                <option value=''>select</option>
                {showSub &&
                  showSub.map((item) => (
                    <option
                      selected={blog?.sub_category_id === item.id}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label>Product Pro Sub Category</label>
              <select {...register("pro_sub_id")} className='w-full'>
                <option value=''>select</option>
                {showProsub &&
                  showProsub.map((item) => (
                    <option
                      selected={blog?.pro_sub_id === item.id}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className='z-40'>
              <label>Blog body</label>
              <TextEditor value={blog?.body} editorRef={body} page='blog' />
            </div>

            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                UPDATE
              </button>
              <Link href='/admin/home/faq'>
                <button
                  type='button'
                  className='btn text-sm'
                  style={{ backgroundColor: "#dc3545", color: "#fff" }}
                >
                  CANCEL
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Editblog;

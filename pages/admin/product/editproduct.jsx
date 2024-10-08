import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { RiProductHuntFill } from "react-icons/ri";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
const TextEditor = dynamic(
  () => import("../../../components/admin/common/TextEditor"),
  {
    ssr: false,
  }
);

const EditProduct = () => {
  const [subCategory, setSubCategory] = useState(null);
  const [showProsub, setShowProSub] = useState(null);
  const [deleteImg, setDeleteImg] = useState([]);
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const { handleSubmit, register } = useForm();
  const [prosub, setProSub] = useState(null);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSub, setShowSub] = useState(null);
  const description = useRef(null);
  const router = useRouter();
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
    (async function () {
      const { data, error } = await store?.fetchData("/api/brand");
      if (data) setBrand(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []); //till;

  //set initial sub category and pro sub categoyr;
  useEffect(() => {
    if (!product) return;
    if (subCategory) {
      const sub = subCategory.filter(
        (item) => item.category_id === product.category_id
      );
      if (sub && sub.length) setShowSub(sub);
    }
    if (prosub) {
      const sub = prosub.filter(
        (item) => item.sub_category_id === product.sub_category_id
      );
      if (sub && sub.length) setShowProSub(sub);
    }
  }, [product, subCategory]); //till;

  //get product info from db;
  useEffect(() => {
    if (router.query.id) {
      (async function () {
        const { data, error } = await store?.fetchData(
          `/api/product?id=${router.query.id}`
        );
        if (data) setProduct(data[0]);
        else {
          store?.setAlert({ msg: error, type: "error" });
          router.push("/admin/product");
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

  async function onSubmit(data) {
    try {
      if (!product) return;
      setLoading(true);
      data.user_id = store.user.id;
      data.qr_code = `name: ${data.name || product.name},`;
      data.qr_code += `\nsku: ${data.sku || product.sku},`;
      data.qr_code += `\nprice: ${data.price || product.price}`;
      if (store.user.user_role === "vendor") {
        data.qr_code += `\nvendor: ${store.user.shop_name}`;
      }
      data.user_type = store.user.user_role;

      //insert same value;
      if (product.description !== description.current?.value) {
        data.description = description.current?.value;
      }
      data.main_image = data.main_image[0];
      data.updated_by = store.user.id;

      //check if images need delete;
      let img = [];
      if (data.main_image) img.push(product.main_image);
      if (deleteImg.length) img.push(...deleteImg);
      if (img.length) data.deleteImage = JSON.stringify(img);
      //till;
      //need not delete image;
      const needImage = [];
      product.features_img.split("|").forEach((img) => {
        if (!deleteImg.includes(img)) needImage.push(img);
      });
      if (needImage.length) data.needImage = JSON.stringify(needImage);

      //set all data into formdata;
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          if (key !== "features_img") {
            formData.append(key, value);
          } else {
            Array.from(value).forEach((img) => {
              formData.append("features_img", img);
            });
          }
        }
      }); //till;

      //save data;
      const { error, message } = await store?.addOrEditData(
        `/api/product?id=${product.id}`,
        formData,
        "PUT"
      );
      if (!error) {
        setUpdate((prev) => !prev);
        store?.setAlert({ msg: message, type: "success" });
      } else {
        store?.setAlert({ msg: message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  }

  const inputs = [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      required: true,
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      required: true,
    },
    {
      name: "price",
      label: "Product sale price",
      type: "number",
      required: true,
    },
    {
      name: "prev_price",
      label: "Product previous price",
      type: "number",
      required: false,
    },
    {
      name: "tax",
      label: "Tax (%)",
      type: "text",
      required: false,
    },
    {
      name: "stock",
      label: "Product Stock",
      type: "number",
      required: true,
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <PageInfo title='Product' type='Edit' icon={<RiProductHuntFill />} />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onSubmit)}>
            {inputs.map((item, i) => (
              <div key={i}>
                <label>{item.label}</label>
                <input
                  {...register(item.name)}
                  defaultValue={(product && product[item.name]) || ""}
                  type={item.type}
                  placeholder={item.label}
                />
              </div>
            ))}
            <div>
              <label>Keywords</label>
              <input
                {...register("keyword")}
                type='text'
                defaultValue={product?.keyword || ""}
                placeholder='Give input like a | b | c'
              />
            </div>
            <div>
              <label>Product size</label>
              <input
                {...register("size")}
                defaultValue={product?.size || ""}
                type='text'
                placeholder='Give input like a | b | c'
              />
            </div>
            <div>
              <label>Colour variant</label>
              <input
                {...register("colour")}
                defaultValue={product?.colour || ""}
                type='text'
                placeholder='Give input like a | b | c'
              />
            </div>
            <div>
              <label>Brand Name</label>
              <select {...register("brand")} className='w-full'>
                <option value=''>select</option>
                {brand &&
                  brand.length &&
                  brand.map((item) => (
                    <option
                      selected={item.id === product.brand}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
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
                      selected={product?.category_id === item.id}
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
                      selected={product?.sub_category_id === item.id}
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
                      selected={product?.pro_sub_id === item.id}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label>Short Description</label>
              <textarea
                {...register("short_description")}
                defaultValue={product?.short_description || ""}
                placeholder='Short Description'
                rows='6'
              />
            </div>
            <div className='z-0'>
              <label>Description</label>
              <TextEditor
                editorRef={description}
                value={product?.description}
              />
            </div>

            {/* main image */}
            <div className='edit-input-container'>
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  Main Image
                </label>
                <input {...register("main_image")} type='file' />
              </div>
              <div>
                {product && (
                  <img
                    className='h-16'
                    src={`/assets/${product.main_image}`}
                    alt=''
                  />
                )}
              </div>
            </div>

            {/* features image */}
            <div className='edit-input-container'>
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  Features Images
                </label>
                <input {...register("features_img")} multiple type='file' />
              </div>
              <div className='flex flex-wrap gap-2'>
                {product &&
                  product.features_img &&
                  product.features_img.split("|").map((img, i) => {
                    return img ? (
                      <div
                        onClick={() =>
                          setDeleteImg((prev) => {
                            if (!prev.includes(img)) return [...prev, img];
                            return [...prev.filter((item) => item !== img)];
                          })
                        }
                        key={i}
                        className={`delete-btn-container-onhover ${
                          deleteImg.includes(img) ? "grayscale" : ""
                        }`}
                      >
                        <img className='h-16 ' src={`/assets/${img}`} alt='' />
                        <div className='delete-btn-onhover'>
                          <FaTrash />
                        </div>
                      </div>
                    ) : null;
                  })}
              </div>
            </div>

            {/* action buttons */}
            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                UPDATE
              </button>
              <Link href='/admin/product'>
                <button
                  type='button'
                  className='btn text-sm'
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

export default EditProduct;

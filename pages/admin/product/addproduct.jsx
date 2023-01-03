import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { RiProductHuntFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
import dynamic from "next/dynamic";
const TextEditor = dynamic(
  () => import("../../../components/admin/common/TextEditor"),
  {
    ssr: false,
  }
);

const AddProduct = () => {
  const [featuresImgUrl, setFeatureUrl] = useState(null);
  const { handleSubmit, register, reset } = useForm();
  const [subCategory, setSubCategory] = useState(null);
  const [mainImgUrl, setMainImgUrl] = useState(null);
  const [showProsub, setShowProSub] = useState(null);
  const [category, setCategory] = useState(null);
  const [showSub, setShowSub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prosub, setProSub] = useState(null);
  const description = useRef(null);
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

  //save data to db;
  async function onSubmit(data) {
    //check description has value;
    if (!description.current?.value) {
      return store?.setAlert({
        msg: "Please add the product description",
        type: "info",
      });
    }
    setLoading(true);
    data.user_id = store.user.id;
    data.user_type = store.user.user_role;
    data.qr_code = `
    name: ${data.name},
    ${
      store.user.user_role === "vendor"
        ? `vendor: ${store.user.shop_name},`
        : ""
    } 
    sku: ${data.sku}, price: ${data.price}`;

    //find the category, sub category and pro sub name base on their ids;
    data.category_name = category?.find(
      (item) => item.id == data.category_id
    )?.name;
    if (data.sub_category_id) {
      data.sub_category_name = subCategory?.find(
        (item) => item.id == data.sub_category_id
      )?.name;
    }
    if (data.pro_sub_id) {
      data.pro_sub_name = prosub?.find(
        (item) => item.id == data.pro_sub_id
      )?.name;
    }

    data.description = description.current?.value;
    data.main_image = data.main_image[0];
    data.created_by = store.user.id;
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
    });

    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/product",
      formData,
      "POST"
    );
    if (!error) {
      store?.setAlert({ msg: message, type: "success" });
      reset();
      setMainImgUrl(null);
      setFeatureUrl(null);
    } else {
      store?.setAlert({ msg: message, type: "error" });
    }
    setLoading(false);
  } //till;

  const inputs = [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      required: true,
    },
    {
      name: "brand",
      label: "Brand Name",
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
      type: "number",
      required: false,
    },
    {
      name: "stock",
      label: "Product Stock",
      type: "number",
      required: true,
    },
  ];

  function hanleMainImg(file) {
    if (file) {
      setMainImgUrl(URL.createObjectURL(file));
    } else setMainImgUrl(null);
  }
  function handleFeatureUrl(file) {
    if (file) {
      const images = [];
      Array.from(file).forEach((img) =>
        images.push({ name: img.name, url: URL.createObjectURL(img) })
      );
      setFeatureUrl(images);
    }
  }

  return (
    <DashboardLayout>
      <div>
        <PageInfo title="Product" type="Add" icon={<RiProductHuntFill />} />

        <div className="add-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            {inputs.map((item, i) => (
              <div key={i}>
                <label>{item.label}</label>
                <input
                  {...register(item.name, { required: item.required })}
                  required={item.required}
                  type={item.type}
                  placeholder={item.label}
                />
              </div>
            ))}
            <div>
              <label>Keywords</label>
              <input
                {...register("keyword", { required: true })}
                required
                type="text"
                placeholder="Give input like a | b | c"
              />
            </div>
            <div>
              <label>Product size</label>
              <input
                {...register("size")}
                type="text"
                placeholder="Give input like a | b | c"
              />
            </div>
            <div>
              <label>Colour variant</label>
              <input
                {...register("size")}
                type="text"
                placeholder="Give input like a | b | c"
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

            <div>
              <label>Product type</label>
              <select
                {...register("type", { required: true })}
                className="w-full"
                required
              >
                <option value="">select</option>
                <option value="single">Single</option>
                <option value="package">Package</option>
              </select>
            </div>
            <div>
              <label>Product Unit</label>
              <select
                {...register("unit", { required: true })}
                className="w-full"
                required
              >
                <option value="">select</option>
                <option value="piece">Piece</option>
                <option value="kg">KG</option>
              </select>
            </div>

            <div>
              <label>Short Description</label>
              <textarea
                {...register("short_description", { required: true })}
                required
                placeholder="Short Description"
                rows="6"
              />
            </div>
            <div>
              <label>Description</label>
              <TextEditor editorRef={description} />
            </div>
            <div className="edit-input-container">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  Main Image
                </label>
                <input
                  {...register("main_image", { required: true })}
                  required
                  onChange={(e) => hanleMainImg(e.target.files[0])}
                  accept="image/png, image/jpeg"
                  type="file"
                />
              </div>
              {mainImgUrl && <img className="h-8" src={mainImgUrl} alt="" />}
            </div>

            <div className="edit-input-container">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  Features Images
                </label>
                <input
                  {...register("features_img", { required: true })}
                  multiple
                  onChange={(e) => handleFeatureUrl(e.target.files)}
                  maxLength={5}
                  accept="image/png, image/jpeg"
                  required
                  type="file"
                />
              </div>
              {featuresImgUrl && (
                <div className="flex gap-1">
                  {featuresImgUrl.map((img, i) => (
                    <img className="h-8" key={i} src={img.url} alt="" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button
                disabled={loading}
                type="submit"
                className="btn active text-sm"
              >
                SAVE
              </button>
              <Link href="/admin/product">
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

export default AddProduct;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import Link from "next/link";
import useStore from "../../../../components/context/useStore";
import { useRouter } from "next/router";
import { PageInfo } from "../../../../components/admin/common/common";

const EditADV = () => {
  const { handleSubmit, register, reset } = useForm();
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [showSub, setShowSub] = useState(null);
  const [update, setUpdate] = useState(false);
  const [adv, setAdv] = useState(null);
  const [loading, setLoading] = useState(false);
  const store = useStore();
  const router = useRouter();

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
  }, []);

  useEffect(() => {
    (async function () {
      if (router.query.id) {
        const { data } = await store?.fetchData(
          `/api/adv?id=${router.query.id}`
        );
        if (data) {
          setAdv(data[0]);
        } else router.push("/admin/home");
      }
    })();
  }, [update, router.query.id]);

  useEffect(() => {
    if (adv && subCategory) {
      const sub = subCategory.filter(
        (item) => item.category_id === adv.category_id
      );
      if (sub && sub.length) setShowSub(sub);
    }
  }, [adv, subCategory]);

  function handleSubCategory(id) {
    if (id) {
      const sub = subCategory?.filter((item) => item.category_id == id);
      if (sub.length) setShowSub(sub);
      else setShowSub(null);
    } else setShowSub(null);
  }

  async function onsubmit(data) {
    if (!store.user) return;
    setLoading(true);

    data.user_id = store.user.id;
    data.image = data.image[0];
    if (data.category_id) {
      data.category_name = category?.find(
        (item) => item.id == data.category_id
      )?.name;
    } else delete data.category_id;
    if (data.sub_category_id) {
      data.sub_category_name = subCategory?.find(
        (item) => item.id == data.sub_category_id
      )?.name;
    } else delete data.sub_category_id;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (data.image) {
      formData.append("existimage", adv?.image);
    }
    //save data;
    const { error, message } = await store?.addOrEditData(
      `/api/adv?id=${adv?.id}`,
      formData,
      "PUT"
    );
    if (!error) {
      store?.setAlert({ msg: message, type: "success" });
      setUpdate((prev) => !prev);
    } else {
      store?.setAlert({ msg: message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title="Adv" type="Edit" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Category</label>
              <select
                {...register("category_id")}
                className="w-full"
                onChange={(e) => handleSubCategory(e.target.value)}
              >
                <option value="">select</option>
                {category &&
                  category.length &&
                  category.map((item) => (
                    <option
                      selected={item.id === adv?.category_id}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Sub Category Name</label>
              <select className="w-full" {...register("sub_category_id")}>
                <option value="">select</option>
                {showSub &&
                  showSub.map((item) => (
                    <option
                      selected={item.id === adv?.sub_category_id}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="edit-input-container">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
                <input {...register("image")} type="file" />
              </div>
              <div>
                {adv?.image && (
                  <img className="h-20" src={`/assets/${adv?.image}`} alt="" />
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                disabled={loading}
                type="submit"
                className="btn active text-sm"
              >
                UPDATE
              </button>
              <Link href="/admin/home/adv">
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
      </section>
    </DashboardLayout>
  );
};

export default EditADV;

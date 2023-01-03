import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import useStore from "../../../../components/context/useStore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

const EditBrand = () => {
  const { handleSubmit, register } = useForm();
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData("/api/category");
      if (data) setCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (router.query.id) {
        const { data } = await store?.fetchData(
          `/api/brand?id=${router.query.id}`
        );
        if (data) setBrand(data[0]);
        else router.push("/admin/home");
      }
    })();
  }, [update, router.query.id]);

  async function onsubmit(data) {
    if (!store.user) return;
    setLoading(true);
    data.user_id = store.user.id;
    data.image = data.image[0];
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (data.image) {
      formData.append("existimage", brand?.image);
    }
    //save data;
    const { error, message } = await store?.addOrEditData(
      `/api/brand?id=${brand?.id}`,
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
        <PageInfo title="Brand" type="Edit" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Brand Name</label>
              <input
                {...register("name")}
                defaultValue={brand?.name || ""}
                type="text"
                placeholder="Brand Name"
              />
            </div>
            <div>
              <label>Category</label>
              <select className="w-full" {...register("category_name")}>
                <option value="">select</option>
                {category &&
                  category.length &&
                  category.map((item) => (
                    <option
                      selected={item.id === brand?.category_id}
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
                {brand?.image && (
                  <img
                    className="h-20"
                    src={`/assets/${brand?.image}`}
                    alt=""
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                loading={loading}
                type="submit"
                className="btn active text-sm"
              >
                UPDATE
              </button>
              <Link href="/admin/home/brand">
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

export default EditBrand;

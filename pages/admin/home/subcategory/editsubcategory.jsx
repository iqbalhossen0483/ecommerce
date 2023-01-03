import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import useStore from "../../../../components/context/useStore";
import { PageInfo } from "../../../../components/admin/common/common";

const EditSubCategory = () => {
  const { handleSubmit, register, reset } = useForm();
  const [subcategory, setsubCategory] = useState(null);
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
          `/api/subcategory?id=${router.query.id}`
        );
        if (data) setsubCategory(data[0]);
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
      formData.append("existimage", subcategory?.image);
    }
    //save data;
    const { error, message } = await store?.addOrEditData(
      `/api/subcategory?id=${subcategory?.id}`,
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
        <PageInfo title="Sub Category" type="Edit" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Category</label>
              <select className="w-full" {...register("category_id")}>
                <option value="">Select</option>
                {category &&
                  category.length &&
                  category.map((item) => (
                    <option
                      selected={item.id === subcategory?.category_id}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Sub Category Name </label>
              <input
                {...register("name")}
                defaultValue={subcategory?.name || ""}
                type="text"
                placeholder="Sub Category Name"
              />
            </div>
            <div>
              <label>Sub Category Description </label>
              <textarea
                {...register("description")}
                rows={5}
                defaultValue={subcategory?.description || ""}
                type="text"
                placeholder="Sub Category Description"
              />
            </div>
            <div className="edit-input-container">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
                <input {...register("image")} type="file" />
              </div>
              <div>
                {subcategory?.image && (
                  <img
                    className="h-20"
                    src={`/assets/${subcategory?.image}`}
                    alt=""
                  />
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
              <Link href="/admin/home/subcategory">
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

export default EditSubCategory;

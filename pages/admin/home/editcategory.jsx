import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Link from "next/link";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { useRouter } from "next/router";
import useStore from "../../../components/context/useStore";
import { PageInfo } from "../../../components/admin/common/common";

const EditCategory = () => {
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [update, setUpdate] = useState(false);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      if (router.query.id) {
        const { data } = await store?.fetchData(
          `/api/category?id=${router.query.id}`
        );
        if (data) setCategory(data[0]);
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
      formData.append("existimage", category?.image);
    }
    //save data;
    const { error, message } = await store?.addOrEditData(
      `/api/category?id=${category?.id}`,
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
        <PageInfo title="Category" type="Edit" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>View Priority</label>
              <input
                {...register("priority")}
                defaultValue={category?.priority}
                type="number"
                placeholder="Priority"
              />
            </div>
            <div>
              <label>Category Name </label>
              <input
                {...register("name")}
                defaultValue={category?.name || ""}
                type="text"
                placeholder="Category Name"
              />
            </div>
            <div>
              <label>Category Description </label>
              <textarea
                {...register("description")}
                rows={5}
                defaultValue={category?.description || ""}
                type="text"
                placeholder="Category Description"
              />
            </div>
            <div className="flex gap-10 items-center">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
                <input {...register("image")} type="file" />
              </div>
              <div>
                {category && (
                  <img
                    className="h-20"
                    src={`/assets/${category?.image}`}
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
              <Link href="/admin/home">
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

export default EditCategory;

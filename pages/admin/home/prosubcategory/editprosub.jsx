import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import useStore from "../../../../components/context/useStore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

const EditProSubCategory = () => {
  const { handleSubmit, register, reset } = useForm();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prosub, setProsub] = useState(null);
  const [update, setUpdate] = useState(false);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData("/api/subcategory");
      if (data) setCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  useEffect(() => {
    if (router.query.id) {
      (async function () {
        const { data, error } = await store?.fetchData(
          `/api/prosub?id=${router.query.id}`
        );
        if (data) setProsub(data[0]);
        else {
          store?.setAlert({ msg: error, type: "error" });
          router.push("/admin/home/prosubcategory");
        }
      })();
    } else router.push("/admin/home/prosubcategory");
  }, [router.query.id, update]);

  async function onsubmit(data) {
    if (!store.user) return;
    setLoading(true);
    data.user_id = store.user.id;
    Object.entries(data).forEach(([key, value]) => {
      if (!value) delete data[key];
    });
    //save data;
    try {
      const res = await fetch(`/api/prosub?id=${prosub?.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        store?.setAlert({ msg: result.message, type: "success" });
        setUpdate((prev) => !prev);
      } else throw result;
    } catch (error) {
      store?.setAlert({ msg: error.message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title="Pro sub Category" type="Edit" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Pro Sub Name</label>
              <input
                {...register("name")}
                type="text"
                defaultValue={prosub?.name}
                placeholder="Pro Sub Category Name"
              />
            </div>
            <div>
              <label>Sub Category</label>
              <select
                className="w-full"
                {...register("sub_category_id", { required: true })}
                required
              >
                <option value="">Select</option>
                {category &&
                  category.length &&
                  category.map((item) => (
                    <option
                      selected={prosub?.sub_category_id === item.id}
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-between">
              <button
                disabled={loading}
                type="submit"
                className="btn active text-sm"
              >
                UPDATE
              </button>
              <Link href="/admin/home/prosubcategory">
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

export default EditProSubCategory;

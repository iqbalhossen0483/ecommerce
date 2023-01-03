import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import Link from "next/link";
import useStore from "../../../../components/context/useStore";
import { PageInfo } from "../../../../components/admin/common/common";

const AdSlider = () => {
  const { handleSubmit, register, reset } = useForm();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData("/api/category");
      if (data) setCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  async function onsubmit(data) {
    if (!store.user) return;

    setLoading(true);
    data.user_id = store.user.id;
    data.image = data.image[0];
    data.category_name = category?.find(
      (item) => item.id == data.category_id
    )?.name;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/slider",
      formData,
      "POST"
    );
    if (!error) {
      store?.setAlert({ msg: message, type: "success" });
      reset();
      setImgUrl(null);
    } else {
      store?.setAlert({ msg: message, type: "error" });
    }
    setLoading(false);
  }

  function imgHandler(file) {
    if (file) {
      setImgUrl(URL.createObjectURL(file));
    } else setImgUrl(null);
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title="Slider" type="Add" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Category</label>
              <select
                className="w-full"
                required
                {...register("category_id", { required: true })}
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
            <div className="edit-input-container">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
                <input
                  {...register("image", { required: true })}
                  onChange={(e) => imgHandler(e.target.files[0])}
                  required
                  accept="image/png, image/gif image/jpeg"
                  type="file"
                />
              </div>
              {imgUrl && <img className="h-8" src={imgUrl} alt="" />}
            </div>
            <div className="flex justify-between">
              <button
                disabled={loading}
                type="submit"
                className="btn active text-sm"
              >
                SAVE
              </button>
              <Link href="/admin/home/slider">
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

export default AdSlider;

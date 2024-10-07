import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PageInfo } from "../../../../components/admin/common/common";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";

const AdBanner = () => {
  const { handleSubmit, register, reset } = useForm();
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const store = useStore();

  async function onsubmit(data) {
    if (!store.user) return;
    setLoading(true);
    data.user_id = store.user.id;
    data.image = data.image[0];

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/banner",
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
        <PageInfo title='Baner' type='Add' />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Position</label>
              <input
                placeholder='Enter position'
                type='number'
                required
                {...register("position", { required: true })}
              />
            </div>
            <div>
              <label>Link</label>
              <input
                placeholder='Enter the link'
                type='text'
                required
                {...register("link", { required: true })}
              />
            </div>
            <div className='edit-input-container'>
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
                <input
                  {...register("image", { required: true })}
                  onChange={(e) => imgHandler(e.target.files[0])}
                  required
                  accept='image/png, image/jpeg'
                  type='file'
                />
              </div>
              {imgUrl && <img className='h-8' src={imgUrl} alt='' />}
            </div>
            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                SAVE
              </button>
              <Link href='/admin/home/banner'>
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
      </section>
    </DashboardLayout>
  );
};

export default AdBanner;

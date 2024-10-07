import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PageInfo } from "../../../../components/admin/common/common";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";

const EditBanner = () => {
  const { handleSubmit, register } = useForm();
  const [update, setUpdate] = useState(false);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      if (router.query.id) {
        const { data } = await store?.fetchData(
          `/api/banner?id=${router.query.id}`
        );
        if (data) {
          setBanner(data[0]);
        } else router.push("/admin/home");
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
      formData.append("existimage", banner?.image);
    }
    //save data;
    const { error, message } = await store?.addOrEditData(
      `/api/banner?id=${banner?.id}`,
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
        <PageInfo title='Baner' type='Edit' />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Position</label>
              <input
                placeholder='Enter position'
                type='number'
                {...register("position")}
                defaultValue={banner?.position}
              />
            </div>
            <div>
              <label>Link</label>
              <input
                placeholder='Enter the link'
                type='text'
                {...register("link")}
                defaultValue={banner?.link}
              />
            </div>
            <div className='edit-input-container'>
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
                <input {...register("image")} type='file' />
              </div>
              <div>
                {banner?.image && (
                  <img
                    className='h-20'
                    src={`/assets/${banner?.image}`}
                    alt=''
                  />
                )}
              </div>
            </div>

            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                UPDATE
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

export default EditBanner;

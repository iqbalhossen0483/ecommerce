import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import useStore from "../../../../components/context/useStore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

const EditOffer = () => {
  const { handleSubmit, register } = useForm();
  const [update, setUpdate] = useState(false);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      if (router.query.id) {
        const { data } = await store?.fetchData(
          `/api/offer?id=${router.query.id}`
        );
        if (data) {
          setOffer(data[0]);
        } else router.push("/admin/home/offer");
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
      `/api/offer?id=${offer?.id}`,
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
        <PageInfo title="Special Offer" type="Edit" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>View Priority</label>
              <input
                {...register("priority")}
                type="number"
                defaultValue={offer?.priority}
                placeholder="Priority"
              />
            </div>
            <div>
              <label>Title </label>
              <input
                {...register("title")}
                defaultValue={offer?.title || ""}
                type="text"
                placeholder="Title"
              />
            </div>
            <div>
              <label>Product Link </label>
              <input
                {...register("product_link")}
                defaultValue={offer?.product_link || ""}
                type="url"
                placeholder="Product link"
              />
            </div>
            <div className="edit-input-container">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
                <input {...register("image")} type="file" />
              </div>
              <div>
                {offer?.image && (
                  <img
                    className="h-20"
                    src={`/assets/${offer?.image}`}
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
              <Link href="/admin/home/offer">
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

export default EditOffer;

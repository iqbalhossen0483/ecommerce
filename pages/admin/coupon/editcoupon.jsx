import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGift } from "react-icons/fa";
import { PageInfo } from "../../../components/admin/common/common";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";

const EditCuppon = () => {
  const { handleSubmit, register, reset } = useForm();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      (async function () {
        const { data, error } = await store?.fetchData(
          `/api/coupon?id=${router.query.id}`
        );
        if (data) setCoupon(data[0]);
        else {
          store?.setAlert({ msg: error, type: "error" });
          router.push("/admin/coupon");
        }
      })();
    }
  }, [router.query.id, update]);

  async function onsubmit(data) {
    setLoading(true);
    Object.entries(data).forEach(([key, value]) => {
      if (!value) delete data[key];
    });
    data.user_id = store.user.id;
    data.user_type = store.user.user_role;
    //save data;
    try {
      const res = await fetch(`/api/coupon?id=${coupon?.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        store?.setAlert({ msg: result.message, type: "success" });
        reset();
        setUpdate((prev) => !prev);
      } else throw result;
    } catch (error) {
      store?.setAlert({ msg: error.message, type: "error" });
    }
    setLoading(false);
  }

  if (!coupon) return null;
  return (
    <DashboardLayout>
      <section>
        <PageInfo title="Coupon Code" type="Edit" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Coupon Code </label>
              <input
                {...register("code")}
                type="text"
                defaultValue={coupon?.code}
                placeholder="Coupon Code"
              />
            </div>
            <div>
              <label>Discount Amount </label>
              <input
                {...register("amount")}
                type="number"
                defaultValue={coupon?.amount}
                placeholder="Discount Amount"
              />
            </div>
            <div>
              <label>Discount Type </label>
              <div className="w-[50px] ml-3">
                <div className="flex items-center gap-4">
                  <input
                    {...register("type")}
                    defaultChecked={coupon?.type === "fixed"}
                    type="radio"
                    name="type"
                    value="fixed"
                    id="fixed"
                  />
                  <label style={{ margin: 0 }} htmlFor="fixed">
                    Fixed
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    {...register("type")}
                    type="radio"
                    defaultChecked={coupon?.type === "percent"}
                    name="type"
                    value="percent"
                    id="percent"
                  />
                  <label style={{ margin: 0 }} htmlFor="percent">
                    Percent
                  </label>
                </div>
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
              <Link href="/admin/coupon">
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

export default EditCuppon;

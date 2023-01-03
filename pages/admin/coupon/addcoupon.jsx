import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";

const AddCuppon = () => {
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const store = useStore();

  async function onsubmit(data) {
    setLoading(true);
    data.user_id = store.user.id;
    data.user_type = store.user.user_role;
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        store?.setAlert({ msg: result.message, type: "success" });
        reset();
      } else throw result;
    } catch (error) {
      store?.setAlert({ msg: error.message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title="Coupon" type="Add" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Coupon Code </label>
              <input
                {...register("code", { required: true })}
                required
                type="text"
                placeholder="Coupon Code"
              />
            </div>
            <div>
              <label>Discount Amount </label>
              <input
                {...register("amount", { required: true })}
                required
                type="number"
                placeholder="Discount Amount"
              />
            </div>
            <div>
              <label>Discount Type </label>
              <div className="w-[50px] ml-3">
                <div className="flex items-center gap-4">
                  <input
                    {...register("type", { required: true })}
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
                    {...register("type", { required: true })}
                    type="radio"
                    defaultChecked
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
                SAVE
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

export default AddCuppon;

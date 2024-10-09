import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PageInfo } from "../../../components/admin/common/common";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";

const AddCuppon = () => {
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const store = useStore();

  async function onsubmit(data) {
    setLoading(true);
    data.user_id = store.user.id;
    data.user_type = store.user.user_role;
    if (store.user.user_role === "vendor") {
      data.store_id = store.user.id;
    }
    try {
      const { error, message } = await store?.addOrEditData(
        "/api/coupon",
        data,
        "POST",
        false
      );

      if (error) {
        store?.setAlert({ msg: message, type: "error" });
      } else {
        store?.setAlert({ msg: message, type: "success" });
        reset();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title='Coupon' type='Add' />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Coupon Code </label>
              <input
                {...register("code", { required: true })}
                required
                type='text'
                placeholder='Coupon Code'
              />
            </div>
            <div>
              <label>Discount Amount </label>
              <input
                {...register("amount", { required: true })}
                required
                type='text'
                placeholder='Discount Amount'
              />
            </div>
            <div>
              <label>Discount Type </label>
              <div className='w-[50px] ml-3'>
                <div className='flex items-center gap-4'>
                  <input
                    {...register("type", { required: true })}
                    type='radio'
                    name='type'
                    value='fixed'
                    id='fixed'
                  />
                  <label style={{ margin: 0 }} htmlFor='fixed'>
                    Fixed
                  </label>
                </div>
                <div className='flex items-center gap-4'>
                  <input
                    {...register("type", { required: true })}
                    type='radio'
                    defaultChecked
                    name='type'
                    value='percent'
                    id='percent'
                  />
                  <label style={{ margin: 0 }} htmlFor='percent'>
                    Percent
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label>Started From</label>
              <input {...register("started_at")} type='date' />
            </div>
            <div>
              <label>Validate for</label>
              <input {...register("validate_for")} type='date' />
            </div>

            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                SAVE
              </button>
              <Link href='/admin/coupon'>
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

export default AddCuppon;

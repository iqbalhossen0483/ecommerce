import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import useStore from "../../../../components/context/useStore";

const AddProsubCategory = () => {
  const { handleSubmit, register, reset } = useForm();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData("/api/subcategory");
      if (data) setCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  async function onsubmit(data) {
    if (!store.user) return;
    setLoading(true);
    try {
      data.user_id = store.user.id;
      const res = await fetch("/api/prosub", {
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
        <PageInfo title='Pro sub Category' type='Add' />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Sub Category</label>
              <select
                className='w-full'
                {...register("sub_category_id", { required: true })}
                required
              >
                <option value=''>Select</option>
                {category &&
                  category.length &&
                  category.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Pro Sub Name</label>
              <input
                {...register("name", { required: true })}
                required
                type='text'
                placeholder='Pro Sub Category Name'
              />
            </div>

            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                SAVE
              </button>
              <Link href='/admin/home/prosubcategory'>
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

export default AddProsubCategory;

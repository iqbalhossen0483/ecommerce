import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import { menuAnimation } from "../../../../components/admin/components/SidebarMenu";
import useStore from "../../../../components/context/useStore";

const AdOffer = () => {
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [products, setproducts] = useState(null);
  const [category, setCategory] = useState(null);
  const store = useStore();
  const [isProduct, setIsProduct] = useState({
    product: 0,
    category: 0,
    all_product: 0,
  });

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        "/api/product?opt=id,name"
      );
      if (data) setproducts(data.data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
    (async function () {
      const { data, error } = await store?.fetchData(
        "/api/category?opt=id,name"
      );

      if (data) setCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  async function onsubmit(data) {
    if (!store.user) return;
    try {
      setLoading(true);
      data.user_id = store.user.id;
      data.image = data.image[0];

      const formData = new FormData();
      Object.entries({ ...data, ...isProduct }).forEach(([key, value]) => {
        formData.append(key, value);
      });
      //save data;
      const { error, message } = await store?.addOrEditData(
        "/api/offer",
        formData,
        "POST"
      );
      if (!error) {
        store?.setAlert({ msg: message, type: "success" });
        reset();
      } else {
        store?.setAlert({ msg: message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  }
  function imgHandler(file) {
    if (file) {
      setImgUrl(URL.createObjectURL(file));
    } else setImgUrl(null);
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title='Special Offer' type='Add' />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>View Priority</label>
              <input
                {...register("priority", { required: true })}
                required
                type='number'
                placeholder='Priority'
              />
            </div>
            <div>
              <label>Offer Title </label>
              <input
                {...register("title", { required: true })}
                required
                type='text'
                placeholder='Title'
              />
            </div>

            <div>
              <label>Offer Type </label>
              <div className='radio'>
                <input
                  required
                  name='type'
                  type='radio'
                  id='type1'
                  value='product'
                  onChange={() =>
                    setIsProduct({ product: 1, category: 0, all_product: 0 })
                  }
                />
                <label style={{ margin: 0 }} htmlFor='type1'>
                  Specific Product
                </label>
              </div>
              <div className='radio'>
                <input
                  required
                  type='radio'
                  name='type'
                  id='type2'
                  value='category'
                  onChange={() =>
                    setIsProduct({ product: 0, category: 1, all_product: 0 })
                  }
                />
                <label style={{ margin: 0 }} htmlFor='type2'>
                  Specific Category
                </label>
              </div>
              <div className='radio'>
                <input
                  required
                  type='radio'
                  name='type'
                  id='type3'
                  value='all_product'
                  onChange={() =>
                    setIsProduct({ product: 0, category: 0, all_product: 1 })
                  }
                />
                <label style={{ margin: 0 }} htmlFor='type3'>
                  All Products
                </label>
              </div>
            </div>

            {isProduct.product ? (
              <AnimatePresence>
                <motion.div
                  variants={menuAnimation}
                  initial='hidden'
                  animate='show'
                  exit='hidden'
                >
                  <label>Product</label>
                  <select
                    className='w-full'
                    {...register("product_id", { required: true })}
                    required
                  >
                    <option value=''>Select product</option>
                    {products && products.length
                      ? products.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))
                      : null}
                  </select>
                </motion.div>
              </AnimatePresence>
            ) : isProduct.category ? (
              <AnimatePresence>
                <motion.div
                  variants={menuAnimation}
                  initial='hidden'
                  animate='show'
                  exit='hidden'
                >
                  <label>Category</label>
                  <select
                    className='w-full'
                    {...register("category_id", { required: true })}
                    required
                  >
                    <option value=''>Select category</option>
                    {category && category.length
                      ? category.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))
                      : null}
                  </select>
                </motion.div>
              </AnimatePresence>
            ) : null}
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
              <Link href='/admin/home/offer'>
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

export default AdOffer;

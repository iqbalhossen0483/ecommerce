import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import { menuAnimation } from "../../../../components/admin/components/SidebarMenu";
import useStore from "../../../../components/context/useStore";

const EditOffer = () => {
  const { handleSubmit, register } = useForm();
  const [update, setUpdate] = useState(false);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setproducts] = useState(null);
  const [category, setCategory] = useState(null);
  const store = useStore();
  const router = useRouter();
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

  useEffect(() => {
    (async function () {
      if (router.query.id) {
        const { data } = await store?.fetchData(
          `/api/offer?id=${router.query.id}`
        );
        if (data) {
          setOffer(data[0]);
          setIsProduct({
            product: data[0].product,
            category: data[0].category,
            all_product: data[0].all_product,
          });
        } else router.push("/admin/home/offer");
      }
    })();
  }, [update, router.query.id]);

  async function onsubmit(data) {
    if (!store.user) return;
    try {
      setLoading(true);
      if (offer.category && !isProduct.category) {
        data.category_id = "0";
      }
      if (offer.product && !isProduct.product) {
        data.product_id = "0";
      }

      data.user_id = store.user.id;
      data.image = data.image[0];
      isProduct.product = isProduct.product + "";
      isProduct.category = isProduct.category + "";
      isProduct.all_product = isProduct.all_product + "";
      const formData = new FormData();
      Object.entries({ ...data, ...isProduct }).forEach(([key, value]) => {
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
    } finally {
      setLoading(false);
    }
  }
  if (!offer) return null;
  return (
    <DashboardLayout>
      <section>
        <PageInfo title='Special Offer' type='Edit' />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>View Priority</label>
              <input
                {...register("priority")}
                type='number'
                defaultValue={offer?.priority}
                placeholder='Priority'
              />
            </div>
            <div>
              <label>Title </label>
              <input
                {...register("title")}
                defaultValue={offer?.title || ""}
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
                  defaultChecked={offer?.product ? true : false}
                  onChange={() =>
                    setIsProduct({ product: 1, category: 0, all_product: 0 })
                  }
                />
                <label htmlFor='type1'>Specific Product</label>
              </div>
              <div className='radio'>
                <input
                  required
                  type='radio'
                  name='type'
                  id='type2'
                  value='category'
                  defaultChecked={offer?.category ? true : false}
                  onChange={() =>
                    setIsProduct({ product: 0, category: 1, all_product: 0 })
                  }
                />
                <label htmlFor='type2'>Specific Category</label>
              </div>
              <div className='radio'>
                <input
                  required
                  type='radio'
                  name='type'
                  id='type3'
                  value='all_product'
                  defaultChecked={offer?.all_product ? true : false}
                  onChange={() =>
                    setIsProduct({ product: 0, category: 0, all_product: 1 })
                  }
                />
                <label htmlFor='type3'>All Products</label>
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
                          <option
                            selected={offer.product_id === item.id}
                            value={item.id}
                          >
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
                          <option
                            selected={offer.category_id === item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))
                      : null}
                  </select>
                </motion.div>
              </AnimatePresence>
            ) : null}
            <div className='edit-input-container'>
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
                <input {...register("image")} type='file' />
              </div>
              <div>
                {offer?.image && (
                  <img
                    className='h-20'
                    src={`/assets/${offer?.image}`}
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

export default EditOffer;

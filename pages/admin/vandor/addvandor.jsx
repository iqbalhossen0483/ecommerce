import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaUsers } from "react-icons/fa";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";

const AddVandor = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const store = useStore(null);

  async function onsubmit(data) {
    if (!/^(?:(?:\+|00)88|01)?\d{11}$/.test(data.number)) {
      return store?.setAlert({
        msg: "Mobile number is invalid",
        type: "error",
      });
    }
    //check password;
    if (data.password !== data.confirm_password) {
      return store?.setAlert({
        msg: "Please Check your password carefully",
        type: "info",
      });
    } else delete data.confirm_password; //till;

    setLoading(true);
    data.user_id = store.user.id;
    data.joined_at = new Date().toISOString();
    if (data.shop_logo) data.shop_logo = data.shop_logo[0];
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/vandor",
      formData,
      "POST"
    );
    if (!error) {
      reset();
      setImgUrl(null);
      store?.setAlert({ msg: message, type: "success" });
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
        <PageInfo title='Vendor' type='Add' icon={<FaUsers />} />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Vandor Name </label>
              <input
                {...register("name", { required: true })}
                required
                type='text'
                placeholder='Vandor Name'
              />
            </div>
            <div>
              <label>Vandor Email </label>
              <input
                {...register("email", { required: true })}
                required
                type='email'
                placeholder='Vandor Email'
              />
            </div>
            <div>
              <label>Phone Number </label>
              <input
                {...register("number", { required: true })}
                required
                type='text'
                placeholder='Vandor Phone number'
              />
            </div>
            <div>
              <label>Shop Name</label>
              <input
                {...register("shop_name", { required: true })}
                required
                type='text'
                placeholder='Shop Name'
              />
            </div>
            <div>
              <label>Trad Liecence</label>
              <input
                {...register("trad_liecence", { required: true })}
                required
                type='text'
                placeholder='Trad Liecence'
              />
            </div>
            <div>
              <label>Shop Location</label>
              <input
                {...register("shop_location", { required: true })}
                required
                type='text'
                placeholder='Shop Location'
              />
            </div>

            <div className='relative'>
              <label>Password</label>
              <input
                {...register("password", { required: true })}
                required
                minLength={6}
                type={showPassword ? "text" : "password"}
                placeholder='Password'
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute right-3 top-11'
              >
                {showPassword ? <AiFillEyeInvisible /> : <FaEye />}
              </button>
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                {...register("confirm_password", { required: true })}
                required
                minLength={6}
                type='password'
                placeholder='Confirm Password'
              />
            </div>

            <div className='edit-input-container'>
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  Shop Logo
                </label>
                <input
                  {...register("shop_logo")}
                  onChange={(e) => imgHandler(e.target.files[0])}
                  type='file'
                  accept='image/png, image/jpeg'
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
              <Link href='/admin/vandor'>
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

export default AddVandor;

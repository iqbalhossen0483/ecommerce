import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaUser } from "react-icons/fa";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
import { userRole } from "./index";

const AddUser = () => {
  const [showPassword, setShowPassword] = useState(false),
    { handleSubmit, register, reset } = useForm(),
    [loading, setLoading] = useState(false),
    [imgUrl, setImgUrl] = useState(null),
    store = useStore(null),
    [vandors, setVandors] = useState(null);

  useEffect(() => {
    (async () => {
      if (store.user.user_role === "admin") {
        const { data } = await store.fetchData("/api/vandor");
        if (data) setVandors(data);
      }
    })();
  }, []);

  async function onsubmit(data) {
    if (!store.user) return;
    if (data.password !== data.confirm_password) {
      return store?.setAlert({
        msg: "Please Check the password carefully",
        type: "info",
      });
    } else delete data.confirm_password;

    if (
      data.user_role !== "customer" &&
      store.user.user_role === "admin" &&
      !data.vandor_id
    ) {
      return store?.setAlert({
        msg: "Vandor id is required",
        type: "error",
      });
    }

    setLoading(true);
    try {
      data.user_id = store.user.id;
      if (!data.vandor_id) data.vandor_id = store.user.id;
      if (data.image.length) data.image = data.image[0];

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      //save data;
      const { error, message } = await store?.addOrEditData(
        "/api/user",
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
        <PageInfo title='User' type='Add' icon={<FaUser />} />

        <div className='add-form'>
          <form autoComplete='off' onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>User Name </label>
              <input
                {...register("name", { required: true })}
                required
                type='text'
                placeholder='User Name'
              />
            </div>
            <div>
              <label>Email </label>
              <input
                {...register("email", { required: true })}
                required
                type='email'
                placeholder='Email'
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
            <div>
              <label>User Role</label>
              <select
                {...register("user_role", { required: true })}
                required
                className='w-full'
              >
                <option value=''>Select</option>
                {userRole.map((role) => (
                  <option key={role.role} value={role.role}>
                    {role.txt}
                  </option>
                ))}
              </select>
            </div>
            {store.user.user_role === "admin" && vandors ? (
              <div>
                <label>Vandor</label>
                <select {...register("vandor_id")} className='w-full'>
                  <option value=''>Select</option>
                  {vandors.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className='edit-input-container'>
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  User profile
                </label>
                <input
                  {...register("image")}
                  type='file'
                  onChange={(e) => imgHandler(e.target.files[0])}
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
              <Link href='/admin/user'>
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

export default AddUser;

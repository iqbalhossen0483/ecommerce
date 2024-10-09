import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaUser } from "react-icons/fa";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
import { userRole } from "./index";

const EditUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const store = useStore();
  const router = useRouter();
  const [vandors, setVandors] = useState(null);

  useEffect(() => {
    (async () => {
      if (store.user.user_role === "admin") {
        const { data } = await store.fetchData("/api/vandor");
        if (data) setVandors(data);
      }
    })();
  }, []);

  useEffect(() => {
    if (router.query.id) {
      (async function () {
        const { data, error } = await store?.fetchData(
          `/api/user?id=${router.query.id}`
        );
        if (data) setUser(data[0]);
        else {
          store?.setAlert({ msg: error, type: "error" });
          router.push("/admin/user");
        }
      })();
    }
  }, [router.query.id]);

  async function onsubmit(data) {
    if (!user) return;

    try {
      setLoading(true);
      data.user_id = store.user.id;
      if (data.image.length) {
        data.image = data.image[0];
        data.existImage = user.image;
      } else delete data.image;
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      //save data;
      const { error, message } = await store?.addOrEditData(
        `/api/user?id=${user.id}`,
        formData,
        "PUT"
      );
      if (!error) {
        store?.setAlert({ msg: message, type: "success" });
      } else {
        store?.setAlert({ msg: message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;
  return (
    <DashboardLayout>
      <section>
        <PageInfo title='User' type='Edit' icon={<FaUser />} />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>User Name </label>
              <input
                {...register("name")}
                type='text'
                defaultValue={user?.name}
                placeholder='User Name'
              />
            </div>
            <div>
              <label>Email </label>
              <input
                {...register("email")}
                readOnly
                defaultValue={user?.email}
                type='email'
                placeholder='Email'
              />
            </div>

            <div className='relative'>
              <label>Password</label>
              <input
                {...register("password")}
                autoComplete='off'
                type={showPassword ? "text" : "password"}
                placeholder='Password'
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute right-3 top-11'
              >
                {showPassword ? <AiFillEyeInvisible /> : <FaEye />}
              </button>
            </div>

            <div>
              <label>User Role</label>
              <select className='w-full' {...register("user_role")}>
                <option value=''>Select</option>
                {userRole.map((item, i) => (
                  <option
                    key={i}
                    selected={user?.user_role === item.role}
                    value={item.role}
                  >
                    {item.txt}
                  </option>
                ))}
              </select>
            </div>

            {store.user.user_role === "admin" && vandors ? (
              <div>
                <label>Vandor</label>
                <select className='w-full' {...register("vandor_id")}>
                  <option value=''>Select</option>
                  {vandors.map((item, i) => (
                    <option
                      key={i}
                      selected={item.id === user?.vandor_id}
                      value={item.id}
                    >
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
                  accept='image/png, image/jpeg'
                />
              </div>
              {user?.image && (
                <img className='h-8' src={`/assets/${user.image}`} alt='' />
              )}
            </div>

            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                UPDATE
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

export default EditUser;

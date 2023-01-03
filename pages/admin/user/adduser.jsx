import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import Link from "next/link";

const AddUser = () => {
  const [showPassword, setShowPassword] = useState(false),
    { handleSubmit, register, reset } = useForm(),
    [loading, setLoading] = useState(false),
    [imgUrl, setImgUrl] = useState(null),
    store = useStore(null);

  async function onsubmit(data) {
    if (!store.user) return;
    if (data.password !== data.confirm_password) {
      return store?.setAlert({
        msg: "Please Check your password carefully",
        type: "info",
      });
    } else delete data.confirm_password;

    setLoading(true);
    data.user_id = store.user.id;
    if (data.profile) data.profile = data.profile[0];
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
        <PageInfo title="User" type="Add" icon={<FaUser />} />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>User Name </label>
              <input
                {...register("name", { required: true })}
                required
                type="text"
                placeholder="User Name"
              />
            </div>
            <div>
              <label>Email </label>
              <input
                {...register("email", { required: true })}
                required
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="relative">
              <label>Password</label>
              <input
                {...register("password", { required: true })}
                required
                minLength={6}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-11"
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
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <div>
              <label>User Role</label>
              <select
                {...register("user_role", { required: true })}
                required
                className="w-full"
              >
                <option value="">Select</option>
                <option value="owner">Admin</option>
                <option value="uploader">Product uploader</option>
              </select>
            </div>
            <div className="edit-input-container">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  User profile
                </label>
                <input
                  {...register("profile")}
                  type="file"
                  onChange={(e) => imgHandler(e.target.files[0])}
                  accept="image/png, image/jpeg"
                />
              </div>
              {imgUrl && <img className="h-8" src={imgUrl} alt="" />}
            </div>

            <div className="flex justify-between">
              <button
                disabled={loading}
                type="submit"
                className="btn active text-sm"
              >
                SAVE
              </button>
              <Link href="/admin/user">
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

export default AddUser;

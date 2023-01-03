import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
import { AiFillEyeInvisible } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { FaEye, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

const EditUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const store = useStore();
  const router = useRouter();

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

    setLoading(true);
    data.user_id = store.user.id;
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
    setLoading(false);
  }

  const userRole = [
    { role: "", txt: "Select" },
    { role: "owner", txt: "Admin" },
    { role: "uploader", txt: "Product uploader" },
  ];
  return (
    <DashboardLayout>
      <section>
        <PageInfo title="User" type="Edit" icon={<FaUser />} />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>User Name </label>
              <input
                {...register("name")}
                type="text"
                defaultValue={user?.name}
                placeholder="User Name"
              />
            </div>
            <div>
              <label>Email </label>
              <input
                {...register("email")}
                readOnly
                defaultValue={user?.email}
                type="email"
                placeholder="Email"
              />
            </div>

            <div className="relative">
              <label>Password</label>
              <input
                {...register("password")}
                defaultValue=""
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-11"
              >
                {showPassword ? <AiFillEyeInvisible /> : <FaEye />}
              </button>
            </div>

            <div>
              <label>User Role</label>
              <select className="w-full" {...register("user_role")}>
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

            <div className="flex justify-between">
              <button
                disabled={loading}
                type="submit"
                className="btn active text-sm"
              >
                UPDATE
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

export default EditUser;

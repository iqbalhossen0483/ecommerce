import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useStore from "../../../components/context/useStore";

const UpdateImportantLinks = () => {
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [links, setLinks] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data } = await store?.fetchData(`/api/links`);
      if (data) setLinks(data);
    })();
  }, [update]);

  async function onsubmit(data) {
    setLoading(true);
    if (data.mobile && !/^(?:(?:\+|00)88|01)?\d{11}$/.test(data.mobile)) {
      return store?.setAlert({
        msg: "Mobile number is invalid",
        type: "error",
      });
    }
    let logo;
    if (data.logo) {
      logo = data.logo[0];
      delete data.logo;
    }
    const document = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        document.push({ name: key, info: value });
      }
    });
    if (!document.length && !logo) {
      return store?.setAlert({
        msg: "There are no Update found",
        type: "info",
      });
    }
    const formData = new FormData();
    formData.append("user_id", store.user.id);
    if (logo) {
      formData.append("logo", logo);
      formData.append("exist", links[9].info);
    }
    formData.append("document", JSON.stringify(document));

    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/links",
      formData,
      "PUT"
    );
    if (!error) {
      setUpdate((prev) => !prev);
      store?.setAlert({ msg: message, type: "success" });
    } else {
      store?.setAlert({ msg: message, type: "error" });
    }
    setLoading(false);
  }

  const inputFeild = [
    {
      label: "Mobile",
      name: "mobile",
      type: "text",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      label: "Web site link",
      name: "Web_site_link",
      type: "url",
    },
    {
      label: "Facebook",
      name: "facebook",
      type: "url",
    },
    {
      label: "Twitter",
      name: "twitter",
      type: "url",
    },
    {
      label: "Linkedin",
      name: "linkedin",
      type: "url",
    },
    {
      label: "Instragram",
      name: "instragram",
      type: "url",
    },
  ];

  return (
    <DashboardLayout>
      <section>
        <PageInfo title="About" type="Edit" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            {inputFeild.map((input, i) => (
              <div key={i}>
                <label>{input.label}</label>
                <input
                  {...register(input.name)}
                  defaultValue={links ? links[i].info : ""}
                  type={input.type}
                  placeholder={input.label}
                />
              </div>
            ))}
            <div>
              <label>Address</label>
              <textarea
                {...register("address")}
                defaultValue={links ? links[7]?.info : ""}
                rows={3}
                placeholder="Address"
              />
            </div>
            <div>
              <label>Other Info</label>
              <textarea
                {...register("other_info")}
                rows={3}
                defaultValue={links ? links[8]?.info : ""}
                placeholder="Other Info"
              />
            </div>
            <div className="flex gap-7 items-center">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  Site Logo
                </label>
                <input {...register("logo")} type="file" />
              </div>
              <div>
                {links && links[9].info && (
                  <img
                    className="h-10"
                    src={`/assets/${links[9].info}`}
                    alt=""
                  />
                )}
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
              <Link href="/admin/footer">
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

export default UpdateImportantLinks;

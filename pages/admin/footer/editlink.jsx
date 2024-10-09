import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
const sampleInput = [
  {
    label: "Mobile",
    name: "mobile",
    type: "text",
    tag: "input",
    sl: 1,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    tag: "input",
    sl: 2,
  },
  {
    label: "Web site link",
    name: "Web_site_link",
    type: "url",
    tag: "input",
    sl: 3,
  },
  {
    label: "Facebook",
    name: "facebook",
    type: "url",
    tag: "input",
    sl: 4,
  },
  {
    label: "Twitter",
    name: "twitter",
    type: "url",
    tag: "input",
    sl: 5,
  },
  {
    label: "Linkedin",
    name: "linkedin",
    type: "url",
    tag: "input",
    sl: 6,
  },
  {
    label: "Instragram",
    name: "instragram",
    type: "url",
    tag: "input",
    sl: 7,
  },
  {
    label: "Address",
    name: "address",
    rows: 3,
    tag: "textarea",
    sl: 8,
  },
  {
    label: "Other Info",
    name: "other_info",
    rows: 3,
    tag: "textarea",
    sl: 9,
  },
  {
    label: "Site Logo",
    name: "logo",
    tag: "file",
    sl: 10,
  },
];
const UpdateImportantLinks = () => {
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState([]);
  const [logoExist, setLogoExist] = useState("");
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data } = await store?.fetchData(`/api/links`);
      if (!data) return;
      const copyOfNovalue = [];
      const copyOfHaveValue = [];

      sampleInput.forEach((item) => {
        const isExist = data.find((d) => d.name === item.name);
        if (isExist) {
          copyOfHaveValue.push({ ...item, defaultValue: isExist.info });
          if (isExist.name === "logo") setLogoExist(isExist.info);
        } else copyOfNovalue.push(item);
      });
      const inputs = [...copyOfHaveValue, ...copyOfNovalue].sort(
        (a, b) => a.sl - b.sl
      );
      setShowInput(inputs);
    })();
  }, []);

  async function onsubmit(data) {
    try {
      setLoading(true);
      if (data.mobile && !/^(?:(?:\+|00)88|01)?\d{11}$/.test(data.mobile)) {
        return store?.setAlert({
          msg: "Mobile number is invalid",
          type: "error",
        });
      }
      let logo;
      if (data.logo.length) {
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
        formData.append("deleteImage", logoExist);
      }
      formData.append("document", JSON.stringify(document));

      //save data;
      const { error, message } = await store?.addOrEditData(
        "/api/links",
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

  if (!showInput.length) return null;
  return (
    <DashboardLayout>
      <section>
        <PageInfo title='About' type='Edit' />

        <div className='add-form'>
          <form onSubmit={handleSubmit(onsubmit)}>
            {showInput.map((data, i) => (
              <div key={i}>
                <label>{data.label}</label>
                {data.tag === "input" ? (
                  <input
                    {...register(data.name)}
                    defaultValue={data.defaultValue || ""}
                    type={data.type}
                    placeholder={data.label}
                  />
                ) : data.tag === "textarea" ? (
                  <textarea
                    {...register(data.name)}
                    defaultValue={data.defaultValue || ""}
                    rows={data.rows}
                    placeholder={data.label}
                  />
                ) : (
                  <div className='flex gap-7 items-center'>
                    <div>
                      <input {...register(data.name)} type='file' />
                    </div>
                    <div>
                      {data.defaultValue ? (
                        <img
                          className='h-10'
                          src={`/assets/${data.defaultValue}`}
                          alt=''
                        />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                SAVE
              </button>
              <Link href='/admin/footer'>
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

export default UpdateImportantLinks;

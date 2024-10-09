import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import useStore from "../../../../components/context/useStore";
const TextEditor = dynamic(
  () => import("../../../../components/admin/common/TextEditor"),
  {
    ssr: false,
  }
);

const UpdateAbout = () => {
  const [loading, setLoading] = useState(false);
  const [about, setAbout] = useState(null);
  const description = useRef(null);
  const store = useStore();

  useEffect(() => {
    (async () => {
      const { data } = await store?.fetchData("/api/footerpages?name=about");
      if (data) setAbout(data[0]);
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!description.current?.value) return;
    setLoading(true);
    try {
      const data = {
        description: description.current?.value,
        user_id: store.user.id,
      };
      const { error, message } = await store?.addOrEditData(
        "/api/footerpages?name=about",
        data,
        "PUT",
        false
      );
      if (error) {
        store?.setAlert({ msg: message, type: "error" });
      } else {
        store?.setAlert({ msg: message, type: "success" });
      }
    } finally {
      setLoading(false);
    }
  }

  if (!about) return null;
  return (
    <DashboardLayout>
      <div className='dashboard-home-container'>
        <PageInfo title='About' type='Edit' />

        <form onSubmit={(e) => onSubmit(e)} className='container'>
          <div className='z-40 space-y-3'>
            <label className='text-gray-500'>Description</label>
            <TextEditor value={about?.description} editorRef={description} />
          </div>
          <div className='flex justify-between mt-5'>
            <button
              disabled={loading}
              type='submit'
              className='btn active text-sm'
            >
              UPDATE
            </button>
            <Link href='/admin/footer/about'>
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
    </DashboardLayout>
  );
};

export default UpdateAbout;

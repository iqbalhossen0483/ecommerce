import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { PageInfo } from "../../../../components/admin/common/common";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";
const TextEditor = dynamic(
  () => import("../../../../components/admin/common/TextEditor"),
  {
    ssr: false,
  }
);

const UpdatePrivacy = () => {
  const description = useRef(null);
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async () => {
      const { data } = await store?.fetchData("/api/footerpages?name=privacy");
      if (data) setPrivacy(data[0]);
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
        "/api/footerpages?name=privacy",
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

  return (
    <DashboardLayout>
      <div className='dashboard-home-container'>
        <PageInfo title='Privacypolicy' type='Edit' />

        <form onSubmit={(e) => onSubmit(e)} className='container'>
          <div className='z-40 space-y-3'>
            <label className='text-gray-500'>Description</label>
            <TextEditor value={privacy?.description} editorRef={description} />
          </div>
          <div className='flex justify-between mt-5'>
            <button
              disabled={loading}
              type='submit'
              className='btn active text-sm'
            >
              Save
            </button>
            <Link href='/admin/footer/privacy'>
              <button
                type='button'
                className='btn text-sm'
                style={{ backgroundColor: "#dc3545", color: "#fff" }}
              >
                CANCEL
              </button>
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UpdatePrivacy;

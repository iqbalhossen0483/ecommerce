import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaHome } from "react-icons/fa";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";
const TextEditor = dynamic(
  () => import("../../../../components/admin/common/TextEditor"),
  {
    ssr: false,
  }
);

const UpdateTerms = () => {
  const description = useRef(null);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async () => {
      const { data } = await store?.fetchData("/api/footerpages?name=terms");
      if (data) setTerms(data[0]);
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
        "/api/footerpages?name=terms",
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
        <div className='page-info'>
          <div className='icon'>
            <FaHome />
          </div>
          <div>
            <h3>Terms of Service Information</h3>
            <p>Edit Terms of Service Information from here</p>
          </div>
        </div>

        <form onSubmit={(e) => onSubmit(e)} className='container'>
          <div className='z-40 space-y-3'>
            <label className='text-gray-500'>Description</label>
            <TextEditor value={terms?.description} editorRef={description} />
          </div>
          <div className='flex justify-between mt-5'>
            <button
              disabled={loading}
              type='submit'
              className='btn active text-sm'
            >
              Save
            </button>
            <Link href='/admin/footer/terms'>
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

export default UpdateTerms;

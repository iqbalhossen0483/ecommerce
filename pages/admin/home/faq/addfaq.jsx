import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useRef, useState } from "react";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import useStore from "../../../../components/context/useStore";
const TextEditor = dynamic(
  () => import("../../../../components/admin/common/TextEditor"),
  {
    ssr: false,
  }
);

const AddFaq = () => {
  const [loading, setLoading] = useState(false);
  const title = useRef(null);
  const body = useRef(null);
  const store = useStore();

  async function onsubmit(e) {
    if (!store.user) return;
    e.preventDefault();
    const data = {};
    data.user_id = store.user.id;
    data.title = title.current?.value;
    data.body = body.current?.value;
    if (!data.body) {
      body.current?.focus();
      return store?.setAlert({ msg: "Give the Answer", type: "info" });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        store?.setAlert({ msg: result.message, type: "success" });
      } else throw result;
    } catch (error) {
      store?.setAlert({ msg: error.message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title='FAQ' type='Add' />

        <div className='add-form'>
          <form onSubmit={(e) => onsubmit(e)}>
            <div>
              <label>Question</label>
              <input ref={title} required type='text' placeholder='Question' />
            </div>
            <div className='z-40'>
              <label>Answer</label>
              <TextEditor editorRef={body} />
            </div>

            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                SAVE
              </button>
              <Link href='/admin/home/faq'>
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

export default AddFaq;

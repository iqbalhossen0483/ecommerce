import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
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

const EditFaq = () => {
  const [loading, setLoading] = useState(false);
  const [faq, setFaq] = useState(null);
  const title = useRef(null);
  const body = useRef(null);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      (async function () {
        const { data, error } = await store?.fetchData(
          `/api/faq?id=${router.query.id}`
        );
        if (data) setFaq(data[0]);
        else {
          store?.setAlert({ msg: error, type: "error" });
          router.push("/admin/home/faq");
        }
      })();
    }
  }, [router.query.id]);

  async function onsubmit(e) {
    if (!store.user) return;
    e.preventDefault();
    const data = {};
    data.user_id = store.user.id;
    data.title = title.current?.value;
    data.body = body.current?.value;
    setLoading(true);
    try {
      const res = await fetch(`/api/faq?id=${faq?.id}`, {
        method: "PUT",
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
        <PageInfo title='FAQ' type='Edit' />

        <div className='add-form'>
          <form onSubmit={(e) => onsubmit(e)}>
            <div>
              <label>Question</label>
              <input
                ref={title}
                defaultValue={faq?.title}
                type='text'
                placeholder='Question'
              />
            </div>
            <div className='z-40'>
              <label>Answer</label>
              <TextEditor value={faq?.body} editorRef={body} />
            </div>

            <div className='flex justify-between'>
              <button
                disabled={loading}
                type='submit'
                className='btn active text-sm'
              >
                UPDATE
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

export default EditFaq;

import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";
import React, { useEffect, useRef, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PageInfo } from "../../../../components/admin/common/common";
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
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/footerpages?name=privacy policy");
        const result = await res.json();
        if (res.ok) {
          setPrivacy(result[0]);
        } else throw result;
      } catch (error) {
        router.push("/admin/footer/privacy");
      }
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!description.current?.value) return;
    setLoading(true);
    try {
      const res = await fetch("/api/footerpages?name=privacy policy", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          description: description.current?.value,
          user_id: store.user.id,
        }),
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
      <div className="dashboard-home-container">
        <PageInfo title="Privacypolicy" type="Edit" />

        <form onSubmit={(e) => onSubmit(e)} className="container">
          <div className="z-40 space-y-3">
            <label className="text-gray-500">Description</label>
            <TextEditor value={privacy?.description} editorRef={description} />
          </div>
          <div className="flex justify-between mt-5">
            <button
              disabled={loading}
              type="submit"
              className="btn active text-sm"
            >
              Save
            </button>
            <Link href="/admin/footer/privacy">
              <button
                type="button"
                className="btn text-sm"
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

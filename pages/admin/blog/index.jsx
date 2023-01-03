import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import useStore from "../../../components/context/useStore";
import React, { useEffect, useState } from "react";
import { FaBlogger } from "react-icons/fa";
import { Interweave } from "interweave";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";

const Blog = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const store = useStore();

  function handleAction(i) {
    setShowAction((prev) => {
      if (prev === i) return -1;
      else return i;
    });
  }
  useEffect(() => {
    (async function () {
      if (store) {
        const { data, error } = await store?.fetchData(
          `/api/blog?limit=${limit}&page=${page}&user_id=${store.user.id}&user_type=${store.user.user_role}`
        );
        if (data) {
          setBlog(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]);

  async function deleteFaq(id) {
    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          user_id: store.user.id,
          user_type: store.user.user_role,
          id,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        store?.setAlert({ msg: result.message, type: "success" });
        setUpdate((prev) => !prev);
      } else throw result;
    } catch (error) {
      store?.setAlert({ msg: error.message, type: "error" });
    }
    setLoading(false);
  }
  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="Blog" type="View" icon={<FaBlogger />} />

        <div className="container">
          <MainPagesTopPart addLink="/admin/blog/addblog" setLimit={setLimit} />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>TITLE</th>
                  <th>BODY</th>
                </tr>
              </thead>
              <tbody>
                {blog && blog.length ? (
                  blog.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          onClick={() => handleAction(i)}
                          className={`${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                        >
                          <div className="flex items-center gap-1 w-20">
                            {showAction !== i ? (
                              <HiPlusCircle />
                            ) : (
                              <HiMinusCircle />
                            )}
                            <span>{item.id}</span>
                          </div>
                        </td>
                        <td>
                          {item.title.slice(0, 50)}{" "}
                          {item.title.length > 50 && "..."}
                        </td>
                        <td>
                          <Interweave content={item.body.slice(0, 40)} />
                          {item.body.length > 50 && "..."}
                        </td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={2}
                          deleteHandler={() => deleteFaq(item.id)}
                          editpage={`/admin/blog/editblog?id=${item.id}`}
                          loading={loading}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <NoDataFount colSpan={2} />
                )}
              </tbody>
            </table>
          </div>
          <MainPagesFooterPart
            count={count}
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={blog?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Blog;

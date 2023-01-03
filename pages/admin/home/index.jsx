import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";

const DCategory = () => {
  const [showAction, setShowAction] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [update, setUpdate] = useState(false);
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
          `/api/category?home=true&limit=${limit}&page=${page}`
        );
        if (data) {
          setCategory(data.data);
          setCount(data.count);
        } else {
          store?.setAlert({ msg: error, type: "error" });
        }
      }
    })();
  }, [update, limit, page]);

  async function deleteCategory(id, image) {
    if (!store.user) return;
    const confirm = window.confirm(
      "Do you want to delete this category and all sub category, pro sub category under this?"
    );
    if (confirm) {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", store.user.id);
      formData.append("id", id);
      formData.append("image", image);
      const { error, message } = await store?.deleteData(
        "/api/category",
        formData
      );
      if (!error) {
        store?.setAlert({ msg: message, type: "success" });
        setUpdate((prev) => !prev);
        setShowAction(-1);
      } else {
        store?.setAlert({ msg: message, type: "error" });
      }
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="Category" type="View" />
        <div className="container">
          <MainPagesTopPart
            addLink="/admin/home/adcategory"
            setLimit={setLimit}
          />

          <div className="table-container">
            <table className="w-3/4 mx-auto">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>PRIORITY</th>
                  <th>IMAGE</th>
                  <th>CATEGORY NAME</th>
                </tr>
              </thead>
              <tbody>
                {category && category.length ? (
                  category.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          onClick={() => handleAction(i)}
                          className={`${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {showAction !== i ? (
                              <HiPlusCircle />
                            ) : (
                              <HiMinusCircle />
                            )}
                            <span>{item.id}</span>
                          </div>
                        </td>
                        <td>{item.priority}</td>
                        <td>
                          <img
                            className="h-5"
                            src={`/assets/${item.image}`}
                            alt=""
                          />
                        </td>
                        <td>{item.name}</td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={4}
                          editpage={`/admin/home/editcategory?id=${item.id}`}
                          loading={loading}
                          deleteHandler={() =>
                            deleteCategory(item.id, item.image)
                          }
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <NoDataFount colSpan={4} />
                )}
              </tbody>
            </table>
          </div>
          <MainPagesFooterPart
            count={count}
            page={page}
            limit={limit}
            setPage={setPage}
            showingData={category?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DCategory;

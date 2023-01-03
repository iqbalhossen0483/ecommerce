import React, { useEffect, useState } from "react";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../../components/admin/common/common";

const DSubCategory = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [subcategory, setsubCategory] = useState(null);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const store = useStore();

  function handleAction(i) {
    setShowAction((prev) => {
      if (prev === i) return -1;
      else return i;
    });
  }

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        `/api/subcategory?home=true&limit=${limit}&page=${page}`
      );
      if (data) {
        setsubCategory(data.data);
        setCount(data.count);
      } else store?.setAlert({ msg: error, type: "error" });
    })();
  }, [update, limit, page]);

  async function deleteSubCategory(id, image) {
    if (!store.user) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", store.user.id);
    formData.append("id", id);
    formData.append("image", image);
    const { error, message } = await store?.deleteData(
      "/api/subcategory",
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

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="Sub Category" type="View" />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/home/subcategory/addsubcategory"
            setLimit={setLimit}
          />

          <div className="table-container">
            <table>
              <thead className="header">
                <tr>
                  <th>ID</th>
                  <th>IMAGE</th>
                  <th>CATEGORY</th>
                  <th>SUB CATEGORY</th>
                </tr>
              </thead>
              <tbody>
                {subcategory && subcategory.length ? (
                  subcategory.map((item, i) => (
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
                        <td>
                          <img
                            className="h-5"
                            src={`/assets/${item.image}`}
                            alt=""
                          />
                        </td>
                        <td>{item.category_name}</td>
                        <td>{item.name}</td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={4}
                          loading={loading}
                          deleteHandler={() =>
                            deleteSubCategory(item.id, item.image)
                          }
                          editpage={`/admin/home/subcategory/editsubcategory?id=${item.id}`}
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
            limit={limit}
            page={page}
            setPage={setPage}
            count={count}
            showingData={subcategory?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DSubCategory;

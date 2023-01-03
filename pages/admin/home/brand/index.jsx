import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../../components/admin/common/common";

const DBrand = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState(null);
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
          `/api/brand?home=true&limit=${limit}&page=${page}`
        );
        if (data) {
          setBrand(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]);

  async function deleteBrand(id, image) {
    if (!store.user) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", store.user.id);
    formData.append("id", id);
    formData.append("image", image);
    const { error, message } = await store?.deleteData(`/api/brand`, formData);
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
        <PageInfo title="Brand" type="View" />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/home/brand/adbrand"
            setLimit={setLimit}
          />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CATEGORY</th>
                  <th>BRAND NAME</th>
                  <th>BRAND</th>
                </tr>
              </thead>
              <tbody>
                {brand && brand.length ? (
                  brand.map((item, i) => (
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
                        <td>{item.category_name}</td>
                        <td>{item.name}</td>
                        <td>
                          <img
                            className="h-5"
                            src={`/assets/${item.image}`}
                            alt=""
                          />
                        </td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={4}
                          editpage={`/admin/home/brand/editbrand?id=${item.id}`}
                          loading={loading}
                          deleteHandler={() => deleteBrand(item.id, item.image)}
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
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={brand?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DBrand;

import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../../components/admin/common/common";

const ProSubCategory = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
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
          `/api/prosub?home=true&limit=${limit}&page=${page}`
        );
        if (data) {
          setCategory(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]);

  async function deleteProSub(id) {
    setLoading(true);
    try {
      const res = await fetch("/api/prosub", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          user_id: store.user.id,
          id,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        store?.setAlert({ msg: result.message, type: "success" });
        setUpdate((prev) => !prev);
        setShowAction(-1);
      } else throw result;
    } catch (error) {
      store?.setAlert({ msg: error.message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="Pro sub Category" type="View" />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/home/prosubcategory/addprosub"
            setLimit={setLimit}
          />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>PRO SUB CATEGORY</th>
                  <th>SUB CATEGORY</th>
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
                          <div className="flex items-center gap-1 ">
                            {showAction !== i ? (
                              <HiPlusCircle />
                            ) : (
                              <HiMinusCircle />
                            )}
                            <span>{item.id}</span>
                          </div>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.sub_category_name}</td>
                        <td>
                          <img className="h-5" src={item.image} alt="" />
                        </td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={5}
                          editpage={`/admin/home/prosubcategory/editprosub?id=${item.id}`}
                          loading={loading}
                          deleteHandler={() => deleteProSub(item.id)}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <NoDataFount colSpan={3} />
                )}
              </tbody>
            </table>
          </div>
          <MainPagesFooterPart
            count={count}
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={category?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProSubCategory;

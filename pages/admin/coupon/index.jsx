import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";

const DCupon = () => {
  const [showAction, setShowAction] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [coupon, setCoupon] = useState(null);
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
          `/api/coupon?limit=${limit}&page=${page}&user_id=${store.user.id}&user_type=${store.user.user_role}`
        );
        if (data) {
          setCoupon(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]);

  async function deleteCoupon(id) {
    setLoading(true);
    const { error, message } = await store?.deleteData(
      `/api/coupon?id=${id}&user=${store.user.id}&user_type=${store.user.user_role}`
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
        <PageInfo title="Coupon Offer" type="View" />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/coupon/addcoupon"
            setLimit={setLimit}
          />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CODE</th>
                  <th>TYPE</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {coupon && coupon.length ? (
                  coupon.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          className={`sn-item ${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                          onClick={() => handleAction(i)}
                        >
                          {showAction !== i ? (
                            <HiPlusCircle />
                          ) : (
                            <HiMinusCircle />
                          )}
                          <span>{item.id}</span>
                        </td>
                        <td>{item.code}</td>
                        <td>{item.type}</td>
                        <td>{item.amount}</td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={5}
                          editpage={`/admin/coupon/editcoupon?id=${item.id}`}
                          loading={loading}
                          deleteHandler={() => deleteCoupon(item.id)}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <NoDataFount colSpan={5} />
                )}
              </tbody>
            </table>
          </div>
          <MainPagesFooterPart
            count={count}
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={coupon?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DCupon;

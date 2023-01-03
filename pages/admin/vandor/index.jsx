import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";

const Vandor = () => {
  const [showAction, setShowAction] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [vandor, setVandor] = useState(null);
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

  //get vandor ;
  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        `/api/vandor?home=true&limit=${limit}&page=${page}`
      );
      if (data) {
        setVandor(data.data);
        setCount(data.count);
      } else {
        store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]); //till

  //delete vandor;
  async function deleteVandor(id, image) {
    const confirm = window.confirm("Are you sure to delete the user?");
    if (confirm) {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", store.user.id);
      formData.append("id", id);
      formData.append("image", image);
      const { error, message } = await store?.deleteData(
        `/api/vandor`,
        formData
      );
      if (!error) {
        store?.setAlert({ msg: message, type: "success" });
        setUpdate((prev) => !prev);
      } else {
        store?.setAlert({ msg: message, type: "error" });
      }
      setLoading(false);
    }
  } //till;

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="Vendor" type="View" icon={<FaUsers />} />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/vandor/addvandor"
            setLimit={setLimit}
          />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>SHOP NAME</th>
                  <th>SHOP LOGO</th>
                </tr>
              </thead>
              <tbody>
                {vandor && vandor.length ? (
                  vandor.map((item, i) => (
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
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.shop_name}</td>
                        <td>
                          {item.shop_logo ? (
                            <img
                              className="h-5 object-contain"
                              src={`/assets/${item.shop_logo}`}
                              alt=""
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={5}
                          editpage={`/admin/vandor/editvandor?id=${item.id}`}
                          deleteHandler={() =>
                            deleteVandor(item.id, item.shop_logo)
                          }
                          loading={loading}
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
            showingData={vandor?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Vandor;

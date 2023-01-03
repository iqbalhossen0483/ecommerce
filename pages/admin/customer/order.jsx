import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import useStore from "../../../components/context/useStore";
import { AiTwotoneCustomerService } from "react-icons/ai";
import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  MySqlDate,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";
import { updateOrder } from "../../../components/admin/components/order/updateOrder";

const initialState = {
  normal: true,
  status: false,
  date: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "normal":
      return { normal: true, status: null, date: null };
    case "status":
      return { normal: false, status: { value: action.value }, date: null };
    case "date":
      return {
        normal: false,
        status: null,
        date: { start_date: action.start_date, end_date: action.end_date },
      };
    default:
      return { normal: true, status: null, date: null };
  }
};

const DOrder = () => {
  const [state, dispatch] = useReducer(reducer, initialState),
    [showAction, setShowAction] = useState(-1),
    { handleSubmit, register } = useForm(),
    [loading, setLoading] = useState(false),
    [update, setUpdate] = useState(false),
    [filtered, setfiltered] = useState(""),
    [orders, setOrders] = useState(null),
    [limit, setLimit] = useState(5),
    [count, setCount] = useState(0),
    [page, setPage] = useState(0),
    store = useStore();

  //handle view and delete action button;
  function handleAction(i) {
    setShowAction((prev) => {
      if (prev === i) return -1;
      else return i;
    });
  } //til;

  //get orders ;
  async function getAllOrder() {
    const { data, error } = await store?.fetchData(
      `/api/order?limit=${limit}&page=${page}&user_id=${store.user.id}`
    );
    if (data) {
      setOrders(data.data);
      setCount(data.count);
    } else {
      store?.setAlert({ msg: error, type: "error" });
    }
  }
  useEffect(() => {
    getAllOrder();
  }, [update]); //till

  //get all product by status;
  async function getOrderByStatus() {
    if (filtered !== null) {
      dispatch({ type: "status", value: filtered });
      const { data, error } = await store?.fetchData(
        `/api/order?status=${filtered}&limit=${limit}&page=${page}&user_id=${store.user.id}`
      );
      if (data) {
        setOrders(data.data);
        setCount(data.count);
        if (!filtered) {
          dispatch({ type: "normal" });
        }
      } else {
        store?.setAlert({ msg: error, type: "error" });
      }
    }
  }
  useEffect(() => {
    getOrderByStatus();
  }, [filtered]); //till;

  //get order by date;
  async function getOrderbyDate(payload) {
    const { data, error } = await store?.fetchData(
      `/api/order?date=true&start=${payload.start_date}&end=${payload.end_date}&limit=${limit}&page=${page}&user_id=${store.user.id}`
    );
    if (data) {
      setOrders(data.data);
      setCount(data.count);
      dispatch({
        type: "date",
        start_date: payload.start_date,
        end_date: payload.end_date,
      });
    } else {
      dispatch("normal");
      store?.setAlert({ msg: error, type: "error" });
    }
  }

  //delete user;
  async function deleteOrder(id) {
    const confirm = window.confirm("Are you sure to delete the user?");
    if (confirm) {
      setLoading(true);
      const { error, message } = await store?.deleteData(`/api/order?id=${id}`);
      if (!error) {
        store?.setAlert({ msg: message, type: "success" });
        setUpdate((prev) => !prev);
        setShowAction(-1);
      } else {
        store?.setAlert({ msg: message, type: "error" });
      }
      setLoading(false);
    }
  } //till;

  //pagination;
  useEffect(() => {
    if (state.status) {
      getOrderByStatus();
    } else if (state.date) {
      getOrderbyDate(state.date);
    } else {
      getAllOrder();
    }
  }, [page, limit]);

  const filterOpt = [
    { txt: "All", value: "" },
    { txt: "Processing", value: "processing" },
    { txt: "Shipping", value: "shipping" },
    { txt: "Delivered", value: "delivered" },
    { txt: "Canceled", value: "canceled" },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo
          title="Order"
          icon={<AiTwotoneCustomerService />}
          type="View"
        />

        <div className="container">
          <div className="date-picker">
            <form onSubmit={handleSubmit(getOrderbyDate)}>
              <input
                {...register("start_date", { required: true })}
                type="date"
              />
              <input
                {...register("end_date", { required: true })}
                type="date"
              />
              <button className="btn active">Search</button>
            </form>
          </div>
          <MainPagesTopPart
            setFilter={setfiltered}
            filterOpt={filterOpt}
            setLimit={setLimit}
          />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>ORDER</th>
                  <th>INVOICE</th>
                  <th>NAME</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length ? (
                  orders.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          onClick={() => handleAction(i)}
                          className={`${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                        >
                          <div className="sn-item">
                            {showAction !== i ? (
                              <HiPlusCircle />
                            ) : (
                              <HiMinusCircle />
                            )}
                            <span>{item.id}</span>
                          </div>
                        </td>
                        <td>
                          <MySqlDate date={item.created_at} />
                        </td>
                        <td>{item.order_id}</td>
                        <td>{item.invoice_id}</td>
                        <td>{item.customer_name}</td>
                        <td>
                          <select
                            onChange={(e) =>
                              updateOrder(
                                e.target.value,
                                item,
                                store,
                                setUpdate
                              )
                            }
                          >
                            {filterOpt.slice(1, filterOpt.length).map((opt) => (
                              <option
                                selected={item.status === opt.value}
                                key={opt.value}
                                value={opt.value}
                              >
                                {opt.txt}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          editpage={`/admin/customer/vieworder?id=${item.id}`}
                          deleteHandler={() => deleteOrder(item.id)}
                          colSpan={6}
                          title="view"
                          loading={loading}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <NoDataFount colSpan={6} />
                )}
              </tbody>
            </table>
          </div>
          <MainPagesFooterPart
            count={count}
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={orders?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DOrder;

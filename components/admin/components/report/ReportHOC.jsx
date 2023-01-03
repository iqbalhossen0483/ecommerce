import React, { useEffect, useReducer, useState } from "react";
import useStore from "../../../context/useStore";

const initialState = {
  normal: true,
  date: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "normal":
      return { normal: true, date: null };
    case "date":
      return {
        normal: false,
        date: { start_date: action.start_date, end_date: action.end_date },
      };
    default:
      return { normal: true, date: null };
  }
};

const ReportHOC = (OriginalComponent, title) => {
  return function NewComponent() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [orders, setOrders] = useState(null);
    const [limit, setLimit] = useState(5);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const store = useStore();

    //get orders ;
    async function getAllOrder() {
      const { data, error } = await store?.fetchData(
        `/api/order?status=${title}&limit=${limit}&page=${page}&user_id=${store.user.id}`
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
    }, []); //till

    //get order by date;
    async function getOrderbyDate(payload) {
      const { data, error } = await store?.fetchData(
        `/api/order?date=true&status=delivered&start=${payload.start_date}&end=${payload.end_date}&limit=${limit}&page=${page}&user_id=${store.user.id}`
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

    //pagination;
    useEffect(() => {
      if (state.date) {
        getOrderbyDate(state.date);
      } else {
        getAllOrder();
      }
    }, [page, limit]);

    return (
      <OriginalComponent
        count={count}
        getOrderbyDate={getOrderbyDate}
        limit={limit}
        orders={orders}
        page={page}
        setLimit={setLimit}
        setPage={setPage}
      />
    );
  };
};

export default ReportHOC;

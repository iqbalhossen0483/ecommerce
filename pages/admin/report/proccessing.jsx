import ReportBody from "../../../components/admin/components/report/ReportBody";
import ReportHOC from "../../../components/admin/components/report/ReportHOC";
import React from "react";

const DProccessing = (props) => {
  const { getOrderbyDate, setLimit, orders, count, limit, page, setPage } =
    props;

  return (
    <ReportBody
      count={count}
      getOrderbyDate={getOrderbyDate}
      limit={limit}
      orders={orders}
      page={page}
      setLimit={setLimit}
      setPage={setPage}
      title="Proccessing Report"
    />
  );
};

export default ReportHOC(DProccessing, "processing");

import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { AiTwotoneCustomerService } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import {
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";

const AllCustomer = () => {
  const [showAction, setShowAction] = useState(-1);
  const [customer, setCustomer] = useState(null);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const store = useStore();

  //get user ;
  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        `/api/order?customer=true&limit=${limit}&page=${page}&user_id=${store.user.id}`
      );
      if (data) {
        setCustomer(data.data);
        setCount(data.count);
      } else {
        setCustomer([]);
        store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [limit, page]); //till

  function handleAction(i) {
    setShowAction((prev) => {
      if (prev === i) return -1;
      else return i;
    });
  }

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo
          title="Customer"
          type="View"
          icon={<AiTwotoneCustomerService />}
        />

        <div className="container">
          <MainPagesTopPart setLimit={setLimit} />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>NUMBER</th>
                  <th>JOIN</th>
                </tr>
              </thead>
              <tbody>
                {customer && customer.length ? (
                  customer.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          className={`${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                          onClick={() => handleAction(i)}
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
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.number}</td>
                        <td>{item.joined_at.slice(0, 10)}</td>
                      </tr>
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
            showingData={customer?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllCustomer;

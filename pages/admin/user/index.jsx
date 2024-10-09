import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";

export const userRole = [
  { role: "customer", txt: "Customer" },
  { role: "staff", txt: "Sales Staff" },
  { role: "administrator", txt: "Administrator" },
  { role: "admin", txt: "Admin" },
];

const DUser = () => {
  const [showAction, setShowAction] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [filtered, setfiltered] = useState("");
  const [user, setUser] = useState(null);
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

  //get user ;
  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        `/api/user?home=true&limit=${limit}&page=${page}`
      );
      if (data) {
        setUser(data.data);
        setCount(data.count);
      } else {
        store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]); //till

  //handle filter user;
  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        `/api/user?filter=${filtered}`
      );
      if (data) {
        setUser(data);
      } else {
        store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [filtered]); //till;

  //delete user;
  async function deleteUser(id, image) {
    const confirm = window.confirm("Are you sure to delete the user?");
    if (confirm) {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", store.user.id);
      formData.append("id", id);
      formData.append("image", image);
      const { error, message } = await store?.deleteData(`/api/user`, formData);
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
      <div className='dashboard-home-container'>
        <PageInfo title='User Board' type='View' icon={<AiOutlineUser />} />

        <div className='container'>
          <MainPagesTopPart
            setFilter={setfiltered}
            filterOpt={userRole}
            addLink='/admin/user/adduser'
            setLimit={setLimit}
          />

          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {user && user.length ? (
                  user.map((item, i) => (
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
                        <td>{item.user_role}</td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={4}
                          editpage={`/admin/user/edituser?id=${item.id}`}
                          deleteHandler={() => deleteUser(item.id, item.image)}
                          loading={loading}
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
            showingData={user?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DUser;

import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import DashboardLayout from "../../components/admin/common/DashboardLayout";
import Report from "../../components/admin/dashboard/Report";
import useStore from "../../components/context/useStore";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(`/api/dashboard`);
      if (data) {
        setData(data);
      } else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className='dashboar-wrapper'>
        <div className='page-info items-center'>
          <div className='icon'>
            <FaHome />
          </div>
          <div>
            <h3>Dashboard</h3>
          </div>
        </div>
        <Report />

        <div className='dashboard-data'>
          <div className='item col-span-2'>
            <h4>Top Sold Product</h4>
            {data &&
              data?.topProduct.map((item) => (
                <div key={item.id}>
                  <img
                    className='h-10 rounded-full'
                    src={`/assets/${item.main_image}`}
                    alt=''
                  />
                  <h3>{item.name.slice(0, 50)}</h3>
                </div>
              ))}
          </div>
          <div className='item'>
            <h4>Top Customer</h4>
            {data &&
              data?.topCustomer.map((item) => (
                <div key={item.id}>
                  <img
                    className='h-10 rounded-full'
                    src={item.profile ? `/assets/${item.profile}` : "/user.png"}
                    alt=''
                  />
                  <h3>{item.name}</h3>
                </div>
              ))}
          </div>
          <div className='item'>
            <h4>Top Saler</h4>
            {data &&
              data?.topSaler.map((item) => (
                <div key={item.id}>
                  <img
                    className='h-10 rounded-full'
                    src={
                      item.shop_logo
                        ? `/assets/${item.shop_logo}`
                        : "/shop-image.jpg"
                    }
                    alt=''
                  />
                  <h3>{item.name.slice(0, 70)}</h3>
                </div>
              ))}
          </div>
          <div className='item'>
            <h4>Top Rated Product</h4>
            {data &&
              data?.topRatedProduct.map((item) => (
                <div key={item.id}>
                  <img
                    className='h-10 rounded-full'
                    src={`/assets/${item.main_image}`}
                    alt=''
                  />
                  <h3>{item.name.slice(0, 20)}</h3>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

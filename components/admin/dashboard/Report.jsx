import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsFillBagCheckFill, BsHandbag } from "react-icons/bs";
import { GiWorld } from "react-icons/gi";
import { MdOutlineLocalShipping } from "react-icons/md";
import useStore from "../../context/useStore";
import { Amount } from "../common/common";

const Report = () => {
  const [report, setReport] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        `/api/dashboard?report=true`
      );
      if (data) {
        setReport(data);
      } else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  return (
    <div className="report_wrapper">
      <Link href="/admin/product">
        <div className="bg-[#17A2B8]">
          <div className="flex items-center">
            <GiWorld />
          </div>
          <div>
            <h3>TOTAL PRODUCTS</h3>
            <p className="text-2xl font-semibold">{report?.total_product}</p>
            <p>See all product</p>
          </div>
        </div>
      </Link>
      <Link href="/admin/report">
        <div className="bg-[#6f42c1]">
          <div className="flex items-center">
            <BsHandbag />
          </div>
          <div>
            <h3>TOTAL SALES</h3>
            <Amount
              className="text-2xl font-semibold"
              page="dashboard"
              value={report?.total_sale}
            />
            <p>See all sales</p>
          </div>
        </div>
      </Link>
      <Link href="/admin/customer/order">
        <div className="bg-[#1CAF9A]">
          <div className="flex items-center">
            <BsFillBagCheckFill />
          </div>
          <div>
            <h3>TODAY'S ORDER</h3>
            <p className="text-2xl font-semibold">{report?.todaysOrder}</p>
            <p>See all orders</p>
          </div>
        </div>
      </Link>
      <Link href="/admin/report/proccessing">
        <div className="bg-[#0866C6]">
          <div className="flex items-center">
            <MdOutlineLocalShipping />
          </div>
          <div>
            <h3>PENDING ORDER</h3>
            <p className="text-2xl font-semibold">{report?.pendingOrder}</p>
            <p>See the orders</p>
          </div>
        </div>
      </Link>
      <Link href="/admin/report/cancel">
        <div className="bg-[#c62408a5]">
          <div className="flex items-center">
            <MdOutlineLocalShipping />
          </div>
          <div>
            <h3>CANCELED ORDER</h3>
            <p className="text-2xl font-semibold">{report?.canceledOrder}</p>
            <p>See the orders</p>
          </div>
        </div>
      </Link>
      <Link href="/admin/product">
        <div className="bg-[#c69608d7]">
          <div className="flex items-center">
            <MdOutlineLocalShipping />
          </div>
          <div>
            <h3>LOW STOCK PRODUCT</h3>
            <p className="text-2xl font-semibold">{report?.lowStockProduct}</p>
            <p>See the products</p>
          </div>
        </div>
      </Link>
      <Link href="/admin/product">
        <div className="bg-[#18c608cd]">
          <div className="flex items-center">
            <MdOutlineLocalShipping />
          </div>
          <div>
            <h3>TOP SOLD PRODUCT</h3>
            <p className="text-2xl font-semibold">{report?.topSoldProduct}</p>
            <p>See the products</p>
          </div>
        </div>
      </Link>
      <Link href="/admin/vandor">
        <div className="bg-[#1CAF9A]">
          <div className="flex items-center">
            <MdOutlineLocalShipping />
          </div>
          <div>
            <h3>TOTAL VANDORS</h3>
            <p className="text-2xl font-semibold">{report?.totalVandor}</p>
            <p>See all vandors</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Report;

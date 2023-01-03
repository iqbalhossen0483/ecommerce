import IndicatorIcon from "../../../components/admin/components/order/IndicatorIcon";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { Amount, PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
import React, { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { updateOrder } from "../../../components/admin/components/order/updateOrder";

const ViewOrder = () => {
  const { handleSubmit, register } = useForm();
  const [order, setOrder] = useState(null);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vandor, setVandor] = useState(null);
  const router = useRouter();
  const store = useStore();
  const status = ["processing", "shipping", "delivered", "canceled"];

  useEffect(() => {
    if (router.query.id) {
      (async function () {
        const { data, error } = await store?.fetchData(
          `/api/order?id=${router.query.id}&user_id=${store.user.id}`
        );
        if (data) {
          const vandor = await store?.fetchData(
            `/api/vandor?id=${data[0].vandor_id}`
          );
          if (vandor.data) {
            setVandor(vandor.data[0]);
            setOrder(data[0]);
          } else {
            store?.setAlert({ msg: error, type: "error" });
            router.push("/admin/customer/order");
          }
        } else {
          store?.setAlert({ msg: error, type: "error" });
          router.push("/admin/customer/order");
        }
      })();
    }
  }, [router.query.id, update]);

  async function onSubmit(data) {
    if (order && order.status !== data.status) {
      setLoading(true);
      await updateOrder(data.status, order, store, setUpdate);
      setLoading(false);
    }
  }

  if (!order || !vandor) return null;
  return (
    <DashboardLayout>
      <section>
        <PageInfo
          title="Detail of Order"
          type="View"
          icon={<FaShippingFast />}
        />

        <div className="order-deatils-container">
          <p className="text-gray-500 bg-gray-100 p-2 rounded-t w-fit">
            Order Shipments
          </p>
          <section className="wrapper">
            <IndicatorIcon status={order.status} />

            <div className="bg-[#C53600] h-6"></div>

            {/* order info start */}
            <div className="order-info">
              {/* vandor info start */}
              <div className="flex gap-2 items-center">
                <div>
                  {vandor?.shop_logo ? (
                    <img
                      className="object-contain h-14"
                      src={`/assets/${vandor.shop_logo}`}
                      alt="logo"
                    />
                  ) : null}
                </div>
                <p className="leading-5">
                  {vandor.name} <br /> {vandor.shop_location} <br />
                  {vandor.number}
                  <br />
                  {vandor.email}
                </p>
              </div>
              {/* vandor info end */}

              {/* invoice info start */}
              <div>
                <h3 className="text-center text-xl font-medium">INVOICE</h3>
                <hr />
                <p>
                  {order.created_at.slice(0, 10)} <br /> {order.invoice_id}
                </p>
              </div>
              {/* invoice info end */}
            </div>
            {/* order info end */}

            {/* shipping and billing address info start */}
            <div className="shipping-info">
              <div>
                <h3>SHIP TO</h3>
                <hr />
                <p>
                  {vandor.name} <br /> {vandor.shop_location} <br />
                  {vandor.email}
                  <br />
                  {vandor.number}
                </p>
              </div>
              <div>
                <h3>BILL TO</h3>
                <hr />
                <p>
                  {order.customer_name} <br /> {order.shipping_address} <br />
                  {order.customer_phone}
                  <br />
                  {order.customer_email}
                </p>
              </div>
            </div>
            {/* shipping and billing address info end */}

            {/* product info start  */}
            <div className="px-2 table-container border-x-0">
              <table className="w-full">
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>Image</td>
                    <td>Product Name</td>
                    <td>Price</td>
                    <td>Qty</td>
                    <td>Total</td>
                  </tr>
                </thead>
                <tbody>
                  {JSON.parse(order.product_info).map((product) => (
                    <tr key={product.product_id}>
                      <td>{product.product_id}</td>
                      <td>
                        <img
                          className="h-14 object-contain w-16"
                          src={`/assets/${product.image}`}
                          alt="img"
                        />
                      </td>
                      <td className="text-[#0866C6]">{product.name}</td>
                      <td>
                        <Amount value={product.price} />
                      </td>
                      <td>{product.quantity}</td>
                      <td>
                        <Amount value={product.price * product.quantity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* product info end  */}

              <div className="total-calc-wrapper">
                <div>
                  <div>
                    <h4>Sub Total</h4>
                    <Amount
                      className="text-green-800 font-medium"
                      value={order.sub_total}
                    />
                  </div>
                  <div>
                    <h4>Discount</h4>
                    <Amount
                      className="text-yellow-700"
                      value={order.discount}
                    />
                  </div>
                  <div>
                    <h4>Tax</h4>
                    <Amount className="text-red-500" value={order.tax} />
                  </div>
                  <div>
                    <h4>Shipping & Handling</h4>
                    <Amount
                      className="text-red-500"
                      value={order.shipping_charge}
                    />
                  </div>
                  <div>
                    <h4>Grand Total</h4>
                    <Amount
                      className="text-green-800 font-medium"
                      value={order.total}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-[#C53600] h-2 mb-8 mt-5"></div>
              <div className="flex justify-end mb-5 print:hidden">
                <button onClick={() => window.print()} className="btn">
                  Print
                </button>
              </div>
            </div>
          </section>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-5 px-7 text-gray-500 print:hidden"
          >
            <div className="flex gap-5 items-center">
              <label htmlFor="status">Update Status</label>
              <select
                required
                {...register("status", { required: true })}
                className="w-[85%]"
                name="status"
              >
                {status.map((st, i) => (
                  <option selected={order.status === st} key={i} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 flex justify-center">
              <button
                disabled={loading}
                className="px-10 py-2 bg-green-500 text-white rounded text-sm"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ViewOrder;

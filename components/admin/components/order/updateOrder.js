export async function updateOrder(status, item, store, setUpdate) {
  try {
    if (item.status === "delivered") {
      return store?.setAlert({
        msg: "This order was delivered",
        type: "error",
      });
    }
    if (item.status === "shipping" && status === "processing") {
      return store?.setAlert({
        msg: "Please cancel the order",
        type: "error",
      });
    }
    if (item.status === "canceled" && status === "delivered") {
      return store?.setAlert({
        msg: "Please back to shipping then deliver this",
        type: "error",
      });
    }
    const data = { status };
    data.user_id = store.user.id;
    data.customer_id = item.customer_id;
    data.vendor_id = item.vandor_id;
    data.order_status = item.status;
    const products = [];
    JSON.parse(item.product_info).forEach((product) => {
      products.push({
        product_id: product.product_id,
        quantity: product.quantity,
      });
    });
    data.products = JSON.stringify(products);

    const confirm = window.confirm("Are you sure to update the order?");
    if (confirm) {
      const res = await fetch(`/api/order?id=${item.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setUpdate((prev) => !prev);
        store?.setAlert({ msg: result.message, type: "success" });
      } else throw result;
    }
  } catch (error) {
    store?.setAlert({ msg: error.message, type: "error" });
  }
}

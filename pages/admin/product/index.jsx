import React, { useEffect, useRef, useState } from "react";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { RiProductHuntFill } from "react-icons/ri";
import QRCode from "react-qr-code";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";
import { downloadSVGAsPNG } from "../../../services/client/common";

const Products = () => {
  const [showAction, setShowAction] = useState(-1);
  const [products, setProducts] = useState(null);
  const [seeQrcode, setSeeQrcode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const store = useStore();
  const svgRef = useRef(null);

  function handleAction(i) {
    setShowAction((prev) => {
      if (prev === i) return -1;
      else return i;
    });
  }

  useEffect(() => {
    (async function () {
      if (store) {
        const { data, error } = await store?.fetchData(
          `/api/product?limit=${limit}&page=${page}&user_id=${store.user.id}&user_type=${store.user.user_role}`
        );
        if (data) {
          setProducts(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]);

  async function deleteProduct(id, image, features_img) {
    const confirm = window.confirm("Are you sure to delete?");
    if (confirm) {
      try {
        setLoading(true);
        const img = [image];
        img.push(...features_img.split("|"));
        const formData = new FormData();
        formData.append("user_id", store.user.id);
        formData.append("user_type", store.user.user_role);
        formData.append("id", id);
        formData.append("image", JSON.stringify(img));
        const { error, message } = await store?.deleteData(
          `/api/product`,
          formData
        );
        if (!error) {
          store?.setAlert({ msg: message, type: "success" });
          setUpdate((prev) => !prev);
          setShowAction(-1);
        } else {
          store?.setAlert({ msg: message, type: "error" });
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <DashboardLayout>
      <div
        onClick={() => setSeeQrcode(null)}
        className='dashboard-home-container'
      >
        <PageInfo title='Product' type='View' icon={<RiProductHuntFill />} />

        <div className='container'>
          <MainPagesTopPart
            addLink='/admin/product/addproduct'
            setLimit={setLimit}
          />

          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Sku</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length ? (
                  products.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          className={`${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                          onClick={() => handleAction(i)}
                        >
                          <div className={`sn-item`}>
                            {showAction !== i ? (
                              <HiPlusCircle />
                            ) : (
                              <HiMinusCircle />
                            )}
                            <span>{item.id}</span>
                          </div>
                        </td>
                        <td>
                          <img
                            className='h-5 object-contain'
                            src={`/assets/${item.main_image}`}
                            alt=''
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.sku}</td>
                        <td>{item.price}</td>
                        <td>
                          <p className={item.stock < 5 ? "text-red-500" : ""}>
                            {item.stock}
                          </p>
                        </td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={6}
                          editpage={`/admin/product/editproduct?id=${item.id}`}
                          deleteHandler={() =>
                            deleteProduct(
                              item.id,
                              item.main_image,
                              item.features_img
                            )
                          }
                          loading={loading}
                          setSeeQrcode={setSeeQrcode}
                          qrCode={item.qr_code}
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
            showingData={products?.length || 0}
          />
        </div>

        {seeQrcode ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              downloadSVGAsPNG(
                e,
                svgRef.current,
                seeQrcode.split(",")[0].split(":")[1].trim()
              );
            }}
            className='qr-code-container'
          >
            <QRCode ref={svgRef} value={seeQrcode || ""} />
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Products;

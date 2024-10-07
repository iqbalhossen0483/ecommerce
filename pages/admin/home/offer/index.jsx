import React, { useEffect, useState } from "react";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../../components/admin/common/common";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";

const DOffer = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState(null);
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

  useEffect(() => {
    (async function () {
      if (store) {
        const { data, error } = await store?.fetchData(
          `/api/offer?home=true&limit=${limit}&page=${page}`
        );
        if (data) {
          setOffer(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, page, limit]);

  async function deleteOffer(id, image) {
    if (!store.user) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", store.user.id);
    formData.append("id", id);
    formData.append("image", image);
    const { error, message } = await store?.deleteData(`/api/offer`, formData);
    if (!error) {
      store?.setAlert({ msg: message, type: "success" });
      setUpdate((prev) => !prev);
      setShowAction(-1);
    } else {
      store?.setAlert({ msg: message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <div className='dashboard-home-container'>
        <PageInfo title='Special Offer' type='View' />

        <div className='container'>
          <MainPagesTopPart
            addLink='/admin/home/offer/adoffer'
            setLimit={setLimit}
          />

          <div className='table-container'>
            <table className='w-3/4 mx-auto'>
              <thead className='offer-header'>
                <tr>
                  <th>ID</th>
                  <th className='col-span-2'>Title</th>
                  <th>PIORITY</th>
                  <th>SPECIFIQ PRODUCT</th>
                  <th>SPECIFIQ CAETGORY</th>
                  <th>ALL PRODUCT</th>
                  <th>IMAGE</th>
                </tr>
              </thead>
              <tbody>
                {offer && offer.length ? (
                  offer.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          onClick={() => handleAction(i)}
                          className={`${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                        >
                          <div className='flex items-center gap-1'>
                            {showAction !== i ? (
                              <HiPlusCircle />
                            ) : (
                              <HiMinusCircle />
                            )}
                            <span>{item.id}</span>
                          </div>
                        </td>
                        <td className='col-span-2'>{item.title}</td>
                        <td>{item.priority}</td>
                        <td>
                          {item.product ? (
                            <img
                              className='h-5'
                              src={`/assets/${item.product_image}`}
                              alt=''
                            />
                          ) : (
                            "NO"
                          )}
                        </td>
                        <td>{item.category ? item.category_name : "NO"}</td>
                        <td>{item.all_product ? "Yes" : "NO"}</td>
                        <td>
                          <img
                            className='h-5'
                            src={`/assets/${item.image}`}
                            alt=''
                          />
                        </td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={4}
                          editpage={`/admin/home/offer/editoffer?id=${item.id}`}
                          deleteHandler={() => deleteOffer(item.id, item.image)}
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
            showingData={offer?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DOffer;

import { Markup } from "interweave";
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

const DFAQ = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faq, setFaq] = useState(null);
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
          `/api/faq?home=true&limit=${limit}&page=${page}`
        );
        if (data) {
          setFaq(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]);

  async function deleteFaq(id) {
    setLoading(true);
    try {
      const res = await fetch("/api/faq", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          user_id: store.user.id,
          id,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        store?.setAlert({ msg: result.message, type: "success" });
        setUpdate((prev) => !prev);
        setShowAction(-1);
      } else throw result;
    } catch (error) {
      store?.setAlert({ msg: error.message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <div className='dashboard-home-container'>
        <PageInfo title='FAQ' type='View' />

        <div className='container'>
          <MainPagesTopPart
            addLink='/admin/home/faq/addfaq'
            setLimit={setLimit}
          />

          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>QUESTION</th>
                  <th>ANSWER</th>
                </tr>
              </thead>
              <tbody>
                {faq && faq.length ? (
                  faq.map((item, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          onClick={() => handleAction(i)}
                          className={`${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                        >
                          <div className='flex items-center gap-1 w-20 '>
                            {showAction !== i ? (
                              <HiPlusCircle />
                            ) : (
                              <HiMinusCircle />
                            )}
                            <span>{item.id}</span>
                          </div>
                        </td>
                        <td>{item.title}</td>
                        <td>
                          <Markup
                            content={
                              item.body.slice(0, 50) +
                              `${item.body.length > 50 && "..."}`
                            }
                          />
                        </td>
                      </tr>
                      {showAction === i && (
                        <DocumentHandler
                          colSpan={2}
                          deleteHandler={() => deleteFaq(item.id)}
                          editpage={`/admin/home/faq/editfaq?id=${item.id}`}
                          loading={loading}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <NoDataFount colSpan={2} />
                )}
              </tbody>
            </table>
          </div>
          <MainPagesFooterPart
            count={count}
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={faq?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DFAQ;

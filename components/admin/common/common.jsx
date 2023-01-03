import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { AiOutlineQrcode } from "react-icons/ai";
import { FaEdit, FaEye, FaHome, FaTrash } from "react-icons/fa";
import { HiPlusCircle } from "react-icons/hi";
import { menuAnimation } from "../components/SidebarMenu";

export function PageInfo({ title, type, icon }) {
  return (
    <div className='page-info'>
      <div className='icon'>{icon ? icon : <FaHome />}</div>
      <div>
        <h3>{title} Information</h3>
        <p>
          {type} {title} Information from here
        </p>
      </div>
    </div>
  );
}

export function MainPagesTopPart({ setLimit, addLink, setFilter, filterOpt }) {
  return (
    <>
      {addLink && (
        <div className='flex justify-end mb-3'>
          <Link href={addLink}>
            <button className='red-btn'>
              <span>New</span> <HiPlusCircle />
            </button>
          </Link>
        </div>
      )}

      <div className='flex justify-between mb-3'>
        <div className='flex gap-3 items-center'>
          <select onChange={(e) => setLimit(e.target.value)}>
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='10'>25</option>
            <option value='10'>50</option>
            <option value='10'>100</option>
          </select>
          <p>items/page</p>
        </div>
        <div>
          {setFilter && filterOpt ? (
            <select onChange={(e) => setFilter(e.target.value)}>
              {filterOpt.map((item, i) => (
                <option key={i} value={item.value}>
                  {item.txt}
                </option>
              ))}
            </select>
          ) : (
            <input type='text' placeholder='Search' />
          )}
        </div>
      </div>
    </>
  );
}

export function NoDataFount({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <p className='text-center'>No data found</p>
      </td>
    </tr>
  );
}

export function MainPagesFooterPart({
  page,
  limit,
  showingData,
  count,
  setPage,
}) {
  return (
    <div className='flex flex-col md:flex-row gap-3 justify-between mt-6 items-center'>
      <p className='text-sm'>
        Showing {page * limit} to {showingData + page * limit} of {count}{" "}
        entries
      </p>
      <div className='flex gap-1'>
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 0}
          className='btn'
        >
          Previous
        </button>
        <button className='btn active'>{page + 1}</button>
        <button onClick={() => setPage((prev) => prev + 1)} className='btn'>
          Next
        </button>
      </div>
    </div>
  );
}

export function DocumentHandler({
  colSpan,
  editpage,
  loading,
  deleteHandler,
  title,
  setSeeQrcode,
  qrCode,
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <AnimatePresence>
          <motion.div
            variants={menuAnimation}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='flex gap-5 items-center border-x'
          >
            <p className='font-bold text-gray-600'>Action</p>
            <div className='flex gap-2'>
              {editpage && (
                <Link href={editpage}>
                  {title && title === "view" ? (
                    <FaEye className='text-orange-400 w-7' />
                  ) : (
                    <FaEdit className='text-orange-400' />
                  )}
                </Link>
              )}
              {setSeeQrcode && qrCode ? (
                <button
                  className='mx-1'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSeeQrcode(qrCode);
                  }}
                >
                  <AiOutlineQrcode className='text-orange-700' />
                </button>
              ) : null}
              {deleteHandler && (
                <button disabled={loading} onClick={deleteHandler}>
                  <FaTrash className='text-red-500' />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </td>
    </tr>
  );
}

export function MySqlDate({ date }) {
  let datetime = date.slice(0, 10);
  let d = parseInt(datetime.slice(8, 10));
  d = d > 30 ? "01" : d + 1;
  datetime = date.slice(0, 8) + d;
  return <p>{datetime}</p>;
}

export function Amount({ value, page, className = "" }) {
  return (
    <p className={className}>
      <span className={`${page ? "text-2xl" : "text-lg"}`}>{value}</span>
      <span className={`${page ? "text-4xl" : "text-3xl"}`}>৳</span>
    </p>
  );
}

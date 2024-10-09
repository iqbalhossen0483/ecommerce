import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { PageInfo } from "../../../components/admin/common/common";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";

const ImportantLinks = () => {
  const [links, setLinks] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data } = await store?.fetchData(`/api/links`);
      if (data) setLinks(data);
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className='dashboard-home-container'>
        <PageInfo title='Some Important Links' type='View' />

        <div className='container'>
          <div className='flex justify-between mb-3'>
            <div className='flex gap-3 items-center'>
              <select>
                <option value='10'>10</option>
                <option value='10'>25</option>
                <option value='10'>50</option>
                <option value='10'>100</option>
              </select>
              <p>items/page</p>
            </div>
            <div>
              <input type='text' placeholder='Search' />
            </div>
          </div>

          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>INFO</th>
                  <th className='flex justify-center'>
                    <td className='flex justify-center'>
                      <Link href='/admin/footer/editlink'>
                        <FaEdit className='text-orange-400 w-5' />
                      </Link>
                    </td>
                  </th>
                </tr>
              </thead>
              <tbody>
                {links && links.length ? (
                  links.map((link) => (
                    <tr>
                      <td className={`sn-item bg-[#f1f1f1] `}>
                        <p className={link.name === "logo" ? "h-[40px]" : ""}>
                          {link.name}
                        </p>
                      </td>

                      <td>
                        {link.name === "logo" ? (
                          <img
                            height={40}
                            width={40}
                            src={`/assets/${link.info}`}
                            alt=''
                          />
                        ) : (
                          link.info
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>
                      <p className='text-center'>No data found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className='flex justify-between mt-6'>
            <p className='text-sm'>Showing 1 to 1 of 1 entries</p>
            <div className='flex gap-1'>
              <button disabled className='btn'>
                Previous
              </button>
              <button className='btn active'>1</button>
              <button className='btn'>Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImportantLinks;

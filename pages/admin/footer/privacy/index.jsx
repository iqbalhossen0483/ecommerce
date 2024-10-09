import { Markup } from "interweave";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit, FaHome } from "react-icons/fa";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";

const PrivacyPolicay = () => {
  const [privacy, setPrivacy] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async () => {
      const { data } = await store?.fetchData("/api/footerpages?name=privacy");
      if (data) setPrivacy(data[0]);
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className='dashboard-home-container'>
        <div className='page-info'>
          <div className='icon'>
            <FaHome />
          </div>
          <div>
            <h3>Privacypolicy Information</h3>
            <p>View Privacypolicy Information from here</p>
          </div>
        </div>
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
                  <th>DESCRIPTION</th>
                  <th className='flex justify-center'>
                    <p>ACTION</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='bg-gray-100' colSpan={2}>
                    <Markup
                      tagName='div'
                      className='text-justify'
                      content={privacy?.description}
                    />
                  </td>
                  <td>
                    <Link href='/admin/footer/privacy/editprivacy'>
                      <FaEdit className='text-orange-400 w-5' />
                    </Link>
                  </td>
                </tr>
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

export default PrivacyPolicay;

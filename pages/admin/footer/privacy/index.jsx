import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import React, { useEffect, useState } from "react";
import { FaEdit, FaHome } from "react-icons/fa";
import { Markup } from "interweave";
import Link from "next/link";

const PrivacyPolicay = () => {
  const [privacy, setPrivacy] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/footerpages?name=privacy policy");
        const result = await res.json();
        if (res.ok) {
          setPrivacy(result[0]);
        } else throw result;
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <div className="page-info">
          <div className="icon">
            <FaHome />
          </div>
          <div>
            <h3>Privacypolicy Information</h3>
            <p>View Privacypolicy Information from here</p>
          </div>
        </div>
        <div className="container">
          <div className="flex justify-between mb-3">
            <div className="flex gap-3 items-center">
              <select>
                <option value="10">10</option>
                <option value="10">25</option>
                <option value="10">50</option>
                <option value="10">100</option>
              </select>
              <p>items/page</p>
            </div>
            <div>
              <input type="text" placeholder="Search" />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th className="flex justify-center">
                    <p>ACTION</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="bg-gray-100" colSpan={2}>
                    <div className="flex justify-between items-center gap-4">
                      <Markup content={privacy?.description} />
                      <div className="w-20">
                        <Link href="/admin/footer/privacy/editprivacy">
                          <FaEdit className="text-orange-400 w-5" />
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-6">
            <p className="text-sm">Showing 1 to 1 of 1 entries</p>
            <div className="flex gap-1">
              <button disabled className="btn">
                Previous
              </button>
              <button className="btn active">1</button>
              <button className="btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrivacyPolicay;

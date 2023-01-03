import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Markup } from "interweave";
import Link from "next/link";

const About = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/footerpages?name=about");
        const result = await res.json();
        if (res.ok) {
          setAbout(result[0]);
        } else throw result;
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="About Company" type="View" />

        <div className="container">
          <div className="flex justify-between mb-3">
            <div className="flex gap-3 items-center">
              <select>
                <option value="5">5</option>
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
                      <Markup content={about?.description} />
                      <div className="w-20">
                        <Link href="/admin/footer/about/editabout">
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
              <button disabled className="btn">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default About;

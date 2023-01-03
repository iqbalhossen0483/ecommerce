import Link from "next/link";
import React from "react";
import { RiProductHuntFill } from "react-icons/ri";

const OverViewProduct = () => {
  const data = [
    {
      name: "Md Karim",
      comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      name: "Md Karim",
      comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      name: "Md Karim",
      comment: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    },
  ];
  return (
    <div>
      <div className="page-info">
        <div className="icon">
          <RiProductHuntFill />
        </div>
        <div>
          <h3>Product Overview</h3>
          <p>View Product Overview from here</p>
        </div>
      </div>
      <div className="container">
        <div className="border p-5 rounded space-y-5">
          <div className="flex flex-col items-center">
            <img
              src="/assets/product.jpg"
              className="h-20 object-contain"
              alt=""
            />
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatum
            </p>
          </div>
          <table>
            <thead>
              <tr>
                <th>
                  <p className="text-center">Stock</p>
                </th>
                <th>
                  <p className="text-center">Sales</p>
                </th>
                <th>
                  <p className="text-center">Canceled Order</p>
                </th>
                <th>
                  <p className="text-center">On Going Sales</p>
                </th>
                <th>
                  <p className="text-center">Ratings</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p className="text-center">5</p>
                </td>
                <td>
                  <p className="text-center">7</p>
                </td>
                <td>
                  <p className="text-center">2</p>
                </td>
                <td>
                  <p className="text-center">4</p>
                </td>
                <td>
                  <p className="text-center">8</p>
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            <p>
              <b>Comments:</b>
            </p>
            <div>
              {data.map((item, i) => (
                <div className="text-gray-500 py-3">
                  <p className="font-medium">{item.name}</p>
                  <p>{item.comment}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Link href="/admin/product">
              <button className="btn active">Go Back</button>
            </Link>
          </div>
        </div>
      </div>
      <p className="my-7 text-gray-400 text-sm">
        Copyright © 2022 All Rights Reserved.
      </p>
    </div>
  );
};

export default OverViewProduct;

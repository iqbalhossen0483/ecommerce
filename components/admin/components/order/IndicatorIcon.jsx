import React from "react";
import { GiCheckMark } from "react-icons/gi";

const IndicatorIcon = ({ status }) => {
  return (
    <div className="icons-wrapper">
      <div>
        <div
          className={
            /delivered|shipping|processing/.test(status) ? "highlight" : "none"
          }
        >
          <GiCheckMark />
        </div>
        <p>Processing</p>
      </div>
      <div>
        <div
          className={
            /delivered|shipping/.test(status) ? "bg-[navy]" : "bg-gray-400"
          }
        >
          <GiCheckMark />
        </div>
        <p>Shipping</p>
      </div>
      <div>
        <div className={/delivered/.test(status) ? "bg-[navy]" : "bg-gray-400"}>
          <GiCheckMark />
        </div>
        <p>Delivered</p>
      </div>
    </div>
  );
};

export default IndicatorIcon;

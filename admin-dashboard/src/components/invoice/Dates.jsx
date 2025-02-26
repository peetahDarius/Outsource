import React from "react";
// import "../../Quotation.css"

const Dates = ({invoiceNumber, invoiceDate, dueDate}) => {
  return (
    <>
      <article className="mt-10 mb-14 flex items-center justify-end">
        <ul>
          <li className="py-1">
            <span className="font-bold ">Invoice number:</span> {invoiceNumber}
          </li>
          <li className="py-1 bg-gray-100">
            <span className="font-bold ">Invoice date:</span> {invoiceDate}
          </li>
          <li className="py-1">
            <span className="font-bold ">Due Date:</span> {dueDate}
          </li>
        </ul>
      </article>
    </>
  );
};

export default Dates;

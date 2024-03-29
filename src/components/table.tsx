"use client";

import { useState } from "react";

interface TableProps {
  data: any;
  currencyList: any;
  defaultBaseCurrency: any;
  columnHeading: any;
  setColmnHeading: any;
}

export default function Table({
  data,
  currencyList,
  defaultBaseCurrency,
  columnHeading,
  setColmnHeading,
}: TableProps) {
  const deleteColumn = (item: any) => {
    console.log("item", item);
    const filteredArray = columnHeading.filter((i: any) => i !== item);
    columnHeading.length > 3 && setColmnHeading(filteredArray);
  };
  return (
    <table style={{ marginTop: "50px" }}>
      <tr>
        {columnHeading.map((item: any) => (
          <th>
            {currencyList[item]}
            {columnHeading.length > 3 && (
              <i
                onClick={() => deleteColumn(item)}
                className="fa fa-trash"
                aria-hidden="true"
                style={{ color: "red",  marginLeft: "10px",cursor:'pointer', fontSize: "24px", }}
              ></i>
            )}
          </th>
        ))}
      </tr>
      <tr>
        {data[defaultBaseCurrency] &&
          columnHeading.map((item: any) => (
            <td>{data[defaultBaseCurrency][item]}</td>
          ))}
      </tr>
    </table>
  );
}

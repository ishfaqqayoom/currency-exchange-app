"use client";

import Table from "@/components/table";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

function formatDateToYYYYMMDD(date: Date): string | null {
  // Ensure the input is a Date object
  if (!(date instanceof Date)) {
    console.error("Invalid date object");
    return null;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Main() {
  const [currencies, setCurrencies] = useState({});
  const [defaultBaseCurrency, setDefaultBaseCurrency] = useState("gbp");
  const [addColumnData, setAddColumnData] = useState("gbp");
  const [currencyValueData, setCurrencyValueData] = useState();
  const [date, setDate] = useState(formatDateToYYYYMMDD(new Date()) || "");
  const [loading, setLoading] = useState(true);
  const [columnHeading, setColmnHeading] = useState([
    "usd",
    "eur",
    "jpy",
    "chf",
    "cad",
    "aud",
    "zar",
  ]);

  const getCurrencyList = () => {
    setLoading(true);
    axios
      .get(
        "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json"
      )
      .then((res: any) => {
        if(res.status === 200){
        setCurrencies(res.data);
        setLoading(false);
        } else {
            alert('Can not load data')
        }
      }).catch((err) => console.log('errr 11',err.response.data))
  };

  const getCurrencyValueDetails = useCallback(() => {
    setLoading(true);
    axios
      .get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies/${defaultBaseCurrency}.json`
      )
      .then((res: any) => {
        console.log('res nnnn',res.status)
        setCurrencyValueData(res.data);
        setLoading(false);
      }).catch((err) => {
        setLoading(false);
        alert(err.response.data)
    })
  }, [date, defaultBaseCurrency]);

  useEffect(() => {
    getCurrencyList();
  }, []);

  useEffect(() => {
    getCurrencyValueDetails();
  }, [getCurrencyValueDetails]);
  const addAnotherColumn = (item: any) => {
    setAddColumnData(item);
  };
  const addNewCurrency = () => {
    columnHeading.length < 7 &&
    setColmnHeading((prevArray) => [...prevArray, addColumnData]);

  }
  return (
    <div style={{ padding: "50px" }}>
      <div style={{ display: "flex" }}>
        <div>
          <div style={{ marginBottom: "5px", fontSize: "14px" }}>
            Choose Currency
          </div>
          <select
            value={defaultBaseCurrency}
            style={{ width: "200px", height: "30px" }}
            onChange={(event: any) =>
              setDefaultBaseCurrency(event.target.value)
            }
          >
            {(Object.entries(currencies) as [string, string][]).map(
              ([key, value]) => (
                value.trim() !== "" && (
                    <option key={key} value={key}>
                      {value}
                    </option>
              )
              )
            )}
          </select>
        </div>

        <div style={{ marginLeft: "100px" }}>
          <div style={{ marginBottom: "5px", fontSize: "14px" }}>
            Choose Date
          </div>
          <input
            type="date"
            value={date}
            onChange={(event: any) => setDate(event.target.value)}
            style={{ width: "200px", height: "30px" }}
          />
        </div>
        { columnHeading.length < 7 &&
        <div style={{ marginLeft: "100px" }}>
          <div style={{ marginBottom: "5px", fontSize: "14px" }}>
            Add Currency
            {columnHeading.length < 7 && (
              <span
                style={{
                  color: "green",
                  fontSize: "20px",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
                onClick={addNewCurrency}
              >
                +
              </span>
            )}
          </div>

          <select
            value={addColumnData}
            style={{ width: "200px", height: "30px" }}
            onChange={(event: any) => addAnotherColumn(event.target.value)}
            //   setAddColumnData(event.target.value),
            // }
            // }
          >
            {(Object.entries(currencies) as [string, string][]).map(
              ([key, value]) => (
                value.trim() !== "" && (
                    <option key={key} value={key}>
                      {value}
                    </option>
              )
              )
            )}
          </select>
        </div>
}
      </div>
      {!loading && currencies && currencyValueData ? (
        <Table
          data={currencyValueData}
          currencyList={currencies}
          defaultBaseCurrency={defaultBaseCurrency}
          columnHeading={columnHeading}
          setColmnHeading={setColmnHeading}
        />
      ) : (
        <div style={{ marginTop: "50px", textAlign: "center" }}>
          Loading data...
        </div>
      )}
    </div>
  );
}

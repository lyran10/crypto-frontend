import { Banner } from "../banner.js";
import { CoinsTable } from "../coinsTable.js";
import { CryptoState } from "../../cryptoContext";
import { useEffect, useState } from "react";
import "../styles/navBar.css";

export const Home = () => {
  const [show, setshow] = useState(false); // state to show data after all the data is fetched

  // states fro contect api
  const { getdata, addingCoin, handleToken, SpinnerLoading, login } =
    CryptoState();

  // when enter page show spinner loader then handle the token if there is an id and also get the users watch list from the database
  useEffect(
    () => {
      SpinnerLoading();
      if (JSON.parse(localStorage.getItem("id") !== null)) {
        handleToken();
      }
      getdata();
    },
    [addingCoin, JSON.parse(localStorage.getItem("id"))],
    login
  );

// show the banner and coins table in 500 mili seconds
  setTimeout(() => {
    setshow(true);
  }, 500);

  return (
    <main
      className="m-auto"
      style={{
        backgroundColor: "black",
        width: "98.7vw",
        height: "100vh",
        position: "relative",
      }}
    >
      {show ? (
        <div>
          <Banner />
          <CoinsTable />
        </div>
      ) : null}
    </main>
  );
};

import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { CryptoState } from "../cryptoContext";
import "./styles/coinstable.css";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { numberWithCommas } from "./carousel";
import { InputSearch } from "./inputSearch";

export const CoinsTable = () => {
  const [search, setSearch] = useState(""); // search state for the input when changes
  // All states from the context api
  const { symbol, currency, coins, loading, fetchCoins } = CryptoState();
  const navigate = useNavigate();

// fetch all the coins data from an api update symbol and currency also
  useEffect(() => {
    fetchCoins();
  }, [symbol, currency]);

// filter all the coins that matches the search state
  const handleSearch = () => {
      return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <section>
      <Container
        className="coinTable d-flex justify-content-center flex-column"
        style={{
          textAlign: "center",
          backgroundColor: "black",
          color: "white",
          maxWidth: "100%",
          margin: "0px 0px 0px 0px",
        }}
      >
        <span className="fw-normal h2 pt-5">
          Crypto Currency Prices By Market Cap
        </span>

        <span>
          Click on the coins from the table for more information
        </span>
        {/* send the search state to the inputSearch component set the state */}
          <InputSearch search = {setSearch}/>

        {loading ? (
          <Spinner animation="border" variant="warning" />
          // if handleSearch().length is 0 thenthere is no match with the input search so send amessage not found
        ) : handleSearch().length === 0 ? ( 
          <h1>Not Found</h1>
        ) : (
          <Table variant="dark" className="coinTable w-auto" style={{borderRadius:"5px"}}>
            <thead>
              <tr style={{ color: "black" }}>
                <th style={{ backgroundColor: "gold" }}>Coin</th>
                <th style={{ backgroundColor: "gold" }}>Price</th>
                <th style={{ backgroundColor: "gold" }}>24h Change</th>
                <th style={{ backgroundColor: "gold" }}>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {/* display the coins which matches the input search */}
              {handleSearch().map((row) => {
                let profit = row.price_change_percentage_24h >= 0;
                return (
                  <tr
                    key={row.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/coin/${row.id}`)}
                  >
                    <td >
                      <div className="coinInfo imgAndName text-start">
                        <img src={row?.image} height="30" width="30"/>
                        <div className="d-flex justify-content-start flex-column">
                          <span className="fs-4">{row.symbol}</span>
                          <span style={{ fontSize: "12px" }}>{row.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="m-auto">
                      <span className="coinInfo d-flex align-items-center justify-content-center">
                      {symbol} {numberWithCommas(row?.current_price.toFixed(2))}
                      </span>
                      
                    </td>

                    <td className="m-auto">
                      <span
                      className="coinInfo d-flex align-items-center justify-content-center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "800",
                          color: profit > 0 ? "rgb(14,203,129)" : "red",
                        }}
                      >
                        {profit && "+"}{" "}
                        {row?.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </td>

                    <td className="m-auto">
                      <span className="coinInfo d-flex align-items-center justify-content-center">
                        {symbol}{" "}
                        {numberWithCommas(
                          row?.market_cap.toString().slice(0, -6)
                        )}{" "}
                        M
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Container>
    </section>
  );
};

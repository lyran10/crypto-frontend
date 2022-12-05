import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../../cryptoContext";
import { SingleCoin } from "../config/coinapi";
import { CoinInfo } from "../coinInfo.js";
import parse from "html-react-parser";
import Container from "react-bootstrap/esm/Container";
import { numberWithCommas } from "../carousel";
import Spinner from "react-bootstrap/Spinner";
import "../styles/coinpageAndChart.css";
import { checkTokenExpired } from "../config/tokenapi";
import { LoginModal } from "../loginModal";

export const CoinPage = () => {
  const [coin, setCoin] = useState(); // fetch coins and store in this state
  const { id } = useParams();// use the id of the coin
  // All states from the context api
  const {
    currency,
    symbol,
    addingCoin,
    deleteItem,
    handleToken,
    login,
    userList,
    setLogin,
    userId,
    setAddingCoin,
    setModal,
    setOpenSideNav,
    setOpenMiniNav,
    renewIfExpired
  } = CryptoState();

// fetch coin data from an api
  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id), {
      withCredentials: false,
    });
    setCoin(data);
  };

// function to add the coin in the data base
  const addCoinInDataBase = async (coin) => {
    try {
      setLogin(true);
      const { data } = await axios.post(
        "/addcoin",
        {coin: coin ,id: userId},
        { withCredentials: true }
      );
      console.log(data)
      setAddingCoin(data);// storing the added coin in this state to put in the use effect dependencies
      setOpenSideNav("translateback");// show the watch list
    } catch (error) {
      console.log(error)
    }
  }

// before adding coin check if the token expired or not if expired send a message that expired else add the coin
  const addCoin = (e) => {
    let token = localStorage.getItem("token")
    console.log(token)
    checkTokenExpired(`${token}`)
      .then((data) => {
        console.log(data)
        if (data.data.error) {
          console.log(data)
          renewIfExpired(addCoinInDataBase(e.target.id))
          
        }else{
          addCoinInDataBase(e.target.id)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }; 

// if there is an user id then run the handle token function it checks if the token is expired, if expired renew it
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("id") !== null)) {
      handleToken();
    }
    fetchCoin();// fetch the coins from an api
  }, [addingCoin, deleteItem, login, JSON.parse(localStorage.getItem("id"))]);

  if (!coin)// show spinner loader until coins data is not fetched
    return <Spinner className="" animation="border" variant="warning" />;

  return (
    <section>
      <Container
        className="container1 d-flex justify-content-start"
        style={{
          backgroundColor: "black",
          margin: "0px 0px 0px 0px",
          maxWidth: "100%",
        }}
      >
        <div className="coin d-flex flex-column">
          <img
            className="mt-5 mb-3 m-auto"
            src={coin?.image.large}
            alt={coin?.name}
            height="200"
            width="200"
          />

          <span
            style={{ fontWeight: "bold" }}
            className="text-light h2 text-center"
          >
            {coin?.name}
          </span>
          <span
            className="text-light"
            style={{ width: "100%", padding: "30px" }}
          >
            {parse(coin?.description.en.split(". ")[0])}.
          </span>

          <div
            className=" d-flex justify-content-start flex-column"
            style={{ padding: "5px 25px" }}
          >
            <span className="h5 text-light fw-bolder border-bottom p-2">
              Rank : {coin?.market_cap_rank}
            </span>

            <span className="h5 text-light fw-bolder border-bottom p-2">
              Current Price : {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </span>

            <span className="h5 text-light fw-bolder border-bottom p-2">
              Market Cap : {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -4)
              )}{" "}
              M
            </span>
          </div>

          {JSON.parse(localStorage.getItem("id")) === null ? (
            <LoginModal logins="Login In to make your own watch list" />
          ) : (
            <div className="d-flex justify-content-center">
              <button
                id={coin.id}
                onClick={(e) => addCoin(e)}
                className={`btn text-light border-warning ${
                  userList ? (userList.includes(id) ? "bg-danger" : "") : null
                } mb-3 w-75`}
                disabled={
                  userList ? (userList.includes(id) ? true : false) : null
                }
              >
                {userList
                  ? userList.includes(id)
                    ? "Added to Watch List"
                    : "Add to Watch List"
                  : null}
              </button>
            </div>
          )}
        </div>

        <div>
          <CoinInfo coin={coin} />
        </div>
      </Container>
    </section>
  );
};

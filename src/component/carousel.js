import { useState, useEffect } from "react";
import { CryptoState } from "./../cryptoContext";
import axios from "axios";
import { TrendingCoins } from "./config/coinapi";
import "./styles/bannerAndCarousel.css";
import { Carousel } from "react-bootstrap";

// function to put comma between the numbers
export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const Carousels = () => {
  const [trending, setTrending] = useState([]); // state to store the trending coins
  const { currency, symbol } = CryptoState();

// function to fetch all the trending coins
  const fetchTrending = async () => {
    const { data } = await axios.get(TrendingCoins(currency), {
      withCredentials: false,
    });
    setTrending(data);
  };

// first set the state with an empty array and then set it again with the coins
  useEffect(() => {
    setTrending([]);
    setTimeout(() => {
      fetchTrending();
    }, 50);
  }, [currency]);

  // used a map to display all the coins in the carousel
  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;
    return (
      <Carousel.Item key={coin.id} interval={1000}>
        <div className="d-flex gap-2 justify-content-center align-items-center flex-column mt-5 mb-5">
          <img src={coin?.image} alt={coin.name} height="100" />
          <div className="d-flex gap-2 justify-content-center align-items-center">
            <span style={{ fontSize: "15px", fontWeight: "800" }}>
              {coin?.symbol}
            </span>
            <span
              style={{
                fontSize: "15px",
                fontWeight: "800",
                color: profit > 0 ? "rgb(14,203,129)" : "red",
              }}
            >
              {profit && "+"} {coin?.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
          <span style={{ fontSize: "30px", fontWeight: "800" }}>
            {symbol}
            {numberWithCommas(coin?.current_price.toFixed(2))}
          </span>
        </div>
      </Carousel.Item>
    );
  });

  return (
    <section>
      <Carousel className="mt-5 mt-5 text-light" style={{ width: "95vw" }}>
        {items}
      </Carousel>
    </section>
  );
};

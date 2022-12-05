import { useEffect } from "react";
import { numberWithCommas } from "./carousel";
import { CryptoState } from "../cryptoContext";
import axios from "axios";
import { checkTokenExpired } from "./config/tokenapi";
import { useNavigate } from "react-router-dom";

export const WatchList = () => {
  const navigate = useNavigate()
  // All the states from the context API
  const {
    userList,
    addingCoin,
    getdata,
    fetchCoins,
    coins,
    symbol,
    currency,
    deleteItem,
    setDeletedItem,
    setLogin,
    renewIfExpired
  } = CryptoState();

  // fetch coins from an api and also get the user coin list if logged in
  useEffect(() => {
    fetchCoins();
    getdata();
  }, [addingCoin, deleteItem, currency]);

//function to delete the coin from database
  const deleteCoinFromDataBase = async (userId) => {
    try {
      setLogin(true);
      let id = userId;
      const { data } = await axios.delete(
        "/deletecoin",
        { data: { id: id } },
        { withCredentials: true }
      );
      setDeletedItem(data);
    } catch (error) {
      navigate("/")
    }
    
  }
// check if the token is expired then delete the coin 
  const handleDelete = async (e) => {
    let token = localStorage.getItem("token")
      checkTokenExpired(`${token}`)
        .then((data) => {
          if (data.data.error) {
            renewIfExpired()
            deleteCoinFromDataBase(e.target.id)
          }else{
            deleteCoinFromDataBase(e.target.id)
          }
        })
        .catch((err) => {
          navigate("/")
        });
  };

// display the waltch list of the user by using map function
  return (
    <div>
      {userList
        ? coins.map((coin) => {
            if (userList.includes(coin.id)) {
              return (
                <li
                  key={coin?.id}
                  className="watchListLi d-flex justify-content-between"
                >
                  <span className="mt-1">{coin?.name}</span>
                  <div className="d-flex gap-2">
                    <span
                      className="mt-1"
                      id={coin.id}
                      onClick={(e) => console.log(e.target.id)}
                    >
                      {symbol}{" "}
                      {numberWithCommas(coin?.current_price.toFixed(2))}
                    </span>
                    <span>
                      <button
                        className="text-light p-1"
                        style={{
                          border: "solid 1px gold",
                          backgroundColor: "black",
                          borderRadius: "5px",
                          fontSize: "10px",
                        }}
                        id={coin.id}
                        onClick={(e) => handleDelete(e)}
                      >
                        remove
                      </button>
                    </span>
                  </div>
                </li>
              );
            }
          })
        : null}
    </div>
  );
};

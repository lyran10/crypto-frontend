import "./styles/navBar.css";
import { CryptoState } from "../cryptoContext";
import { useNavigate } from "react-router-dom";
import { WatchList } from "./watchList";
import { useEffect,useRef,useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Toastify,loggedOutToasts } from "./toastify";
import {LogoutButton} from "./logoutButton"
import {MiniMainBar} from "./miniNavBar"
import {deleteFromDataBase} from "./config/tokenapi.js"

export const SideBar = () => {
  const sideMenuRef = useRef()// useRef to targate the side nav
  const [logout,setlogout] = useState(false) // state to set logout
  // All states from context api
  const {
    userName,
    cleared,
    login,
    setLogin,
    userId,
    openSideNav,
    setUserName,
    setOpenSideNav,
    SpinnerLoading,
    currency,
    setCurrency,
    openMiniNav,
    setOpenMiniNav,
  } = CryptoState();
  const navigate = useNavigate();

    //function when clicked outside if the side nav close the side nav 
  const closeSideMenuBar = (ref,close,set,event) => {
    document.body.addEventListener(event,(event) => {
      if(ref.current){
        if(!ref.current.contains(event.target)){set(close)}
  }        
})
  }

  useEffect(() => {
    if(login === true){
      closeSideMenuBar(sideMenuRef,"translate",setOpenSideNav,"click")
    }
  }, [openSideNav, login, currency, openMiniNav]);

// functio to logout when clicked on the button, remove all the info that had been set in the states and alose remove cookie by using logout api
  const handleLogout = () => {
    axios.get("/logout").then((data) => {
      deleteFromDataBase(JSON.parse(localStorage.getItem("id")))
      .then((data) => console.log())
      .catch((err) => navigate("/"));
      setTimeout(() => {
        setLogin(false);
      }, 500);
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      if (data.data.status === "cleared") {
        setTimeout(() => {return loggedOutToasts("Logged Out")},700)
        setlogout(true)
        setTimeout(() => { setlogout(false)},5000)
        SpinnerLoading();
        navigate("/");
        setUserName("");
        setOpenMiniNav("minitranslateback");
      } else {
        SpinnerLoading();
        navigate("/");
      }
    });
  };

// set the currency when changed ILS and USD
  const handleChange = (e) => {
    SpinnerLoading();
    setCurrency(e.target.value);
    setOpenMiniNav("minitranslateback");
  };

   // select form of the currency
   const formSelect = () => {
		return(
      <Form.Select
      value={currency}
      onChange={(e) => handleChange(e)}
      className="mini text-light bg-dark"
      aria-label="Default select example"
    >
      <option value="USD">USD</option>
      <option value="ILS">ILS</option>
    </Form.Select>
		)
	}

// show the side nav only when logged in
  return (
    <>
      {login ? (
        <nav
          style={{ paddingRight: "0px" }}
          className={`sideBar ${
            !login || cleared === "" ? "d-flex" : "d-none"
          } ${openSideNav} justify-content-start text-light`}
        >
          <ul
            className="sideBarUl"
            style={{ backgroundColor: "black" }}
          >
            <li
              className="li text-light mt-3"
              style={{ fontWeight: "800", fontSize: "20px" }}
            >
              <div className="d-flex flex-column text-center">
                <span>User Name</span>
                <span>{`${userName}`}</span>
              </div>
            </li>
            <li className="li">
              <div
              ref={sideMenuRef}
                className="watchList bg-dark d-flex flex-column"
                style={{
                  minHeight: "50vh",
                  borderRadius: "10px",
                }}
              >
                <div>
                {formSelect()}
                </div>
                <span className="h6 mt-3 align-self-center fw-bold">
                  Watch List
                </span>
                <ul className="watchListUl">
                  <WatchList />
                </ul>
              </div>
            </li>
            <li className="li">
            <LogoutButton Logout = {handleLogout}/>
            </li>
          </ul>
        </nav>
      ) : null}
      {logout?<Toastify/>:null}
      {!login ? (
      <MiniMainBar selectForm ={formSelect()} minitranslate={openMiniNav}/>
      ) : null}
    </>
  );
};

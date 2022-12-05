import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import "./styles/navBar.css";
import { Link } from "react-router-dom";
import { CryptoState } from "../cryptoContext.js";
import { SideBar } from "./sideBar.js";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { checkTokenExpired } from "./config/tokenapi";
import { LoginModal } from "./loginModal.js";
import { SignInModal } from "./signinModal";

export const Nav_Bar = () => {
  // All states from the context api
  const {
    currency,
    setCurrency,
    login,
    setLogin,
    spinner,
    SpinnerLoading,
    setModal,
    openSideNav,
    setOpenSideNav,
    openMiniNav,
    setOpenMiniNav,
    renewIfExpired
  } = CryptoState();

// dependencies to update and then rendered
  useEffect(() => {}, [login, spinner, openSideNav, openMiniNav]);

// function to open watchlist when clicked and close when clicked again
  const openAndCloseWatchList = () => {
    return   openSideNav === "translate"
       ?setOpenSideNav("translateback")
       : setOpenSideNav("translate");

  }

// first check if the token is not expired, if expired renew then open or close the watch list
  const handleClick = async () => {
    let token = localStorage.getItem("token")
     checkTokenExpired(`${token}`)
       .then((data) => {
         if (data.data.error) {
           renewIfExpired()
           openAndCloseWatchList()
         }else{
           openAndCloseWatchList()
         }
       })
       .catch((err) => {
         console.log(err);
       });
 };

// function to open or close mini nav
  const handleMiniBar = () => {
    openMiniNav === "minitranslate"
      ? setOpenMiniNav("minitranslateback")
      : setOpenMiniNav("minitranslate");
  };

  const handleChange = (e) => {
    SpinnerLoading();
    setCurrency(e.target.value);
    setOpenMiniNav("minitranslateback")
  };

  return (
    <nav>
      <Navbar
        bg="dark"
        className="navbar d-flex position-fixed"
        variant="dark"
        style={{ width: "100%" }}
      >
        <Container className="p-2 d-flex justify-content-between gap-5">
          <Link
            className="navBrand"
            style={{
              cursor: "pointer",
              color: "gold",
              fontWeight: "800",
              fontSize: "20px",
            }}
            to="/"
          >
            Crypto Currency
          </Link>
          <Nav className="d-flex gap-4 justify-content-center">
          <Form.Select
            value={currency}
            onChange={(e) => handleChange(e)}
            className="select text-light bg-dark"
            aria-label="Default select example"
          >
            <option value="USD">USD</option>
            <option value="ILS">ILS</option>
          </Form.Select>
              {/* button when login for watch list */}
            {!login ? null :  (
              <GiHamburgerMenu
                onClick={handleClick}
                size={40}
                style={{ cursor: "pointer" }}
              />
            )}
             {/* button for mini nav when not logged in */}
            {!login ? (
                <GiHamburgerMenu
                className = "miniSide"
                onClick={handleMiniBar}
                size={40}
                style={{ cursor: "pointer" }}
              />
            )
             : null}
 {/* spinner during page loading */}
            {spinner ? (
              <div className="loadingPage d-flex justify-content-center">
                <Spinner
                  style={{ width: "8rem", height: "8rem" }}
                  className="m-auto"
                  animation="border"
                  variant="warning"
                />
              </div>
            ) : null}
            <LoginModal dNone="logSignModal" button="Login" />
            <SignInModal dNone="logSignModal" />
          </Nav>
        </Container>
      </Navbar>
      <SideBar />
    </nav>
  );
};

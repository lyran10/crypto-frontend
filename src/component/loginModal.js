import React, { useState,useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import { tokenFromDataBase, checkTokenExpired } from "./config/tokenapi";
import { CryptoState } from "../cryptoContext.js";
import "./styles/loginsignin.css";
import {Toastify,errorToasts,loggedInToasts} from "./toastify.js"

export const LoginModal = (props) => {
  const { dNone, logins, button, sideButton, tokenLogin } = props; // props from navBar sideBar and coin page components

  // All states from context api
  const {
    SpinnerLoading,
    setOpenSideNav,
    setUserName,
    setUserId,
    setLogin,
    login,
    setOpenMiniNav,
  } = CryptoState();
  const [inputs, setInputs] = useState("");// state fro the inputs of user
  const [show, setshow] = useState(false);// state for modal
  const navigate = useNavigate();
  const [fullscreen, setFullscreen] = useState(true);
  const [Show, setShow] = useState(false);
  axios.defaults.withCredentials = true;

// function to make madal responsive
  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

// check if user name exists in the data base, if exists set the state with the info and send a log in message
  const checkLogin = () => {
    axios
    .post("/login", inputs, { withCredentials: true })
    .then((data) => {
      setTimeout(() => {setLogin(data.data.status);}, 500);
       if(data.data.notExists) {
        errorToasts(data.data.notExists);
      }else if (data.data.user) {
        setUserName(data.data.user.user_name);
        setUserId(data.data.user.id);

        if (JSON.parse(localStorage.getItem("id")) == null) {
          localStorage.setItem("id", JSON.stringify(data.data.user.id));
        }
        SpinnerLoading();
        setShow(false) 
        setInputs("");
        setTimeout(() => {return loggedInToasts("Logged In")},700)
      } else {
        navigate("/");
        setShow(false);
        setInputs("");
      }
    })
    .catch((error) => console.log(error));
   }

  // check the inputs
   const handleClick = (e) => {
    e.preventDefault();
    if (inputs === "") { // if inputs is "" means there are no inputs
      errorToasts("Fill the details");// send this message
    } else if (inputs.user_name === "" || inputs.user_name === undefined) {
      errorToasts("Enter User Name"); // if only user name is not given then send this message
    } else if (
      inputs.user_password === "" ||
      inputs.user_password === undefined
    ) {
      errorToasts("Enter Password");// if only user password is not given then send this message
    }else{
      checkLogin()// if none of the above then run this function
    }
    
  };

//check user token 
  const checkUser = async () => {
    tokenFromDataBase(JSON.parse(localStorage.getItem("id"))).then((data) => {
      checkTokenExpired(data.data.user[0]).then((data) => {
        if (data.data.status) {
          navigate("/");
        }
      });
    });
  };

// whne logged in close both the navs
  useEffect(() => {
    checkUser();
    setOpenSideNav("translate");
    setOpenMiniNav("minitranslateback");
  }, []);

  setTimeout(() => {
    setshow(true);
  }, 500);

// show the login button when not logged in
  return (
    <section>
      {!login ? (
        <Button
          style={{
            backgroundColor: "gold",
            border: "none",
            margin: "auto",
            marginTop:"1px"
          }}
          className={`btn text-dark ${dNone}`}
          onClick={() => handleShow("sm-down")}
        >
          {logins || button || sideButton || tokenLogin}
        </Button>
      ) : null}
      <Modal
        style={{ height: "100%" }}
        show={Show}
        fullscreen={fullscreen}
        onHide={() => setShow(false)}
      >
        <Modal.Body style={{ border: "none" }}>
          <Container className="d-flex justify-content-center align-items-center flex-column text-light p-3">
            {show ? (
              <form
                style={{ width: "100%" }}
                className="form d-flex flex-column gap-3 justify-content-start p-1"
              >
                <h1 className="h1 text-light">LOGIN</h1>
                <div>
                  <label>User Name</label>
                  <br />
                  <input
                    style={{ width: "100%" }}
                    className="input p-1"
                    name="user_name"
                    onChange={(e) =>
                      setInputs((state) => ({
                        ...state,
                        user_name: e.target.value,
                      }))
                    }
                    type="text"
                  />
                  <br />
                </div>
                <div>
                  <label>Password</label>
                  <br />
                  <input
                    style={{ width: "100%" }}
                    className="input p-1"
                    onChange={(e) =>
                      setInputs((state) => ({
                        ...state,
                        user_password: e.target.value,
                      }))
                    }
                    type="password"
                  />
                  <br />
                </div>
                <div className="d-flex flex-column gap-3">
                  <input
                    className="loginButtons btn text-light border-warning"
                    onClick={(e) => handleClick(e)}
                    type="submit"
                    value="Login"
                  />
                </div>
              </form>
            ) : null}
          </Container>
        </Modal.Body>
        {!login?<Toastify/>:null}
      </Modal>
      {login?<Toastify/>:null}
    </section>
  );
};

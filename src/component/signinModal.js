import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { CryptoState } from "../cryptoContext.js";
import "./styles/loginsignin.css";
import { Toastify,errorToasts,singedInToasts } from "./toastify.js";

export const SignInModal = (props) => {
  const { dNone } = props;
  const { SpinnerLoading, login } = CryptoState();
  const [inputs, setInputs] = useState({});
  const [show, setshow] = useState(false);
  const navigate = useNavigate();
  const [Show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [isSigned,setIsSigned] = useState(false)

// function to make the modal responsive
  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

// put login in dependency so it will be updated and render
  useEffect(() => {
    SpinnerLoading();
  }, [login]);

// create user in the data base
  const signIn = () => {
    axios
      .post("/signup", inputs)
      .then((data) => {
        if (data.data.Registered) {
          errorToasts(data.data.Registered);
        } else {
          setShow(false);
          navigate("/");
          setIsSigned(true)
          setTimeout(() => {setIsSigned(false)},8000)
          setTimeout(() => {return singedInToasts("Signed In")},100) 
        }
      })
      .catch((error) => console.log(error));
  }

  const handleClick = (e) => {
    e.preventDefault();
      // regex for email pattern
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (// check if all the inputs are empty
      !inputs.user_confirm_password ||
      !inputs.user_password ||
      !inputs.user_name ||
      !inputs.user_email_id
    ) {
      return errorToasts("Fill all the Details");
    }else if (emailPattern.test(inputs.user_email_id) === false) {
      return errorToasts("Email ID not valid");// if email pattern does not match
    }else if (inputs.user_password.length < 8) {
      return errorToasts("Password should be minimum of 8 characters");// if password is less then 8 characters
    }else if (inputs.user_confirm_password !== inputs.user_password) {// if password does not match
      return errorToasts("Password does not match");
    }
      signIn()// if none of the above then create a user
    
  };

  setTimeout(() => {
    setshow(true);
  }, 500);

  return (
    <>
     {/* if not login then show the sign in button */}
      {!login ? (
        <Button
          style={{ backgroundColor: "gold", border: "none" }}
          className={`btn text-dark ${dNone}`}
          onClick={() => handleShow("sm-down")}
        >
          SignUp
        </Button>
      ) : null}
      <Modal
        style={{ height: "100%", paddingTop: "20px" }}
        show={Show}
        fullscreen={fullscreen}
        onHide={() => setShow(false)}
      >
        <Modal.Body style={{ border: "none" }}>
          <Container className="d-flex justify-content-center align-items-center flex-column text-light">
            {show ? (
              <form
                style={{ width: "100%" }}
                className="form d-flex flex-column gap-3 justify-content-start p-3"
              >
                <h1 className="h1 text-light mt-3">SIGN UP</h1>
                <div>
                  <div>
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
                        required
                      />
                      <br />
                    </div>
                    <div>
                      <label>Email ID</label>
                      <br />
                      <input
                        style={{ width: "100%" }}
                        className="input p-1"
                        onChange={(e) =>
                          setInputs((state) => ({
                            ...state,
                            user_email_id: e.target.value,
                          }))
                        }
                        type="email"
                        required
                      />
                      <br />
                    </div>
                  </div>
                  <div>
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
                        required
                      />
                      <br />
                      <span style={{ fontSize: "13px", color: "gold" }}>
                        Minimum 8 characters
                      </span>
                    </div>
                    <div>
                      <label>Confirm Password</label>
                      <br />
                      <input
                        style={{ width: "100%" }}
                        className="input p-1"
                        onChange={(e) =>
                          setInputs((state) => ({
                            ...state,
                            user_confirm_password: e.target.value,
                          }))
                        }
                        type="password"
                        required
                      />
                    </div>
                  </div>
                </div>
                <input
                  className="btn text-light border-warning mb-3"
                  onClick={handleClick}
                  type="submit"
                  value="Sign Up"
                />
              </form>
            ) : null}
          </Container>
        </Modal.Body>
        {!isSigned?<Toastify />:null}
      </Modal>
      {isSigned?<Toastify />:null}
    </>
  );
};

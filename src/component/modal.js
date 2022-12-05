import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import "./styles/navBar.css";
import { CryptoState } from "../cryptoContext";
import { LoginModal } from "./loginModal";

export const Modale = () => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const { setModal } = CryptoState();

// function to show modal
  const handleClose = () => {
    setShow(false);
    navigate("/log");
    setModal(false);
  };

// close button in the modal
  const closeButton = () => {
    setShow(false);
    setModal(false);
  };

  return (
    <section>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body variant="dark">
          Your session is over. Please login again
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={closeButton}>
            Close
          </Button>
          <LoginModal tokenLogin="Login" onClick={handleClose}/>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

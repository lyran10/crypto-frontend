import "./App.css";
import { Nav_Bar } from "./component/navBar.js";
import { Routes, Route } from "react-router-dom";
import { CryptoState } from "./cryptoContext";
import { Home } from "./component/pages/homepage.js";
import { CoinPage } from "./component/pages/coinpage.js";
import { Modale } from "../src/component/modal.js";
import { useEffect } from "react";

function App() {
  const { modal } = CryptoState();

  useEffect(() => {}, [modal]); // update modal

  return (
    <div className="">
      {/* if modal is true then show that session is over */}
      {modal ? <Modale /> : null}
      <Nav_Bar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<CoinPage />} />
      </Routes>
    </div>
  );
}

export default App;

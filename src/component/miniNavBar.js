import { useEffect,useRef } from "react"
import { LoginModal } from "./loginModal"
import { SignInModal } from "./signinModal"
import "./styles/navBar.css";
import { CryptoState } from "../cryptoContext";

export const MiniMainBar = (props) => {
  const miniNavBar = useRef() // useRef to target mini nav
  const {
    setOpenMiniNav} = CryptoState()
  const {selectForm, minitranslate} = props // props from side bar

// function to close mini nav when clicked out of the mini nav
  const closeMiniNavBar = (ref,close,set,event) => {
    document.body.addEventListener(event,(event) => {
      if(ref.current){
        if(!ref.current.contains(event.target)){set(close)}
  }        
})
  }

  useEffect(() => {
    closeMiniNavBar(miniNavBar,"minitranslateback",setOpenMiniNav,"mousedown")
  },[minitranslate])


  return(
    <nav
    style={{ paddingRight: "0px" }}
    className={`miniSideBar  ${minitranslate} justify-content-start text-light`}
    ref = {miniNavBar}
  >
    <ul
      className="sideBarUl"
      style={{
        width: "100%",
        minHeight: "200px",
        backgroundColor: "black",
      }}
    >
      <li>
      {selectForm}
      </li>
      <li>
        <LoginModal sideButton="Login" />
      </li>
      <li>
        <SignInModal />
      </li>
    </ul>
  </nav>
  )
}
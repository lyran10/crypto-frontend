import { CryptoState } from "../cryptoContext";

// logout button 
export const LogoutButton = (props) => {
  const {Logout} = props
const {setOpenSideNav} = CryptoState()

// when logged out close the side nav if open
const handleLogout = () => {
  setOpenSideNav("translate")
  Logout() // logout function from side bar component

}

      return(
        <>
        <button
                onClick={() => {handleLogout()}}
                style={{ backgroundColor: "gold" }}
                className="mb-3 btn text-dark border-warning"
              >
                LOGOUT
              </button>
              
        </>
      )
}
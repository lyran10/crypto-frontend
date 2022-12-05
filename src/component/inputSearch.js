
// search input of the coins
export const InputSearch = (props) => {
  const {search} = props
  return(
    <form className="mt-3 mb-3">
    <label className="custom-field one">
      <input
        className="text-light inputField"
        onChange={(e) => search(e.target.value)}
        type="text"
        placeholder=" "
      />
      <span className="placeholder">Enter Coin</span>
    </label>
  </form>
  )
}
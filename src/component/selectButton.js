// buttons that are in the chart
export const SelectButton = ({ children, selected, onClick }) => {
  return (
    <span
      style={{
        cursor: "pointer",
        borderRadius: "5px",
        border: "solid 1px gold",
        backgroundColor: selected ? "gold" : "",
        color: selected ? "black" : "",
        fontWeight: selected ? "700" : "500",
        padding: "10px",
      }}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

const ToggleButton = ({ value, sendValue }) => {
  let className = 'button-toggle';
  if (!value) className += ' button-off';
  return (
    <button className={className} onClick={() => sendValue(!value)}>
      <svg width="2.8rem" height="1.5rem" xmlns="http://www.w3.org/2000/svg">
        <circle
          className="button-toggle-circle"
          fill="white"
          cx="74%"
          cy="50%"
          r="25%"
        ></circle>
      </svg>
    </button>
  );
};
export default ToggleButton;

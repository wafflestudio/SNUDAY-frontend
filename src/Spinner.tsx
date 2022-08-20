//Source: https://codepen.io/supah/pen/BjYLdW
import 'Spinner.css';
const Spinner = ({ color = 'var(--blue)', size = 50, delay = '0' }) => (
  <svg
    className="spinner"
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    style={{ animationDelay: delay }}
  >
    <circle
      className="path"
      cx={`${size / 2}`}
      cy={`${size / 2}`}
      r={`${size / 2 - 5}`}
      //   cx="50"
      //   cy="50"
      //   r="5"
      fill="none"
      stroke={color}
      strokeWidth={size / 10}
      style={{ animationDelay: delay }}
    ></circle>
  </svg>
);
export default Spinner;

import { COLORS } from 'Constants';
import 'ColorPicker.css';
import ReactDOM from 'react-dom';
const ColorPicker = ({ color, setColor, target, left, ...rest }) => {
  const colorMap = Object.entries(COLORS);
  console.log(target);
  return (
    <div className="colorpicker-wrapper">
      <div
        className="colorpicker-arrow"
        style={
          left + 24 > window.innerWidth - (12 + 20)
            ? { right: 20 }
            : { left: left < 12 + 20 ? 32 - 12 : left - 12 }
        }
      />
      <div className="colorpicker-palette">
        {colorMap.map(([name, value], idx) => (
          <div
            key={idx}
            className="colorpicker-color"
            style={{
              backgroundColor: value,
              width: `calc(100% / ${colorMap.length})`,
            }}
            onClick={(e) => {
              setColor({ name, value });
              console.log(e.target);
              e.stopPropagation();
              e.preventDefault();
            }}
            {...rest}
          ></div>
        ))}
      </div>
    </div>
  );
};
export default ColorPicker;

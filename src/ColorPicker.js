import { COLORS } from 'Constants';
import 'ColorPicker.css';
import ReactDOM from 'react-dom';
const ColorPicker = ({
  color,
  setColor,
  target,
  targetBoundingRect,
  ...rest
}) => {
  const colorMap = Object.entries(COLORS);
  console.log(target);
  const left = ((targetBoundingRect.left << 1) + targetBoundingRect.width) >> 1;
  const top = targetBoundingRect.top + targetBoundingRect.height;
  return (
    <div className="colorpicker-wrapper" style={{ top }}>
      <div
        className="colorpicker-arrow"
        style={
          !targetBoundingRect
            ? {}
            : left + 24 > window.innerWidth - (12 + 20)
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

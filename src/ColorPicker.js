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
  const targetLeft =
    ((targetBoundingRect.left << 1) + targetBoundingRect.width) >> 1;
  const arrowLeft =
    targetLeft + 24 > window.innerWidth - (12 + 20)
      ? undefined
      : targetLeft < 12 + 20
      ? 32 - 12
      : targetLeft - 12;
  const arrowRight = targetLeft ? undefined : 20;
  const top = targetBoundingRect.top + targetBoundingRect.height;
  return (
    <div className="colorpicker-wrapper" style={{ top }}>
      <div
        className="colorpicker-arrow"
        style={
          !targetBoundingRect
            ? {}
            : arrowLeft
            ? { left: arrowLeft }
            : { right: arrowRight }
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

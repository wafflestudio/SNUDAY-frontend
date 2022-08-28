import ColorPicker from 'ColorPicker';
import Modal from 'Modal';
import { useEffect, useState } from 'react';
import { getChannel } from './API';
import { COLORS } from './Constants';
import { useAuthContext } from './context/AuthContext';
import { useCalendarContext } from './context/CalendarContext';

const Tag = ({
  id,
  name,
  color: defaultColor,
  disabled,
  readonly = true,
  ...props
}) => {
  const findColor = (id) => {
    if (channelColors) {
      return { value: COLORS[channelColors.get(id)] ?? channelColors.get(id) };
    } else {
      const channelColors = new Map(
        JSON.parse(localStorage.getItem('channelColors'))
      );
      return {
        value:
          COLORS[channelColors.get(id)] ?? channelColors.get(id) ?? '#b8b8b8',
      };
    }
  };
  const { channelColors, setChannelColor } = useCalendarContext();
  const [channel, setChannel] = useState(null);
  const [longPress, setLongPress] = useState(false);
  const showColorPicker = !readonly && longPress;
  if (showColorPicker) window.navigator.vibrate?.(5);
  const [timerId, setTimerId] = useState(undefined);
  const [leftClickPos, setLeftClickPos] = useState(undefined);
  const [boundingRect, setBoundingRect] = useState(undefined);
  const [color, setColor] = useState(defaultColor ?? findColor(id));
  const {
    value: { user },
  } = useAuthContext();
  useEffect(() => {
    if (!name) {
      name = JSON.parse(localStorage.getItem('channel'))?.[id];
      getChannel(id).then(setChannel);
    }
    setColor(findColor(id));
    return () => {
      setChannel(null);
      name = null;
    };
  }, [id, name]);
  useEffect(() => {
    if (!readonly && color.name) setChannelColor(id, color.name);
    // console.log(color);
  }, [color.value]);
  if (!(channel || name)) return <div className="tag loading"></div>;

  return (
    <>
      <div
        {...props}
        className={disabled ? 'tag disabled' : 'tag'}
        style={{
          backgroundColor: color.value,
          zIndex: longPress ? '999' : '',
          ...props.style,
        }}
        onTouchStart={(e) => {
          if (showColorPicker) {
            setLongPress(false);
            return;
          }
          if (
            e.target === e.currentTarget &&
            e.targetTouches.length === 1 &&
            e.targetTouches.length === e.touches.length
          ) {
            const boundingRect = e.target.getBoundingClientRect();
            console.log(boundingRect);
            setLeftClickPos(
              ((boundingRect.left << 1) + boundingRect.width) >> 1
            );
            setTimerId(setTimeout(setLongPress, 700, true));
            setBoundingRect(boundingRect);
          }
        }}
        onTouchMove={(e) => {
          if (e.target === e.currentTarget && !longPress) {
            // console.log(e);
            setLongPress(false);
            clearTimeout(timerId);
          }
        }}
        onTouchEnd={(e) => {
          clearTimeout(timerId);
        }}
        // {...props}
        onClick={(e) => {
          props.onClick?.(e);
          setLongPress(false);
          clearTimeout(timerId);
          console.log('click');
        }}
      >
        {user?.my_channel === id ? '나의 일정' : name ?? channel.name}
        {showColorPicker ? (
          <Modal
            isActive={setLongPress}
            content={
              <ColorPicker
                setColor={setColor}
                left={leftClickPos}
                targetBoundingRect={boundingRect}
              />
            }
          ></Modal>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default Tag;

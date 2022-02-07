import ColorPicker from 'ColorPicker';
import { ModalBackground } from 'Modal';
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
  const { channelColors, setChannelColor } = useCalendarContext();
  const [channel, setChannel] = useState(null);
  const [isChangingColor, setIsChangingColor] = useState(false);
  const [timerId, setTimerId] = useState(undefined);
  const [leftClickPos, setLeftClickPos] = useState(undefined);
  const [color, setColor] = useState(
    defaultColor
      ? { value: defaultColor }
      : channelColors
      ? { value: COLORS[channelColors.get(id)] }
      : {
          value:
            COLORS[
              new Map(JSON.parse(localStorage.getItem('channelColors'))).get(id)
            ],
        }
  );
  const {
    value: { userInfo },
  } = useAuthContext();
  useEffect(() => {
    if (!name) getChannel(id).then(setChannel);
  }, [id, name]);
  useEffect(() => {
    if (!readonly && color.name) setChannelColor(id, color.name);
    // console.log(color);
  }, [color.value]);
  return channel || name ? (
    <div
      className={disabled ? 'tag disabled' : 'tag'}
      style={{
        backgroundColor: color.value,
        zIndex: isChangingColor ? '999' : '',
      }}
      onTouchStart={(e) => {
        if (
          e.target === e.currentTarget &&
          e.targetTouches.length === 1 &&
          e.targetTouches.length === e.touches.length
        ) {
          const boundingRect = e.target.getBoundingClientRect();
          console.log(boundingRect);
          setLeftClickPos(((boundingRect.left << 1) + boundingRect.width) >> 1);
          setTimerId(setTimeout(setIsChangingColor, 700, true));
        }
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          // console.log(e);
          setIsChangingColor(false);
          clearTimeout(timerId);
        }
      }}
      onTouchEnd={(e) => {
        clearTimeout(timerId);
      }}
      onClick={(e) => {
        setIsChangingColor(false);
        clearTimeout(timerId);
      }}
      {...props}
    >
      {userInfo?.my_channel === id ? '나의 일정' : name ?? channel?.name}
      {!readonly && isChangingColor ? (
        <>
          <ModalBackground isActive={setIsChangingColor}></ModalBackground>
          <ColorPicker setColor={setColor} left={leftClickPos} />
        </>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <div className="tag"></div>
  );
};
export default Tag;

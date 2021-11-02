import { useEffect, useState } from 'react';
import { getChannel } from './API';
import { COLORS } from './Constants';
import { useAuthContext } from './context/AuthContext';
import { useCalendarContext } from './context/CalendarContext';

const Tag = ({ id, name, color, disabled, ...props }) => {
  const { channelColors } = useCalendarContext();
  const [channel, setChannel] = useState(null);
  const {
    value: { userInfo },
  } = useAuthContext();
  useEffect(() => {
    if (!name) getChannel(id).then(setChannel);
  }, [id, name]);

  return channel || name ? (
    <div
      className={disabled ? 'tag disabled' : 'tag'}
      style={{
        backgroundColor:
          color ?? channelColors
            ? COLORS[channelColors.get(id)]
            : COLORS[
                new Map(JSON.parse(localStorage.getItem('channelColors'))).get(
                  id
                )
              ],
      }}
      {...props}
    >
      {userInfo?.my_channel === id ? '나의 일정' : name ?? channel?.name}
    </div>
  ) : (
    <></>
  );
};
export default Tag;

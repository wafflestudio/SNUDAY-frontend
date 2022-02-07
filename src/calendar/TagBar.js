import { useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { useCalendarContext } from 'context/CalendarContext';
import Tag from 'Tag';

const colors = {
  red: '#d4515d',
  orange: '#e8914f',
  yellow: '#f3c550',
  green: '#b2d652',
};
const TagBar = ({ category, onTagClick, isMain, ...props }) => {
  const { disabledChannels, setDisabledChannels } = useCalendarContext();
  const [channels, setChannels] = useState([]);
  const {
    value: { userInfo },
  } = useAuthContext();
  if (category === 'active')
    onTagClick = (channel) =>
      setDisabledChannels((channels) => {
        return channels.includes(channel)
          ? [...channels].filter((ch) => ch !== channel)
          : [...channels, channel];
      });
  useEffect(() => {
    if (category === 'active') {
      setChannels((channels) =>
        [...channels].sort(
          (a, b) => disabledChannels.includes(a) - disabledChannels.includes(b)
        )
      );
    }
  }, [disabledChannels]);
  useEffect(() => {
    switch (category) {
      case 'active':
        const subscribingChannels = Array.from(
          userInfo?.subscribing_channels ?? []
        );
        subscribingChannels.sort(
          (a, b) => disabledChannels.includes(a) - disabledChannels.includes(b)
        );
        setChannels(subscribingChannels);
        break;
      case 'managing':
        setChannels(Array.from(userInfo?.managing_channels ?? []));
        break;
      case 'subscribing':
        setChannels(Array.from(userInfo?.subscribing_channels ?? []));
        break;
      default:
        break;
    }
  }, [userInfo]);
  return (
    <ul className={`tagbar${isMain ? ' main' : ''}`} {...props}>
      {channels?.map((key) => (
        <Tag
          readonly={false}
          key={key}
          id={key}
          onClick={() => (onTagClick ? onTagClick(key) : undefined)}
          disabled={category === 'active' && disabledChannels.includes(key)}
        />
      ))}
      {/* <div
        className="plus"
        onClick={(e) => e.target.parentElement.classList.toggle('expand')}
      >
        +
      </div> */}
    </ul>
  );
};
export default TagBar;

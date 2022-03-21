import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { useCalendarContext } from 'context/CalendarContext';
import Tag from 'Tag';

const TagBar = ({ category, onTagClick, isMain, ...props }) => {
  const { disabledChannels, setDisabledChannels } = useCalendarContext();
  const [channels, setChannels] = useState([]);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const tagbarRef = useRef(null);
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
  useEffect(() => {
    const callback = (mutationList, observer) => {
      if (
        tagbarRef.current?.matches('.expand') ||
        tagbarRef.current?.offsetWidth < tagbarRef.current?.scrollWidth
      )
        setIsOverflowing(true);
      else setIsOverflowing(false);
    };
    const observer = new MutationObserver(callback);
    observer.observe(tagbarRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div
      ref={tagbarRef}
      className={`tagbar${isMain ? ' main' : ''}`}
      {...props}
    >
      {channels.map((channelId) => (
        <Tag
          readonly={!isMain}
          key={channelId}
          id={channelId}
          onClick={() => (onTagClick ? onTagClick(channelId) : undefined)}
          disabled={
            category === 'active' && disabledChannels.includes(channelId)
          }
        />
      ))}
      {isMain && isOverflowing ? (
        <img
          className="plus"
          src="/resources/plus.svg"
          onClick={(e) => {
            e.target.parentElement.classList.toggle('expand');
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
export default TagBar;

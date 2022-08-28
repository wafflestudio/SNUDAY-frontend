import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { useCalendarContext } from 'context/CalendarContext';
import Tag from 'Tag';

const TagBar = ({ category, onTagClick, isMain, ...props }) => {
  const [channels, setChannels] = useState([]);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const tagbarRef = useRef(null);
  const {
    action: { setValue },
    value: { user, default_channels, disabled_channels },
  } = useAuthContext();
  if (category === 'active')
    onTagClick = (channel) => {
      setValue({
        type: 'disabled_channels',
        value: disabled_channels.includes(channel)
          ? [...disabled_channels].filter((ch) => ch !== channel)
          : [...disabled_channels, channel],
      });
    };
  useEffect(() => {
    if (category === 'active') {
      setChannels((channels) =>
        [...channels].sort(
          (a, b) =>
            disabled_channels.includes(a) - disabled_channels.includes(b)
        )
      );
    }
  }, [disabled_channels]);
  useEffect(() => {
    switch (category) {
      case 'active':
        const subscribingChannels = Array.from(
          user
            ? user.subscribing_channels.add(user.my_channel)
            : [...default_channels]
        );
        subscribingChannels.sort(
          (a, b) =>
            disabled_channels.includes(a) - disabled_channels.includes(b)
        );
        setChannels(subscribingChannels);
        break;
      case 'managing':
        if (user?.managing_channels)
          setChannels(
            Array.from(user.managing_channels.add(user.my_channel) ?? [])
          );
        break;
      case 'subscribing':
        setChannels(
          Array.from(user.subscribing_channels.add(user.my_channel) ?? [])
        );
        break;
      default:
        break;
    }
  }, [user]);
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
            category === 'active' && disabled_channels.includes(channelId)
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

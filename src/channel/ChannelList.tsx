import React, { useEffect, useRef, useState } from 'react';
import {
  getChannels,
  getManagingChannels,
  getSubscribedChannels,
  searchChannels,
} from 'API';
import ChannelCard from 'channel/ChannelCard';
import { useAuthContext } from 'context/AuthContext';
import useInfiniteScroll from 'useInfiniteScroll';
import Spinner from 'Spinner';

const ChannelList = ({
  category,
  isLoggedIn,
  type,
  keyword,
  style,
}: {
  category: ChannelType;
  isLoggedIn: boolean;
  type: SearchChannelType;
  keyword: string;
  style: React.CSSProperties;
}) => {
  const listRef = useRef(null);
  const [channels, setChannels] = useState<ChannelsResponse>();
  const [isFetching, setIsFetching] = useInfiniteScroll(() => {
    if (channels?.next) fetchChannels({ cursor: channels.next });
  }, listRef.current);
  // console.log(listRef.current?.getBoundingClientRect().top);
  // console.log(listRef.current?.parentElement.getBoundingClientRect());
  const {
    action: { setUserInfo },
    value: { userInfo },
  } = useAuthContext();
  const fetchChannels = async ({
    cursor,
    signal,
  }: {
    cursor?: string;
    signal?: boolean;
  }) => {
    if (keyword) {
      if (type)
        searchChannels({ type, q: keyword, cursor }).then((response) => {
          if (!signal)
            setChannels((channels) =>
              cursor
                ? {
                    ...response,
                    results: [
                      ...(channels?.results ?? []),
                      ...response.results,
                    ],
                  }
                : response
            );
        });
    } else if (isLoggedIn)
      if (category === 'managed')
        getManagingChannels().then((channelsData) => {
          if (!signal) setChannels(() => ({ results: channelsData }));
          setUserInfo({
            ...userInfo,
            managing_channels: new Set(
              channelsData.map((channel) => channel.id)
            ),
          });
          console.log(channelsData);
        });
      else
        getSubscribedChannels().then((channelsData) => {
          if (!signal) setChannels(() => ({ results: channelsData }));
          setUserInfo({
            ...userInfo,
            subscribing_channels: new Set(
              channelsData.map((channel) => channel.id)
            ),
          });
        });
    else
      getChannels(cursor).then((response) => {
        if (!signal)
          setChannels((channels) =>
            cursor
              ? {
                  ...response,
                  results: [...(channels?.results ?? []), ...response.results],
                }
              : response
          );
      });
  };
  useEffect(() => {
    let isCancelled = false;
    fetchChannels({ signal: isCancelled });
    return () => {
      isCancelled = true;
    };
  }, [category, isLoggedIn, type, keyword]);

  if (channels && isLoggedIn && !keyword && !(channels?.results.length > 0)) {
    if (category === 'managed')
      return <div className="error">관리 중인 채널이 없습니다.</div>;
    if (category === 'subscribed')
      return <div className="error">구독 중인 채널이 없습니다.</div>;
  }

  return (
    <div ref={listRef} className="channel-list" style={style}>
      {channels ? (
        channels.results.map((channelData) => (
          <ChannelCard key={channelData.id} channelData={channelData} />
        ))
      ) : (
        <Spinner color="var(--grey)" size={40} delay="1s" />
      )}
    </div>
  );
};
export default ChannelList;

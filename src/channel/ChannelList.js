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

const ChannelList = ({ category, isLoggedIn, type, keyword, style }) => {
  const listRef = useRef(null);
  const [channels, setChannels] = useState(null);
  const [isFetching, setIsFetching] = useInfiniteScroll(() => {
    if (channels?.next) fetchChannels(channels.next);
  }, listRef.current);
  // console.log(listRef.current?.getBoundingClientRect().top);
  // console.log(listRef.current?.parentElement.getBoundingClientRect());
  const {
    action: { setUserInfo },
    value: { userInfo },
  } = useAuthContext();
  const fetchChannels = async (cursor) => {
    if (keyword) {
      if (type)
        searchChannels({ type, q: keyword, cursor }).then((response) =>
          setChannels((channels) =>
            cursor
              ? {
                  ...response,
                  results: [...channels.results, ...response.results],
                }
              : response
          )
        );
    } else if (isLoggedIn)
      if (category === 'managed')
        getManagingChannels().then((channelsData) => {
          setChannels(() => ({ results: channelsData }));
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
          setChannels(() => ({ results: channelsData }));
          setUserInfo({
            ...userInfo,
            subscribing_channels: new Set(
              channelsData.map((channel) => channel.id)
            ),
          });
        });
    else
      getChannels(cursor).then((response) => {
        setChannels((channels) =>
          cursor
            ? {
                ...response,
                results: [...channels.results, ...response.results],
              }
            : response
        );
      });
  };
  useEffect(() => {
    fetchChannels();
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

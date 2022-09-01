import React, { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from 'context/AuthContext';
import useInfiniteScroll from 'useInfiniteScroll';
import {
  getChannels,
  getManagingChannels,
  getSubscribedChannels,
  searchChannels,
} from 'API';
import ChannelCard from 'channel/ChannelCard';
import Spinner from 'Spinner';

const fetchMyChannels = async ({
  category,
  signal,
}: {
  category: string;
  signal?: boolean;
}) => {
  let get;
  if (category === 'managed') get = getManagingChannels;
  if (category === 'subscribed') get = getSubscribedChannels;
  return get?.().then((channels) => {
    if (!signal) return { results: channels } as ChannelsResponse;
  });
};

const fetchChannels = async ({
  body: { type, keyword, cursor },
  signal,
}: {
  body: { type?: SearchChannelType; keyword?: string; cursor?: string };
  signal?: boolean;
}) => {
  let response;
  if (keyword && type)
    response = await searchChannels({ type, q: keyword, cursor });
  else response = await getChannels(cursor);
  if (!signal) return response;
};

const ChannelList = ({
  category,
  isLoggedIn,
  type,
  keyword,
  style,
}: {
  category?: ChannelType;
  isLoggedIn: boolean;
  type?: SearchChannelType;
  keyword?: string;
  style?: React.CSSProperties;
}) => {
  const listRef = useRef(null);
  const [channels, setChannels] = useState<ChannelsResponse>();
  const cursor = channels?.next;
  const [isFetching, setIsFetching] = useInfiniteScroll(() => {
    if (channels?.next)
      fetchChannels({ body: { type, keyword, cursor } }).then((response) => {
        if (response) {
          setChannels((channels) => ({
            ...response,
            results: [...(channels?.results ?? []), ...response.results],
          }));
          response?.results?.forEach((channel) =>
            queryClient.setQueryData(['channel', channel.id], channel)
          );
        }
      });
  }, listRef.current);
  // console.log(listRef.current?.getBoundingClientRect().top);
  // console.log(listRef.current?.parentElement.getBoundingClientRect());
  const {
    action: { setUser },
    value: { user },
  } = useAuthContext();
  const queryClient = useQueryClient();
  useEffect(() => {
    let isCancelled = false;
    (() => {
      if (isLoggedIn && category && !type && !keyword) {
        return fetchMyChannels({ category, signal: isCancelled }).then(
          (response) => {
            if (response) {
              setChannels(response);
              if (category === 'managed')
                setUser({
                  ...user,
                  managing_channels: new Set(
                    response.results.map((channel) => channel.id)
                  ),
                });
              if (category === 'subscribed')
                setUser({
                  ...user,
                  subscribing_channels: new Set(
                    response.results.map((channel) => channel.id)
                  ),
                });
              return response;
            }
          }
        );
      } else {
        return fetchChannels({
          body: { type, keyword },
          signal: isCancelled,
        }).then((response) => {
          if (response) {
            setChannels(response);
            return response;
          }
        });
      }
    })().then((response) =>
      response?.results?.forEach((channel) =>
        queryClient.setQueryData(['channel', channel.id], channel)
      )
    );
    return () => {
      isCancelled = true;
      setChannels(undefined);
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
          <ChannelCard
            key={channelData.id}
            channelId={channelData.id}
            channelData={channelData}
          />
        ))
      ) : (
        <Spinner color="var(--grey)" size={40} delay="1s" />
      )}
    </div>
  );
};
export default ChannelList;

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

  return (
    <div ref={listRef} className="channel-list" style={style}>
      {channels?.results.map((channelData) => (
        <ChannelCard key={channelData.id} channelData={channelData} />
      ))}
    </div>
  );
};
export default ChannelList;

// useEffect(() => {
//   // console.log(channels);
//   let options = {
//     threshold: 0.5,
//   };
//   const io = new IntersectionObserver(
//     (entries, observer) =>
//       entries.forEach((entry) => {
//         // eslint-disable-next-line curly
//         if (entry.isIntersecting && channels?.next) {
//           // console.log(entry, channels.next);
//           fetchChannels(channels.next); //callback
//         }
//       }),
//     options
//   );
//   if (channels?.next) {
//     const lastChannel = listRef.current.lastElementChild;
//     if (lastChannel) io.observe(lastChannel);
//   }
//   return () => io.disconnect();
// }, [channels]);

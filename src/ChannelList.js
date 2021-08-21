import React, { useEffect, useState } from 'react';
import {
  getChannels,
  getManagingChannels,
  getSubscribedChannels,
  searchChannels,
} from './API';
import ChannelCard from './ChannelCard';
import { useAuthContext } from './context/AuthContext';

const ChannelList = ({ category, isLoggedIn, type, keyword }) => {
  const [channels, setChannels] = useState([]);
  const {
    value: { userInfo },
  } = useAuthContext();
  const fetchChannels = () => {
    if (keyword) {
      if (type)
        searchChannels({ type, q: keyword }).then((response) =>
          setChannels(response.results)
        );
    } else if (isLoggedIn)
      if (category === 'managed')
        getManagingChannels().then((response) => {
          setChannels(() => response);
        });
      else
        getSubscribedChannels().then((response) => {
          setChannels(() => response);
        });
    else
      getChannels().then((response) => {
        setChannels(() =>
          response.results.filter((channel) => !channel.is_personal)
        );
      });
  };
  useEffect(() => {
    fetchChannels();
  }, [category, isLoggedIn, type, keyword, userInfo]);

  return (
    <>
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} />
      ))}
    </>
  );
};
export default ChannelList;

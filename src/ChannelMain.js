import React, { useState } from 'react';
import AddButton from './AddButton';
import AddChannelModal from './AddChannelModal';
import './ChannelMain.css';
import { useAuthContext } from './context/AuthContext';
import ChannelList from './ChannelList';
const ChannelMain = () => {
  const [activeTab, setActiveTab] = useState('subscribed');
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  return (
    <>
      {isLoggedIn ? <AddButton component={AddChannelModal} /> : <></>}
      <ChannelMainTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      ></ChannelMainTab>
      <ChannelList category={activeTab} isLoggedIn={isLoggedIn} />
    </>
  );
};
const ChannelMainTab = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <ul className="channel-tabs">
        <li
          className={
            activeTab === 'subscribed' ? 'channel-tab active' : 'channel-tab'
          }
          onClick={() => setActiveTab(() => 'subscribed')}
        >
          구독 채널
        </li>
        <li
          className={
            activeTab === 'managed' ? 'channel-tab active' : 'channel-tab'
          }
          onClick={() => setActiveTab(() => 'managed')}
        >
          관리 채널
        </li>
      </ul>
    </>
  );
};

export default ChannelMain;

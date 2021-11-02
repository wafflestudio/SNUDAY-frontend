import React, { useState } from 'react';
import AddButton from 'AddButton';
import AddChannelModal from 'channel/AddChannelModal';
import 'channel/ChannelMain.css';
import { useAuthContext } from 'context/AuthContext';
import ChannelList from 'channel/ChannelList';
import { useHistory } from 'react-router-dom';
const ChannelMain = () => {
  const [activeTab, setActiveTab] = useState('subscribed');
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  const history = useHistory();
  if (!isLoggedIn) history.push('/search');
  return (
    <>
      {activeTab === 'managed' ? (
        <AddButton component={AddChannelModal} />
      ) : (
        <></>
      )}
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
    <div className="channel-tabs">
      <ul className="channel-tabs-list">
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
    </div>
  );
};

export default ChannelMain;

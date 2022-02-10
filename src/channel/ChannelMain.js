import React, { useEffect, useRef, useState } from 'react';
import ModalButton from 'AddButton';
import AddChannelModal from 'channel/AddChannelModal';
import 'channel/ChannelMain.css';
import { useAuthContext } from 'context/AuthContext';
import ChannelList from 'channel/ChannelList';
import { useHistory } from 'react-router-dom';
import Header from 'Header';
const ChannelMain = () => {
  const [activeTab, setActiveTab] = useState('subscribed');
  const listRef = useRef(null);
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  const history = useHistory();
  if (!isLoggedIn) history.push('/search');
  return (
    <>
      <Header left={<></>}>내 채널</Header>
      {activeTab === 'managed' ? (
        <ModalButton component={AddChannelModal} />
      ) : (
        <></>
      )}
      <div
        ref={listRef}
        style={{
          width: '100vw',
          height: 'calc(100% - 3rem)',
          overflow: 'auto',
          position: 'fixed',
          top: '3rem',
          backgroundColor: 'white',
        }}
      >
        <ChannelMainTab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        ></ChannelMainTab>
        <ChannelList category={activeTab} isLoggedIn={isLoggedIn} />
      </div>
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
          onScroll={(e) => e.stopPropagation()}
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

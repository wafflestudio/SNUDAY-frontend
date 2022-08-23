import React, { useEffect, useRef, useState } from 'react';
import ModalButton from 'AddButton';
import AddChannelModal from 'channel/AddChannelModal';
import 'channel/MyChannels.css';
import { useAuthContext } from 'context/AuthContext';
import ChannelList from 'channel/ChannelList';
import { useNavigate } from 'react-router-dom';
import Header from 'Header';
const TAB = { SUBSCRIBED: 'subscribed', MANAGED: 'managed' };
const MyChannels = () => {
  const [activeTab, setActiveTab] = useState<ChannelType>('subscribed');
  const listRef = useRef(null);
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  const navigate = useNavigate();
  if (!isLoggedIn) navigate('/search');
  return (
    <>
      <Header left={<></>}>내 채널</Header>
      {activeTab === TAB.MANAGED ? (
        <ModalButton component={AddChannelModal} />
      ) : (
        <></>
      )}
      <div
        className="main-container"
        ref={listRef}
        style={{
          width: '100%',
          // height: `calc(${
          //   listRef.current?.parentElement.getBoundingClientRect().height
          // }px - 3rem)`,
          // position: 'absolute',
          position: 'sticky',
          top: '3rem',
          backgroundColor: 'white',
        }}
        onScroll={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <MyChannelsTab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        ></MyChannelsTab>
        <section
          className="my-channels"
          // style={{ transform: 'translateX(100%)' }}
        >
          <ChannelList category={activeTab} isLoggedIn={isLoggedIn} />
        </section>
      </div>
    </>
  );
};
const MyChannelsTab = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: ChannelType;
  setActiveTab: React.Dispatch<React.SetStateAction<ChannelType>>;
}) => {
  return (
    <div className="channel-tabs">
      <ul className="channel-tabs-list">
        <li
          className={
            activeTab === TAB.SUBSCRIBED ? 'channel-tab active' : 'channel-tab'
          }
          onClick={() => setActiveTab(() => 'subscribed')}
          onScroll={(e) => e.stopPropagation()}
        >
          구독 채널
        </li>
        <li
          className={
            activeTab === TAB.MANAGED ? 'channel-tab active' : 'channel-tab'
          }
          onClick={() => setActiveTab(() => 'managed')}
        >
          관리 채널
        </li>
      </ul>
    </div>
  );
};

export default MyChannels;

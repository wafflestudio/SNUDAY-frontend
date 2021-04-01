import { useState } from 'react';
import ChannelCard from './ChannelCard';
import './ChannelMain.css';
const ChannelMain = () => {
  const [activeTab, setActiveTab] = useState('subscribed');
  return (
    <>
      <ChannelMainTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      ></ChannelMainTab>
      <ChannelList />
    </>
  );
};
const ChannelMainTab = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <ul className='channel-tabs'>
        <li
          className={
            activeTab === 'subscribed' ? 'channel-tab active' : 'channel-tab'
          }
          onClick={() => setActiveTab(() => 'subscribed')}
        >
          구독 채널
        </li>
        <li
          className={activeTab === 'my' ? 'channel-tab active' : 'channel-tab'}
          onClick={() => setActiveTab(() => 'my')}
        >
          내 채널
        </li>
      </ul>
    </>
  );
};
const ChannelList = () => {
  return (
    <>
      <ChannelCard />
    </>
  );
};
export default ChannelMain;

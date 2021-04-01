import './ChannelCard.css';
import { ReactComponent as Favorite } from './resources/star.svg';
import { ReactComponent as ClosedLock } from './resources/lock-closed.svg';
import { ReactComponent as OpenLock } from './resources/lock-open.svg';
import { ReactComponent as OfficialMark } from './resources/checkbox-checked.svg';
import { useState } from 'react';
const ChannelCard = () => {
  const [isClosed, setIsClosed] = useState(true);
  const [isOfficial, setIsOfficial] = useState(true);

  return (
    <div className='channel-card'>
      <img className='channel-card-image' src='./resources/logo.svg' />
      <div className='channel-card-info'>
        <div className='channel-card-info-row'>
          <span className='channel-card-name'># 채널 이름</span>
          {isOfficial ? <OfficialMark /> : <></>}
          {isClosed ? <ClosedLock /> : <OpenLock />}
        </div>
        <div className='channel-card-info-row'>
          <span className='channel-card-subscribers'>구독자 777명</span>
          <Favorite />
        </div>
      </div>
    </div>
  );
};
export default ChannelCard;

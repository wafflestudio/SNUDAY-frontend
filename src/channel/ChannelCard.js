import 'channel/ChannelCard.css';
import { ReactComponent as Favorite } from 'resources/star.svg';
import { ReactComponent as ClosedLock } from 'resources/lock-closed.svg';
import { ReactComponent as OpenLock } from 'resources/lock-open.svg';
import { ReactComponent as OfficialMark } from 'resources/checkbox-checked.svg';
import { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
import { subscribeChannel, unsubscribeChannel } from 'API';
import { ChannelButton, SubscribeButton } from 'channel/ChannelButton';
import { EditChannelModal } from 'channel/AddChannelModal';
const ChannelInfoHeader = ({ name, is_official, is_private }) => {
  return (
    <div className="channel-card-info-row">
      <span className="channel-card-name"># {name}</span>
      {is_official ? <OfficialMark /> : <></>}
      {is_private ? <ClosedLock /> : <OpenLock />}
    </div>
  );
};
const ChannelAvatar = ({ name, image }) => {
  return (
    <img
      className="channel-card-image"
      alt={name}
      src={image ?? '/resources/default-image.svg'}
    />
  );
};

const ChannelCard = ({ channel, verbose }) => {
  const {
    id,
    name,
    description,
    image,
    is_private,
    is_official,
    is_personal,
    subscribers_count,
  } = channel;
  const history = useHistory();
  return (
    <div
      className="channel-card"
      onClick={() => history.push(`/channel/${id}`)}
    >
      <div className="channel-image-with-button">
        <ChannelAvatar name={name} image={image} />
        {verbose ? <ChannelButton channel={channel} /> : <></>}
      </div>
      <div //
        className="channel-card-info"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <ChannelInfoHeader
          name={name}
          is_official={is_official}
          is_private={is_private}
        />
        <div className="channel-card-info-row" style={{ height: '2rem' }}>
          <div className="channel-card-subscribers">
            구독자 {subscribers_count}명
          </div>
          {verbose ? <></> : <ChannelButton channel={channel} />}
          {/* <Favorite onClick={() => {}} /> */}
        </div>
        {verbose ? (
          <div className="channel-card-subscribers">{description}</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default ChannelCard;

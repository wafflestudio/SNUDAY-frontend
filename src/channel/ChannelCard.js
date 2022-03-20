import 'channel/ChannelCard.css';
import { ReactComponent as Favorite } from 'resources/star.svg';
import { ReactComponent as ClosedLock } from 'resources/lock-closed.svg';
import { ReactComponent as OpenLock } from 'resources/lock-open.svg';
import { ReactComponent as OfficialMark } from 'resources/checkbox-checked.svg';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
import { ChannelStatusButton, WaitingListButton } from 'channel/ChannelButton';
const ChannelInfoHeader = ({
  channelData: { name, is_official, is_private },
}) => {
  return (
    <div className="channel-card-info-row">
      <span className="channel-card-name"># {name}</span>
      {is_official ? <OfficialMark /> : <></>}
      {is_private ? <ClosedLock /> : <OpenLock />}
    </div>
  );
};
const ChannelAvatar = ({ name, image }) => (
  <img
    className="avatar"
    alt={name}
    src={image ?? '/resources/default-image.svg'}
  />
);

const ChannelCard = ({ channelData, verbose }) => {
  const navigate = useNavigate();
  const {
    value: { userInfo },
  } = useAuthContext();
  const {
    id,
    name,
    image,
    description,
    subscribers_count,
    is_private,
    // is_official,
    //is_personal,
    //created_at,
    //updated_at,
  } = channelData;
  return (
    <div
      className="channel-card"
      onClick={() =>
        verbose || (is_private && !userInfo?.subscribing_channels?.has(id))
          ? undefined
          : navigate(`/channel/${id}`)
      }
    >
      <div className="channel-image-with-button">
        <ChannelAvatar name={name} image={image} />
        {verbose ? <ChannelStatusButton channelData={channelData} /> : <></>}
      </div>
      <div className="channel-card-info">
        <ChannelInfoHeader channelData={channelData} />
        <div className="channel-card-info-row">
          <div className="channel-card-subscribers">
            구독자 {subscribers_count}명
          </div>
          {verbose ? (
            <></>
          ) : (
            <>
              {userInfo?.managing_channels?.has(channelData.id) ? (
                <WaitingListButton channelData={channelData} />
              ) : (
                <></>
              )}
              <ChannelStatusButton channelData={channelData} />
            </>
          )}
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

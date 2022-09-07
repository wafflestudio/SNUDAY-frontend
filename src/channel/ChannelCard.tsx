import 'channel/ChannelCard.css';
import { ReactComponent as Favorite } from 'resources/star.svg';
import { ReactComponent as ClosedLock } from 'resources/lock-closed.svg';
import { ReactComponent as OpenLock } from 'resources/lock-open.svg';
import { ReactComponent as OfficialMark } from 'resources/checkbox-checked.svg';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getChannel } from 'API';
import { useAuthContext } from 'context/AuthContext';
import { ChannelStatusButton, WaitingListButton } from 'channel/ChannelButton';

const ChannelAvatar = ({ name, image }: Pick<Channel, 'name' | 'image'>) => (
  <img
    className="avatar"
    alt={name ?? 'Channel image'}
    src={image ?? '/resources/default-image.svg'}
  />
);
const ChannelCard = ({
  channelId,
  channelData,
  verbose = false,
}: {
  channelId: number;
  channelData: Channel;
  verbose?: boolean;
}) => {
  const channel = useQuery(
    ['channel', channelId],
    () => getChannel(channelId),
    {
      onSuccess: (channel) => {
        document.title = channel.name + ' | SNUDAY';
      },
      enabled: !channelData && channelId !== undefined,
    }
  );
  const navigate = useNavigate();
  const {
    value: { user },
  } = useAuthContext();
  channelData = channelData || channel.data;
  const {
    id,
    name,
    image,
    description,
    subscribers_count,
    is_private,
    is_official,
    //is_personal,
    //created_at,
    //updated_at,
  } = channelData ?? {};
  return (
    <div
      className="grid-channel-card"
      onClick={() =>
        !id || verbose || (is_private && !user?.subscribing_channels?.has(id))
          ? undefined
          : navigate(`/channel/${id}`)
      }
    >
      {/* <div className="channel-image-with-button"> */}
      <ChannelAvatar name={name} image={image} />
      {verbose ? <ChannelStatusButton channelData={channelData} /> : <></>}
      {/* </div> */}
      <div className="channel-card-info-row first">
        <span className="channel-card-name"># {name}</span>
        {is_official ? <OfficialMark /> : <></>}
        {is_private ? <ClosedLock /> : <OpenLock />}
      </div>
      <div className="channel-card-info-row second">
        <div className="channel-card-main-text">
          구독자 {subscribers_count ?? ''}명
        </div>
        {verbose ? (
          <></>
        ) : (
          <>
            {channelData?.id && user?.managing_channels?.has(channelData.id) ? (
              <WaitingListButton channelData={channelData} />
            ) : (
              <></>
            )}
            <ChannelStatusButton channelData={channelData} />
          </>
        )}
      </div>
      {verbose ? (
        <div className="channel-card-main-text">{description}</div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default ChannelCard;

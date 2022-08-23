import { deleteRejectAwaiters, postAllowAwaiters } from 'API';
const ChannelInfoHeader = ({
  channelData: { name, is_official, is_private },
}) => {
  return (
    <div className="channel-card-info-row">
      <span className="channel-card-name">{name}</span>
    </div>
  );
};
const UserAvatar = ({ name, image }) => (
  <img
    className="avatar"
    style={{ height: '48px', width: '48px' }}
    alt={name}
    src={image ?? '/resources/default-image.svg'}
  />
);

const UserCard = ({ userInfo, channelId, sendResult }) => {
  const { id, email, username, last_name, first_name } = userInfo;
  return (
    <div
      className="channel-card"
      style={{ justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div style={{ display: 'flex' }}>
        <UserAvatar name={username} image={null} />
        <div style={{ lineHeight: '48px', paddingLeft: '10px' }}>
          {username}
        </div>
      </div>
      <div className="channel-card-info-row">
        <AcceptButton
          channelId={channelId}
          userId={id}
          sendResult={sendResult}
        />
        <DeclineButton
          channelId={channelId}
          userId={id}
          sendResult={sendResult}
        />{' '}
      </div>
    </div>
  );
};

const AcceptButton = ({ channelId, userId, sendResult }) => {
  const sendRequest = () => {
    postAllowAwaiters({ channelId, userId })
      .then(() => sendResult(userId))
      .catch((e) => {
        console.log(e);
      });
  };
  return <button onClick={sendRequest}>수락</button>;
};
const DeclineButton = ({ channelId, userId, sendResult }) => {
  const sendRequest = () => {
    deleteRejectAwaiters({ channelId, userId })
      .then(() => sendResult(-userId))
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <button onClick={sendRequest} className="button-delete">
      거절
    </button>
  );
};
export default UserCard;

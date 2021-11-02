import { useState } from 'react';
import { EditChannelModal } from 'channel/AddChannelModal';
import { subscribeChannel, unsubscribeChannel } from 'API';
import { useAuthContext } from 'context/AuthContext';

export const SubscribeButton = ({ channel: { id, name, is_private } }) => {
  const {
    value: { userInfo },
    action: { setUserInfo },
  } = useAuthContext();
  if (!userInfo) return <></>;
  if (userInfo.subscribing_channels.has(id))
    return (
      <button
        className="button-blue"
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm(`'${name}'의 구독을 정말 그만둘까요?`))
            unsubscribeChannel(id).then(() => {
              const subscribing_channels = userInfo.subscribing_channels;
              if (subscribing_channels.delete(id))
                setUserInfo({
                  ...userInfo,
                  subscribing_channels,
                });
            });
        }}
        style={{ fontSize: '0.9rem' }}
      >
        구독중
      </button>
    );
  if (userInfo.awaiting_channels.has(id))
    return (
      <button
        className="button-blue"
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm(`'${name}'의 구독 신청을 취소할까요?`))
            unsubscribeChannel(id).then(() => {
              const awaiting_channels = userInfo.awaiting_channels;
              if (awaiting_channels.delete(id))
                setUserInfo({
                  ...userInfo,
                  awaiting_channels: awaiting_channels,
                });
            });
        }}
        style={{ fontSize: '0.9rem' }}
      >
        대기
      </button>
    );
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        subscribeChannel(id).then((response) => {
          console.log(response);
          is_private
            ? setUserInfo({
                ...userInfo,
                awaiting_channels: userInfo.awaiting_channels.add(id),
              })
            : setUserInfo({
                ...userInfo,
                subscribing_channels: userInfo.subscribing_channels.add(id),
              });
        });
      }}
      style={{ fontSize: '0.9rem' }}
    >
      구독
    </button>
  );
};
export const ChannelButton = ({ channel }) => {
  const [onEdit, setOnEdit] = useState(false);
  const {
    value: { userInfo },
  } = useAuthContext();
  return userInfo?.managing_channels?.has(channel.id) ? (
    <>
      <img
        style={{
          height: '28px',
          border: '1px solid #3b77ff',
          borderRadius: '14px',
        }}
        src="/resources/edit-no-border.svg"
        onClick={(e) => {
          e.stopPropagation();
          setOnEdit(true);
        }}
      />
      {onEdit ? (
        <EditChannelModal isActive={setOnEdit} channelId={channel.id} />
      ) : (
        <></>
      )}
    </>
  ) : (
    <SubscribeButton channel={channel} />
  );
};

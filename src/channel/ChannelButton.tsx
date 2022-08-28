import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getChannel, subscribeChannel, unsubscribeChannel } from 'API';
import { useAuthContext } from 'context/AuthContext';
import { EditChannelModal } from 'channel/AddChannelModal';
import ChannelAwaitersModal from 'channel/ChannelAwaitersModal';
export const ChannelStatusButton = ({
  channelData,
  setChannelData,
}: {
  channelData: Channel;
  setChannelData: React.Dispatch<React.SetStateAction<Channel>>;
}) => {
  //채널 구독 상태에 따라 [구독 버튼], [구독 대기 버튼] [구독 취소 버튼]
  const {
    value: { user },
  } = useAuthContext();
  if (user?.managing_channels?.has(channelData.id))
    return (
      <EditChannelButton
        channelData={channelData}
        setChannelData={setChannelData}
      />
    );
  if (user?.subscribing_channels?.has(channelData.id))
    return (
      <CancelSubscriptionButton
        channelData={channelData}
        setChannelData={setChannelData}
      />
    );
  if (user?.awaiting_channels?.has(channelData.id))
    return <AwaitSubscriptionButton channelData={channelData} />;
  return (
    <SubscribeButton
      channelData={channelData}
      setChannelData={setChannelData}
    />
  );
};
export const SubscribeButton = ({
  channelData: { id, is_private },
  setChannelData,
}: {
  channelData: Channel;
  setChannelData: React.Dispatch<React.SetStateAction<Channel>>;
}) => {
  const {
    value: { user },
    action: { setUser },
  } = useAuthContext();
  let navigate = useNavigate();
  let location = useLocation();
  return (
    <button
      className="subscribe-button"
      onClick={(e) => {
        e.stopPropagation();
        if (!user) {
          navigate('/signin', { state: { prev: location.pathname } });
          return;
        }
        subscribeChannel(id).then((response) => {
          console.log(response);
          getChannel(id).then((response) => {
            setChannelData(response);
          });
          is_private
            ? setUser({
                ...user,
                awaiting_channels: user.awaiting_channels.add(id),
              })
            : setUser({
                ...user,
                subscribing_channels: user.subscribing_channels.add(id),
              });
        });
      }}
      style={{ fontSize: '0.8rem' }}
    >
      구독
    </button>
  );
};
export const CancelSubscriptionButton = ({
  channelData,
  setChannelData,
}: {
  channelData: Channel;
  setChannelData: React.Dispatch<React.SetStateAction<Channel>>;
}) => {
  const { id, name, is_private, subscribers_count } = channelData;
  const {
    action: { updateUser },
  } = useAuthContext();
  return (
    <button
      className="button-blue cancel-subscription-button"
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm(`'${name}'의 구독을 그만둘까요?`))
          unsubscribeChannel(id).then(() => {
            if (is_private) {
              setChannelData({
                ...channelData,
                subscribers_count: subscribers_count - 1,
              });
            } else {
              getChannel(id).then((response) => {
                console.log(response);
                setChannelData(response);
              });
            }
            updateUser();
            // const subscribing_channels = user.subscribing_channels;
            // if (subscribing_channels.delete(id))
            //   setUser({
            //     //setter 설정해보기
            //     ...user,
            //     subscribing_channels,
            //   });
          });
      }}
      style={{ fontSize: '0.8rem' }}
    >
      구독중
    </button>
  );
};
export const AwaitSubscriptionButton = ({
  channelData: { name, id },
}: {
  channelData: Channel;
}) => {
  const {
    value: { user },
    action: { setUser },
  } = useAuthContext();
  return (
    <button
      className="button-blue await-subscription-button"
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm(`'${name}'의 구독 신청을 취소할까요?`))
          unsubscribeChannel(id).then(() => {
            const awaiting_channels = user.awaiting_channels;
            if (awaiting_channels.delete(id))
              setUser({
                ...user,
                awaiting_channels: awaiting_channels,
              });
          });
      }}
      style={{ fontSize: '0.8rem' }}
    >
      대기
    </button>
  );
};
export const WaitingListButton = ({
  channelData,
}: {
  channelData: Channel;
}) => {
  const [onEdit, setOnEdit] = useState(false);
  return (
    <>
      <img
        className="waiting-list-button"
        alt="waiters"
        // style={{
        //   height: '28px',
        //   border: '1px solid var(--blue)',
        //   borderRadius: '14px',
        // }}
        src="/resources/person.svg"
        onClick={(e) => {
          e.stopPropagation();
          setOnEdit(true);
        }}
      />
      {onEdit ? (
        <ChannelAwaitersModal isActive={setOnEdit} channelId={channelData.id} />
      ) : (
        <></>
      )}
    </>
  );
};
export const EditChannelButton = ({
  channelData,
  setChannelData,
}: {
  channelData: Channel;
  setChannelData: React.Dispatch<React.SetStateAction<Channel>>;
}) => {
  const [onEdit, setOnEdit] = useState(false);
  useEffect(() => {
    if (!onEdit) {
      getChannel(channelData.id).then((newData) => setChannelData(newData));
    }
  }, [onEdit]);
  return (
    <>
      <img
        alt="edit"
        className="edit-channel-button"
        style={{
          height: '28px',
          border: '1px solid var(--blue)',
          borderRadius: '14px',
        }}
        src="/resources/edit-no-border.svg"
        onClick={(e) => {
          e.stopPropagation();
          setOnEdit(true);
        }}
      />
      {onEdit ? (
        <EditChannelModal isActive={setOnEdit} channelId={channelData.id} />
      ) : (
        <></>
      )}
    </>
  );
};

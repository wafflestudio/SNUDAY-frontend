import { useState, useEffect } from 'react';
import { EditChannelModal } from 'channel/AddChannelModal';
import { getChannel, subscribeChannel, unsubscribeChannel } from 'API';
import { useAuthContext } from 'context/AuthContext';
import ChannelAwaitersModal from './ChannelAwaitersModal';
export const ChannelStatusButton = ({ channelData, setChannelData }) => {
  //채널 구독 상태에 따라 [구독 버튼], [구독 대기 버튼] [구독 취소 버튼]
  const {
    value: { userInfo },
  } = useAuthContext();
  if (!userInfo) return <></>;
  if (userInfo.managing_channels?.has(channelData.id))
    return (
      <EditChannelButton
        channelData={channelData}
        setChannelData={setChannelData}
      />
    );
  if (userInfo.subscribing_channels?.has(channelData.id))
    return <CancelSubscriptionButton channelData={channelData} />;
  if (userInfo.awaiting_channels?.has(channelData.id))
    return <AwaitSubscriptionButton channelData={channelData} />;
  return <SubscribeButton channelData={channelData} />;
};
export const SubscribeButton = ({ channelData: { id, is_private } }) => {
  const {
    value: { userInfo },
    action: { setUserInfo },
  } = useAuthContext();
  return (
    <button
      class="subscribe-button"
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
      style={{ fontSize: '0.8rem' }}
    >
      구독
    </button>
  );
};
export const CancelSubscriptionButton = ({ channelData: { id, name } }) => {
  const {
    value: { userInfo },
    action: { setUserInfo },
  } = useAuthContext();
  return (
    <button
      className="button-blue cancel-subscription-button"
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm(`'${name}'의 구독을 그만둘까요?`))
          unsubscribeChannel(id).then(() => {
            const subscribing_channels = userInfo.subscribing_channels;
            if (subscribing_channels.delete(id))
              setUserInfo({
                //setter 설정해보기
                ...userInfo,
                subscribing_channels,
              });
          });
      }}
      style={{ fontSize: '0.8rem' }}
    >
      구독중
    </button>
  );
};
export const AwaitSubscriptionButton = ({ channelData: { name, id } }) => {
  const {
    value: { userInfo },
    action: { setUserInfo },
  } = useAuthContext();
  return (
    <button
      className="button-blue await-subscription-button"
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
      style={{ fontSize: '0.8rem' }}
    >
      대기
    </button>
  );
};
export const WaitingListButton = ({ channelData }) => {
  const [onEdit, setOnEdit] = useState(false);
  return (
    <>
      <img
        class="waiting-list-button"
        alt="waiters"
        // style={{
        //   height: '28px',
        //   border: '1px solid #3b77ff',
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
export const EditChannelButton = ({ channelData, setChannelData }) => {
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
        class="edit-channel-button"
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
        <EditChannelModal isActive={setOnEdit} channelId={channelData.id} />
      ) : (
        <></>
      )}
    </>
  );
};

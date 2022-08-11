import { useState, useEffect } from 'react';
import { EditChannelModal } from 'channel/AddChannelModal';
import { getChannel, subscribeChannel, unsubscribeChannel } from 'API';
import { useAuthContext } from 'context/AuthContext';
import ChannelAwaitersModal from './ChannelAwaitersModal';
import { useLocation, useNavigate } from 'react-router-dom';
export const ChannelStatusButton = ({ channelData, setChannelData }) => {
  //채널 구독 상태에 따라 [구독 버튼], [구독 대기 버튼] [구독 취소 버튼]
  const {
    value: { userInfo },
  } = useAuthContext();
  if (userInfo?.managing_channels?.has(channelData.id))
    return (
      <EditChannelButton
        channelData={channelData}
        setChannelData={setChannelData}
      />
    );
  if (userInfo?.subscribing_channels?.has(channelData.id))
    return (
      <CancelSubscriptionButton
        channelData={channelData}
        setChannelData={setChannelData}
      />
    );
  if (userInfo?.awaiting_channels?.has(channelData.id))
    return (
      <AwaitSubscriptionButton
        channelData={channelData}
        setChannelData={setChannelData}
      />
    );
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
}) => {
  const {
    value: { userInfo },
    action: { setUserInfo },
  } = useAuthContext();
  let navigate = useNavigate();
  let location = useLocation();
  return (
    <button
      className="subscribe-button"
      onClick={(e) => {
        e.stopPropagation();
        if (!userInfo) {
          navigate('/signin', { state: { prev: location.pathname } });
          return;
        }
        subscribeChannel(id).then((response) => {
          console.log(response);
          getChannel(id).then((response) => {
            setChannelData(response);
          });
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
export const CancelSubscriptionButton = ({ channelData, setChannelData }) => {
  const { id, name, is_private, subscribers_count } = channelData;
  const {
    value: { userInfo },
    action: { setUserInfo, initUserInfo },
  } = useAuthContext();
  return (
    <button
      className="button-blue cancel-subscription-button"
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm(`'${name}'의 구독을 그만둘까요?`))
          unsubscribeChannel(id).then((response) => {
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
            initUserInfo();
            // const subscribing_channels = userInfo.subscribing_channels;
            // if (subscribing_channels.delete(id))
            //   setUserInfo({
            //     //setter 설정해보기
            //     ...userInfo,
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

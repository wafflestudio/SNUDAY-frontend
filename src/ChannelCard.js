import './ChannelCard.css';
import { ReactComponent as Favorite } from './resources/star.svg';
import { ReactComponent as ClosedLock } from './resources/lock-closed.svg';
import { ReactComponent as OpenLock } from './resources/lock-open.svg';
import { ReactComponent as OfficialMark } from './resources/checkbox-checked.svg';
import { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { subscribeChannel, unsubscribeChannel } from './API';
const ChannelCard = ({ channel }) => {
  console.log(channel);
  const {
    id,
    name,
    description,
    is_private,
    is_official,
    is_personal,
    subscribers_count,
  } = channel;
  const history = useHistory();
  const {
    value: { userInfo },
    action: { setUserInfo },
  } = useAuthContext();
  console.log(userInfo);
  return (
    <div
      className="channel-card"
      onClick={() => history.push(`/channel/${id}`)}
    >
      <img className="channel-card-image" src="/resources/logo.svg" />
      <div className="channel-card-info">
        <div className="channel-card-info-row">
          <span className="channel-card-name"># {name}</span>
          {is_official ? <OfficialMark /> : <></>}
          {is_private ? <ClosedLock /> : <OpenLock />}
        </div>
        <div className="channel-card-info-row">
          <span className="channel-card-subscribers">
            구독자 {subscribers_count}명
          </span>
          {userInfo ? (
            userInfo.subscribing_channels.has(id) ? (
              <button
                className="button-blue"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`'${name}'의 구독을 정말 그만둘까요?`))
                    unsubscribeChannel(id).then(() => {
                      const subscribing_channels =
                        userInfo.subscribing_channels;
                      if (subscribing_channels.delete(id))
                        setUserInfo({
                          ...userInfo,
                          subscribing_channels,
                        });
                    });
                }}
                style={{ fontSize: '0.8rem' }}
              >
                구독중
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  subscribeChannel(id).then(() => {
                    setUserInfo({
                      ...userInfo,
                      subscribing_channels: userInfo.subscribing_channels.add(
                        id
                      ),
                    });
                  });
                }}
                style={{ fontSize: '0.8rem' }}
              >
                구독
              </button>
            )
          ) : (
            <></>
          )}
          {/* <Favorite onClick={() => {}} /> */}
        </div>
      </div>
    </div>
  );
};
export default ChannelCard;

import { getAwaiters } from 'API';
import { useEffect, useState } from 'react';
import Modal from 'Modal';
import UserCard from 'UserCard';
const ChannelAwaitersModal = ({ channelId, content, isActive, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Modal
      isActive={isActive}
      header={isLoading ? undefined : <h3 className="title">구독 신청자</h3>}
      content={
        <ChannelAwaitersList channelId={channelId} isLoading={setIsLoading} />
      }
    ></Modal>
  );
};
const ChannelAwaitersList = ({ channelId, isLoading }) => {
  const [awaitersList, setAwaitersList] = useState(null);
  const sendResult = (result) => {
    //see UserCard > AcceptButton/DeclineButton
    //if result > 0: request accepted
    //if result < 0: request declined
    //userId === Math.abs(result)
    awaitersList.splice(awaitersList.indexOf(Math.abs(result)), 1);
    setAwaitersList([...awaitersList]);
  };
  useEffect(() => {
    getAwaiters(channelId).then(setAwaitersList).catch(console.log);
  }, []);
  useEffect(() => {
    if (isLoading && awaitersList !== null) isLoading(false);
  });
  if (awaitersList === null) return <></>;
  if (awaitersList.length === 0)
    return <div className="error">현재 구독 신청자가 없습니다.</div>;
  return (
    <div>
      {awaitersList.map((awaiter) => (
        <UserCard
          key={awaiter.id}
          user={awaiter}
          channelId={channelId}
          sendResult={sendResult}
        />
      ))}
    </div>
  );
};
export default ChannelAwaitersModal;

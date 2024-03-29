import Header from 'Header';
import { useEffect, useState } from 'react';
import NoticeList from 'channel/NoticeList';
import AddNotice from 'channel/AddNotice';
import { useAuthContext } from 'context/AuthContext';
import { useParams } from 'react-router-dom';

const ChannelNotice = () => {
  let { channelId } = useParams();
  channelId = +channelId;
  const [addNotice, setAddNotice] = useState(false);
  const {
    value: { user },
  } = useAuthContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [addNotice]);
  return addNotice ? (
    <AddNotice
      channelId={channelId}
      setIsDone={(done) => setAddNotice(!done)}
    />
  ) : (
    <>
      <Header
        right={
          user?.managing_channels.has(channelId) ? (
            <img
              alt="add notice"
              width="58"
              height="42"
              src="/resources/plus.svg"
              onClick={() => setAddNotice(true)}
            />
          ) : undefined
        }
      >
        공지사항
      </Header>
      <div className="card main-container">
        <NoticeList channelId={channelId} />
      </div>
    </>
  );
};
export default ChannelNotice;

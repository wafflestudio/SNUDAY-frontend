import Header from 'Header';
import { useEffect, useState } from 'react';
import NoticeList from 'channel/NoticeList';
import AddNotice from 'channel/AddNotice';
import { useAuthContext } from 'context/AuthContext';

const ChannelNotice = ({
  match: {
    params: { id },
  },
}) => {
  const [addNotice, setAddNotice] = useState(false);
  const {
    value: { userInfo },
  } = useAuthContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [addNotice]);
  return addNotice ? (
    <AddNotice channelId={id} setIsDone={(done) => setAddNotice(!done)} />
  ) : (
    <>
      <Header
        right={
          userInfo?.managing_channels.has(parseInt(id)) ? (
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
      <div className="card">
        <NoticeList channelId={id} />
      </div>
    </>
  );
};
export default ChannelNotice;

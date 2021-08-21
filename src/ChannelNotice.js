import Header from './Header';
import { useEffect, useState } from 'react';
import NoticeList from './NoticeList';
import AddNotice from './AddNotice';

const ChannelNotice = ({
  match: {
    params: { id },
  },
}) => {
  const [addNotice, setAddNotice] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [addNotice]);
  return addNotice ? (
    <AddNotice channelId={id} setIsDone={(done) => setAddNotice(!done)} />
  ) : (
    <>
      <Header
        right={
          <img
            alt="add notice"
            width="58"
            height="42"
            src="/resources/plus.svg"
            onClick={() => setAddNotice(true)}
          />
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

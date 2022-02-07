import './Channel.css';
import { getChannel, getChannelEvents } from 'API';
import ChannelCard from 'channel/ChannelCard';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoticeList from 'channel/NoticeList';
const ChannelHome = ({ match }) => {
  const history = useHistory();
  const id = match.params.id;
  const [channelData, setChannelData] = useState(null);
  useEffect(() => {
    getChannel(id).then((channel) => setChannelData(() => channel));
  }, []);
  return channelData ? (
    <div className="main-container">
      <ChannelCard channelData={channelData} verbose={true} />
      <section className="card">
        <header
          className="card-header"
          onClick={() => history.push(`/channel/${id}/notice/`)}
        >
          공지사항
          <img className="arrow" src="/resources/right-arrow.svg" alt="more" />
        </header>
        <NoticeList channelId={id} limit={3} />
      </section>
      <section className="card">
        <header
          className="card-header"
          onClick={() => history.push(`/channel/${id}/events/`)}
        >
          채널 일정
          <img
            className="arrow"
            src="/resources/right-arrow.svg"
            alt="see more events"
          />
        </header>
        <div className="error"> 캘린더 넣기</div>
      </section>
    </div>
  ) : (
    <></>
  );
};
export default ChannelHome;

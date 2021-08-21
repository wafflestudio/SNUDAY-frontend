import './Channel.css';
import { getChannel, getChannelEvents } from './API';
import ChannelCard from './ChannelCard';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoticeList from './NoticeList';
const ChannelHome = ({ match }) => {
  const history = useHistory();
  const id = match.params.id;
  const [channel, setChannel] = useState({});
  const [events, setEvents] = useState([]);
  useEffect(() => {
    getChannel(id).then((channel) => setChannel(() => channel));
    getChannelEvents({ channelId: id }).then((response) => {
      setEvents(() => response);
    });
  }, []);
  return (
    <div className="main-container">
      <ChannelCard channel={channel} />
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
  );
};
export default ChannelHome;

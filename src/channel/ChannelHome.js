import './Channel.css';
import { getChannel } from 'API';
import ChannelCard from 'channel/ChannelCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoticeList from 'channel/NoticeList';
import Calendar from 'calendar/Calendar';
const ChannelHome = () => {
  const navigate = useNavigate();
  let { channelId } = useParams();
  channelId = +channelId;
  console.log(channelId);
  const [channelData, setChannelData] = useState(null);
  useEffect(() => {
    getChannel(channelId).then((channel) => setChannelData(() => channel));
  }, []);
  useEffect(() => {
    const today = document.getElementsByClassName('day today')[0];
    const calendar = document.getElementsByClassName('Calendar-content')[0];
    if (today) {
      calendar.scrollTo({ top: today.offsetTop, behavior: 'smooth' });
    }
  });
  return channelData ? (
    <div className="main-container">
      <ChannelCard channelData={channelData} verbose={true} />
      <section className="card">
        <header
          className="card-header"
          onClick={() => navigate(`/channel/${channelId}/notice/`)}
        >
          공지사항
          <img className="arrow" src="/resources/right-arrow.svg" alt="more" />
        </header>
        <NoticeList channelId={channelId} limit={3} />
      </section>
      <section className="card">
        <header
          className="card-header"
          onClick={() => navigate(`/channel/${channelId}/events/`)}
        >
          채널 일정
          <img
            className="arrow"
            src="/resources/right-arrow.svg"
            alt="see more events"
          />
        </header>
        <div style={{ height: 'calc(14rem + 2px)', overflow: 'hidden' }}>
          <Calendar channelId={channelId} type="mini" />
        </div>
      </section>
    </div>
  ) : (
    <></>
  );
};
export default ChannelHome;

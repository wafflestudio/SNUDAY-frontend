import './Channel.css';
import { getChannel, getChannelEvents } from 'API';
import ChannelCard from 'channel/ChannelCard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoticeList from 'channel/NoticeList';
import ChannelCalendar from './ChannelCalendar';
import Calendar from 'calendar/Calendar';
const ChannelHome = ({ match }) => {
  const navigate = useNavigate();
  const id = +match.params.id;
  const [channelData, setChannelData] = useState(null);
  useEffect(() => {
    getChannel(id).then((channel) => setChannelData(() => channel));
  }, []);
  useEffect(() => {
    const today = document.getElementsByClassName('day today')[0];
    const calendar = document.getElementsByClassName('Calendar-content')[0];
    if (today) {
      console.log(today);
      console.log(today.getBoundingClientRect().top);
      console.log(today.offsetTop);
      console.log(today.scrollTop);
      console.log(
        calendar.scrollTo({ top: today.offsetTop, behavior: 'smooth' })
      );
    }
  });
  return channelData ? (
    <div className="main-container">
      <ChannelCard channelData={channelData} verbose={true} />
      <section className="card">
        <header
          className="card-header"
          onClick={() => navigate(`/channel/${id}/notice/`)}
        >
          공지사항
          <img className="arrow" src="/resources/right-arrow.svg" alt="more" />
        </header>
        <NoticeList channelId={id} limit={3} />
      </section>
      <section className="card">
        <header
          className="card-header"
          onClick={() => navigate(`/channel/${id}/events/`)}
        >
          채널 일정
          <img
            className="arrow"
            src="/resources/right-arrow.svg"
            alt="see more events"
          />
        </header>
        {/* <div className="error"> 캘린더 넣기</div> */}
        <div style={{ height: 'calc(14rem + 2px)', overflow: 'hidden' }}>
          <Calendar channelId={id} type={'mini'} />
        </div>
      </section>
    </div>
  ) : (
    <></>
  );
};
export default ChannelHome;

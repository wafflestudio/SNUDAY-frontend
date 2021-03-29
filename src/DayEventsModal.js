import { EventList } from './Event';
import Modal from './Modal';

const DayEventsModalHeader = ({ date }) => {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return (
    <div className='day-events-modal-header'>
      <h2 className='date-title'>{`${
        date.getMonth() + 1
      }월 ${date.getDate()}일`}</h2>
      <div className='date-small'>
        {date.toLocaleDateString('ko-KR', options)}
      </div>
      <hr></hr>
    </div>
  );
};
const DayEventsModalContent = ({ events }) => {
  return (
    <div className='date-events-modal-content'>
      {events.map((event) => (
        <EventList key={event.id} event={event} />
      ))}
    </div>
  );
};
const DayEventsModal = ({ isActive, date }) => {
  let events = [
    {
      id: 0,
      user_id: 0,
      channel_id: 0,
      title: '개강',
      start_date: new Date('2020-01-01T00:00:00'),
      due_date: new Date('2020-01-01T00:00:00'),
      created_at: '2020-01-01T00:00:00',
      updated_at: '2020-01-01T00:00:00',
    },
    {
      id: 1,
      user_id: 0,
      channel_id: 0,
      title: '개강',
      start_date: new Date('2020-01-01T00:00:00'),
      due_date: new Date('2020-01-01T00:00:00'),
      created_at: '2020-01-01T00:00:00',
      updated_at: '2020-01-01T00:00:00',
    },
    {
      id: 2,
      user_id: 0,
      channel_id: 0,
      title: '개강',
      start_date: new Date('2020-01-01T00:00:00'),
      due_date: new Date('2020-01-01T00:00:00'),
      created_at: '2020-01-01T00:00:00',
      updated_at: '2020-01-01T00:00:00',
    },
  ];
  return (
    <Modal
      isActive={isActive}
      header={<DayEventsModalHeader date={date} content={<></>} />}
      content={<DayEventsModalContent events={events} />}
    />
  );
};
export default DayEventsModal;

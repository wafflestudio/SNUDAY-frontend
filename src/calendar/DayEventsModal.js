import { useState } from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { EventListItem, EventModal } from './Event';
import Modal from 'Modal';

const DayEventsModalHeader = ({ date }) => {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return (
    <div className="day-events-modal-header">
      <h2 className="date-title">{`${
        date.getMonth() + 1
      }월 ${date.getDate()}일`}</h2>
      <div className="date-small">
        {date.toLocaleDateString('ko-KR', options)}
      </div>
      <hr></hr>
    </div>
  );
};
const DayEventsModalContent = ({ events, showEvent }) => {
  if (events.length === 0 || !events) {
    return <div className="error">일정이 없습니다.</div>;
  }
  return (
    <div className="date-events-modal-content">
      {events.map((event) => (
        <EventListItem key={event.id} event={event} showEvent={showEvent} />
      ))}
    </div>
  );
};
const DayEventsModal = ({ isActive, date }) => {
  const { getDayEvents, getEvent } = useCalendarContext();
  const [selectedEvent, setSelectedEvent] = useState(null);
  console.log(selectedEvent);
  return selectedEvent ? (
    <EventModal isActive={setSelectedEvent} event={getEvent(selectedEvent)} />
  ) : (
    <Modal
      style={{ padding: '2rem' }}
      isActive={isActive}
      header={<DayEventsModalHeader date={date} />}
      content={
        <DayEventsModalContent
          events={getDayEvents(date)}
          showEvent={setSelectedEvent}
        />
      }
    />
  );
};
export default DayEventsModal;

import { useState } from 'react';
import './EventBar.css';
import EventModal from './EventModal';
const EventBar = ({ event }) => {
  let className = 'eventbar';
  const [showEvent, setShowEvent] = useState(false);
  event = {
    id: 0,
    user_id: 0,
    channel_id: 0,
    title: '개강',
    start_date: new Date('2020-01-01T00:00:00'),
    due_date: new Date('2020-01-01T00:00:00'),
    created_at: '2020-01-01T00:00:00',
    updated_at: '2020-01-01T00:00:00',
  };
  return (
    <>
      <div
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          setShowEvent(true);
        }}
      >
        {event.title}
      </div>
      {showEvent ? <EventModal isActive={setShowEvent} event={event} /> : <></>}
    </>
  );
};
export default EventBar;

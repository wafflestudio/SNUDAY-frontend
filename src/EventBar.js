import { useState } from 'react';
import './EventBar.css';
import { EventModal } from './Event';
const EventBar = ({ event }) => {
  let className = 'eventbar';
  const [showEvent, setShowEvent] = useState(false);

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

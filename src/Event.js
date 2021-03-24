import './Event.css';
const Event = ({ event }) => {
  const options = {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  };
  return (
    <div className='event-container'>
      <div className='event-color'>
        <svg viewBox='0 0 16 16'>
          <circle cx='0.5rem' cy='0.5rem' r='0.5rem'></circle>
        </svg>
      </div>
      <div className='event-name'>{event.title}</div>
      <div className='event-date date-small'>
        {event.start_date.toLocaleDateString('ko-KR', options)}~
        {event.due_date.toLocaleDateString('ko-KR', options)}
      </div>
    </div>
  );
};
export default Event;

import './Event.css';
import Modal from './Modal';
import Tag from './Tag';

const EventTag = ({ event }) => {
  return (
    <div className='event-modal-header'>
      <Tag name={event.channel_id} color='#d4515d' />
    </div>
  );
};
const EventContent = ({ event }) => {
  const start = event.start_date;
  const end = event.due_date;
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return (
    <div className='event-modal-content'>
      <h3 className='event-title'>{event.title}</h3>
      <div className='event-date'>
        {start.toLocaleDateString('ko-KR', options)} ~
      </div>
      <div className='event-date'>
        {end.toLocaleDateString('ko-KR', options)}
      </div>
      <div>{/*메모*/}</div>
    </div>
  );
};
export const EventModal = ({ isActive, event }) => {
  return (
    <Modal
      isActive={isActive}
      header={<EventTag event={event} />}
      content={<EventContent event={event} />}
    ></Modal>
  );
};
export const EventList = ({ event }) => {
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

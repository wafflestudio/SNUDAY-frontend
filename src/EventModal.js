import Modal from './Modal';
import Tag from './Tag';

const EventModalHeader = ({ event }) => {
  return (
    <div className='event-modal-header'>
      <Tag name={event.channel_id} color='#d4515d' />
    </div>
  );
};
const EventModalContent = ({ event }) => {
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
const EventModalButton = () => {
  return <></>;
};
const EventModal = ({ isActive, event }) => {
  return (
    <Modal
      isActive={isActive}
      header={<EventModalHeader event={event} />}
      content={<EventModalContent event={event} />}
      button={<EventModalButton />}
    ></Modal>
  );
};
export default EventModal;

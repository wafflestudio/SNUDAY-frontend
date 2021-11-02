import { useState } from 'react';
import { useHistory } from 'react-router';
import { useAuthContext } from 'context/AuthContext';
import 'calendar/Event.css';
import Modal from 'Modal';
import AddEventModal from 'AddEventModal';
import Tag from 'Tag';
import { useCalendarContext } from 'context/CalendarContext';
import { COLORS } from 'Constants';
import { deleteEvent } from 'API';

const EventTag = ({ event }) => {
  const history = useHistory();
  const {
    value: { userInfo },
  } = useAuthContext();
  return (
    <div className="event-modal-header">
      <Tag
        id={event.channel}
        name={event.channel_name}
        color="#d4515d"
        onClick={() => {
          if (userInfo.my_channel !== event.channel)
            history.push(`/channel/${event.channel}`);
        }}
      />
    </div>
  );
};
const EventContent = ({ isActive, event, modify }) => {
  const { fetchEvents } = useCalendarContext();
  const start = event.start_date;
  const end = event.due_date;
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return (
    <div className="event-modal-content">
      <h3 className="event-title">{event.title}</h3>
      <pre className="event-date">{eventDateString(event)}</pre>
      <div>{event.memo}</div>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <img
          onClick={() => modify(true)}
          className="button"
          style={{
            width: '45px',
            height: '45px',
          }}
          src="/resources/edit-filled.svg"
        />
        <img
          onClick={() => {
            const proceed = window.confirm('일정을 삭제하시겠습니까?');
            if (proceed) {
              deleteEvent(event.channel, event.id).then((response) => {
                fetchEvents();
                isActive(false);
              });
            }
          }}
          className="button"
          style={{
            width: '45px',
            height: '45px',
            transform: 'rotate(45deg)',
            marginRight: '5px',
          }}
          src="/resources/delete.svg"
        />
      </div>
    </div>
  );
};
export const EventModal = ({ isActive, event }) => {
  const [isModifying, setIsModifying] = useState(false);
  console.log(event);
  return isModifying ? (
    <AddEventModal isActive={setIsModifying} event={event} />
  ) : (
    <Modal
      isActive={isActive}
      header={<EventTag event={event} />}
      content={
        <EventContent
          isActive={isActive}
          event={event}
          modify={setIsModifying}
        />
      }
    ></Modal>
  );
};
export const EventListItem = ({ event, showEvent }) => {
  const { channelColors } = useCalendarContext();
  const dateString = eventDateString(event);
  return (
    <div className="event-container" onClick={() => showEvent(event.id)}>
      <div className="event-color">
        <svg viewBox="0 0 16 16">
          <circle
            cx="0.5rem"
            cy="0.5rem"
            r="0.5rem"
            fill={COLORS[channelColors.get(event.channel)]}
          ></circle>
        </svg>
      </div>
      <div className="event-name">{event.title}</div>
      <pre className="event-date date-small">{dateString}</pre>
    </div>
  );
};
export function eventDateString(event) {
  const dateOptions = {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  };
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };
  const isSingleDay =
    event.start_date.getFullYear() === event.due_date.getFullYear() &&
    event.start_date.getMonth() === event.due_date.getMonth() &&
    event.start_date.getDate() === event.due_date.getDate();
  console.log(isSingleDay);
  const dateString = isSingleDay
    ? event.has_time
      ? `${event.start_date.toLocaleDateString('ko-KR', {
          ...dateOptions,
        })}\n${event.start_date.toLocaleTimeString('ko-KR', {
          ...timeOptions,
        })} ~ ${event.due_date.toLocaleTimeString('ko-KR', timeOptions)}`
      : event.start_date.toLocaleDateString('ko-KR', dateOptions)
    : event.has_time
    ? `${event.start_date.toLocaleString('ko-KR', {
        ...dateOptions,
        ...timeOptions,
      })} ~ \n${event.due_date.toLocaleString('ko-KR', {
        ...dateOptions,
        ...timeOptions,
      })}`
    : `${event.start_date.toLocaleDateString(
        'ko-KR',
        dateOptions
      )} ~ ${event.due_date.toLocaleDateString('ko-KR', dateOptions)}`;
  return dateString;
}

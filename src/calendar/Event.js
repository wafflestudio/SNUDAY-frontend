import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from 'context/AuthContext';
import 'calendar/Event.css';
import Modal from 'Modal';
import AddEventModal from 'AddEventModal';
import Tag from 'Tag';
import { useCalendarContext } from 'context/CalendarContext';
import { COLORS } from 'Constants';
import { deleteEvent } from 'API';
import useEvents from 'context/useEvents';

const EventTag = ({ event }) => {
  const navigate = useNavigate();
  const {
    value: { userInfo },
  } = useAuthContext();
  return (
    <div className="event-modal-header">
      <Tag
        id={event.channel}
        name={event.channelName}
        onClick={() => {
          if (userInfo.my_channel !== event.channel)
            navigate(`/channel/${event.channel}`);
        }}
      />
    </div>
  );
};
const EventContent = ({ isActive, event, modify }) => {
  const {
    value: { userInfo },
  } = useAuthContext();
  const { deleteEvent: delEvent } = useCalendarContext();
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
      {userInfo?.managing_channels.has(event.channel) ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'flex-end',
          }}
        >
          <img
            alt="edit"
            onClick={() => modify(true)}
            className="button"
            style={{
              width: '45px',
              height: '45px',
            }}
            src="/resources/edit-filled.svg"
          />
          <img
            alt="delete"
            onClick={() => {
              const proceed = window.confirm('일정을 삭제하시겠습니까?');
              if (proceed)
                deleteEvent(event.channel, event.id).then((response) => {
                  // events
                  console.log(response);
                  delEvent(event);
                  isActive(false);
                });
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
      ) : (
        <></>
      )}
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
  if (!channelColors) return <></>;
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
  const dateOptions = (date) => ({
    year:
      date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };
  const isSingleDay =
    event.start.getFullYear() === event.end.getFullYear() &&
    event.start.getMonth() === event.end.getMonth() &&
    event.start.getDate() === event.end.getDate();
  console.log(isSingleDay);
  let dateString;
  if (isSingleDay)
    if (!event.isAllDay)
      dateString = `${event.start.toLocaleDateString('ko-KR', {
        ...dateOptions(event.start),
      })}\n${event.start.toLocaleTimeString('ko-KR', {
        ...timeOptions,
      })} ~ ${event.end.toLocaleTimeString('ko-KR', timeOptions)}`;
    else
      dateString = event.end.toLocaleDateString(
        'ko-KR',
        dateOptions(event.end)
      );
  else if (!event.isAllDay)
    dateString = `${event.start.toLocaleString('ko-KR', {
      ...dateOptions(event.start),
      ...timeOptions,
    })} ~ \n${event.end.toLocaleString('ko-KR', {
      ...dateOptions(event.end),
      ...timeOptions,
    })}`;
  else
    dateString = `${event.start.toLocaleDateString(
      'ko-KR',
      dateOptions(event.start)
    )} ~ ${event.end.toLocaleDateString('ko-KR', dateOptions(event.end))}`;
  return dateString;
}

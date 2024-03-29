import { useState } from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { useAuthContext } from '../context/AuthContext';
import { EventListItem, EventModal } from './Event';
import Modal from 'Modal';
import ModalButton from 'AddButton';
import AddEventModal from 'AddEventModal';

const DayEventsModalHeader = ({ channelList, date }) => {
  const {
    value: { user },
  } = useAuthContext();
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const isManaging = channelList?.some((ch) => user?.managing_channels.has(ch));
  return (
    <>
      <div className="day-events-modal-header">
        <div>
          <h2 className="date-title">{`${
            date.getMonth() + 1
          }월 ${date.getDate()}일`}</h2>
          <time
            className="date-small"
            dateTime={`${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`}
          >
            {date.toLocaleDateString('ko-KR', options)}
          </time>
        </div>
        {user ? (
          <ModalButton
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
            }}
            component={AddEventModal}
            button={
              !channelList || isManaging ? (
                <img
                  alt="+"
                  src="/resources\plus.svg"
                  style={{ height: '100%' }}
                />
              ) : (
                <></>
              )
            }
            date={date}
          />
        ) : (
          <></>
        )}
      </div>
      <hr></hr>
    </>
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
const DayEventsModal = ({ isActive, date, channelList }) => {
  const { getDailyEvents, getEvent } = useCalendarContext();
  const [selectedEvent, setSelectedEvent] = useState(null);
  console.log(selectedEvent);
  return selectedEvent ? (
    <EventModal isActive={setSelectedEvent} event={getEvent(selectedEvent)} />
  ) : (
    <Modal
      style={{ padding: '2rem' }}
      isActive={isActive}
      header={<DayEventsModalHeader channelList={channelList} date={date} />}
      content={
        <DayEventsModalContent
          events={
            channelList
              ? getDailyEvents(date).filter((event) =>
                  channelList.includes(event.channel)
                )
              : getDailyEvents(date)
          }
          showEvent={setSelectedEvent}
        />
      }
    />
  );
};
export default DayEventsModal;

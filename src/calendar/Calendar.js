import React, { useState, useEffect } from 'react';
import Month from './Month';
import TagBar from './TagBar';
import './Calendar.css';
import { getNumDaysofMonth } from 'Constants';
import ModalButton from 'AddButton';
import {
  CalendarContextProvider,
  useCalendarContext,
} from 'context/CalendarContext';
import { useAuthContext } from 'context/AuthContext';
import AddEventModal from 'AddEventModal';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
export const AndroidCalendar = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  const {
    value: { isLoggedIn },
    action: { setIsLoggedIn, setToken },
  } = useAuthContext();
  useEffect(() => {
    setToken({ access: token });
    setIsLoggedIn(true);
    return () => {
      setToken({ access: null });
      setIsLoggedIn(false);
    };
  }, []);
  useEffect(() => {
    const addButton = document.getElementById('add-button');
    if (addButton) addButton.style.bottom = '0';
  });
  if (!isLoggedIn) return <></>;
  return <Calendar type="main" />;
};

export const Calendar = ({ type, channelId }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [day, setDay] = useState(today.getDate());
  const [numDays, setNumDays] = useState(getNumDaysofMonth(year, monthIndex));
  const [channelList, setChannelList] = useState([]);
  const {
    value: { isLoggedIn, userInfo, default_channels },
  } = useAuthContext();
  useEffect(() => {
    if (type === 'main')
      if (isLoggedIn && userInfo)
        setChannelList([...userInfo.subscribing_channels]);
      else setChannelList([...default_channels]);
    if (type === 'channel' || type === 'mini')
      if (Number.isInteger(channelId)) setChannelList([channelId]);
      else if (Array.isArray()) setChannelList(channelId);
  }, [type, channelId, userInfo, isLoggedIn, default_channels]);
  const navigate = useNavigate();
  const location = useLocation();
  // useEffect(() => {
  //   getMyEvents().then((events) => {
  //     calendar.registerEvents(events);
  //   });
  //   console.log(calendar.getEvents());
  // }, []);
  //// DATE Util Function
  const moveMonth = (direction) => {
    if (direction < 0) {
      //previous month
      console.log(1 - getNumDaysofMonth(year, monthIndex - 1));
      chooseDay(1 - getNumDaysofMonth(year, monthIndex - 1));
      return;
    }
    if (direction > 0) {
      //next month
      chooseDay(1 + numDays);
      return;
    }
  };
  const chooseDay = (d) => {
    //전후 달
    if (d < 1) {
      if (monthIndex === 0) {
        setYear((year) => year - 1);
        setMonthIndex(() => 11);
      } else setMonthIndex((monthIndex) => monthIndex - 1);

      setDay(() => getNumDaysofMonth(year, monthIndex - 1) + d);
      return;
    }
    if (d > numDays) {
      setDay(d - numDays);
      if (monthIndex > 10) {
        setYear((year) => year + 1);
        setMonthIndex(() => 0);
      } else setMonthIndex((monthIndex) => monthIndex + 1);

      return;
    }
    setDay(d);
  };
  const goToday = () => {
    if (
      day === today.getDate() &&
      monthIndex === today.getMonth() &&
      year === today.getFullYear()
    )
      return;
    setYear(today.getFullYear());
    setMonthIndex(today.getMonth());
    setDay(today.getDate());
    //document.getElementById(today.toLocaleDateString('ko-KR'))?.classList.remove('active');
  };
  ////
  useEffect(() => {
    setNumDays(getNumDaysofMonth(year, monthIndex));
    document.getElementById('Calendar-content').scrollLeft = window.innerWidth;
  }, [year, monthIndex]);
  const chooseMonth = (value) => {
    if (!value.match(/^\d{4}[-](0?[1-9]|1[012])$/)) return;
    const date = value.split('-');
    setYear(parseInt(date[0]));
    setMonthIndex(parseInt(date[1]) - 1);
    setDay(undefined);
  };
  useEffect(() => {
    Array.from(document.getElementsByClassName('active')).forEach((element) => {
      element.classList.remove('active');
    });
    document
      .getElementById(today.toLocaleDateString('ko-KR'))
      ?.classList.add('active');
  }, [year, monthIndex, day]);
  useEffect(() => {
    const selectedDay = document.getElementById(
      `${year}-${monthIndex}-${new Date(
        year,
        monthIndex,
        day
      ).toLocaleDateString('ko-KR')}`
    );
    //FIXIT:intersecting day
    // let observer = new IntersectionObserver(
    //   () => selectedDay.scrollIntoView(),
    //   {
    //     root: document.getElementsByClassName('Calendar-content')[0],
    //     threshold: 1,
    //   }
    // );
  }, [day]);

  return (
    <>
      <CalendarContextProvider
        value={{
          year,
          monthIndex,
          day,
          setDay: chooseDay,
          channelList,
        }}
      >
        {isLoggedIn &&
        userInfo &&
        (!channelId || userInfo.managing_channels.has(channelId)) ? (
          <ModalButton component={AddEventModal} channelId={channelId} />
        ) : (
          <></>
        )}
        <div className={`Calendar ${type ?? ''}`}>
          <div className="Calendar-header">
            <h1 className="Calendar-title">
              {year === today.getFullYear() ? '' : `${year}년 `}
              {monthIndex + 1}월
              <input
                type="month"
                className="Calendar-date-select"
                value={year + '-' + (monthIndex + 1 + '').padStart(2, '0')}
                onChange={(e) => {
                  console.log(e.target.value);
                  chooseMonth(e.target.value);
                }}
              />
            </h1>
            <button onClick={() => goToday()}>오늘</button>
            {!isLoggedIn && type == 'main' ? (
              <button
                onClick={() =>
                  navigate('/signin', { state: { prev: location.pathname } })
                }
                style={{
                  marginLeft: 'auto',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--blue)',
                }}
              >
                로그인
              </button>
            ) : (
              <></>
            )}
          </div>
          {channelId ? (
            <></>
          ) : (
            <div className="Calendar-tagbar-container">
              <TagBar category="active" isMain={true} />
            </div>
          )}

          <CalendarBody
            moveMonth={moveMonth}
            year={year}
            monthIndex={monthIndex}
            channelList={channelList}
            type={type}
          />
        </div>
      </CalendarContextProvider>
    </>
  );
};
export default Calendar;
export const CalendarBody = ({
  moveMonth,
  year,
  monthIndex,
  channelList,
  type,
}) => {
  const [targetTouch, setTargetTouch] = useState(null);
  const [scrollTime, setScrollTime] = useState(Date.now());
  const [activeChannelList, setActiveChannelList] = useState(channelList);
  const {
    value: { disabled_channels },
  } = useAuthContext();
  useEffect(() => {
    if (type === 'main')
      setActiveChannelList(
        channelList.filter((channel) => !disabled_channels.includes(channel))
      );
    else setActiveChannelList(channelList);
  }, [channelList, disabled_channels]);
  useEffect(() => {
    // setScrollTime(null);
  }, [monthIndex]);
  return (
    <div
      className="Calendar-body"
      onWheel={(e) => {
        if (type !== 'mini' && Date.now() - scrollTime > 1000) {
          setScrollTime(Date.now());
          moveMonth(e.deltaY);
        }
      }}
    >
      <div className="weekdays">
        <div className="weekday">일</div>
        <div className="weekday">월</div>
        <div className="weekday">화</div>
        <div className="weekday">수</div>
        <div className="weekday">목</div>
        <div className="weekday">금</div>
        <div className="weekday">토</div>
      </div>
      <div
        id="Calendar-content"
        className="Calendar-content"
        onScroll={(e) => {
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          if (e.touches.length === 1) setTargetTouch(e.touches[0]);
          else setTargetTouch(null);
        }}
        onTouchEnd={(e) => {
          if (targetTouch === null) return;
          const movedPositionX =
            e.changedTouches[0].clientX - targetTouch.clientX;
          const movedPositionY =
            e.changedTouches[0].clientY - targetTouch.clientY;
          const slope = movedPositionY / movedPositionX;
          if (Math.abs(movedPositionX) > 20 && Math.abs(slope) < 0.6)
            moveMonth(-movedPositionX);
        }}
      >
        {/* <div
          style={{
            minWidth: '100vw',
            height: '100%',
            textAlign: 'center',
            backgroundColor: 'pink',
          }}
        >
          1
        </div>
        <div
          style={{
            minWidth: '100vw',
            height: '100%',
            textAlign: 'center',
            backgroundColor: 'yellowgreen',
          }}
        >
          2
        </div>
        <div
          style={{
            minWidth: '100vw',
            height: '100%',
            textAlign: 'center',
            backgroundColor: 'lightblue',
          }}
        >
          3
        </div> */}
        {/* <Month
          key={`${year}-${monthIndex - 1}-`}
          year={year}
          monthIndex={monthIndex - 1}
        /> */}
        <Month
          key={`${year}-${monthIndex}`}
          year={year}
          monthIndex={monthIndex}
          channelList={type === 'main' ? null : activeChannelList}
        />
        {/* <Month
          key={`${year}-${monthIndex + 1}-`}
          year={year}
          monthIndex={monthIndex + 1}
        /> */}
      </div>
    </div>
  );
};

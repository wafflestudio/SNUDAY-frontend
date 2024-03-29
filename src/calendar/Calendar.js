import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CalendarContextProvider } from 'context/CalendarContext';
import { useAuthContext } from 'context/AuthContext';
import { getNumDaysofMonth } from 'Constants';
import './Calendar.css';
import AddEventModal from 'AddEventModal';
import ModalButton from 'AddButton';
import Month from './Month';
import TagBar from './TagBar';

export const AndroidCalendar = () => {
  let [searchParams] = useSearchParams();
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
  const [channelList, setChannelList] = useState([]);
  const today = new Date();
  const [date, setDate] = useState(today);
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const day = date.getDate();
  const numDays = getNumDaysofMonth(year, monthIndex);
  const {
    value: { default_channels, user },
  } = useAuthContext();
  useEffect(() => {
    if (type === 'main')
      if (user) setChannelList([...user.subscribing_channels]);
      else setChannelList([...default_channels]);
    if (type === 'channel' || type === 'mini')
      if (Number.isInteger(channelId)) setChannelList([channelId]);
      else if (Array.isArray()) setChannelList(channelId);
  }, [type, channelId, user, default_channels]);
  const navigate = useNavigate();
  const location = useLocation();
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
      const day = getNumDaysofMonth(year, monthIndex - 1) + d;
      if (monthIndex === 0) setDate((date) => new Date(year - 1, 11, day));
      else setDate((date) => new Date(year, monthIndex - 1, day));

      return;
    }
    if (d > numDays) {
      const day = d - numDays;
      if (monthIndex > 10) setDate((date) => new Date(year + 1, 0, day));
      else setDate((date) => new Date(year, monthIndex + 1, day));

      return;
    }
  };
  const goToday = () => {
    if (
      day === today.getDate() &&
      monthIndex === today.getMonth() &&
      year === today.getFullYear()
    )
      return;
    setDate(today);
    //document.getElementById(today.toLocaleDateString('ko-KR'))?.classList.remove('active');
  };
  ////
  useEffect(() => {
    document.getElementById('Calendar-content').scrollLeft = window.innerWidth;
  }, [year, monthIndex]);
  const chooseMonth = (value) => {
    if (!value.match(/^\d{4}[-](0?[1-9]|1[012])$/)) return;
    const [yyyy, mm] = value.split('-').map((s) => parseInt(s, 10));
    setDate(new Date(yyyy, mm - 1));
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
        {user && (!channelId || user.managing_channels.has(channelId)) ? (
          <ModalButton component={AddEventModal} />
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
            {!user && type === 'main' ? (
              <button
                onClick={() =>
                  navigate('/signin', { state: { prev: location.pathname } })
                }
                style={{
                  marginLeft: 'auto',
                  padding: 0,
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
        <Month
          key={`${year}-${monthIndex}`}
          year={year}
          monthIndex={monthIndex}
          channelList={type === 'main' ? null : activeChannelList}
        />
      </div>
    </div>
  );
};

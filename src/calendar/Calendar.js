import React, { useState, useEffect } from 'react';
import Month from './Month';
import TagBar from './TagBar';
import './Calendar.css';
import AddButton from 'AddButton';
import { Calendar as cal } from './cal';
import { CalendarContextProvider } from 'context/CalendarContext';
import { getMyEvents, getSubscribedChannels } from '../API';
import { useAuthContext } from 'context/AuthContext';
import AddEventModal from 'AddEventModal';

const getNumDays = (year, month) => {
  return 32 - new Date(year, month, 32).getDate();
};

const Calendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [day, setDay] = useState(today.getDate());
  const [numDays, setNumDays] = useState(getNumDays(year, monthIndex));
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  useEffect(() => {
    // getMyEvents().then((events) => {
    //   calendar.registerEvents(events);
    // });
    // console.log(calendar.getEvents());
  }, []);
  const moveMonth = (event) => {
    if (event.deltaY < 0) {
      chooseDay(1 - getNumDays(year, monthIndex - 1));
      return;
    }
    if (event.deltaY > 0) {
      chooseDay(1 + numDays);
      return;
    }
  };
  useEffect(() => {
    setNumDays(getNumDays(year, monthIndex));
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
    document
      .getElementById(
        `${year}-${monthIndex}-${new Date(
          year,
          monthIndex,
          day
        ).toLocaleDateString('ko-KR')}`
      )
      ?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
  }, [day]);
  const chooseDay = (d) => {
    //전후 달
    if (d < 1) {
      if (monthIndex < 1) {
        setYear(year - 1);
        setMonthIndex(11);
      } else setMonthIndex(monthIndex - 1);

      setDay(getNumDays(year, monthIndex - 1) + d);
      return;
    }
    if (d > numDays) {
      setDay(d - numDays);
      if (monthIndex > 10) {
        setYear(year + 1);
        setMonthIndex(0);
      } else setMonthIndex(monthIndex + 1);

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
  return (
    <>
      <CalendarContextProvider
        value={{
          day,
          setDay: chooseDay,
        }}
      >
        {isLoggedIn ? <AddButton component={AddEventModal} /> : <></>}
        <div className="Calendar">
          <div className="Calendar-header">
            <h3 className="Calendar-title">
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
            </h3>
            <button onClick={() => goToday()}>오늘</button>
          </div>
          <TagBar category="active" />
          <div className="weekdays">
            <div className="weekday">일</div>
            <div className="weekday">월</div>
            <div className="weekday">화</div>
            <div className="weekday">수</div>
            <div className="weekday">목</div>
            <div className="weekday">금</div>
            <div className="weekday">토</div>
          </div>
          <CalendarBody
            moveMonth={moveMonth}
            year={year}
            monthIndex={monthIndex}
          />
        </div>
      </CalendarContextProvider>
    </>
  );
};
export default Calendar;
const CalendarBody = ({ moveMonth, year, monthIndex }) => {
  return (
    <div className="Calendar-body" onWheel={(e) => moveMonth(e)}>
      <div
        id="Calendar-content"
        className="Calendar-content"
        onScroll={(e) => e.preventDefault()}
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

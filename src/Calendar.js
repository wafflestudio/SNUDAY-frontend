import React, { useState, useEffect } from 'react';
import Day from './Day';
import './Calendar.css';
const getNumDays = (year, month) => {
  return 32 - new Date(year, month, 32).getDate();
};

const Calendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [day, setDay] = useState(today.getDate());
  const [firstDayOfTheWeek, setfirstDayOfTheWeek] = useState(
    new Date(year, month).getDay()
  );
  const [numDays, setNumDays] = useState(getNumDays(year, month));
  console.log(numDays, firstDayOfTheWeek);
  console.log(year, month);
  const findToday = () => {
    if (year !== today.getFullYear()) {
      return;
    }
    if (month !== today.getMonth()) {
      return;
    }
    document.getElementById(`day${today.getDate()}`).classList.add('today');
  };
  const deleteToday = () => {
    if (year !== today.getFullYear()) {
      document
        .getElementById(`day${today.getDate()}`)
        .classList.remove('today');
      return;
    }
    if (month !== today.getMonth()) {
      document
        .getElementById(`day${today.getDate()}`)
        .classList.remove('today');
      return;
    }
  };
  useEffect(() => {
    setfirstDayOfTheWeek(new Date(year, month).getDay());
    setNumDays(getNumDays(year, month));
    deleteToday();
  }, [year, month]);
  useEffect(() => {
    findToday();
  }, [numDays]);

  const chooseDay = (day) => {
    if (day < 1) {
      setDay(getNumDays(year, month - 1) + day);
      if (month < 1) {
        setYear(year - 1);
        setMonth(11);
      } else {
        setMonth(month - 1);
      }
      return;
    }
    if (day > numDays) {
      setDay(day - numDays);
      if (month > 10) {
        setYear(year + 1);
        setMonth(0);
      } else {
        setMonth(month + 1);
      }
      return;
    }
  };
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };
  return (
    <>
      <h3>
        {year === today.getFullYear() ? '' : `${year}년 `}
        {month + 1}월
      </h3>
      <button onClick={() => goToday()}>오늘</button>
      <div className='Calendar'>
        <div className='week'>
          <div className='weekday'>일</div>
          <div className='weekday'>월</div>
          <div className='weekday'>화</div>
          <div className='weekday'>수</div>
          <div className='weekday'>목</div>
          <div className='weekday'>금</div>
          <div className='weekday'>토</div>
        </div>
        {[...Array(Math.ceil((numDays + firstDayOfTheWeek) / 7)).keys()].map(
          (w) => (
            <div key={w + 1} id={`week${w + 1}`} className='week'>
              {[...Array(7).keys()].map((d) => {
                const index = w * 7 + d + 1;
                return (
                  <div
                    key={index}
                    id={`day${index - firstDayOfTheWeek}`}
                    className='day'
                    onClick={() => chooseDay(index - firstDayOfTheWeek)}
                  >
                    <Day
                      year={year}
                      month={month}
                      day={index - firstDayOfTheWeek}
                      numDays={numDays}
                    />
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </>
  );
};
export default Calendar;

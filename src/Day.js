import React from 'react';
const Day = ({ year, month, day, numDays }) => {
  const date = new Date(year, month, day);
  let className = 'date';
  if (day < 1) className += ' past';
  if (day > numDays) className += ' next';
  return (
    <>
      <div className={className}>
        <span>{date.getDate()}</span>
      </div>
      <div className='day-todo-box'></div>
    </>
  );
};
export default Day;

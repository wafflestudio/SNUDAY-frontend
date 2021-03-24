import React from 'react';
const CalendarContext = React.createContext({
  getNumDays: () => {},
  day: null,
  setDay: () => {},
  calendar: null,
});
export default CalendarContext;

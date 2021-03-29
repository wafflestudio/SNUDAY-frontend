import Day from './Day';
const Week = ({ year, monthIndex, day }) => {
  const monthStart = 1 - new Date(year, monthIndex).getDay();
  const date = new Date(year, monthIndex, day);
  const startDate = day - date.getDay();

  return (
    <div className='week'>
      {[...Array(7).keys()].map((weekday) => (
        <Day
          key={`${year}-${monthIndex}-${startDate + weekday}`}
          year={year}
          monthIndex={monthIndex}
          day={startDate + weekday}
        />
      ))}
    </div>
  );
};
export default Week;

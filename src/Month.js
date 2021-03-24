import { useEffect } from 'react';
import Week from './week';
const Month = ({ year, monthIndex }) => {
  const date = new Date(year, monthIndex);
  const startDate = 1 - date.getDay();
  const getNumDays = (year, monthIndex) => {
    return 32 - new Date(year, monthIndex, 32).getDate();
  };
  const numWeeks = Math.ceil(
    (date.getDay() + getNumDays(year, monthIndex)) / 7
  );
  useEffect(() => {
    document
      .getElementById(
        `${year}-${monthIndex}-${new Date().toLocaleDateString('ko-KR')}`
      )
      ?.classList.add('today');
  }, []);
  return (
    <div className='month'>
      {[...Array(numWeeks).keys()].map((weekNo) => (
        <Week
          key={`${year}-${monthIndex}-${weekNo}w`}
          year={year}
          monthIndex={monthIndex}
          day={startDate + 7 * weekNo}
        />
      ))}
    </div>
  );
};
export default Month;

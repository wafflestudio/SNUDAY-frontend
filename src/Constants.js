export const usernamePattern = /^[a-z0-9]{5,}$/;
export const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\s)[A-Za-z\d\w\W]{8,}$/;
export const namePattern = /^[A-Za-z가-힣]+$/;
export const emailPattern = /^\S+@snu.ac.kr$/;
export const authNumberPattern = /^[a-zA-Z0-9]{6,6}$/;
export const COLORS = {
  POMEGRANATE: '#d4515d',
  ORANGE: '#e8914f',
  YELLOW: '#f3c550',
  LIGHTGREEN: '#b2d652',
  GREEN: '#60bf70',
  MEDITTERANEAN: '#60cdc8',
  SKYBLUE: '#4499e3',
  AMETHYST: '#a45eae',
  LAVENDER: '#4b4dbd',
};
export function getNumDaysofMonth(year, monthIndex) {
  let temp;
  if (year instanceof Date) {
    temp = year;
  } else if (!arguments.length) {
    temp = new Date();
  } else {
    temp = new Date(year, monthIndex);
  }
  year = temp.getFullYear();
  monthIndex = temp.getMonth();
  switch (+monthIndex + 1) {
    case 2:
      const isLeapYear =
        year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
      return isLeapYear ? 29 : 28;
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
  }
}
export const isSameDate = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
export const toDateString = (date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}-${(
    date.getDate() + ''
  ).padStart(2, '0')}`;

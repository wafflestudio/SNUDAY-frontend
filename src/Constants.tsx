import { useEffect } from 'react';

export const usernamePattern = /^[a-z0-9]{5,}$/;
export const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\s)[A-Za-z\d\w\W]{8,}$/;
export const namePattern = /^[A-Za-z가-힣]+$/;
export const emailPattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@snu\.ac.kr$/;
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
export const CHANNEL_SNUDAY = 64;
export const CHANNEL_ACADEMIC_CALENDAR = 65;
export const CHANNEL_HOLIDAYS = 73;
export const defaultColors = {
  [CHANNEL_ACADEMIC_CALENDAR]: 'rgb(15, 15, 112)',
  [CHANNEL_HOLIDAYS]: COLORS['POMEGRANATE'],
};
export const useUpdateLogger = (key: string, value: any) => {
  useEffect(() => {
    console.log(`UPDATE[${key}]`, value);
  }, [value]);
};
export function getNumDaysofMonth(year: Date | number, monthIndex: number) {
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
export const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
export const toDateString = (date: Date): string =>
  `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}-${(
    date.getDate() + ''
  ).padStart(2, '0')}`;
export const toTimeString = (date: Date): string =>
  `${(date.getHours() + '').padStart(2, '0')}:${(
    date.getMinutes() + ''
  ).padStart(2, '0')}:${(date.getSeconds() + '').padStart(2, '0')}`;
export const getDateLength = (date1: Date, date2: Date): number => {
  const dayInMs = 60 * 60 * 24 * 1000;
  date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return (date2.getTime() - date1.getTime()) / dayInMs + 1;
};
const textToATag = (string: string) => <a href={string}>{string}</a>;
export const parseURL = (string: string) => {
  if (typeof string !== 'string') return;
  const arr: (string | JSX.Element)[] = [];
  let result;
  let lastIndex = 0;
  const reURL = /https?:\/\/[\S]+\.[\S]+/g;
  console.log(string?.split(reURL));
  while ((result = reURL.exec(string)) !== null) {
    // console.log(result);
    // console.log(reURL.lastIndex);
    arr.push(string.slice(lastIndex, result.index));
    arr.push(
      <a key={arr.length} href={result[0]}>
        {result[0]}
      </a>
    );
    lastIndex = reURL.lastIndex;
  }
  arr.push(string.slice(lastIndex));
  console.log(arr);
  return arr;
  // return string?.replaceAll(reURL, `<a href='$&'>$&</a>`);
};

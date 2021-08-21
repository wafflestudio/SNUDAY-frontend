import holidays from './resources/holidays';
export class Calendar {
  constructor() {
    this.today = new Date();
    this.year = new Year();
    this.holiday = holidays;
  }
  setYear(year) {
    this.year = new Year(year);
    return this.year.getFullYear();
  }
  getYear(year) {
    return year === undefined ? this.year : new Year(year);
  }
  getHoliday(date) {
    const dateString = `${date.getFullYear()}-${(
      date.getMonth() +
      1 +
      ''
    ).padStart(2, '0')}-${(date.getDate() + '').padStart(2, '0')}`;
    if (this.holiday[date.getFullYear()] === undefined) return;
    for (let holiday of this.holiday[date.getFullYear()])
      if (dateString === holiday['날짜']) return holiday['이름'];

    return '';
  }
}
export class Year {
  constructor(year) {
    this.year = year === undefined ? new Date().getFullYear() : year;
    this.months = [...Array(12).keys()].map(
      (monthIndex) => new Month(new Date(this.year, monthIndex))
    );
  }
  getMonth(monthIndex) {
    return this.months[monthIndex];
  }
  getMonths() {
    return this.months;
  }
}
export class Month {
  constructor(date) {
    date.setDate(1);
    const getNumDays = (year, monthIndex) => {
      return 32 - new Date(year, monthIndex, 32).getDate();
    };
    this.year = date.getFullYear();
    this.monthIndex = date.getMonth();
    this.startDate = 1 - date.getDay();
    this.numWeeks = Math.ceil(
      (date.getDate() + getNumDays(this.year, this.monthIndex)) / 7
    );
    this.weeks = [...Array(this.numWeeks).keys()].map(
      (weekNo) =>
        new Week(this.year, this.monthIndex, this.startDate + 7 * weekNo)
    );
  }
  getWeek(weekNumber) {
    return this.weeks[weekNumber];
  }
}
export class Week {
  constructor(year, monthIndex, day) {
    this.year = year;
    this.monthIndex = monthIndex;
    this.monthStart = 1 - new Date(this.year, this.monthIndex).getDay();
    const date = new Date(year, monthIndex, day);
    this.startDate = day - date.getDay();
    this.days = [...Array(7).keys()].map(
      (weekday) => new Day(this.year, this.monthIndex, this.startDate + weekday)
    );
  }
  getDay(day) {
    return this.days[day];
  }
}
export class Day {
  constructor(year, monthIndex, day) {
    //date: Date
    this.date = new Date(year, monthIndex, day);
    this.holiday = null;
    this.schedule = [
      {
        id: 0,
        user_id: 'snuday',
        channel_id: 'my',
        contents: 'birthday',
        start_date: new Date('2021-02-20T00:00:00'),
        due_date: new Date('2021-02-20T23:59:59'),
        created_at: new Date('2021-02-19T00:00:00'),
        updated_at: new Date('2021-02-19T00:00:00'),
      },
    ];
  }
}

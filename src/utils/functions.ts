import moment from 'moment';
import { EventInfo, Mentoring } from './types';

export const convertData = (date: string) => {
  /*eslint-disable*/
  const [day, month, year, hour, minutes] = date.split(/[\/ :]/).map((v) => parseInt(v, 10));
  const data = new Date(year, month - 1, day, hour, minutes).toISOString();

  return data;
};

export const rnd = (a: any, b: any) => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};
  
export const rndElement = (arr: any) => {
  return arr[rnd(0, arr.length - 1)];
};

export const formatEvents = (events: Array<Mentoring>) => {
  const colors = ['#2196F3', '#3F51B5', '#673AB7', '#00BCD4', '#4CAF50', '#FF9800', '#757575'];
  const formatted = events
  .reduce((acc: Array<EventInfo>, curr: Mentoring) => {
    const event = {
      name: curr.name,
      start: moment(curr.dt_initial).format('YYYY-MM-DD HH:mm'),
      end: moment(curr.dt_final).format('YYYY-MM-DD HH:mm'),
      color: rndElement(colors),
    };
    acc.push(event);
    return acc;
  }, [] as Array<EventInfo>);

  return formatted;
};
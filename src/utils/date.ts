import { tz } from '@date-fns/tz';
import { format, formatDistanceToNow } from 'date-fns';

const TZ = 'Asia/Yangon';
const myTZ = tz(TZ);

export const myanmarFormat = (date: string | Date, fmt: string): string => {
  if (typeof date === 'string') {
    date = date.replace(' ', 'T');
    if (!date.includes('Z') && !date.includes('+')) {
      date += '+00:00';
    }
  }
  return format(date, fmt, { in: myTZ });
};

export const formatRelativeTime = (date: string | Date): string => {
  if (typeof date === 'string') {
    date = date.replace(' ', 'T');
    if (!date.includes('Z') && !date.includes('+')) {
      date += '+00:00';
    }
  }
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDate = (date: string | Date): string =>
  myanmarFormat(date, 'yyyy-MM-dd');

export const formatDateTime = (date: string | Date): string =>
  myanmarFormat(date, 'yyyy-MM-dd HH:mm');

export const formatTime = (date: string | Date): string =>
  myanmarFormat(date, 'HH:mm');

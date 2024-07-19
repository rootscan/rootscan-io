type TDate = Date | number;

export const fromNow = (date: TDate) => {
  const seconds = Math.floor((Number(new Date()) - Number(date)) / 1000);
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor(seconds / 2592000);
  const days = Math.floor(seconds / 86400);

  if (days > 548) {
    return years > 1 ? years + ' years ago' : '1 year ago';
  }

  if (days >= 320 && days <= 547) {
    return 'a year ago';
  }
  if (days >= 45 && days <= 319) {
    return months > 1 ? months + ' months ago' : '1 month ago';
  }
  if (days >= 26 && days <= 45) {
    return 'a month ago';
  }

  const hours = Math.floor(seconds / 3600);

  if (hours >= 36 && days <= 25) {
    return days > 1 ? days + ' days ago' : '1 day ago';
  }
  if (hours >= 22 && hours <= 35) {
    return 'a day ago';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes >= 90 && hours <= 21) {
    return hours > 1 ? hours + ' hours ago' : '1 hour ago';
  }
  if (minutes >= 45 && minutes <= 89) {
    return 'an hour ago';
  }
  if (seconds >= 90 && minutes <= 44) {
    return minutes > 1 ? minutes + ' minutes ago' : '1 minute ago';
  }
  if (seconds >= 45 && seconds <= 89) {
    return 'a minute ago';
  }
  if (seconds >= 0 && seconds <= 45) {
    return seconds > 1 ? seconds + ' seconds ago' : '1 second ago';
  }

  return 'just now';
};

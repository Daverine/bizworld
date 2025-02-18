function to12hrsTime(time) {
    time = time.split(':');
    return `${Number(time[0]) % 12 || 12}:${time[1]}${
      Number(time[0]) >= 12 ? 'PM' : 'AM'
    }`;
  }
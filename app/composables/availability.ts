export const useAvailability = (hours: ([string, string] | false)[]) => {
  const now = useNow({ interval: 10000 });
  const openTime = computed(() =>
    hours[now.value.getDay()] === false
      ? false
      : (hours[now.value.getDay()] as Array<string>)[0]
          .split(':')
          .map((el) => Number(el))
  );
  const closeTime = computed(() =>
    openTime.value === false
      ? false
      : (hours[now.value.getDay()] as Array<String>)[1]
          .split(':')
          .map((el) => Number(el))
  );
  const isClosed = computed(
    () =>
      !openTime.value ||
      openTime.value[0] > now.value.getHours() ||
      (openTime.value[0] === now.value.getHours() &&
        openTime.value[1] > now.value.getMinutes()) ||
      (closeTime.value !== false &&
        (closeTime.value[0] < now.value.getHours() ||
          (closeTime.value[0] === now.value.getHours() &&
            closeTime.value[1] < now.value.getMinutes())))
  );
  const willOpenToday = computed(
    () =>
      openTime.value !== false &&
      (openTime.value[0] > now.value.getHours() ||
        (openTime.value[0] === now.value.getHours() &&
          openTime.value[1] > now.value.getMinutes()))
  );
  const closesSoon = computed(
    () =>
      !isClosed.value &&
      closeTime.value !== false &&
      closeTime.value[0] * 60 +
        closeTime.value[1] -
        (now.value.getHours() * 60 + now.value.getMinutes()) <
        90
  );
  const nextOpenDay = computed(() => {
    let ex = now.value.getDay() === 6 ? 0 : now.value.getDay() + 1;
    let i = 1;
    let result: number | boolean = false;

    for (; i < 6; i++) {
      if (hours[ex > 5 ? -1 + i : ex + i] !== false) {
        result = ex > 5 ? -1 + i : ex + i;
        break;
      }
    }
    return result;
  });
  function whatDay(index: number) {
    return [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][index];
  }

  return ref({
    now,
    openTime,
    closeTime,
    isClosed,
    willOpenToday,
    closesSoon,
    nextOpenDay,
    whatDay,
  });
};

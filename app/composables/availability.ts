export type processedTime = [number, number];
export type unprocessedTime = [string, string];
export type weeklySchedule = [
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false
];
export const useAvailability = (weeklySchedule: weeklySchedule) => {
  const now = useNow({ interval: 10000 });
  const openTime = computed<processedTime | false>(() =>
    weeklySchedule[now.value.getDay()] === false
      ? false
      : ((weeklySchedule[now.value.getDay()] as unprocessedTime)[0]
          .split(':')
          .map((el) => Number(el)) as processedTime)
  );
  const closeTime = computed<processedTime | false>(() =>
    openTime.value === false
      ? false
      : ((weeklySchedule[now.value.getDay()] as unprocessedTime)[1]
          .split(':')
          .map((el) => Number(el)) as processedTime)
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
      if (weeklySchedule[ex > 5 ? -1 + i : ex + i] !== false) {
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

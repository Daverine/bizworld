export type processedTime = [number, number];
export type unprocessedTime = [string, string];
export type weeklySchedule = [
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
  unprocessedTime | false,
];

type hours = [
  {
    day: "Sunday";
    avail: "nil" | "always" | "selected" | "appointment";
    hours: { opening?: string; closing?: string };
  },
  {
    day: "Monday";
    avail: "nil" | "always" | "selected" | "appointment";
    hours: { opening?: string; closing?: string };
  },
  {
    day: "Tuesday";
    avail: "nil" | "always" | "selected" | "appointment";
    hours: { opening?: string; closing?: string };
  },
  {
    day: "Wednesday";
    avail: "nil" | "always" | "selected" | "appointment";
    hours: { opening?: string; closing?: string };
  },
  {
    day: "Thursday";
    avail: "nil" | "always" | "selected" | "appointment";
    hours: { opening?: string; closing?: string };
  },
  {
    day: "Friday";
    avail: "nil" | "always" | "selected" | "appointment";
    hours: { opening?: string; closing?: string };
  },
  {
    day: "Saturday";
    avail: "nil" | "always" | "selected" | "appointment";
    hours: { opening?: string; closing?: string };
  },
];
export const useAvailability = (weeklySchedule: hours) => {
  const now = useNow({ interval: 10000 });
  const today = computed(() => weeklySchedule[now.value.getDay()]);
  const openTime = computed(() => {
    if (today.value?.avail !== "selected") return;
    return today.value?.hours.opening?.split(":").map((el) => Number(el)) as [number, number];
  });
  const closeTime = computed(() => {
    if (!openTime.value) return;
    return today.value?.hours.closing?.split(":").map((el) => Number(el)) as [number, number];
  });
  const isClosed = computed(
    () =>
      !openTime.value ||
      openTime.value[0] > now.value.getHours() ||
      (openTime.value[0] === now.value.getHours() && openTime.value[1] > now.value.getMinutes()) ||
      (closeTime.value &&
        (closeTime.value[0] < now.value.getHours() ||
          (closeTime.value[0] === now.value.getHours() &&
            closeTime.value[1] < now.value.getMinutes()))),
  );
  const willOpenToday = computed(
    () =>
      openTime.value &&
      (openTime.value[0] > now.value.getHours() ||
        (openTime.value[0] === now.value.getHours() && openTime.value[1] > now.value.getMinutes())),
  );
  const closesSoon = computed(
    () =>
      !isClosed.value &&
      closeTime.value &&
      closeTime.value[0] * 60 +
      closeTime.value[1] -
      (now.value.getHours() * 60 + now.value.getMinutes()) <
      90,
  );
  const nextOpenDay = computed(() => {
    let tomorrowOfWeekDays = now.value.getDay() === 6 ? 0 : now.value.getDay() + 1;

    for (let i = 1; i < 6; i++) {
      let nextDay = weeklySchedule[(tomorrowOfWeekDays > 5 ? -1 : tomorrowOfWeekDays) + i];
      if (nextDay?.avail !== "nil") return nextDay;
    }
  });
  function whatDay(index: number) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
  }

  return {
    now,
    today,
    isClosed,
    willOpenToday,
    closesSoon,
    nextOpenDay,
    whatDay,
  };
};

import { Dayjs } from "dayjs";

export const getPreviousMonthLastBusinessDay = (date: Dayjs) => {
  const lastDay = date.startOf("month").subtract(1, "day");
  if (lastDay.day() === 0) {
    return lastDay.subtract(2, "day");
  } else if (lastDay.day() === 6) {
    return lastDay.subtract(1, "day");
  }
  return lastDay;
};

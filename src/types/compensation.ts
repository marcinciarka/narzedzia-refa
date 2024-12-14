export const DATE_FORMAT = "YYYY-MM-DD" as `${string}-${string}-${string}`;

export type Compensation = {
  name: string;
  date: typeof DATE_FORMAT;
  exchangeRateDate: typeof DATE_FORMAT;
  loadingExchangeRate?: boolean;
  exchangeRate?: number;
  amount: number;
};

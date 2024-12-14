"use client";

import { getPreviousMonthLastBusinessDay } from "@/app/helpers";
import { Compensation, DATE_FORMAT } from "@/types/compensation";
import { IconDeviceFloppy, IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect } from "react";

export const CompensationItem = ({
  item,
  index,
  removeCompensation,
  updateCompensation,
  compensationCurrency,
  compensationBase,
}: {
  item: Compensation;
  index: number;
  compensationCurrency: "eur" | "usd";
  compensationBase: number;
  removeCompensation: (index: number) => void;
  updateCompensation: (index: number, item: Compensation) => void;
}) => {
  useEffect(() => {
    if (
      item.exchangeRateDate &&
      !item.exchangeRate &&
      !item.loadingExchangeRate
    ) {
      updateCompensation(index, {
        ...item,
        loadingExchangeRate: true,
      });
      console.log(
        "fetching exchange rate for date",
        dayjs(item.exchangeRateDate).format(DATE_FORMAT)
      );

      fetch(
        `https://api.nbp.pl/api/exchangerates/rates/a/${compensationCurrency}/${dayjs(
          item.exchangeRateDate
        ).format(DATE_FORMAT)}/?format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          updateCompensation(index, {
            ...item,
            exchangeRate: data.rates[0].mid,
            loadingExchangeRate: false,
          });
        });
    }
  }, [
    index,
    item,
    item.exchangeRateDate,
    updateCompensation,
    compensationCurrency,
  ]);
  return (
    <div
      className="grid grid-cols-6 divide-x"
      key={`CompensationCalculator-${index}`}
    >
      <div className="text-center flex items-center justify-center">
        {item.name}
      </div>
      <div className="text-center flex items-center justify-center">
        {dayjs(item.date).format(DATE_FORMAT)}
      </div>
      <div className="text-center flex flex-col items-center justify-center">
        {dayjs(item.exchangeRateDate).format("DD/MM/YYYY")}
        {item.loadingExchangeRate && <span className="animate-pulse">...</span>}
        {item.exchangeRate && (
          <div>
            <p className="text-xs text-gray-500">
              1 {compensationCurrency.toUpperCase()} ={" "}
              {item.exchangeRate.toFixed(4)} PLN
            </p>
          </div>
        )}
      </div>
      <div className="text-center flex flex-col items-center justify-center">
        {item.exchangeRate
          ? Number(item.exchangeRate * compensationBase).toFixed(2)
          : "- "}{" "}
        PLN
      </div>
      <div className="text-center flex items-center justify-center">
        {item.amount}
      </div>
      <div className="text-center flex items-center justify-center">
        <button
          className="btn btn-ghost btn-xs m-1"
          onClick={() => {
            removeCompensation(index);
          }}
        >
          <IconTrash size={20} />
          usuń
        </button>
        <button
          className="btn btn-ghost btn-xs m-1"
          onClick={() => {
            if (document?.getElementById(`compensationEditModal-${index}`)) {
              return (
                document.getElementById(
                  `compensationEditModal-${index}`
                ) as HTMLDialogElement
              ).showModal();
            }
          }}
        >
          <IconEdit size={20} />
          edytuj
        </button>
      </div>
      <hr className="col-span-6" />
      <dialog id={`compensationEditModal-${index}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edytuj rekompensatę</h3>
          <form autoComplete="off">
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex flex-row justify-between">
                <label
                  htmlFor="compensation_name"
                  className="text-sm text-gray-500 mr-8 flex content-center flex-wrap"
                >
                  Nazwa (opcjonalne)
                </label>
                <input
                  type="text"
                  data-1p-ignore
                  id="compensation_name"
                  className="input input-bordered focus:input-primary w-[60%]"
                  value={item?.name}
                  autoComplete="off"
                  onChange={(e) => {
                    updateCompensation?.(index, {
                      ...item,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-row justify-between">
                <label
                  htmlFor="name"
                  className="text-sm text-gray-500 mr-8 flex content-center flex-wrap"
                >
                  Data należności
                </label>
                <input
                  type="date"
                  id="date"
                  className="input input-bordered focus:input-primary w-[60%]"
                  value={
                    item?.date ? dayjs(item.date).format(DATE_FORMAT) : "-"
                  }
                  max={dayjs().format(DATE_FORMAT)}
                  onChange={(e) => {
                    updateCompensation?.(index, {
                      ...item,
                      date: dayjs(e.target.value).format(
                        DATE_FORMAT
                      ) as typeof DATE_FORMAT,
                      exchangeRate: undefined,
                      exchangeRateDate: getPreviousMonthLastBusinessDay(
                        dayjs(e.target.value)
                      ).format(DATE_FORMAT) as typeof DATE_FORMAT,
                    });
                  }}
                />
              </div>
              <div className="flex flex-row justify-between">
                <label
                  htmlFor="name"
                  className="text-sm text-gray-500 mr-8 flex content-center flex-wrap"
                >
                  Data obliczenia kursu
                </label>
                <input
                  type="date"
                  disabled
                  id="exchangeRateDate"
                  className="input input-bordered focus:input-primary w-[60%] disabled"
                  value={
                    item?.exchangeRateDate
                      ? dayjs(item.exchangeRateDate).format(DATE_FORMAT)
                      : undefined
                  }
                />
              </div>
              <div className="flex flex-row justify-between">
                <label
                  htmlFor="name"
                  className="text-sm text-gray-500 mr-8 flex content-center flex-wrap"
                >
                  Kwota należności
                </label>
                <input
                  type="number"
                  id="amount"
                  className="input input-bordered focus:input-primary w-[60%]"
                  value={item?.amount}
                  onChange={(e) => {
                    updateCompensation?.(index, {
                      ...item,
                      amount: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-primary mt-8"
                disabled={!item?.date}
                onClick={() => {
                  (
                    document.getElementById(
                      `compensationEditModal-${index}`
                    ) as HTMLDialogElement
                  ).close();
                }}
              >
                <IconDeviceFloppy />
                Zapisz
              </button>
            </form>
          </div>
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                (
                  document.getElementById(
                    `compensationEditModal-${index}`
                  ) as HTMLDialogElement
                ).close();
              }}
            >
              &times;
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

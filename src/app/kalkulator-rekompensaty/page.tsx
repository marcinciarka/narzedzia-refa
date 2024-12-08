"use client";

import {
  IconDeviceFloppy,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

type Compensation = {
  name: string;
  date: Dayjs;
  exchangeRateDate: Dayjs;
  loadingExchangeRate?: boolean;
  exchangeRate?: number;
  amount: number;
};

const getPreviousMonthLastBusinessDay = (date: Dayjs) => {
  const lastDay = date.startOf("month").subtract(1, "day");
  if (lastDay.day() === 0) {
    return lastDay.subtract(2, "day");
  } else if (lastDay.day() === 6) {
    return lastDay.subtract(1, "day");
  }
  return lastDay;
};

const CompensationItem = ({
  item,
  index,
  removeCompensation,
  updateCompensation,
  compensationCurrency,
}: {
  item: Compensation;
  index: number;
  compensationCurrency: "eur" | "usd";
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
        item.exchangeRateDate.format("YYYY-MM-DD")
      );

      fetch(
        `https://api.nbp.pl/api/exchangerates/rates/a/${compensationCurrency}/${item.exchangeRateDate.format(
          "YYYY-MM-DD"
        )}/?format=json`
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
      className="grid grid-cols-5 divide-x"
      key={`CompensationCalculator-${index}`}
    >
      <div className="text-center flex items-center justify-center">
        {item.name}
      </div>
      <div className="text-center flex items-center justify-center">
        {item.date.format("DD/MM/YYYY")}
      </div>
      <div className="text-center flex flex-col items-center justify-center">
        {item.exchangeRateDate.format("DD/MM/YYYY")}
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
      <div className="text-center flex items-center justify-center">
        {item.amount}
      </div>
      <div className="text-center flex items-center justify-center">
        <button
          className="btn btn-ghost btn-sm m-2"
          onClick={() => {
            removeCompensation(index);
          }}
        >
          <IconTrash size={20} />
          usuń
        </button>
        <button
          className="btn btn-ghost btn-sm m-2"
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
      <hr className="col-span-5" />
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
                  value={item?.date?.format("YYYY-MM-DD")}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => {
                    updateCompensation?.(index, {
                      ...item,
                      date: dayjs(e.target.value),
                      exchangeRate: undefined,
                      exchangeRateDate: getPreviousMonthLastBusinessDay(
                        dayjs(e.target.value)
                      ),
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
                  value={item?.exchangeRateDate?.format("YYYY-MM-DD")}
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

export default function CompensationCalculator() {
  const [compensationCurrency, setCompensationCurrency] = useState<
    "eur" | "usd"
  >("eur");
  const [compensationBase, setCompensationBase] = useState<number>(40);
  const [editingCompensationIndex, setEditingCompensationIndex] = useState<
    number | undefined
  >();
  const [editingCompensation, setEditingCompensation] =
    useState<Partial<Compensation>>();
  const [compensations, setCompensations] = useState<Compensation[]>();

  useEffect(() => {
    setCompensations((prev) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      prev?.map(({ exchangeRate, ...item }) => ({
        ...item,
        exchangeRateDate: getPreviousMonthLastBusinessDay(item.date),
      }))
    );
  }, [compensationCurrency]);

  return (
    <div>
      <h1 className="text-center mt-6 text-2xl font-semibold">
        Kalkulator rekompensaty <br />
        <small>za koszty odzyskiwania należności</small>
      </h1>
      <div className="flex flex-row justify-center items-center mt-8">
        <div className="flex">
          <button
            className={`btn ${
              compensationCurrency === "eur" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setCompensationCurrency("eur")}
          >
            EUR
          </button>
          <button
            className={`btn ${
              compensationCurrency === "usd" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setCompensationCurrency("usd")}
          >
            USD
          </button>
        </div>
        <div className="ml-6 mr-6">Kwota bazowa rekompensaty</div>
        <input
          type="number"
          value={compensationBase}
          onChange={(e) => setCompensationBase(parseInt(e.target.value))}
          className="input input-bordered focus:input-primary w-20"
        />
      </div>
      <div className="grid grid-cols-5 mt-20 divide-x">
        <div className="text-sm text-center font-bold pb-4">Nazwa</div>
        <div className="text-sm text-center font-bold pb-4">
          Data należności
        </div>
        <div className="text-sm text-center font-bold pb-4">
          Data obliczenia kursu
        </div>
        <div className="text-sm text-center font-bold pb-4">
          Kwota należności
        </div>
        <div className="text-sm text-center font-bold pb-4">#</div>
        <hr className="col-span-5" />
      </div>
      {compensations
        ?.sort((a, b) => a.date.valueOf() - b.date.valueOf())
        .map((item, index) => (
          <CompensationItem
            item={item}
            index={index}
            compensationCurrency={compensationCurrency}
            key={`CompensationCalculator-${index}`}
            removeCompensation={(index) => {
              setCompensations(compensations.filter((_, i) => i !== index));
            }}
            updateCompensation={(index, item) => {
              setCompensations(
                compensations.map((compensation, i) =>
                  i === index ? item : compensation
                )
              );
            }}
          />
        ))}
      <div className="text-center mt-20">
        <p
          className="text-lg font-bold"
          style={{ color: compensations?.length ? "black" : "gray" }}
        >
          Suma rekompensat
        </p>
        <p
          className="text-lg font-bold"
          style={{ color: compensations?.length ? "black" : "gray" }}
        >
          {Number(
            compensations
              ?.map(({ exchangeRate }) => {
                return (exchangeRate || 0) * compensationBase;
              })
              .reduce((acc, curr) => acc + curr, 0) || 0
          ).toFixed(2)}{" "}
          PLN /{" "}
          {Number(
            compensations
              ?.map(() => {
                return compensationBase;
              })
              .reduce((acc, curr) => acc + curr, 0) || 0
          ).toFixed(2)}{" "}
          EUR
        </p>
      </div>
      <div className="text-center mt-20">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingCompensation({});
            if (document?.getElementById("compensationAddModal")) {
              return (
                document.getElementById(
                  "compensationAddModal"
                ) as HTMLDialogElement
              ).showModal();
            }
          }}
        >
          <IconPlus />
          Dodaj rekompensatę
        </button>
      </div>
      <dialog id="compensationAddModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {editingCompensationIndex !== undefined ? "Edytuj" : "Dodaj"}{" "}
            rekompensatę
          </h3>
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
                  value={editingCompensation?.name}
                  autoComplete="off"
                  onChange={(e) =>
                    setEditingCompensation({
                      ...editingCompensation,
                      name: e.target.value,
                    })
                  }
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
                  value={editingCompensation?.date?.format("YYYY-MM-DD")}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setEditingCompensation({
                      ...editingCompensation,
                      date: dayjs(e.target.value),
                      exchangeRateDate: getPreviousMonthLastBusinessDay(
                        dayjs(e.target.value)
                      ),
                    })
                  }
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
                  value={editingCompensation?.exchangeRateDate?.format(
                    "YYYY-MM-DD"
                  )}
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
                  value={editingCompensation?.amount}
                  onChange={(e) =>
                    setEditingCompensation({
                      ...editingCompensation,
                      amount: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-primary mt-8"
                disabled={!editingCompensation?.date}
                onClick={() => {
                  setCompensations(
                    editingCompensationIndex !== undefined
                      ? compensations?.map((item, index) =>
                          index === editingCompensationIndex
                            ? (editingCompensation as Compensation)
                            : item
                        )
                      : (compensations || []).concat(
                          editingCompensation as Compensation
                        )
                  );
                  setEditingCompensation(undefined);
                  setEditingCompensationIndex(undefined);
                  (
                    document.getElementById(
                      "compensationAddModal"
                    ) as HTMLDialogElement
                  ).close();
                }}
              >
                {editingCompensationIndex !== undefined ? (
                  <>
                    <IconDeviceFloppy />
                    Zapisz
                  </>
                ) : (
                  <>
                    <IconPlus />
                    Dodaj
                  </>
                )}
              </button>
            </form>
          </div>
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setEditingCompensation(undefined);
                setEditingCompensationIndex(undefined);
                (
                  document.getElementById(
                    "compensationAddModal"
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
}

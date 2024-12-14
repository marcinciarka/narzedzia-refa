"use client";

import { getPreviousMonthLastBusinessDay } from "@/app/helpers";
import { useCompensations } from "@/app/hooks/useCompensations";
import { CompensationItem } from "@/components/CompensationItem";
import { Compensation, DATE_FORMAT } from "@/types/compensation";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function CompensationCalculator() {
  const {
    compensations,
    setCompensations,
    compensationCurrency,
    setCompensationCurrency,
    compensationBase,
    setCompensationBase,
    setEditingCompensation,
    editingCompensationIndex,
    editingCompensation,
    setEditingCompensationIndex,
  } = useCompensations();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setCompensations((prev) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      prev?.map(({ exchangeRate, ...item }) => ({
        ...item,
        exchangeRateDate: getPreviousMonthLastBusinessDay(
          dayjs(item.date)
        ).format(DATE_FORMAT) as typeof DATE_FORMAT,
      }))
    );
  }, [compensationCurrency, setCompensations]);

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
      <div className="grid grid-cols-6 mt-20 divide-x">
        <div className="text-sm text-center font-bold pb-4">Nazwa</div>
        <div className="text-sm text-center font-bold pb-4">
          Data należności
        </div>
        <div className="text-sm text-center font-bold pb-4">
          Data obliczenia kursu
        </div>
        <div className="text-sm text-center font-bold pb-4">
          Kwota rekompensaty
        </div>
        <div className="text-sm text-center font-bold pb-4">
          Kwota należności
        </div>
        <div className="text-sm text-center font-bold pb-4">#</div>
        <hr className="col-span-6" />
      </div>
      {isClient &&
        compensations
          ?.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
          .map((item, index) => (
            <CompensationItem
              item={item}
              index={index}
              compensationCurrency={compensationCurrency}
              compensationBase={compensationBase}
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
      {isClient && compensations?.length ? (
        <div className="grid grid-cols-6 divide-x">
          <div className="col-span-3" />
          <div className="pt-3 text-center">
            <p
              className="text-xs uppercase"
              style={{ color: "gray" }}
              suppressHydrationWarning
            >
              Suma rekompensat
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: compensations?.length ? "black" : "gray" }}
              suppressHydrationWarning
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
            <hr className="mt-3" />
          </div>
          <div className="col-span-2" />
        </div>
      ) : null}
      {isClient && !compensations?.length ? (
        <div className="text-center mt-20 text-gray-500">Brak rekompensat</div>
      ) : null}
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
      <p className="text-center mt-20 text-sm text-gray-500">
        <strong>Zmiany zapisują się automatycznie w przeglądarce.</strong>
      </p>
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
                  value={
                    editingCompensation?.date
                      ? dayjs(editingCompensation.date)?.format("YYYY-MM-DD")
                      : undefined
                  }
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setEditingCompensation({
                      ...editingCompensation,
                      date: dayjs(e.target.value).format(
                        DATE_FORMAT
                      ) as typeof DATE_FORMAT,
                      exchangeRateDate: getPreviousMonthLastBusinessDay(
                        dayjs(e.target.value)
                      ).format(DATE_FORMAT) as typeof DATE_FORMAT,
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
                  value={
                    editingCompensation?.exchangeRateDate
                      ? dayjs(editingCompensation.exchangeRateDate).format(
                          "YYYY-MM-DD"
                        )
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

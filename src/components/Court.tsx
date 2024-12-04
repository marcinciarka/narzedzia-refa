import { HighlightRanges } from "@nozbe/microfuzz";
import { Highlight } from "@nozbe/microfuzz/react";
import clsx from "clsx";
import {
  IconAlertCircle,
  IconBooks,
  IconHome,
  IconStar,
  IconTower,
  IconWallet,
} from "@tabler/icons-react";
import { Court as CourtType } from "@/types/db";
import Link from "next/link";

export const Court = ({
  court,
  loading,
  highlightCourtName,
  highlightCourtData,
  uncertain,
  active,
  superActive,
  onClick,
  details,
}: {
  court?: CourtType;
  loading?: boolean;
  highlightCourtName?: HighlightRanges;
  highlightCourtData?: HighlightRanges;
  active?: boolean;
  superActive?: boolean;
  uncertain?: boolean;
  details?: boolean;
  score?: number;
  onClick?: () => void;
}) => {
  const courtTypeDefault = court?.courttype || "rejonowy";
  const commercialDepartmentLabelClass = {
    apelacyjny: "text-white shadow-sm bg-pink-800",
    okregowy: "text-white shadow-sm bg-teal-800",
    rejonowy: "text-white shadow-sm bg-blue-800",
  }[courtTypeDefault];

  const mortgageDepartmentLabelClass = {
    apelacyjny: "text-white shadow-sm bg-pink-400",
    okregowy: "text-white shadow-sm bg-teal-400",
    rejonowy: "text-white shadow-sm bg-slate-700",
  }[courtTypeDefault];

  const gradientClass = {
    apelacyjny: "from-pink-100",
    okregowy: "from-teal-100",
    rejonowy: "from-blue-100",
  }[courtTypeDefault];

  const activeClass = {
    apelacyjny: "border-pink-800",
    okregowy: "border-teal-600",
    rejonowy: "border-blue-500",
  }[courtTypeDefault];

  const accentTextClass = {
    apelacyjny: "text-pink-800",
    okregowy: "text-teal-600",
    rejonowy: "text-blue-500",
  }[courtTypeDefault];

  const highlightTextClass = {
    apelacyjny: "bg-pink-100 text-pink-900",
    okregowy: "bg-teal-100 text-teal-900",
    rejonowy: "bg-blue-100 text-blue-900",
  }[courtTypeDefault];

  const icon = {
    apelacyjny: (
      <IconStar
        size={160}
        color="white"
        className="absolute top-[-40px] left-[-40px] opacity-60"
        title={courtTypeDefault}
      />
    ),
    okregowy: (
      <IconTower
        size={120}
        color="white"
        className="absolute top-[-20px] left-[-20px] opacity-60"
        title={courtTypeDefault}
      />
    ),
    rejonowy: (
      <IconHome
        size={160}
        color="white"
        className="absolute top-[-30px] left-[-30px] opacity-50"
        title={courtTypeDefault}
      />
    ),
  }[courtTypeDefault];

  const comercialIcon = court?.iscommercial ? (
    <p
      className={clsx(
        "text-xs font-bold text-black inline-block mb-1 mr-2 px-2 py-1 rounded-lg relative z-2 leading-7",
        commercialDepartmentLabelClass
      )}
    >
      <IconWallet size={22} strokeWidth={1} className="inline mr-2 mb-1" />
      Wydział Gospodarczy
    </p>
  ) : null;

  const mortgageIcon = court?.ismortgage ? (
    <p
      className={clsx(
        "text-xs font-bold text-black inline-block mb-1 mr-2 px-2 py-1 rounded-lg relative z-2 leading-7",
        mortgageDepartmentLabelClass
      )}
    >
      <IconBooks size={22} strokeWidth={1} className="inline mr-2 mb-1" />
      Księgi Wieczyste
    </p>
  ) : null;

  const uncertainIcon = uncertain ? (
    <p
      className={clsx(
        "text-xs font-bold text-white inline-block mb-1 mr-2 px-2 py-1 rounded-lg relative z-2 leading-7 cursor-pointer",
        "bg-red-700"
      )}
      title="Wyszukanie niepewne, sugerujemy sprawdzenie ręczne"
    >
      <IconAlertCircle size={18} strokeWidth={1} className="inline mr-2 mb-1" />
      Niepewne wyszukanie
    </p>
  ) : null;

  return (
    <div
      key={court?.name}
      className={clsx(
        "max-w-full max-h-max relative bg-white shadow-sm hover:shadow-xl transition-shadow",
        "hover:border-gray-300 transition-border",
        "rounded-lg p-6 pt-4 overflow-hidden",
        "bg-gradient-to-br to-60%",
        gradientClass,
        active || superActive ? activeClass : "border-gray-100",
        superActive ? `border-4 ${activeClass}` : "border",
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
    >
      {icon}
      <h2
        className={clsx("text-xl font-bold relative mb-2 z-2", accentTextClass)}
      >
        <small className="text-xs font-bold mb-2">{court?.state}</small>
        <br />
        {highlightCourtName ? (
          <Highlight
            className={clsx("font-bold p-0.5", highlightTextClass)}
            style={{ backgroundColor: undefined }}
            text={court?.name || "Ładowanie..."}
            ranges={highlightCourtName}
          />
        ) : (
          court?.name
        )}
        {loading && (
          <div className="h-4 animate-pulse bg-gray-200 rounded-full max-w-[360px] mb-4.5" />
        )}
      </h2>
      {uncertainIcon}
      {comercialIcon}
      {mortgageIcon}
      <div className="mt-3">
        {highlightCourtData ? (
          <p className="text-gray-700 text-xs relative z-2">
            <Highlight
              className={clsx("font-bold p-0.5", highlightTextClass)}
              style={{ backgroundColor: undefined }}
              text={court?.description || ""}
              ranges={highlightCourtData}
            />
          </p>
        ) : (
          <p className="text-gray-700 text-xs relative z-2">
            {court?.description}
          </p>
        )}
        {loading && (
          <>
            <div className="h-2 animate-pulse bg-gray-200 rounded-full max-w-[360px] mt-2 mb-2.5" />
            <div className="h-2 animate-pulse bg-gray-200 rounded-full max-w-[360px] mb-2.5" />
            <div className="h-2 animate-pulse bg-gray-200 rounded-full max-w-[360px] mb-2.5" />
            <div className="h-2 animate-pulse bg-gray-200 rounded-full max-w-[360px] mb-2.5" />
          </>
        )}
        {details && (
          <div className="mt-4">
            <p className="text-gray-600 text-xs relative z-2">
              <span className="font-bold">Adres:</span> {court?.address}
            </p>
            <p className="text-gray-600 text-xs relative z-2">
              <span className="font-bold">Telefon:</span> {court?.phone}
            </p>
            <p className="text-gray-600 text-xs relative z-2">
              <span className="font-bold">Email:</span> {court?.email}
            </p>
            <p className="text-gray-600 text-xs relative z-2">
              <span className="font-bold">WWW:</span>{" "}
              <a
                href={court?.website || "#"}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {court?.website}
              </a>
            </p>
            <Link href={`/wyszukuwarka-sadow/sad/${court?.id}`}>
              <button className="text-xs mt-6 text-blue-600">
                <span className="font-bold">Ustaw ten sąd jako główny</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

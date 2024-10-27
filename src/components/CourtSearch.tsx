"use client";

import { useEffect, useState } from "react";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import { CourtSearchBar } from "@/components/CourtSearchBar";

export const CourtSearch = () => {
  const [districtCourtSearchParams, setDistrictCourtSearchParams] =
    useState<SearchResult<RawResult>>();
  const [geoSearchResults, setGeoSearchResults] = useState<
    SearchResult<RawResult>[]
  >([]);

  useEffect(() => {
    console.log("districtCourtSearchParams", districtCourtSearchParams);
    if (districtCourtSearchParams) {
      fetch("/api/search-district-court", {
        method: "POST",
        body: JSON.stringify(districtCourtSearchParams),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  }, [districtCourtSearchParams]);

  return (
    <>
      <div className="flex justify-center mt-2">
        <div className="text-center rounded-lg p-6 w-full md:w-[80%]">
          <h1 className="text-3xl font-bold text-gray-800 mb-9">
            Wyszukiwarka Sądów Właściwych
          </h1>
          <CourtSearchBar
            geoSearchResults={geoSearchResults}
            setGeoSearchResults={setGeoSearchResults}
            districtCourtSearchParams={districtCourtSearchParams}
            setDistrictCourtSearchParams={setDistrictCourtSearchParams}
          />
        </div>
      </div>
      {/* {!!searchParams && (
        <>
          <p className="text-center text-gray-600 font-bold">
            Wybierz sąd rejonowy.
          </p>
          <p className="text-center text-gray-600 mx-3">
            Po kliknięciu w odpowiedni sąd zobaczysz strukturę sądów wchodzących
            w jego skład,
            <br />
            począwszy od sądu rejonowego, poprzez sąd okręgowy, aż do sądu
            apelacyjnego.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
            {districtCourtFiltered.map(
              ({ item, highlightCourtData, highlightCourtName }) => (
                <Link
                  key={item.name}
                  href={`/wyszukuwarka-sadow/sad/${safeEncodeUrl(item.name)}`}
                >
                  <Court
                    court={item}
                    highlightCourtData={highlightCourtData}
                    highlightCourtName={highlightCourtName}
                  />
                </Link>
              )
            )}
          </div>
        </>
      )}
      {!searchParams && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4 mx-auto">
          {courtsData.map((item) => (
            <Link
              key={item.name}
              href={`/wyszukuwarka-sadow/sad/${safeEncodeUrl(item.name)}`}
            >
              <Court court={item} />
            </Link>
          ))}
        </div>
      )} */}
    </>
  );
};

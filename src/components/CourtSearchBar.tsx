"use client";

import clsx from "clsx";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { useState } from "react";

const geoSearchProvider = new OpenStreetMapProvider({
  params: {
    "accept-language": "pl",
    countrycodes: "pl",
    format: "geojson",
    addressdetails: 1,
  },
});

export const CourtSearchBar = ({
  setGeoSearchResults,
  geoSearchResults,
  districtCourtSearchParams,
  setDistrictCourtSearchParams,
}: {
  setGeoSearchResults: (results: SearchResult<RawResult>[]) => void;
  geoSearchResults: SearchResult<RawResult>[];
  districtCourtSearchParams: SearchResult<RawResult> | undefined;
  setDistrictCourtSearchParams: (
    searchParams: SearchResult<RawResult> | undefined
  ) => void;
}) => {
  const [geoSearchString, setGeoSearchString] = useState("");

  const handleSearchUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeoSearchString(e.target.value);
    if (geoSearchResults) {
      setGeoSearchResults([]);
      setDistrictCourtSearchParams(undefined);
    }
  };

  const handleReset = async () => {
    setDistrictCourtSearchParams(undefined);
    setGeoSearchResults([]);
    setGeoSearchString("");
  };

  const handleSearch = async () => {
    const geoSearchResultsTemp = await geoSearchProvider.search({
      query: geoSearchString,
    });
    setGeoSearchResults(geoSearchResultsTemp);
    if (geoSearchResultsTemp.length > 0) {
      setDistrictCourtSearchParams(geoSearchResultsTemp[0]);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <input
          value={geoSearchString}
          onChange={handleSearchUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          type="text"
          placeholder="Szukaj (kod pocztowy, adres, miejscowość, etc)"
          className="w-full border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring focus:ring-blue-500 size-lg"
        />
        <button
          className="bg-blue-500 w-full md:w-auto mt-2 md:mt-0 text-white rounded-lg px-6 py-4 ml-0 md:ml-2"
          onClick={handleSearch}
        >
          Szukaj
        </button>
        <button
          className="bg-red-500 w-full md:w-auto text-white mt-2 md:mt-0  ml-0 md:ml-2 rounded-lg px-6 py-4 ml-2"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      {geoSearchResults.length > 0 && (
        <div className="my-8 text-gray-500">
          <p className="mb-8 font-bold">
            Znaleziono {geoSearchResults.length} miejsc.
          </p>
          <div className="flex flex-col">
            {geoSearchResults.map((result) => {
              return (
                <button
                  key={result.raw.place_id}
                  className={clsx(
                    "w-full p-2 border hover:bg-gray-100 rounded-lg mb-2 text-sm text-center",
                    result.raw.place_id ===
                      districtCourtSearchParams?.raw.place_id &&
                      "border-blue-400 text-blue-400 font-bold"
                  )}
                  onClick={() => {
                    setDistrictCourtSearchParams(result);
                  }}
                >
                  {result.raw.display_name.replace(/, Polska$/, "")}
                  <br />
                </button>
              );
            })}
            <p className="mt-8 font-bold">
              Wybierz sąd rejonowy aby zobaczyć strukturę.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

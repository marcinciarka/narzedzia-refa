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
    layer: "address",
    dedupe: 1,
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
          className="input input-bordered w-full size-lg"
        />
        <button
          className="btn btn-primary w-full md:w-auto mt-2 md:mt-0 px-6 py-4 ml-0 md:ml-2"
          onClick={handleSearch}
        >
          Szukaj
        </button>
        <button
          className="btn btn-ghost w-full md:w-auto mt-2 md:mt-0  ml-0 md:ml-2 px-6 py-4 ml-2"
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
              const selected =
                result.raw.place_id === districtCourtSearchParams?.raw.place_id;
              return (
                <button
                  key={result.raw.place_id}
                  className={clsx("w-full btn p-2 mb-2 text-center", {
                    [""]: !selected,
                    ["btn-accent font-bold"]: selected,
                  })}
                  onClick={() => {
                    setDistrictCourtSearchParams(result);
                  }}
                >
                  {result.raw.display_name.replace(/, Polska$/, "")} <br />
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

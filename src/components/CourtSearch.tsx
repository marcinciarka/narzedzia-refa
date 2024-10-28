"use client";

import { useEffect, useState } from "react";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import { CourtSearchBar } from "@/components/CourtSearchBar";
import { Court as CourtType } from "@/types/db";
import { safeEncodeUrl } from "@/app/handlers/urlEncodersDecoders";
import Link from "next/link";
import { Court } from "@/components/Court";

export const CourtSearch = () => {
  const [districtCourtSearchParams, setDistrictCourtSearchParams] =
    useState<SearchResult<RawResult>>();
  const [geoSearchResults, setGeoSearchResults] = useState<
    SearchResult<RawResult>[]
  >([]);
  const [districtCourtSearchResults, setDistrictCourtSearchResults] =
    useState<CourtType[]>();

  useEffect(() => {
    if (districtCourtSearchParams) {
      fetch("/api/search-district-court", {
        method: "POST",
        body: JSON.stringify(districtCourtSearchParams),
      })
        .then((res) => res.json())
        .then(
          (data: {
            distructCourtSearchResults: CourtType[];
            searchTerms: string[];
          }) => {
            console.log("data", data);
            if (data.distructCourtSearchResults) {
              setDistrictCourtSearchResults(data.distructCourtSearchResults);
            }
          }
        );
    } else {
      setDistrictCourtSearchResults(undefined);
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
      {!!districtCourtSearchResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
          {districtCourtSearchResults.map((districtCourt) => (
            <Link
              key={districtCourt.name}
              href={`/wyszukuwarka-sadow/sad/${safeEncodeUrl(
                districtCourt.name
              )}`}
            >
              <Court court={districtCourt} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

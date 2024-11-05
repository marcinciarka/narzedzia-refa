"use client";

import { useEffect, useState } from "react";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import { CourtSearchBar } from "@/components/CourtSearchBar";
import { Court as CourtType } from "@/types/db";
import { safeEncodeUrl } from "@/app/handlers/urlEncodersDecoders";
import Link from "next/link";
import { Court } from "@/components/Court";
import { SearchDistrictCourtResult } from "@/types/search-district-court";

export const CourtSearch = () => {
  const [districtCourtSearchParams, setDistrictCourtSearchParams] =
    useState<SearchResult<RawResult>>();
  const [geoSearchResults, setGeoSearchResults] = useState<
    SearchResult<RawResult>[]
  >([]);
  const [districtCourtSearchResults, setDistrictCourtSearchResults] =
    useState<SearchDistrictCourtResult>();

  useEffect(() => {
    if (districtCourtSearchParams) {
      fetch("/api/search-district-court", {
        method: "POST",
        body: JSON.stringify(districtCourtSearchParams),
      })
        .then((res) => res.json())
        .then((data: SearchDistrictCourtResult) => {
          if (data) {
            setDistrictCourtSearchResults(data);
          }
        });
    } else {
      setDistrictCourtSearchResults(undefined);
    }
  }, [districtCourtSearchParams]);

  const updateDistrictCourtSearchParams = (
    searchParams?: SearchResult<RawResult>
  ) => {
    setDistrictCourtSearchResults(undefined);
    setDistrictCourtSearchParams(searchParams);
  };

  return (
    <>
      <div className="flex justify-center mt-2">
        <div className="text-center rounded-lg p-6 w-full md:w-[80%]">
          <h1 className="text-3xl font-bold text-gray-800 mb-9">
            Wyszukiwarka Sądów
          </h1>
          <CourtSearchBar
            geoSearchResults={geoSearchResults}
            setGeoSearchResults={setGeoSearchResults}
            districtCourtSearchParams={districtCourtSearchParams}
            setDistrictCourtSearchParams={updateDistrictCourtSearchParams}
          />
        </div>
      </div>
      {!!districtCourtSearchResults &&
        districtCourtSearchResults.districtCourts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
            {districtCourtSearchResults.districtCourts.map((districtCourt) => (
              <Link
                key={districtCourt.name}
                href={`/wyszukuwarka-sadow/sad/${safeEncodeUrl(
                  districtCourt.name
                )}`}
              >
                <Court
                  court={districtCourt as unknown as CourtType}
                  highlightCourtData={districtCourtSearchResults.descriptionHighlights?.[
                    districtCourt.id
                  ]?.flat()}
                  highlightCourtName={districtCourtSearchResults.nameHighlights?.[
                    districtCourt.id
                  ]?.flat()}
                />
              </Link>
            ))}
          </div>
        )}
    </>
  );
};

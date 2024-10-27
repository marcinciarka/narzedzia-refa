import { Court as CourtType } from "@/types/db";
import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { useMemo } from "react";

export const useDistrictFuzzySearch = ({
  courtsData,
  searchParams,
}: {
  courtsData: CourtType[];
  searchParams: SearchResult<RawResult> | undefined;
}) => {
  const searchParamsTyped = searchParams?.raw as unknown as {
    address: {
      city: string;
      town: string;
      suburb: string;
      administrative: string;
      city_district: string;
      municipality: string;
    };
  };
  const districtCourtBroadQueryText = useMemo(() => {
    if (!searchParamsTyped) {
      return "";
    }
    return (
      searchParamsTyped.address.city ??
      searchParamsTyped.address.town ??
      searchParamsTyped.address.suburb ??
      searchParamsTyped.address.administrative ??
      searchParamsTyped.address.city_district ??
      searchParamsTyped.address.municipality?.replace("gmina", "").trim()
    );
  }, [searchParamsTyped]);

  const districtCourtNarrowQueryText = useMemo(() => {
    if (!searchParamsTyped) {
      return "";
    }
    return (
      searchParamsTyped.address.municipality?.replace("gmina", "").trim() ??
      searchParamsTyped.address.city_district ??
      searchParamsTyped.address.administrative ??
      searchParamsTyped.address.suburb
    );
  }, [searchParamsTyped]);

  const districtCourtBroadDataFiltered = useFuzzySearchList({
    list: courtsData,
    queryText: districtCourtBroadQueryText,
    getText: (item) => [item.description],
    mapResultItem: ({ item, score, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
      score,
    }),
  });

  const districtCourtNarrowDataFiltered = useFuzzySearchList({
    list: courtsData,
    queryText: districtCourtNarrowQueryText,
    getText: (item) => [item.description],
    mapResultItem: ({ item, score, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
      score,
    }),
  });

  const districtCourtBroadNameFiltered = useFuzzySearchList({
    list: courtsData,
    queryText: districtCourtBroadQueryText,
    getText: (item) => [item.name],
    mapResultItem: ({ item, score, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
      score,
    }),
  });

  const districtCourtNarrowNameFiltered = useFuzzySearchList({
    list: courtsData,
    queryText: districtCourtNarrowQueryText,
    getText: (item) => [item.name],
    mapResultItem: ({ item, score, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
      score,
    }),
  });
  return {
    districtCourtBroadDataFiltered,
    districtCourtNarrowDataFiltered,
    districtCourtBroadNameFiltered,
    districtCourtNarrowNameFiltered,
  };
};

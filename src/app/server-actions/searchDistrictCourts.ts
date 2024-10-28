import { db } from "@/app/server-actions/db";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import { sql } from "kysely";
import createFuzzySearch, {
  FuzzyMatches,
  FuzzySearcher,
} from "@nozbe/microfuzz";

export const searchDistrictCourts = async ({
  searchParams,
}: {
  searchParams: SearchResult<RawResult>;
}) => {
  const typedAddressParams = searchParams.raw as unknown as {
    address: {
      [key: string]: string;
    };
  };
  const district = typedAddressParams.address.district;
  const subdistrict = typedAddressParams.address.subdistrict;
  const municipality = typedAddressParams.address.municipality
    ?.replace("gmina ", "")
    .trim();
  const city = typedAddressParams.address.city;
  const suburb = typedAddressParams.address.suburb;
  const quarter = typedAddressParams.address.quarter;
  const neighbourhood = typedAddressParams.address.neighbourhood;
  const town = typedAddressParams.address.town;
  const village = typedAddressParams.address.village;

  const searchLevelOne =
    district ||
    subdistrict ||
    municipality ||
    city ||
    suburb ||
    quarter ||
    neighbourhood ||
    town ||
    village;

  const searchTermLevelTwo =
    city || suburb || quarter || neighbourhood || town || village;

  const searchTermLevelThree =
    suburb || quarter || neighbourhood || town || village;

  const searchTerms = [
    ...new Set([searchLevelOne, searchTermLevelTwo, searchTermLevelThree]),
  ].filter(Boolean);

  try {
    const distructCourtSearchResults = await db
      .withSchema("public")
      .selectFrom("court")
      .selectAll()
      .where((eb) => eb("court.courttype", "=", "rejonowy"))
      .where(({ eb, or }) =>
        or([
          ...searchTerms.map((term) => eb("court.name", "@@", term)),
          ...searchTerms.map((term) => eb("court.description", "@@", term)),
          eb("court.name", "ilike", searchTerms[0]),
          eb("court.description", "ilike", searchTerms[0]),
        ])
      )
      .orderBy(
        // order search results by relevance
        sql`ts_rank_cd(to_tsvector(court.name || ' ' || court.description), to_tsquery(${searchTerms.join(
          " | "
        )})) DESC`
      )
      .execute();

    const descriptionHighlightsSearch = createFuzzySearch(
      distructCourtSearchResults,
      {
        key: "description",
      }
    );
    const nameHighlightsSearch = createFuzzySearch(distructCourtSearchResults, {
      key: "name",
    });

    const descriptionHighlightsRaw = searchTerms.map((term) =>
      descriptionHighlightsSearch(term)
    );
    const nameHighlightsRaw = searchTerms.map((term) =>
      nameHighlightsSearch(term)
    );

    const prepareHighlight = (test: typeof descriptionHighlightsRaw) => {
      return (
        test
          .reduce((acc, val) => acc.concat(val), [])
          .filter(({ score }) => score < 1)
          // map id: matches
          .reduce((acc, { item, matches }) => {
            acc[item.id] = matches;
            return acc;
          }, {} as Record<number, FuzzyMatches>)
      );
    };

    const descriptionHighlights = prepareHighlight(descriptionHighlightsRaw);
    const nameHighlights = prepareHighlight(nameHighlightsRaw);

    return {
      distructCourtSearchResults,
      descriptionHighlights,
      nameHighlights,
      searchTerms,
      error: false,
      message: "",
    };
  } catch (message) {
    return {
      distructCourtSearchResults: [],
      searchTerms,
      error: true,
      message,
    };
  }
};

export type SearchDistrictCourtsResponse = Awaited<
  ReturnType<typeof searchDistrictCourts>
>;

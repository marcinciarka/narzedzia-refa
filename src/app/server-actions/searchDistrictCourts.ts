import { db } from "@/app/server-actions/db";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import { sql } from "kysely";
import createFuzzySearch, { HighlightRanges } from "@nozbe/microfuzz";

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
  const state = typedAddressParams.address.state;

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
    village || town || neighbourhood || quarter || suburb || city;

  const searchTermLevelThree =
    suburb || quarter || neighbourhood || town || village;

  const searchTerms = [
    ...new Set([searchTermLevelThree, searchTermLevelTwo, searchLevelOne]),
  ].filter(Boolean);

  const courtSearchQuery = db
    .withSchema("public")
    .selectFrom("court")
    .selectAll()
    .where((eb) => eb("court.courttype", "=", "rejonowy"))
    .where((eb) => eb("court.state", "=", state.replace("województwo ", "")));

  try {
    const tsQuery = `ts_rank_cd(to_tsvector(court.description), to_tsquery("'${searchTerms.join(
      " | "
    )}'")) DESC`;
    const districtCourtStrictSearch = await courtSearchQuery
      .where(({ eb, or }) => {
        const searches = [
          ...searchTerms.map((term) =>
            eb("court.name", "@@", `to_tsquery("'${term}'")`)
          ),
          ...searchTerms.map((term) =>
            eb("court.description", "@@", `to_tsquery("'${term}'")`)
          ),
          ...searchTerms.map(
            (term) => eb("court.city", "@@", `to_tsquery("'${term}'")`),
            ...searchTerms.map((term) => eb("court.name", "ilike", term)),
            ...searchTerms.map((term) =>
              eb("court.description", "ilike", term)
            ),
            ...searchTerms.map((term) => eb("court.city", "ilike", term))
          ),
        ];
        return or([...searches]);
      })
      .orderBy(
        // order search results by relevance
        sql`${tsQuery}`
      )
      .execute();

    const districtCourts =
      districtCourtStrictSearch.length >= 1
        ? districtCourtStrictSearch
        : await courtSearchQuery
            .where(({ eb, or }) => {
              const searches = [
                ...searchTerms.map((term) =>
                  eb("court.description", "ilike", term)
                ),
                ...searchTerms.map((term) =>
                  eb("court.description", "@@", term)
                ),
              ];
              return or([...searches]);
            })
            .orderBy(
              // order search results by relevance
              sql`${tsQuery}`
            )
            .execute();

    const descriptionHighlightsSearch = createFuzzySearch(districtCourts, {
      key: "description",
    });
    const nameHighlightsSearch = createFuzzySearch(districtCourts, {
      key: "name",
    });

    const highlightTerms = searchTerms.map((term) => term.split(" ")).flat();

    const descriptionHighlightsRaw = highlightTerms.map((term) =>
      descriptionHighlightsSearch(`${term} `)
    );
    const nameHighlightsRaw = highlightTerms.map((term) =>
      nameHighlightsSearch(`${term} `)
    );

    const prepareHighlight = (searchResults: typeof descriptionHighlightsRaw) =>
      searchResults
        .reduce((acc, val) => acc.concat(val), [])
        .filter(({ score }) => score < 1.5 && score > 0.1)
        // map id: matches
        .reduce((acc, { item, matches }) => {
          acc[item.id] = matches as HighlightRanges[];
          return acc;
        }, {} as Record<number, HighlightRanges[]>);

    const descriptionHighlights = prepareHighlight(descriptionHighlightsRaw);
    const nameHighlights = prepareHighlight(nameHighlightsRaw);

    return {
      districtCourts,
      descriptionHighlights,
      nameHighlights,
      searchTerms,
      error: false,
      message: "",
    };
  } catch (message) {
    console.log("error", message);
    return {
      districtCourts: [],
      searchTerms,
      error: true,
      message,
    };
  }
};

export type SearchDistrictCourtsResponse = Awaited<
  ReturnType<typeof searchDistrictCourts>
>;

import { db } from "@/app/server-actions/db";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";

export const searchDistrictCourts = async ({
  searchParams,
}: {
  searchParams: SearchResult<RawResult>;
}) => {
  const _parsedDisplayName = searchParams.raw.display_name
    .replaceAll(",", "")
    .replaceAll("gmina", "")
    .replaceAll("powiat", "")
    .replaceAll("województwo", "")
    .replaceAll("Polska", "")
    .replace(/[^-a-złóżźćąęńZŁÓŻŹĆĄĘŃ ]/gi, "")
    .replaceAll(/  +/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 2)
    .join(" ");
  console.log("_parsedDisplayName", _parsedDisplayName);

  try {
    const courtsData = await db
      .withSchema("public")
      .selectFrom("court")
      .selectAll()
      .execute();

    return { courtsData, error: false, message: "" };
  } catch (message) {
    return {
      courtsData: [],
      error: true,
      message,
    };
  }
};

export type SearchDistrictCourtsResponse = Awaited<
  ReturnType<typeof searchDistrictCourts>
>;

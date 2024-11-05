import { searchDistrictCourts } from "@/app/server-actions/searchDistrictCourts";

export type SearchDistrictCourtResult = Awaited<
  ReturnType<typeof searchDistrictCourts>
>;

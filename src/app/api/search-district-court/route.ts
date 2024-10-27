import { searchDistrictCourts } from "@/app/server-actions/searchDistrictCourts";

export const revalidate = 60;

export async function POST(request: Request) {
  const searchParams = await request.json();
  const districtCourts = await searchDistrictCourts({
    searchParams,
  });

  return Response.json(districtCourts);
}

import { CourtSearchWrapper } from "@/components/CourtSearchWrapper";
import { getCourts } from "@/app/server-actions/getCourts";

export default async function CourtSearch() {
  const { courtsData, stats } = await getCourts();
  return (
    <CourtSearchWrapper
      districtCourts={courtsData.districtCourts}
      stats={stats}
    />
  );
}

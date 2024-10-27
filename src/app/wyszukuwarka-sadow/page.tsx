import { CourtSearchWrapper } from "@/components/CourtSearchWrapper";
import { getCourts } from "@/app/server-actions/getCourts";

export default async function CourtSearch() {
  const courtsData = await getCourts();
  return <CourtSearchWrapper courtsData={courtsData} />;
}

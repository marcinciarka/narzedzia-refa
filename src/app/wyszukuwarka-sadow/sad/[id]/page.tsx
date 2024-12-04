import { searchCourtsByDistrictCourt } from "@/app/server-actions/searchCourtsByDistrictCourt";
import { Court } from "@/components/Court";
import Link from "next/link";

type CourtPageProps = {
  params: {
    id: string;
  };
};

export default async function CourtPage(props: CourtPageProps) {
  const {
    districtCourt,
    regionalCourt,
    districtCourtsWithinRegion,
    appealCourt,
  } = await searchCourtsByDistrictCourt(Number(props.params.id));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
      <Court court={districtCourt} details />
      <div className="grid grid-cols-1 gap-4">
        <Court court={regionalCourt} details />
        <div className="text-center">
          ↓&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;↓
        </div>
        {districtCourtsWithinRegion.map((court) => (
          <Court
            key={court.name}
            court={court}
            details
            active={String(court.id) === props.params.id}
          />
        ))}
      </div>
      <Court court={appealCourt} details />
    </div>
  );
}

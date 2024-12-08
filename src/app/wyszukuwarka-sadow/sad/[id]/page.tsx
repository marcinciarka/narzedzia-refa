import { searchCourtsByDistrictCourt } from "@/app/server-actions/searchCourtsByDistrictCourt";
import { Court } from "@/components/Court";

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
        <Court court={districtCourt} details />
        <Court court={regionalCourt} details />
        <Court court={appealCourt} details />
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mt-6 mb-4">
          Sądy rejonowe w okręgu{" "}
          {regionalCourt.name
            .replace("Sąd", "Sądu")
            .replace("Okręgowy", "Okręgowego")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
        {districtCourtsWithinRegion.map((court) => (
          <Court
            key={court.name}
            court={court}
            details
            active={String(court.id) === props.params.id}
          />
        ))}
      </div>
    </div>
  );
}

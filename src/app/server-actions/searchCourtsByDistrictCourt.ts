import { db } from "@/app/server-actions/db";
import { Court } from "@/types/db";

export const searchCourtsByDistrictCourt = async (districtDourtId: number) => {
  const courtSearchQuery = db
    .withSchema("public")
    .selectFrom("court")
    .selectAll();

  const districtCourt = await courtSearchQuery
    .where((eb) => eb("id", "=", districtDourtId))
    .execute();
  if (districtCourt.length === 0) {
    throw new Error("District court not found");
  }
  const regionalCourt = await courtSearchQuery
    .where(({ eb, and }) =>
      and([
        eb("courttype", "=", "okregowy"),
        eb("district", "=", districtCourt[0].district),
      ])
    )
    .execute();
  const districtCourtsWithinRegion = await courtSearchQuery
    .where(({ eb, and }) =>
      and([
        eb("courttype", "=", "rejonowy"),
        eb("district", "=", districtCourt[0].district),
      ])
    )
    .execute();

  if (regionalCourt.length === 0) {
    throw new Error("Regional court not found");
  }

  const appealCourt = await courtSearchQuery
    .where(({ eb, and }) =>
      and([
        eb("courttype", "=", "apelacyjny"),
        eb("appeal", "=", districtCourt[0].appeal),
      ])
    )
    .execute();

  if (appealCourt.length === 0) {
    throw new Error("Appeal court not found");
  }
  return {
    districtCourt: districtCourt[0] as unknown as Court,
    regionalCourt: regionalCourt[0] as unknown as Court,
    districtCourtsWithinRegion:
      districtCourtsWithinRegion as unknown as Court[],
    appealCourt: appealCourt[0] as unknown as Court,
  };
};

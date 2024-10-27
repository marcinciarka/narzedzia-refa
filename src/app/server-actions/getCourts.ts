import { db } from "@/app/server-actions/db";

export const getCourts = async () => {
  try {
    const courtsData = await db
      .withSchema("public")
      .selectFrom("court")
      .selectAll()
      .execute();

    return courtsData;
  } catch (message) {
    return {
      courtsData: {
        districtCourts: [],
        regionalCourts: [],
        appealCourts: [],
      },
      stats: {},
      error: true,
      message,
    };
  }
};

export type GetCourtsResponse = Awaited<ReturnType<typeof getCourts>>;

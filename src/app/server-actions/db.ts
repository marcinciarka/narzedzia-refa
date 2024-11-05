import { Kysely } from "kysely";
import postgres from "postgres";
import { PostgresJSDialect } from "kysely-postgres-js";
import { DB } from "@/types/db";

if (!process.env.NARZEDZIA_REFA__URL_NON_POOLING) {
  throw new Error("NARZEDZIA_REFA__URL_NON_POOLING is not set");
}

const pg = postgres(process.env.NARZEDZIA_REFA__URL_NON_POOLING);
export const db = new Kysely<DB>({
  dialect: new PostgresJSDialect({
    postgres: pg,
  }),
});

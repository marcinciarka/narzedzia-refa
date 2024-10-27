import { Kysely } from "kysely";
import postgres from "postgres";
import { PostgresJSDialect } from "kysely-postgres-js";
import { DB } from "@/types/db";

if (!process.env.DATABASE_URL_NON_POOLING) {
  throw new Error("DATABASE_URL_NON_POOLING is not set");
}

const pg = postgres(process.env.DATABASE_URL_NON_POOLING);
export const db = new Kysely<DB>({
  dialect: new PostgresJSDialect({
    postgres: pg,
  }),
});

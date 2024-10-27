import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "@/types/db";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DATABASE_DATABASE,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: 5434,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});

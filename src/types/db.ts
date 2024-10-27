/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Courttype = "apelacyjny" | "okregowy" | "rejonowy";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Court {
  address: string | null;
  city: string | null;
  courttype: Courttype;
  description: string | null;
  email: string | null;
  id: Generated<number>;
  iscommercial: boolean | null;
  ismortgage: boolean | null;
  jurisdiction: number | null;
  name: string;
  phone: string | null;
  postalcode: string | null;
  website: string | null;
}

export interface DB {
  court: Court;
}

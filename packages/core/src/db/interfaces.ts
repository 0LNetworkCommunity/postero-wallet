import { Knex } from "knex";

export interface IDbService {
  db: Knex;

  raw<T>(value: Knex.Value): Knex.Raw<T>;
}

import { Knex } from "knex";

export interface IDbService {
  db: Knex;
}

import { Module } from "@nestjs/common";

import { Types } from "../types";
import DbService from "./DbService";

@Module({
  providers: [
    {
      provide: Types.IDbService,
      useClass: DbService,
    },
  ],
  exports: [Types.IDbService],
})
class DbModule {}

export default DbModule;

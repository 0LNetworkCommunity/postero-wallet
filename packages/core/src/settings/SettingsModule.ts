import { Module } from "@nestjs/common";

import SettingsResolver from "./SettingsResolver";
import { Types } from "../types";
import SettingsRepository from "./SettingsRepository";
import DbModule from "../db/DbModule";

@Module({
  imports: [DbModule],
  providers: [
    SettingsResolver,
    {
      provide: Types.ISettingsRepository,
      useClass: SettingsRepository,
    },
  ],
  exports: [],
})
class SettingsModule {}

export default SettingsModule;

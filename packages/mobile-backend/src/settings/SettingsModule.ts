import { Module } from "@nestjs/common";

import SettingsResolver from "./SettingsResolver";

@Module({
  providers: [SettingsResolver],
  exports: [],
})
class SettingsModule {}

export default SettingsModule;

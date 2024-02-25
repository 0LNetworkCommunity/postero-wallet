import process from "node:process";

import { Query, Resolver } from "@nestjs/graphql";
import { systemPreferences } from "electron";

import Settings from "./Settings";

const isMac = process.platform === "darwin";

@Resolver()
class SettingsResolver {
  @Query((returns) => Settings)
  public async settings() {
    const accentColor = isMac ? systemPreferences.getAccentColor() : "0000DD";

    const settings = new Settings();
    settings.init({ accentColor: `#${accentColor}` });

    return settings;
  }
}

export default SettingsResolver;

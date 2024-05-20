import Settings from "./Settings";

export interface ISettingsRepository {

  getSettings(): Promise<Settings>;
}

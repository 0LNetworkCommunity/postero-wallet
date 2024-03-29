import { systemPreferences } from "electron";

class ElectronLocalAuthenticationService {
  public async authenticate(): Promise<boolean> {
    try {
      await systemPreferences.promptTouchID("auth");
      return true;
    } catch (err) {}
    return false;
  }
}

export default ElectronLocalAuthenticationService;

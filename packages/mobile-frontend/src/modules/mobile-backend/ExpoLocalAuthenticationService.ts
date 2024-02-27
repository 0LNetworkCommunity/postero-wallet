import * as LocalAuthentication from "expo-local-authentication";

class ExpoLocalAuthenticationService {
  public async authenticate(): Promise<boolean> {
    const res = await LocalAuthentication.authenticateAsync();
    return res.success;
  }
}

export default ExpoLocalAuthenticationService;

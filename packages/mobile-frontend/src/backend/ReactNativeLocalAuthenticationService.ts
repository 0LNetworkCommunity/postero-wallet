import * as LocalAuthentication from "expo-local-authentication";

class ReactNativeLocalAuthenticationService {
  public async authenticate(): Promise<boolean> {
    const res = await LocalAuthentication.authenticateAsync();
    return res.success;
  }
}

export default ReactNativeLocalAuthenticationService;

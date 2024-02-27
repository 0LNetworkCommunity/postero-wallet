import { PlatformTypes } from "@postero/mobile-backend";
import ExpoCryptoService from "./ExpoCryptoService";
import ExpoSqliteService from "./ExpoSqliteService";
import ExpoEncryptedStoreService from "./ExpoEncryptedStoreService";
import ExpoLocalAuthenticationService from "./ExpoLocalAuthenticationService";

const ExpoPlatformModule = {
  providers: [
    {
      provide: PlatformTypes.CryptoService,
      useClass: ExpoCryptoService,
    },
    {
      provide: PlatformTypes.SqliteService,
      useClass: ExpoSqliteService,
    },
    {
      provide: PlatformTypes.EncryptedStoreService,
      useClass: ExpoEncryptedStoreService,
    },
    {
      provide: PlatformTypes.LocalAuthenticationService,
      useClass: ExpoLocalAuthenticationService,
    },
  ],
  exports: [
    PlatformTypes.SqliteService,
    PlatformTypes.CryptoService,
    PlatformTypes.EncryptedStoreService,
    PlatformTypes.LocalAuthenticationService,
  ],
};

export default ExpoPlatformModule;

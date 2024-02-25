import { PlatformTypes } from "@postero/mobile-backend";
import ExpoCryptoService from "./ExpoCryptoService";
import ExpoSqliteService from "./ExpoSqliteService";
import ExpoEncryptedStoreService from "./ExpoEncryptedStoreService";

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
  ],
  exports: [
    PlatformTypes.SqliteService,
    PlatformTypes.CryptoService,
    PlatformTypes.EncryptedStoreService,
  ],
};

export default ExpoPlatformModule;

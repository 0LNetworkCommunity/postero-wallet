import { Scope } from "@nestjs/common";

import { PlatformTypes } from "@postero/mobile-backend";

// import ElectronCryptoService from "./ElectronCryptoService";
// import ElectronSqliteService from "./ElectronSqliteService";
// import ElectronEncryptedStoreService from "./ElectronEncryptedStoreService";
// import ElectronLocalAuthenticationService from "./ElectronLocalAuthenticationService";
import ElectronWindowManagerService from "./window-manager/ElectronWindowManagerService";
import { Types } from "../types";
import ElectronWindow from "./window-manager/ElectronWindow";
import ElectronBrowserBridge from "./browser-link/ElectronBrowserBridge";
import ElectronBrowserLinkService from "./browser-link/ElectronBrowserLinkService";

const ElectronPlatformModule = {
  providers: [
    // {
    //   provide: PlatformTypes.CryptoService,
    //   useClass: ElectronCryptoService,
    // },
    // {
    //   provide: PlatformTypes.SqliteService,
    //   useClass: ElectronSqliteService,
    // },
    // {
    //   provide: PlatformTypes.EncryptedStoreService,
    //   useClass: ElectronEncryptedStoreService,
    // },
    // {
    //   provide: PlatformTypes.LocalAuthenticationService,
    //   useClass: ElectronLocalAuthenticationService,
    // },
    {
      provide: PlatformTypes.PlatformWindowManagerService,
      useClass: ElectronWindowManagerService,
    },
    {
      provide: Types.IWindow,
      useClass: ElectronWindow,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.IBrowserBridge,
      useClass: ElectronBrowserBridge,
      scope: Scope.TRANSIENT,
    },
    {
      provide: PlatformTypes.BrowserLinkService,
      useClass: ElectronBrowserLinkService,
    },
  ],
  exports: [
    // PlatformTypes.SqliteService,
    // PlatformTypes.CryptoService,
    // PlatformTypes.EncryptedStoreService,
    // PlatformTypes.LocalAuthenticationService,
    PlatformTypes.PlatformWindowManagerService,
    PlatformTypes.BrowserLinkService,
  ],
};

export default ElectronPlatformModule;

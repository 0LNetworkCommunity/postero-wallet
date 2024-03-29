import { Scope } from "@nestjs/common";

import { PlatformTypes } from "@postero/mobile-backend";

import ElectronCryptoService from "./ElectronCryptoService";
import ElectronSqliteService from "./ElectronSqliteService";
import ElectronEncryptedStoreService from "./ElectronEncryptedStoreService";
import ElectronLocalAuthenticationService from "./ElectronLocalAuthenticationService";
import ElectronWindowManagerService from "./window-manager/ElectronWindowManagerService";
import ElectronWindow from "./window-manager/ElectronWindow";
import ElectronBrowserBridge from "./browser-link/ElectronBrowserBridge";
import ElectronBrowserLinkService from "./browser-link/ElectronBrowserLinkService";
import ElectronSvgCleanerService from "./ElectronSvgCleanerService";

const ElectronPlatformModule = {
  providers: [
    {
      provide: PlatformTypes.CryptoService,
      useClass: ElectronCryptoService,
    },
    {
      provide: PlatformTypes.SqliteService,
      useClass: ElectronSqliteService,
    },
    {
      provide: PlatformTypes.EncryptedStoreService,
      useClass: ElectronEncryptedStoreService,
    },
    {
      provide: PlatformTypes.LocalAuthenticationService,
      useClass: ElectronLocalAuthenticationService,
    },
    {
      provide: PlatformTypes.PlatformWindowManagerService,
      useClass: ElectronWindowManagerService,
    },
    {
      provide: PlatformTypes.Window,
      useClass: ElectronWindow,
      scope: Scope.TRANSIENT,
    },
    {
      provide: PlatformTypes.BrowserBridge,
      useClass: ElectronBrowserBridge,
      scope: Scope.TRANSIENT,
    },
    {
      provide: PlatformTypes.BrowserLinkService,
      useClass: ElectronBrowserLinkService,
    },
    {
      provide: PlatformTypes.SvgCleanerService,
      useClass: ElectronSvgCleanerService,
    },
  ],
  exports: [
    PlatformTypes.SqliteService,
    PlatformTypes.CryptoService,
    PlatformTypes.EncryptedStoreService,
    PlatformTypes.LocalAuthenticationService,
    PlatformTypes.PlatformWindowManagerService,
    PlatformTypes.BrowserLinkService,
    PlatformTypes.SvgCleanerService,
  ],
};

export default ElectronPlatformModule;

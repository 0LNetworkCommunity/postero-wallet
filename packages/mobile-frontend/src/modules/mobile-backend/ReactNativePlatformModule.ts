import { Scope } from "@nestjs/common";

import { PlatformTypes } from "@postero/mobile-backend";

import ReactNativeCryptoService from "./ReactNativeCryptoService";
import ReactNativeSqliteService from "./ReactNativeSqliteService";
import ReactNativeEncryptedStoreService from "./ReactNativeEncryptedStoreService";
import ReactNativeLocalAuthenticationService from "./ReactNativeLocalAuthenticationService";
import ReactNativeWindowManagerService from "./ReactNativeWindowManagerService";
import ReactNativeWindow from "./ReactNativeWindow";
import ReactNativeBrowserBridge from "./browser-link/ReactNativeBrowserBridge";
import ReactNativeBrowserLinkService from "./browser-link/ReactNativeBrowserLinkService";
import ReactNativeSvgCleanerService from "./ReactNativeSvgCleanerService";

const ReactNativePlatformModule = {
  providers: [
    {
      provide: PlatformTypes.CryptoService,
      useClass: ReactNativeCryptoService,
    },
    {
      provide: PlatformTypes.SqliteService,
      useClass: ReactNativeSqliteService,
    },
    {
      provide: PlatformTypes.EncryptedStoreService,
      useClass: ReactNativeEncryptedStoreService,
    },
    {
      provide: PlatformTypes.LocalAuthenticationService,
      useClass: ReactNativeLocalAuthenticationService,
    },
    {
      provide: PlatformTypes.PlatformWindowManagerService,
      useClass: ReactNativeWindowManagerService,
    },
    {
      provide: PlatformTypes.Window,
      useClass: ReactNativeWindow,
      scope: Scope.TRANSIENT,
    },
    {
      provide: PlatformTypes.BrowserBridge,
      useClass: ReactNativeBrowserBridge,
      scope: Scope.TRANSIENT,
    },
    {
      provide: PlatformTypes.BrowserLinkService,
      useClass: ReactNativeBrowserLinkService,
    },
    {
      provide: PlatformTypes.SvgCleanerService,
      useClass: ReactNativeSvgCleanerService,
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

export default ReactNativePlatformModule;

import { Scope } from "@nestjs/common";

import { PlatformTypes } from "@postero/mobile-backend";

import ReactNativeCryptoService from "./ReactNativeCryptoService";
import ReactNativeSqliteService from "./ReactNativeSqliteService";
import ReactNativeEncryptedStoreService from "./ReactNativeEncryptedStoreService";
import ReactNativeLocalAuthenticationService from "./ReactNativeLocalAuthenticationService";
import ReactNativeWindowManagerService from "./ReactNativeWindowManagerService";
import ReactNativeIpcService from "./ReactNativeIpcService";
import ReactNativeWindow from "./ReactNativeWindow";

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
      provide: PlatformTypes.WindowManagerService,
      useClass: ReactNativeWindowManagerService,
    },
    {
      provide: PlatformTypes.IpcService,
      useClass: ReactNativeIpcService,
    },
    {
      provide: PlatformTypes.Window,
      useClass: ReactNativeWindow,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [
    PlatformTypes.SqliteService,
    PlatformTypes.CryptoService,
    PlatformTypes.EncryptedStoreService,
    PlatformTypes.LocalAuthenticationService,
    PlatformTypes.WindowManagerService,
    PlatformTypes.IpcService,
  ],
};

export default ReactNativePlatformModule;

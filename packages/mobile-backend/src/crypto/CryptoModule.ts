import { Module } from "@nestjs/common";

import { Types } from "../types";
import CryptoService from "./CryptoService";

@Module({
  providers: [
    {
      provide: Types.ICryptoService,
      useClass: CryptoService,
    },
  ],
  exports: [Types.ICryptoService],
})
class CryptoModule {}

export default CryptoModule;

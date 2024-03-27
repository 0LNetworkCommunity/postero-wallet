import { Module, Scope } from "@nestjs/common";
import DbModule from "../db/DbModule";
import MovementsResolver from "./MovementsResolver";
import { Types } from "../types";
import MovementsService from "./MovementsService";
import MovementFactory from "./MovementFactory";
import Movement from "./Movement";
import MovementsRepository from "./MovementsRepository";

@Module({
  imports: [
    DbModule,
  ],
  providers: [
    MovementsResolver,
    {
      provide: Types.IMovement,
      useClass: Movement,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.IMovementFactory,
      useClass: MovementFactory,
    },
    {
      provide: Types.IMovementsRepository,
      useClass: MovementsRepository,
    },
    {
      provide: Types.IMovementsService,
      useClass: MovementsService,
    },
  ],
  exports: [Types.IMovementsService],
})
class MovementsModule {}

export default MovementsModule;
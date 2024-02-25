import { Args, ID, Query, Resolver, Subscription } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { Repeater } from "@repeaterjs/repeater";

import { DAppServiceEvent, IDApp, IDAppService } from "./interfaces";
import { Types } from "../types";
import DApp from "./DApp";

@Resolver((of) => DApp)
class DAppsResolver {
  @Inject(Types.IDAppService)
  private readonly dAppsService: IDAppService;

  @Query((returns) => DApp)
  public dApp(
    @Args("id", { type: () => ID })
    id: string,
  ) {
    return this.dAppsService.getDApp(id);
  }

  @Query((returns) => [DApp])
  public dApps() {
    return this.dAppsService.getDApps();
  }

  @Subscription((returns) => DApp)
  public newDApp() {
    return new Repeater(async (push, stop) => {
      const release = this.dAppsService.on(
        DAppServiceEvent.NewDApp,
        async (dApp: IDApp) => {
          push({
            newDApp: dApp,
          });
        },
      );
      await stop;
      release();
    });
  }
}

export default DAppsResolver;

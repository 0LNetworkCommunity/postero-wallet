import { Args, ID, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { Repeater } from "@repeaterjs/repeater";

import {
  DAppServiceEvent,
  IConnectionRequest,
  IDAppService,
} from "./interfaces";
import ConnectionRequest from "./ConnectionRequest";
import { Types } from "../types";

@Resolver((of) => ConnectionRequest)
class ConnectionRequestsResolver {
  @Inject(Types.IDAppService)
  private readonly dAppsService: IDAppService;

  @Mutation(() => Boolean)
  public async approveConnectionRequest(
    @Args("connectionRequestId", { type: () => ID })
    connectionRequestId: string,

    @Args("walletAddress", { type: () => String })
    walletAddress: string,
  ) {
    return this.dAppsService.approveConnectionRequest(
      connectionRequestId,
      Buffer.from(walletAddress, 'hex'),
    );
  }

  @Mutation(() => Boolean)
  public async denyConnectionRequest(
    @Args("connectionRequestId", { type: () => ID })
    connectionRequestId: string,
  ) {
    return this.dAppsService.denyConnectionRequest(connectionRequestId);
  }

  @Subscription((returns) => ConnectionRequest)
  public newConnectionRequest(
    @Args("dAppId", { type: () => ID, nullable: true }) dAppId: string,
  ) {
    return new Repeater(async (push, stop) => {
      const release = this.dAppsService.on(
        DAppServiceEvent.ConnectionRequest,
        async (connectionRequest: IConnectionRequest) => {
          if (connectionRequest.dApp.id === dAppId) {
            push({
              newConnectionRequest: connectionRequest,
            });
          }
        },
      );
      await stop;
      release();
    });
  }

  @Subscription((returns) => String)
  public connectionRequestRemoved() {
    return new Repeater(async (push, stop) => {
      const release = this.dAppsService.on(
        DAppServiceEvent.ConnectionRequestRemoved,
        async (connectionRequestId: string) => {
          push({
            connectionRequestRemoved: connectionRequestId,
          });
        },
      );
      await stop;
      release();
    });
  }
}

export default ConnectionRequestsResolver;

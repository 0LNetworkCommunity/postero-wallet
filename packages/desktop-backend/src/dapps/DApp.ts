import * as uuid from "uuid";
import Emittery, { UnsubscribeFn } from "emittery";
import { Inject } from "@nestjs/common";
import { Field, ID, ObjectType } from "@nestjs/graphql";

import {
  DAppEntity,
  IConnectionRequest,
  IConnectionRequestFactory,
  IDApp,
  DAppEvent,
  DAppStatus,
  IDAppService,
  ConnectionRequestEvent,
} from "./interfaces";
import { IBrowserTab } from "../rpc/interfaces";
import { Types } from "../types";
import ConnectionRequest from "./ConnectionRequest";

@ObjectType("DApp")
class DApp implements IDApp {
  @Field((type) => ID)
  public id: string;

  @Field()
  public name: string;

  @Field()
  public host: string;

  @Field({ nullable: true })
  public description?: string;

  @Field({ nullable: true })
  public icon?: Buffer;

  @Field((type) => DAppStatus)
  public status: DAppStatus;

  @Field((type) => [ConnectionRequest])
  public readonly connectionRequests: IConnectionRequest[] = [];

  @Inject(Types.IConnectionRequestFactory)
  private readonly connectionRequestFactory!: IConnectionRequestFactory;

  @Inject(Types.IDAppService)
  private readonly dAppService: IDAppService;

  private readonly eventEmitter = new Emittery();

  public init(entity: DAppEntity) {
    this.id = `${entity.id}`;
    this.name = entity.name;
    this.host = entity.host;
    this.description = entity.description;
    this.icon = entity.icon;
    this.status = DAppStatus.Unknown;
  }

  public async connect(browserTab: IBrowserTab): Promise<IConnectionRequest> {
    const connectionRequest =
      await this.connectionRequestFactory.getConnectionRequest(
        uuid.v4(),
        browserTab,
        this,
      );
    this.connectionRequests.push(connectionRequest);

    this.eventEmitter.emit(DAppEvent.ConnectionRequest, connectionRequest);
    this.dAppService.onConnectionRequest(connectionRequest);

    connectionRequest.notify();

    const onFullfiled = () => {
      const index = this.connectionRequests.indexOf(connectionRequest);
      if (index !== -1) {
        this.connectionRequests.splice(index, 1);
      }
    };

    connectionRequest.on(ConnectionRequestEvent.Approve, onFullfiled);
    connectionRequest.on(ConnectionRequestEvent.Deny, onFullfiled);
    connectionRequest.on(ConnectionRequestEvent.Cancel, onFullfiled);

    return connectionRequest;
  }

  public on(
    event: DAppEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.on(event, listener);
  }
}

export default DApp;

import { Notification } from "electron";
import Emittery, { UnsubscribeFn } from "emittery";
import { Field, ID, ObjectType } from "@nestjs/graphql";

import { ConnectionRequestEvent, IConnectionRequest, IDApp } from "./interfaces";
import { IBrowserTab } from "../rpc/interfaces";
import Wallet from "../crypto/Wallet";

@ObjectType("ConnectionRequest")
class ConnectionRequest implements IConnectionRequest {
  @Field((type) => ID)
  public id!: string;

  @Field((type) => Date)
  public createdAt!: Date;

  public browserTab!: IBrowserTab;

  public dApp!: IDApp;

  private promise: Promise<Wallet | null>;

  private readonly eventEmitter = new Emittery();

  private promiseResolver: {
    resolve: (res: Wallet | null) => void;
    reject: (error: Error) => void;
  };

  public init(id: string, browserTab: IBrowserTab, dApp: IDApp) {
    this.id = id;
    this.browserTab = browserTab;
    this.dApp = dApp;
    this.createdAt = new Date();
    this.promise = new Promise((resolve, reject) => {
      this.promiseResolver = { resolve, reject };
    });
  }

  public wait(): Promise<Wallet | null> {
    return this.promise;
  }

  public notify() {
    new Notification({
      title: `Connect ${this.dApp.name}`,
    }).show();
  }

  public async approve(wallet: Wallet): Promise<void> {
    this.promiseResolver.resolve(wallet);
    try {
      await this.eventEmitter.emit(ConnectionRequestEvent.Approve);
    } finally {
      this.eventEmitter.clearListeners();
    }
  }

  public async deny(): Promise<void> {
    this.promiseResolver.resolve(null);

    try {
      await this.eventEmitter.emit(ConnectionRequestEvent.Deny);
    } finally {
      this.eventEmitter.clearListeners();
    }
  }

  public async cancel(): Promise<void> {
    this.promiseResolver.resolve(null);

    try {
      await this.eventEmitter.emit(ConnectionRequestEvent.Cancel);
    } finally {
      this.eventEmitter.clearListeners();
    }
  }

  public on(
    event: ConnectionRequestEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }
}

export default ConnectionRequest;

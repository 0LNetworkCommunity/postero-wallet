import { Injectable, Inject } from "@nestjs/common";
import Emittery, { UnsubscribeFn } from "emittery";
import urlMetadata from "url-metadata";
import axios from "axios";

import {
  ConnectionRequestEvent,
  DAppMetadata,
  DAppServiceEvent,
  IConnectionRequest,
  IDApp,
  IDAppInstance,
  IDAppInstanceFactory,
  IDAppRepository,
  IDAppService,
} from "./interfaces";
import { IWalletService } from "../wallets/interfaces";
import { Types } from "../types";
import { PlatformSvgCleanerService } from "../platform/interfaces";
import { PlatformTypes } from "../platform/platform-types";

@Injectable()
class DAppService implements IDAppService {
  private readonly dAppInstances = new Set<IDAppInstance>();

  private readonly connectionRequests = new Map<string, IConnectionRequest>();

  private eventEmitter = new Emittery();

  @Inject(Types.IDAppRepository)
  private readonly dAppRepository!: IDAppRepository;

  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @Inject(Types.IDAppInstanceFactory)
  private readonly dAppInstanceFactory!: IDAppInstanceFactory;

  @Inject(PlatformTypes.SvgCleanerService)
  private readonly platformSvgCleanerService!: PlatformSvgCleanerService;

  public isDAppConnected(dApp: IDApp): boolean {
    for (const dAppInstance of this.dAppInstances.values()) {
      if (dAppInstance.dApp.id === dApp.id) {
        return true;
      }
    }
    return false;
  }

  public getDApp(id: string): Promise<IDApp | null> {
    return this.dAppRepository.getDApp(id);
  }

  public getDApps(): Promise<IDApp[]> {
    return this.dAppRepository.getDApps();
  }

  public getDAppsById(ids: string[]): Promise<IDApp[]> {
    return this.dAppRepository.getDAppsById(ids);
  }

  public async registerDAppInstance(
    dAppInstance: IDAppInstance,
  ): Promise<void> {
    const isDappConnected = this.isDAppConnected(dAppInstance.dApp);

    this.dAppInstances.add(dAppInstance);
    dAppInstance.onDeactivate((dAppInstance: IDAppInstance) =>
      this.onDAppInstanceDeactivate(dAppInstance),
    );

    if (!isDappConnected) {
      this.eventEmitter.emit(
        DAppServiceEvent.DAppStatusChange,
        dAppInstance.dApp,
      );
    }
  }

  public on(
    event: DAppServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }

  public async getDAppInstance(url: string): Promise<IDAppInstance> {
    const dApp = await this.getOrCreateDApp(url);

    const dAppInstance = await this.dAppInstanceFactory.getDAppInstance(dApp);
    this.registerDAppInstance(dAppInstance);

    return dAppInstance;
  }

  public async getOrCreateDApp(url: string): Promise<IDApp> {
    const appUrl = new URL(url);
    const host = appUrl.host;

    let dApp = await this.dAppRepository.getDAppFromHost(host);
    if (!dApp) {
      const metadata = await this.getAppMetadata(host);
      dApp = await this.dAppRepository.saveDApp(host, metadata);
      this.eventEmitter.emit(DAppServiceEvent.NewDApp, dApp);
    }
    return dApp;
  }

  public onConnectionRequest(connectionRequest: IConnectionRequest) {
    this.connectionRequests.set(connectionRequest.id, connectionRequest);
    this.eventEmitter.emit(
      DAppServiceEvent.ConnectionRequest,
      connectionRequest,
    );

    const onFullfiled = () => {
      this.connectionRequests.delete(connectionRequest.id);
      this.eventEmitter.emit(
        DAppServiceEvent.ConnectionRequestRemoved,
        connectionRequest.id,
      );
    };

    connectionRequest.on(ConnectionRequestEvent.Approve, onFullfiled);
    connectionRequest.on(ConnectionRequestEvent.Deny, onFullfiled);
    connectionRequest.on(ConnectionRequestEvent.Cancel, onFullfiled);
  }

  public async approveConnectionRequest(
    connectionRequestId: string,
    walletId: string,
  ): Promise<boolean> {
    const connectionRequest = this.connectionRequests.get(connectionRequestId);
    if (!connectionRequest) {
      return false;
    }

    const wallet = await this.walletService.getWallet(walletId);
    if (!wallet) {
      return false;
    }
    connectionRequest.approve(wallet);
    return true;
  }

  public async denyConnectionRequest(
    connectionRequestId: string,
  ): Promise<boolean> {
    const connectionRequest = this.connectionRequests.get(connectionRequestId);
    if (!connectionRequest) {
      return false;
    }
    connectionRequest.deny();
    return true;
  }

  private onDAppInstanceDeactivate(dAppInstance: IDAppInstance) {
    if (!this.dAppInstances.delete(dAppInstance)) {
      throw new Error("dAppInstance not found is DAppService");
    }
    if (!this.isDAppConnected(dAppInstance.dApp)) {
      this.eventEmitter.emit(
        DAppServiceEvent.DAppStatusChange,
        dAppInstance.dApp,
      );
    }
  }

  private async getAppMetadata(host: string): Promise<DAppMetadata> {
    const metadata = await urlMetadata(`http://${host}`, {
      includeResponseBody: true,
    });

    const ogUrl = metadata["og:url"] as string;
    const ogTitle = metadata["og:title"] as string;
    const ogDescription = metadata["og:description"] as string;
    const ogImage = metadata["og:image"] as string;

    const res = await axios({
      method: "GET",
      url: ogImage,
    });
    const icon = this.platformSvgCleanerService.clean(res.data);

    return {
      url: ogUrl,
      name: ogTitle,
      description: ogDescription,
      icon: Buffer.from(icon),
    };
  }
}

export default DAppService;

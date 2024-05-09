import { Injectable } from "@nestjs/common";
import { ApiError, AptosClient, Types } from "aptos";

import { IOpenLibraService } from "./interfaces";
import { normalizeAddress } from "../utils";

@Injectable()
class OpenLibraService implements IOpenLibraService {
  private aptosClient: AptosClient;

  public constructor() {
    this.aptosClient = new AptosClient("https://rpc.0l.fyi");
  }

  public async getOriginatingAddress(
    authenticationKey: Uint8Array,
  ): Promise<Uint8Array> {
    try {
      const res = (await this.aptosClient.view({
        function: "0x1::account::get_originating_address",
        type_arguments: [],
        arguments: [`0x${Buffer.from(authenticationKey).toString("hex")}`],
      })) as [string];
      const address = normalizeAddress(res[0]);
      return Buffer.from(address, "hex");
    } catch (error) {
      if (error instanceof ApiError) {
        const err = error as ApiError;
        if (err.errorCode === "invalid_input") {
          return authenticationKey;
        }
      }

      throw error;
    }
  }

  public async getAccountResources(
    accountAddress: Uint8Array,
  ): Promise<Types.MoveResource[]> {
    const addressLiteral = `0x${Buffer.from(accountAddress).toString("hex")}`;
    try {
      const resources =
        await this.aptosClient.getAccountResources(addressLiteral);
      return resources;
    } catch (error) {
      if (error instanceof ApiError) {
        const err = error as ApiError;
        if (err.errorCode === "account_not_found") {
          return [];
        }
      }
      throw error;
    }
  }

  public async getAccountResource(
    accountAddress: Uint8Array,
    resourceType: string,
  ): Promise<Types.MoveResource> {
    const addressLiteral = `0x${Buffer.from(accountAddress).toString("hex")}`;
    const resource = await this.aptosClient.getAccountResource(
      addressLiteral,
      resourceType,
    );
    return resource;
  }
}

export default OpenLibraService;

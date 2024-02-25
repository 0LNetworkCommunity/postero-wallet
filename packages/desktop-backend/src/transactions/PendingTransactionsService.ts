import Emittery, { UnsubscribeFn } from "emittery";
import { Inject, Injectable } from "@nestjs/common";
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";
import axios, { AxiosError } from "axios";
import { AptosAccount, AptosClient, BCS, TxnBuilderTypes } from "aptos";
import { GraphQLError } from "graphql";

import { IPendingTransaction, IPendingTransactionsRepository, IPendingTransactionsService, ITransactionsRepository, PendingTransactionsServiceEvent, RawPendingTransactionPayload, RawPendingTransactionPayloadType } from "./interfaces";
import { Types } from "../types";
import { IWalletService } from "../wallets/interfaces";
import { IDApp } from "../dapps/interfaces";

const {
  AccountAddress,
  EntryFunction,
  TransactionPayloadEntryFunction,
  RawTransaction,
  ChainId,
  TransactionAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  SignedTransaction
} = TxnBuilderTypes;

@Injectable()
class PendingTransactionsService implements IPendingTransactionsService {
  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @Inject(Types.IPendingTransactionsRepository)
  private readonly pendingTransactionsRepository!: IPendingTransactionsRepository;

  private aptosClient = new AptosClient("https://rpc.0l.fyi");

  private eventEmitter = new Emittery();

  public async sendPendingTransaction(
    pendingTransactionId: string,
    walletId: string,
    gasPrice: number,
    maxGasUnit: number,
    timeout: number,
  ): Promise<Uint8Array | null> {
    const pendingTransaction = await this.getPendingTransaction(pendingTransactionId);
    if (!pendingTransaction) {
      return null;
    }

    const wallet = await this.walletService.getWallet(walletId);
    const privateKey = await this.walletService.getWalletPrivateKey(walletId);

    const chainId = await this.aptosClient.getChainId();

    const walletAddress = Buffer.from(wallet!.accountAddress).toString('hex').toLocaleUpperCase();
    const account = await this.aptosClient.getAccount(walletAddress);

    const deserializer = new BCS.Deserializer(pendingTransaction.payload);

    const entryFunctionPayload = new TransactionPayloadEntryFunction(
      EntryFunction.deserialize(deserializer),
    );

    const rawTxn = new RawTransaction(
      // Transaction sender account address
      AccountAddress.fromHex(walletAddress),

      BigInt(account.sequence_number),
      entryFunctionPayload,
      // Max gas unit to spend
      BigInt(maxGasUnit),
      // Gas price per unit
      BigInt(gasPrice),
      // Expiration timestamp. Transaction is discarded if it is not executed within 10 seconds from now.
      BigInt(Math.floor(Date.now() / 1_000) + timeout),
      new ChainId(chainId),
    );

    const signer = new AptosAccount(privateKey!);

    const hash = sha3Hash.create();
    hash.update("DIEM::RawTransaction");

    const prefix = hash.digest();
    const body = BCS.bcsToBytes(rawTxn);
    const mergedArray = new Uint8Array(prefix.length + body.length);
    mergedArray.set(prefix);
    mergedArray.set(body, prefix.length);

    const signingMessage = mergedArray;

    const signature = signer.signBuffer(signingMessage);
    const sig = new Ed25519Signature(signature.toUint8Array());

    const authenticator = new TransactionAuthenticatorEd25519(
      new Ed25519PublicKey(signer.pubKey().toUint8Array()),
      sig
    );
    const signedTx = new SignedTransaction(rawTxn, authenticator);

    const bcsTxn = BCS.bcsToBytes(signedTx);

    console.log('sending...');
    try {
      const res = await axios<{
        hash: string;
      }>({
        method: 'POST',
        url: 'https://rpc.0l.fyi/v1/transactions',
        headers: {
          "content-type": "application/x.diem.signed_transaction+bcs",
        },
        data: bcsTxn,
      });

      if (res.status === 202) {
        return new Uint8Array(Buffer.from(res.data.hash.substring(2), "hex"));
      }
    } catch (error) {
      console.error(error);

      if (error.isAxiosError) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log(axiosError.response?.data);
          if ((axiosError.response?.data as any).message) {
            throw new GraphQLError((axiosError.response?.data as any).message);
          }
        }
      }

      throw error;
    }

    return null;
  }

  public async newTransaction(
    dApp: IDApp,
    transaction: RawPendingTransactionPayload,
  ): Promise<IPendingTransaction> {
    switch (transaction.type) {
      case RawPendingTransactionPayloadType.EntryFunctionPayload:
        {
          const payload = Buffer.from(transaction.payload, "base64");
          const pendingTransaction =
            await this.pendingTransactionsRepository.createPendingTransaction(
              dApp,
              transaction.type,
              payload,
            );
          await this.eventEmitter.emit(
            PendingTransactionsServiceEvent.NewPendingTransaction,
            pendingTransaction,
          );
          return pendingTransaction;

          // const deserializer = new BCS.Deserializer(tx);

          // const entryFunctionPayload = new TransactionPayloadEntryFunction(
          //   EntryFunction.deserialize(deserializer),
          // );
          // console.log(entryFunctionPayload);
        }
        break;
    }
    throw new Error(`unsupported transaction type: ${transaction.type}`);
  }

  public async getPendingTransaction(id: string): Promise<IPendingTransaction | null> {
    return this.pendingTransactionsRepository.getPendingTransaction(id);
  }

  public async getPendingTransactions(): Promise<IPendingTransaction[]> {
    return this.pendingTransactionsRepository.getPendingTransactions();
  }

  public async removePendingTransaction(id: string): Promise<void> {
    await this.pendingTransactionsRepository.removePendingTransaction(id);
    await this.eventEmitter.emit(
      PendingTransactionsServiceEvent.PendingTransactionRemoved,
      id,
    );
  }

  public on(
    event: PendingTransactionsServiceEvent,
    listener: (eventData: any) => void,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }
}

export default PendingTransactionsService;

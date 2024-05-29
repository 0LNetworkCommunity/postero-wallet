import Emittery, { UnsubscribeFn } from "emittery";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";
import axios, { AxiosError } from "axios";
import { AptosAccount, AptosClient, BCS, TxnBuilderTypes } from "aptos";
import { GraphQLError } from "graphql";

import { IPendingTransaction, IPendingTransactionsRepository, IPendingTransactionsService, ITransactionsRepository, ITransactionsWatcherService, PendingTransactionStatus, PendingTransactionsServiceEvent, RawPendingTransactionPayload, RawPendingTransactionPayloadType, TransactionsWatcherServiceEvent } from "./interfaces";
import { Types } from "../../types";
import { IWalletService } from "../interfaces";
import { IDApp } from "../../dapps/interfaces";
import { IKeychainService } from '../keychain/interfaces';
import { parseHexString } from "../../utils";
// import AccountAddress from "../crypto/AccountAddress";

const {
  AccountAddress,
  EntryFunction,
  TransactionPayload,
  TransactionPayloadEntryFunction,
  RawTransaction,
  ChainId,
  TransactionAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  SignedTransaction
} = TxnBuilderTypes;

@Injectable()
class PendingTransactionsService
  implements OnModuleInit, IPendingTransactionsService
{
  @Inject(Types.IWalletService)
  private readonly walletService!: IWalletService;

  @Inject(Types.IPendingTransactionsRepository)
  private readonly pendingTransactionsRepository!: IPendingTransactionsRepository;

  @Inject(Types.IKeychainService)
  private readonly keychainService!: IKeychainService;

  @Inject(Types.ITransactionsWatcherService)
  private readonly walletsWatcherService: ITransactionsWatcherService;

  private aptosClient = new AptosClient('https://rpc.0l.fyi');

  private eventEmitter = new Emittery();

  public onModuleInit() {
    this.walletsWatcherService.on(
      TransactionsWatcherServiceEvent.PendingTransaction,
      async (data) => {
        await this.onPendingTransaction(data);
      },
    );

    const tick = () => {
      this.checkDanglingTransactions()
        .catch((error) => console.error(error))
        .finally(() => {
          setTimeout(() => {
            tick();
          }, 10_000);
        });
    };

    setTimeout(() => {
      tick();
    }, 10_000);
  }

  public async sendPendingTransaction(
    pendingTransactionId: string,
    walletAddress: Uint8Array,
    gasPrice: number,
    maxGasUnit: number,
    timeout: number,
  ): Promise<Uint8Array | null> {
    const pendingTransaction =
      await this.getPendingTransaction(pendingTransactionId);
    if (!pendingTransaction) {
      return null;
    }

    const wallet = await this.walletService.getWallet(walletAddress);
    const privateKey =
      await this.walletService.getWalletPrivateKey(walletAddress);

    const chainId = await this.aptosClient.getChainId();

    const account = await this.aptosClient.getAccount(
      Buffer.from(wallet!.address).toString('hex').toUpperCase(),
    );

    const deserializer = new BCS.Deserializer(pendingTransaction.payload);

    const entryFunctionPayload = new TransactionPayloadEntryFunction(
      EntryFunction.deserialize(deserializer),
    );

    const rawTxn = new RawTransaction(
      // Transaction sender account address
      new AccountAddress(wallet!.address),

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
    hash.update('DIEM::RawTransaction');

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
      sig,
    );
    const signedTx = new SignedTransaction(rawTxn, authenticator);

    const bcsTxn = BCS.bcsToBytes(signedTx);

    try {
      const res = await axios<{
        hash: string;
      }>({
        method: 'POST',
        url: 'https://rpc.0l.fyi/v1/transactions',
        headers: {
          'content-type': 'application/x.diem.signed_transaction+bcs',
        },
        data: bcsTxn,
      });

      if (res.status === 202) {
        return new Uint8Array(Buffer.from(res.data.hash.substring(2), 'hex'));
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

  public async newPendingTransaction(
    sender: Uint8Array,
    transactionPayload: Uint8Array,
    maxGasUnit: bigint,
    gasPrice: bigint,
    expirationTimestamp: bigint,
  ): Promise<string> {
    const id =
      await this.pendingTransactionsRepository.createPendingTransaction(
        sender,
        transactionPayload,
        maxGasUnit,
        gasPrice,
        expirationTimestamp,
      );

    let sender32: Uint8Array;
    if (sender.length === 32) {
      sender32 = sender;
    } else if (sender.length === 16) {
      sender32 = new Uint8Array(Buffer.concat([Buffer.alloc(16), sender]));
    } else {
      throw new Error('invalid sender length');
    }

    const account = await this.aptosClient.getAccount(
      Buffer.from(sender32).toString('hex'),
    );

    const deserializer = new BCS.Deserializer(transactionPayload);
    const txPayload = TransactionPayload.deserialize(deserializer);

    const rawTxn = new RawTransaction(
      new AccountAddress(sender32),
      BigInt(account.sequence_number),
      txPayload,
      maxGasUnit,
      gasPrice,
      expirationTimestamp,
      new ChainId(await this.aptosClient.getChainId()),
    );

    const privateKey = await this.keychainService.getWalletPrivateKey(sender);
    const signer = new AptosAccount(privateKey!);

    const hash = sha3Hash.create();
    hash.update('DIEM::RawTransaction');

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
      sig,
    );
    const signedTx = new SignedTransaction(rawTxn, authenticator);
    const bcsTxn = BCS.bcsToBytes(signedTx);

    const res = await axios<{
      data?: {
        newTransaction: {
          hash: string;
          status: string;
        };
      };
    }>({
      method: 'POST',
      url: 'https://api.0l.fyi/graphql',
      // url: 'http://localhost:3000/graphql',
      validateStatus: () => true,
      data: {
        operationName: 'NewTransaction',
        variables: {
          signedTransaction: Buffer.from(bcsTxn).toString('hex'),
        },
        query: `
          mutation NewTransaction($signedTransaction: Bytes!) {
            newTransaction(signedTransaction: $signedTransaction) {
              hash
              status
            }
          }
        `,
      },
    });

    if (res.data.data) {
      await this.pendingTransactionsRepository.setPendingTransactionHash(
        id,
        parseHexString(res.data.data.newTransaction.hash),
      );
    }

    return id;
  }

  public async newTransaction(
    dApp: IDApp,
    transaction: RawPendingTransactionPayload,
  ): Promise<IPendingTransaction> {
    switch (transaction.type) {
      case RawPendingTransactionPayloadType.EntryFunctionPayload:
        {
          throw new Error('unimplemented');
          // const payload = Buffer.from(transaction.payload, "base64");
          // const pendingTransaction =
          //   await this.pendingTransactionsRepository.createPendingTransaction(
          //     dApp,
          //     transaction.type,
          //     payload,
          //   );

          // await this.eventEmitter.emit(
          //   PendingTransactionsServiceEvent.NewPendingTransaction,
          //   pendingTransaction,
          // );
          // return pendingTransaction;

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

  public async getPendingTransaction(
    id: string,
  ): Promise<IPendingTransaction | null> {
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

  public async setPendingTransactionStatus(
    hash: Uint8Array,
    status: PendingTransactionStatus,
  ) {
    const pendingTransaction =
      await this.pendingTransactionsRepository.getPendingTransactionByHash(
        hash,
      );

    if (pendingTransaction) {
      await this.eventEmitter.emit(
        PendingTransactionsServiceEvent.PendingTransactionUpdated,
        await this.pendingTransactionsRepository.getPendingTransaction(
          pendingTransaction.id,
        ),
      );
    }
  }

  private async onPendingTransaction({
    status,
    hash,
  }: {
    status: PendingTransactionStatus;
    address: Uint8Array;
    hash: Uint8Array;
  }) {
    await this.setPendingTransactionStatus(hash, status);
  }

  private async checkDanglingTransactions() {
    const transactions =
      await this.pendingTransactionsRepository.getTransactionsExpiredAfter(
        Math.floor(Date.now() / 1e3),
        10,
      );

    for (const transaction of transactions) {
      if (!transaction.hash) {
        continue;
      }

      const res = await axios<{
        data?: {
          transaction: {
            hash: string;
            status: PendingTransactionStatus;
          };
        };
      }>({
        // url: 'http://localhost:3000/graphql',
        url: 'https://api.0l.fyi/graphql',
        method: 'POST',
        data: {
          operationName: 'GetTransaction',
          variables: {
            hash: Buffer.from(transaction.hash).toString('hex'),
          },
          query: `
            query GetTransaction($hash: Bytes!) {
              transaction(hash: $hash) {
                hash
                status
              }
            }
          `,
        },
      });

      if (res.data.data) {
        const { hash, status } = res.data.data.transaction;
        await this.setPendingTransactionStatus(
          Buffer.from(hash, 'hex'),
          status,
        );
      }
    }
  }
}

export default PendingTransactionsService;

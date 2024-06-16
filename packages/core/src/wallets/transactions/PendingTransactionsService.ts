import Emittery, { UnsubscribeFn } from "emittery";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";
import axios from "axios";
import { AptosAccount, AptosClient, BCS, TxnBuilderTypes } from "aptos";

import {
  IPendingTransaction,
  IPendingTransactionsRepository,
  IPendingTransactionsService,
  IPendingTransactionsUpdaterService,
  ITransactionsWatcherService,
  PendingTransactionStatus,
  PendingTransactionsServiceEvent,
  PendingTransactionsUpdaterServiceEvent,
  RawPendingTransactionPayload,
  RawPendingTransactionPayloadType,
  TransactionsWatcherServiceEvent,
} from './interfaces';
import { Types } from "../../types";
import { IWalletService } from "../interfaces";
import { IKeychainService } from '../keychain/interfaces';
import { parseHexString } from "../../utils";

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
  private aptosClient = new AptosClient('https://rpc.0l.fyi');

  private eventEmitter = new Emittery();

  public constructor(
    @Inject(Types.IWalletService)
    private readonly walletService: IWalletService,

    @Inject(Types.IPendingTransactionsRepository)
    private readonly pendingTransactionsRepository: IPendingTransactionsRepository,

    @Inject(Types.IKeychainService)
    private readonly keychainService: IKeychainService,

    @Inject(Types.ITransactionsWatcherService)
    private readonly walletsWatcherService: ITransactionsWatcherService,

    @Inject(Types.IPendingTransactionsUpdaterService)
    private readonly pendingTransactionsUpdaterService: IPendingTransactionsUpdaterService,
  ) {}

  public onModuleInit() {
    this.walletsWatcherService.on(
      TransactionsWatcherServiceEvent.PendingTransaction,
      async (data) => {
        await this.onPendingTransaction(data);
      },
    );

    this.pendingTransactionsUpdaterService.on(
      PendingTransactionsUpdaterServiceEvent.TransactionUpdated,
      (pendingTransaction) => {
        this.eventEmitter.emit(
          PendingTransactionsServiceEvent.PendingTransactionUpdated,
          pendingTransaction,
        );
      },
    );

    this.pendingTransactionsUpdaterService.on(
      PendingTransactionsUpdaterServiceEvent.UpdatingTransaction,
      (pendingTransaction) => {
        this.eventEmitter.emit(
          PendingTransactionsServiceEvent.PendingTransactionUpdated,
          pendingTransaction,
        );
      },
    );
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

    const pendingTransaction = await this.getPendingTransaction(id);

    this.eventEmitter.emit(
      PendingTransactionsServiceEvent.NewPendingTransaction,
      pendingTransaction,
    );

    return id;
  }

  public async newTransaction(
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
      await this.pendingTransactionsRepository.setPendingTransactionStatus(
        pendingTransaction.id,
        status,
      );

      await this.eventEmitter.emit(
        PendingTransactionsServiceEvent.PendingTransactionUpdated,
        await this.pendingTransactionsRepository.getPendingTransaction(
          pendingTransaction.id,
        ),
      );
    }
  }

  public async getWalletPendingTransactions(
    address: Uint8Array,
  ): Promise<IPendingTransaction[]> {
    return this.pendingTransactionsRepository.getWalletPendingTransactions(
      address,
    );
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
}

export default PendingTransactionsService;

import Emittery, { UnsubscribeFn } from 'emittery';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import _ from 'lodash';
import { BCS, TxnBuilderTypes } from 'aptos';
import { Knex } from 'knex';

import {
  IBalance,
  IBalanceRepository,
  IGraphQLWallet,
  IGraphQLWalletFactory,
  ISlowWallet,
  ISlowWalletFactory,
  IWalletRepository,
  IWalletService,
  WalletServiceEvent,
} from './interfaces';
import { Types } from '../types';
import { IDbService } from '../db/interfaces';
import { IOpenLibraService } from '../open-libra/interfaces';
import { ICoinRepository } from '../coin/interfaces';
import { GetAccountMovementsRes } from './gql-types';
import { IKeychainService } from '../wallets/keychain/interfaces';
import { IPendingTransactionsService, ITransactionsService } from './transactions/interfaces';

const {
  EntryFunction,
  TransactionPayloadEntryFunction,
  ModuleId,
  Identifier,
} = TxnBuilderTypes;

export const GET_MOVEMENTS = `
  query GetAccountMovements(
    $address: Bytes!,
    $order: OrderDirection,
    $first: Int,
    $after: String,
  ) {
    account(address: $address) {
      balance
      movements(
        order: $order,
        after: $after,
        first: $first,
      ) {
        totalCount
        pageInfo {
          prevCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            amount
            unlockedAmount
            lockedAmount
            balance
            lockedBalance
            version
            transaction {
              __typename
              version
              hash
              ... on BlockMetadataTransaction {
                epoch
                timestamp
              }
              ... on UserTransaction {
                success
                moduleName
                moduleAddress
                functionName
                sender
                arguments
                timestamp
                gasUsed
              }
              ... on ScriptUserTransaction {
                success
                timestamp
                sender
              }
            }
          }
        }
      }
    }
  }
`;

@Injectable()
class WalletService implements IWalletService {
  public constructor(
    @Inject(Types.IBalanceRepository)
    private readonly balanceRepository: IBalanceRepository,

    @Inject(Types.IDbService)
    private readonly dbService: IDbService,

    @Inject(Types.IOpenLibraService)
    private readonly openLibraService: IOpenLibraService,

    @Inject(Types.IKeychainService)
    private readonly keychainService: IKeychainService,

    @Inject(Types.ICoinRepository)
    private readonly coinRepository: ICoinRepository,

    @Inject(Types.IWalletRepository)
    private readonly walletRepository: IWalletRepository,

    @Inject(Types.ISlowWalletFactory)
    private readonly slowWalletFactory: ISlowWalletFactory,

    @Inject(Types.IGraphQLWalletFactory)
    private readonly graphQLWalletFactory: IGraphQLWalletFactory,

    @Inject(Types.ITransactionsService)
    private readonly transactionsService: ITransactionsService,

    @Inject(forwardRef(() => Types.IPendingTransactionsService))
    private readonly pendingTransactionsService: IPendingTransactionsService,
  ) { }

  private eventEmitter = new Emittery();

  public async syncWallet(address: Uint8Array) {
    {
      const res = await axios<{ data: GetAccountMovementsRes }>({
        method: 'POST',
        url: 'https://api.0l.fyi/graphql',
        data: {
          operationName: 'GetAccountMovements',
          query: GET_MOVEMENTS,
          variables: {
            address: Buffer.from(address).toString('hex'),
            order: 'DESC',
            first: 1_000,
          },
        },
      });
      if (!res.data.data.account) {
        return;
      }

      const movements = res.data.data.account.movements.edges;
      const movementsLength = movements.length;

      const movementsRows: {
        version: string;
        walletAddress: Knex.Raw<any>;
        lockedBalance: string;
        balance: string;
        unlockedAmount: string;
        lockedAmount: string;
      }[] = [];

      const userTransactionRows: Array<{
        version: string;
        hash: Uint8Array;
        timestamp: string;
        gasUsed: string;
        success: boolean;
        sender: Uint8Array;
        moduleAddress: Uint8Array;
        moduleName: string;
        functionName: string;
        arguments: string;
      }> = [];

      const scriptUserTransactionRows: Array<{
        version: string;
        hash: Knex.Raw<unknown>; // Uint8Array;
        timestamp: string;
        success: boolean;
        sender: Knex.Raw<unknown>; // Uint8Array;
      }> = [];

      const blockMetadataTransactionRows: Array<{
        version: string;
        hash: Knex.Raw<unknown>; // Uint8Array;
        epoch: string;
        timestamp: string;
      }> = [];

      const genesisTransactionRows: Array<{
        version: string;
        hash: Knex.Raw<unknown>; // Uint8Array;
      }> = [];

      const transactionHashes: Buffer[] = [];

      for (let i = 0; i < movementsLength; ++i) {
        const movement = movements[i];

        movementsRows.push({
          version: movement.node.version,
          walletAddress: this.dbService.db.raw(
            `X'${Buffer.from(address).toString('hex')}'`,
          ),
          lockedBalance: movement.node.lockedBalance,
          balance: movement.node.balance,
          unlockedAmount: movement.node.unlockedAmount,
          lockedAmount: movement.node.lockedAmount,
        });

        const { transaction } = movement.node;

        const transactionHash = Buffer.from(transaction.hash, 'hex');
        transactionHashes.push(transactionHash);

        switch (transaction.__typename) {
          case 'GenesisTransaction':
            genesisTransactionRows.push({
              version: transaction.version,
              hash: this.dbService.raw(transactionHash),
            });
            break;

          case 'UserTransaction':
            userTransactionRows.push({
              version: transaction.version,
              gasUsed: transaction.gasUsed,
              hash: transactionHash,
              success: transaction.success,
              sender: Buffer.from(transaction.sender, 'hex'),
              moduleAddress: Buffer.from(transaction.moduleAddress, 'hex'),
              moduleName: transaction.moduleName,
              functionName: transaction.functionName,
              arguments: transaction.arguments,
              timestamp: transaction.timestamp,
            });
            break;

          case 'ScriptUserTransaction':
            scriptUserTransactionRows.push({
              version: transaction.version,
              hash: this.dbService.raw(transactionHash),
              success: transaction.success,
              sender: this.dbService.raw(
                Buffer.from(transaction.sender, 'hex'),
              ),
              timestamp: transaction.timestamp,
            });
            break;

          case 'BlockMetadataTransaction':
            blockMetadataTransactionRows.push({
              version: transaction.version,
              hash: this.dbService.raw(transactionHash),
              epoch: transaction.epoch,
              timestamp: transaction.timestamp,
            });
            break;
        }
      }

      if (movementsRows.length) {
        await this.dbService
          .db('movements')
          .insert(movementsRows)
          .onConflict(['version', 'walletAddress'])
          .merge();

        if (blockMetadataTransactionRows.length) {
          await this.dbService
            .db('blockMetadataTransaction')
            .insert(blockMetadataTransactionRows)
            .onConflict('version')
            .ignore();
        }

        await this.transactionsService.createUserTransactions(
          userTransactionRows,
        );

        if (scriptUserTransactionRows.length) {
          await this.dbService
            .db('scriptUserTransaction')
            .insert(scriptUserTransactionRows)
            .onConflict('version')
            .ignore();
        }

        if (genesisTransactionRows.length) {
          await this.dbService
            .db('genesisTransaction')
            .insert(genesisTransactionRows)
            .onConflict('version')
            .ignore();
        }
      }

      if (transactionHashes.length) {
        await this.dbService.db('pendingTransactions')
          .where('sender', this.dbService.raw(address))
          .whereIn('hash', transactionHashes.map((it) => this.dbService.raw(it)))
          .del();
      }
    }

    const resources = await this.openLibraService.getAccountResources(address);

    for (const resource of resources) {
      if (resource.type.startsWith('0x1::coin::CoinStore<')) {
        const coinType = resource.type.substring(
          '0x1::coin::CoinStore<'.length,
          resource.type.length - 1,
        );

        const data = resource.data as {
          coin: { value: string };
        };

        const coin = await this.coinRepository.getOrCreateCoin(coinType);

        await this.dbService
          .db('balances')
          .insert({
            coinId: coin.id,
            walletAddress: address,
            amount: data.coin.value,
          })
          .onConflict(['coinId', 'walletAddress'])
          .merge(['amount']);
      } else if (resource.type === '0x1::slow_wallet::SlowWallet') {
        const slowWallet = resource.data as {
          transferred: string;
          unlocked: string;
        };

        await this.dbService
          .db('slowWallets')
          .insert({
            walletAddress: address,
            transferred: slowWallet.transferred,
            unlocked: slowWallet.unlocked,
          })
          .onConflict(['walletAddress'])
          .merge(['transferred', 'unlocked']);
      }
    }



  }

  public async deleteWallet(walletAddress: Uint8Array) {
    await this.dbService.db('wallets').where('address', walletAddress).del();
    this.eventEmitter.emit(WalletServiceEvent.WalletRemoved, walletAddress);
  }

  public on(
    eventName: WalletServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(eventName, listener);
  }

  public async getWalletBalances(
    walletAddress: Uint8Array,
  ): Promise<IBalance[]> {
    return this.balanceRepository.getBalances(walletAddress);
  }

  public async importPrivateKey(
    privateKey: Uint8Array,
  ): Promise<IGraphQLWallet> {
    const { authKey } =
      await this.keychainService.newKeyFromPrivateKey(privateKey);
    return this.newWalletFromAuthKey(authKey);
  }

  public async importMnemonic(mnemonic: string): Promise<IGraphQLWallet> {
    const { authKey } = await this.keychainService.newKeyFromMnemonic(mnemonic);
    return this.newWalletFromAuthKey(authKey);
  }

  private async newWalletFromAuthKey(
    authKey: Uint8Array,
  ): Promise<IGraphQLWallet> {
    const address = await this.openLibraService.getOriginatingAddress(authKey);

    const wallet = await this.walletRepository.saveWallet(address, authKey);
    await this.syncWallet(wallet.address);
    this.eventEmitter.emit(WalletServiceEvent.NewWallet, wallet);
    return wallet;
  }

  public async getSlowWallet(
    walletAddress: Uint8Array,
  ): Promise<ISlowWallet | undefined> {
    const res = await this.dbService
      .db('slowWallets')
      .where('walletAddress', this.dbService.raw(walletAddress))
      .first();
    if (res) {
      return this.slowWalletFactory.getSlowWallet(
        res.transferred,
        res.unlocked,
      );
    }
    return undefined;
  }

  public async setSlow(address: Uint8Array): Promise<Uint8Array> {
    const entryFunctionPayload = new TransactionPayloadEntryFunction(
      new EntryFunction(
        ModuleId.fromStr('0x1::slow_wallet'),
        new Identifier('user_set_slow'),
        [],
        [],
      ),
    );

    const maxGasUnit = BigInt(2_000_000);
    const gasPrice = BigInt(200);

    const timeout = 60 * 1; // 1 minute
    const expirationTimestamp = BigInt(
      Math.floor(Date.now() / 1_000) + timeout,
    );

    const serializer = new BCS.Serializer();
    entryFunctionPayload.serialize(serializer);
    const b = serializer.getBytes();

    const hash = await this.pendingTransactionsService.newPendingTransaction(
      address,
      b,
      maxGasUnit,
      gasPrice,
      expirationTimestamp,
    );

    return hash;
  }

  public async getWalletsFromAuthKey(
    authKey: Uint8Array,
  ): Promise<IGraphQLWallet[]> {
    return this.walletRepository.getWalletsFromAuthKey(authKey);
  }

  public async setWalletLabel(
    address: Uint8Array,
    label: string,
  ): Promise<void> {
    await this.walletRepository.setWalletLabel(address, label);
    const wallet = await this.walletRepository.getWallet(address);
    this.eventEmitter.emit(WalletServiceEvent.WalletUpdated, wallet);
  }

  public async getWallets(): Promise<IGraphQLWallet[]> {
    const wallets = await this.walletRepository.getWallets();

    return Promise.all(
      wallets.map((wallet) =>
        this.graphQLWalletFactory.getGraphQLWallet(
          wallet.label,
          wallet.address,
        ),
      ),
    );
  }
}

export default WalletService;

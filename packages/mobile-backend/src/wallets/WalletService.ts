import Emittery, { UnsubscribeFn } from "emittery";
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import _ from 'lodash';

import {
  IBalance,
  IBalanceRepository,
  ISlowWallet,
  ISlowWalletFactory,
  IWalletRepository,
  IWalletService,
  WalletServiceEvent,
} from './interfaces';
import { Types } from '../types';
import { ICryptoService } from '../crypto/interfaces';
import Wallet from "../crypto/Wallet";
import { IDbService } from "../db/interfaces";
import { IOpenLibraService } from "../open-libra/interfaces";
import { ICoinRepository } from "../coin/interfaces";
import AccountAddress from "../crypto/AccountAddress";
import { GetAccountMovementsRes } from "./gql-types";

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
  @Inject(Types.IBalanceRepository)
  private readonly balanceRepository: IBalanceRepository;

  setWalletLabel(walletId: string, label: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getWallet(walletId: string): Promise<Wallet> {
    throw new Error('Method not implemented.');
  }

  getWalletPrivateKey(walletId: string): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }

  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.ICryptoService)
  private readonly cryptoService: ICryptoService;

  @Inject(Types.IOpenLibraService)
  private readonly openLibraService: IOpenLibraService;

  @Inject(Types.ICoinRepository)
  private readonly coinRepository: ICoinRepository;

  @Inject(Types.IWalletRepository)
  private readonly walletRepository: IWalletRepository;

  @Inject(Types.ISlowWalletFactory)
  private readonly slowWalletFactory: ISlowWalletFactory;

  private eventEmitter = new Emittery();

  public async newWallet(): Promise<Wallet> {
    const cryptoWallet = await this.cryptoService.newWallet();
    const address = await this.openLibraService.getOriginatingAddress(
      cryptoWallet.authenticationKey.bytes,
    );
    cryptoWallet.accountAddress = new AccountAddress(address);
    const wallet = await this.walletRepository.saveWallet(cryptoWallet);
    this.eventEmitter.emit(WalletServiceEvent.NewWallet, wallet);
    return wallet;
  }

  public async syncWallet(id: string) {
    const wallet = await this.walletRepository.getWallet(id);
    if (wallet) {

      {
        const res = await axios<{ data: GetAccountMovementsRes }>({
          url: 'https://api.0l.fyi/graphql',
          method: 'POST',
          data: {
            operationName: 'GetAccountMovements',
            query: GET_MOVEMENTS,
            variables: {
              address: Buffer.from(wallet.accountAddress).toString('hex'),
              order: 'DESC',
              first: 1_000,
            },
          },
        });

        // CREATE TABLE IF NOT EXISTS "movements" (
        //   "version" TEXT NOT NULL,
        //   "walletId" TEXT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
        //   "lockedBalance" TEXT NOT NULL,
        //   "unlockedBalance" TEXT NOT NULL,
        //   "timestamp" INTEGER,
        //   PRIMARY KEY("version", "walletId")
        // )

        const movements = res.data.data.account.movements.edges;
        const movementsLength = movements.length;

        const movementsRows: {
          version: string;
          walletId: string;
          lockedBalance: string;
          balance: string;
          unlockedAmount: string;
          lockedAmount: string;
        }[] = [];

        const userTransactionRows: Array<{
          version: string;
          timestamp: string;
          success: boolean;
          sender: string;
          moduleAddress: string;
          moduleName: string;
          functionName: string;
          arguments: string;
        }> = [];

        const scriptUserTransactionRows: Array<{
          version: string;
          timestamp: string;
          success: boolean;
          sender: string;
        }> = [];

        const blockMetadataTransactionRows: Array<{
          version: string;
          epoch: string;
          timestamp: string;
        }> = [];

        const genesisTransactionRows: Array<{
          version: string;
        }> = [];

        for (let i = 0; i < movementsLength; ++i) {
          const movement = movements[i];

          movementsRows.push({
            version: movement.node.version,
            walletId: wallet.id,
            lockedBalance: movement.node.lockedBalance,
            balance: movement.node.balance,
            unlockedAmount: movement.node.unlockedAmount,
            lockedAmount: movement.node.lockedAmount,
          });

          const { transaction } = movement.node;

          switch (transaction.__typename) {
            case 'GenesisTransaction':
              genesisTransactionRows.push({
                version: transaction.version,
              });
              break;

            case 'UserTransaction':
              userTransactionRows.push({
                version: transaction.version,
                success: transaction.success,
                sender: transaction.sender,
                moduleAddress: transaction.moduleAddress,
                moduleName: transaction.moduleName,
                functionName: transaction.functionName,
                arguments: transaction.arguments,
                timestamp: transaction.timestamp,
              });
              break;

            case 'ScriptUserTransaction':
              scriptUserTransactionRows.push({
                version: transaction.version,
                success: transaction.success,
                sender: transaction.sender,
                timestamp: transaction.timestamp,
              });
              break;

            case 'BlockMetadataTransaction':
              blockMetadataTransactionRows.push({
                version: transaction.version,
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
            .onConflict(['version', 'walletId'])
            .merge();

          if (blockMetadataTransactionRows.length) {
            await this.dbService
              .db('blockMetadataTransaction')
              .insert(blockMetadataTransactionRows)
              .onConflict('version')
              .ignore();
          }

          if (userTransactionRows.length) {
            await this.dbService
              .db('userTransaction')
              .insert(userTransactionRows)
              .onConflict('version')
              .ignore();
          }

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
      }

      const resources = await this.openLibraService.getAccountResources(
        wallet.accountAddress,
      );

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
              walletId: wallet.id,
              amount: data.coin.value,
            })
            .onConflict(['coinId', 'walletId'])
            .merge(['amount']);
        } else if (resource.type === '0x1::slow_wallet::SlowWallet') {
          const slowWallet = resource.data as {
            transferred: string;
            unlocked: string;
          };

          await this.dbService
            .db('slow_wallets')
            .insert({
              walletId: wallet.id,
              transferred: slowWallet.transferred,
              unlocked: slowWallet.unlocked,
            })
            .onConflict(['walletId'])
            .merge(['transferred', 'unlocked']);
        }
      }
    }
  }

  public async deleteWallet(id: string) {
    await this.dbService.db('wallets').where('id', id).del();
    this.eventEmitter.emit(WalletServiceEvent.WalletRemoved, id);
  }

  public on(
    eventName: WalletServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(eventName, listener);
  }

  public async getWalletBalances(walletId: string): Promise<IBalance[]> {
    return this.balanceRepository.getBalances(walletId);
  }

  public async importWallet(mnemonic: string): Promise<Wallet> {
    const cryptoWallet = await this.cryptoService.walletFromMnemonic(mnemonic);
    const address = await this.openLibraService.getOriginatingAddress(
      cryptoWallet.authenticationKey.bytes,
    );
    cryptoWallet.accountAddress = new AccountAddress(address);
    const wallet = await this.walletRepository!.saveWallet(cryptoWallet);
    await this.syncWallet(wallet.id);

    this.eventEmitter.emit(WalletServiceEvent.NewWallet, wallet);

    return wallet;
  }

  public async getSlowWallet(
    walletId: string,
  ): Promise<ISlowWallet | undefined> {
    const res = await this.dbService
      .db('slow_wallets')
      .where('walletId', walletId)
      .first();
    if (res) {
      return this.slowWalletFactory.getSlowWallet(
        res.transferred,
        res.unlocked,
      );
    }
    return undefined;
  }
}

export default WalletService;

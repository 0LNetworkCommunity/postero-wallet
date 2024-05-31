import { gql } from '@apollo/client';
import BN from 'bn.js';

export const GET_MOVEMENTS = gql`
  query GetMovements(
    $walletAddress: Bytes!,
  ) {
    movements(
      walletAddress: $walletAddress
    ) {
      totalCount
      pageInfo {
        prevCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          version
          lockedAmount
          unlockedAmount
          balance
          lockedBalance
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
              sender
              timestamp
            }
          }
        }
      }
    }
  }
`;


export interface GqlAbstractTransaction {
  version: string;
}

export interface GqlBlockMetadataTransaction extends GqlAbstractTransaction {
  __typename: 'BlockMetadataTransaction';
  epoch: string;
  timestamp: string;
}

export interface GqlUserTransaction extends GqlAbstractTransaction {
  __typename: 'UserTransaction';
  moduleAddress: string;
  moduleName: string;
  functionName: string;
  success: boolean;
  sender: string;
  arguments: string;
  timestamp: BN;
}

export interface GqlScriptUserTransaction extends GqlAbstractTransaction {
  __typename: 'ScriptUserTransaction';
  success: boolean;
  sender: string;
  timestamp: string;
}

export interface GqlGenesisTransaction extends GqlAbstractTransaction {
  __typename: 'GenesisTransaction';
}

export type GqlTransaction =
  | GqlGenesisTransaction
  | GqlUserTransaction
  | GqlScriptUserTransaction
  | GqlBlockMetadataTransaction;

export interface GqlMovement {
  amount: string;
  lockedAmount: string;
  unlockedAmount: string;
  balance: string;
  lockedBalance: string;
  version: string;
  changeIndex: string;
  transaction: GqlTransaction;
}

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  prevCursor: string | null;
  hasNextPage: boolean;
}

export interface Paginated<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface GetAccountMovementsRes {
  movements: Paginated<GqlMovement>;
}

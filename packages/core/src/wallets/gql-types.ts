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
  timestamp: string;
}

export interface GqlScriptUserTransaction extends GqlAbstractTransaction {
  __typename: 'ScriptUserTransaction';
  success: boolean;
  sender: string;
  arguments: string;
  timestamp: string;
}

export interface GqlGenesisTransaction extends GqlAbstractTransaction {
  __typename: 'GenesisTransaction';
}

export type GqlTransaction =
  | GqlGenesisTransaction
  | GqlUserTransaction
  | GqlBlockMetadataTransaction
  | GqlScriptUserTransaction;

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
  account: {
    balance: number;
    movements: Paginated<GqlMovement>;
  } | null;
}

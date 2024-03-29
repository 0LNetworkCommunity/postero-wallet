import { DynamicModule, Module } from '@nestjs/common';
import { WindowManagerModule } from '../window-manager/WindowManagerModule';
import WalletsModule from '../wallets/WalletsModule';
import { GraphQLModule } from '../graphql/graphql.module';
import RpcModule from '../rpc/RpcModule';

@Module({})
export class PlatformModule {
  static forRoot({
    providers,
    exports,
  }: Pick<DynamicModule, 'providers' | 'exports'>): DynamicModule {
    return {
      global: true,
      module: PlatformModule,
      imports: [
        WindowManagerModule,
        WalletsModule,
        GraphQLModule,
        RpcModule,
      ],
      providers,
      exports,
    };
  }
}

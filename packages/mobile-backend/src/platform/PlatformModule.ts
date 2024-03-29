import { DynamicModule, Module } from '@nestjs/common';
import WalletsModule from '../wallets/WalletsModule';
import { GraphQLModule } from '../graphql/graphql.module';
import RpcModule from '../rpc/RpcModule';
import { WindowManagerModule } from '../window-manager/WindowManagerModule';

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

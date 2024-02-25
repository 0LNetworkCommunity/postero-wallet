import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class PlatformModule {
  static forRoot({
    providers,
    exports,
  }: Pick<DynamicModule, 'providers' | 'exports'>): DynamicModule {
    return {
      global: true,
      module: PlatformModule,
      providers,
      exports,
    };
  }
}

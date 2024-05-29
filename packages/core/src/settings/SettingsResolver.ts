import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import Settings, { SettingsKey } from "./Settings";

@Resolver()
class SettingsResolver {
  @Query(() => Settings)
  public async settings() {
    const settings = new Settings();
    settings.init({
      rpcUrl: 'https://rpc.0l.fyi/',
      chainId: 1,
      maxGasUnit: 2_000_000,
      gasPricePerUnit: 200,
    });

    return settings;
  }

  @Mutation(() => Settings)
  public async setSetting(
    @Args('key', { type: () => String })
    key: SettingsKey,

    @Args('value', { type: () => String })
    value: string,
  ): Promise<Settings> {
    const settings = new Settings();
    settings.init({
      rpcUrl: 'https://rpc.0l.fyi/',
      chainId: 1,
      maxGasUnit: 2_000_000,
      gasPricePerUnit: 200,
    });

    return settings;
  }
}

export default SettingsResolver;

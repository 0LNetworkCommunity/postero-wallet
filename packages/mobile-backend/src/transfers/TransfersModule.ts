import { Module } from "@nestjs/common";
import TransfersResolver from "./TransfersResolver";
import { Args, ID, Mutation } from "@nestjs/graphql";

@Module({
  imports: [],
  providers: [
    TransfersResolver,
  ],
  exports: [],
})
class TransfersModule {

  @Mutation((returns) => Boolean)
  public async newTransfer(
    @Args("walletId", { type: () => ID })
    walletId: string,

    @Args("recipient", { type: () => String })
    recipient: string,

    @Args("amount", { type: () => String })
    amount: string,
  ) {

    console.log(
      "newTransfer",
      { walletId, recipient, amount }
    );

    // await this.walletService.deleteWallet(id);

    return true;
  }
}

export default TransfersModule;

import { Inject } from "@nestjs/common";
import { Args, ID, Int, Mutation, Resolver } from "@nestjs/graphql";
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";
import { AptosAccount, AptosClient, BCS, TxnBuilderTypes } from "aptos";
import axios from "axios";
import { PlatformTypes } from "../platform/platform-types";
import { PlatformEncryptedStoreService } from "../platform/interfaces";
import { Types } from "../types";
import { IWalletRepository } from "../wallets/interfaces";
import { IPendingTransactionsService } from "../transactions/interfaces";
import BN from "bn.js";

const {
  AccountAddress,
  EntryFunction,
  TransactionPayloadEntryFunction,
  TransactionPayload,
  RawTransaction,
  ChainId,
  TransactionAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  SignedTransaction,
  ModuleId,
  Identifier,
  StructTag,
  TypeTagStruct,
} = TxnBuilderTypes;

@Resolver()
class TransfersResolver {
  private readonly aptosClient = new AptosClient("https://rpc.0l.fyi");

  @Inject(PlatformTypes.EncryptedStoreService)
  private readonly platformEncryptedStoreService: PlatformEncryptedStoreService;

  @Inject(Types.IWalletRepository)
  private readonly walletRepository: IWalletRepository;

  @Inject(Types.IPendingTransactionsService)
  private readonly pendingTransactionsService: IPendingTransactionsService;

  @Mutation(() => String)
  public async newTransfer(
    @Args("walletAddress", { type: () => Buffer })
    walletAddress: Uint8Array,

    @Args("recipient", { type: () => Buffer })
    recipient: Uint8Array,

    @Args("amount", { type: () => BN })
    amount: BN,
  ) {
    const wallet = await this.walletRepository.getWallet(walletAddress);
    if (!wallet) {
      return false;
    }

    let recipient32: Uint8Array;
    if (recipient.length === 16) {
      recipient32 = new Uint8Array(Buffer.concat([Buffer.alloc(16), recipient]));
    } else if (recipient.length === 32) {
      recipient32 = recipient;
    } else {
      throw new Error(`invalid address length ${recipient.length}`);
    }

    // const pk = await this.platformEncryptedStoreService.getItem(
    //   Buffer.from(walletAddress).toString('hex').toUpperCase(),
    // );
    // if (!pk) {
    //   return false;
    // }

    // const privateKey = Buffer.from(
    //   pk,
    //   'hex',
    // );

    const func = new EntryFunction(
      ModuleId.fromStr('0x1::ol_account'),
      new Identifier('transfer'),
      [],
      [recipient32, BCS.bcsSerializeUint64(BigInt(amount.toString(10)))],
    );

    const entryFunctionPayload = new TransactionPayloadEntryFunction(func);

    // const serializer = new BCS.Serializer();
    // func.serialize(serializer);

    // await this.pendingTransactionsService.newPendingTransaction(
    //   walletAddress,
    //   serializer.getBytes(),
    // );

    // console.log('entryFunctionPayload', entryFunctionPayload);

    const maxGasUnit = BigInt(2_000_000);
    const gasPrice = BigInt(200);

    // const chainId = 1; // await this.aptosClient.getChainId();

    const timeout = 10;
    const expirationTimestamp = BigInt(Math.floor(Date.now() / 1_000) + timeout);

    // const account = await this.aptosClient.getAccount(
    //   Buffer.from(walletAddress).toString('hex'),
    // );

    const serializer = new BCS.Serializer();
    entryFunctionPayload.serialize(serializer);
    const b = serializer.getBytes();

    const id = await this.pendingTransactionsService.newPendingTransaction(
      walletAddress,
      b,
      maxGasUnit,
      gasPrice,
      expirationTimestamp,
    );

    // const rawTxn = new RawTransaction(
    //   // Transaction sender account address
    //   new AccountAddress(walletAddress),

    //   BigInt(account.sequence_number),
    //   entryFunctionPayload,
    //   // Max gas unit to spend
    //   maxGasUnit,
    //   // Gas price per unit
    //   gasPrice,
    //   // Expiration timestamp. Transaction is discarded if it is not executed within 10 seconds from now.
    //   expirationTimestamp,
    //   new ChainId(chainId),
    // );

    // {

    //   const deserializer = new BCS.Deserializer(b);
    //   const transactionPayload = TransactionPayload.deserialize(deserializer);
    //   if (transactionPayload instanceof TransactionPayloadEntryFunction) {

    //   }
    //   // console.log('>>>', transactionPayload instanceof TransactionPayloadEntryFunction);
    // }



    // const signer = new AptosAccount(privateKey!);

    // const hash = sha3Hash.create();
    // hash.update("DIEM::RawTransaction");

    // const prefix = hash.digest();
    // const body = BCS.bcsToBytes(rawTxn);
    // const mergedArray = new Uint8Array(prefix.length + body.length);
    // mergedArray.set(prefix);
    // mergedArray.set(body, prefix.length);

    // const signingMessage = mergedArray;

    // const signature = signer.signBuffer(signingMessage);
    // const sig = new Ed25519Signature(signature.toUint8Array());

    // const authenticator = new TransactionAuthenticatorEd25519(
    //   new Ed25519PublicKey(signer.pubKey().toUint8Array()),
    //   sig
    // );
    // const signedTx = new SignedTransaction(rawTxn, authenticator);

    // const bcsTxn = BCS.bcsToBytes(signedTx);

    // console.log('sending...');

    // try {
    //   const res = await axios<{
    //     hash: string;
    //   }>({
    //     method: 'POST',
    //     url: 'https://rpc.0l.fyi/v1/transactions',
    //     headers: {
    //       "content-type": "application/x.diem.signed_transaction+bcs",
    //     },
    //     data: bcsTxn,
    //   });
    //   console.log(res.status);

    //   if (res.status === 202) {
    //     console.log(res.data);
    //     // return new Uint8Array(Buffer.from(res.data.hash.substring(2), "hex"));
    //   }
    // } catch (error) {
    //   console.error(error);
    // }

    return id;
  }

}

export default TransfersResolver;

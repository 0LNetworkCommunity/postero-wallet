import { Inject } from "@nestjs/common";
import { Args, ID, Int, Mutation, Resolver } from "@nestjs/graphql";
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";
import { AptosAccount, AptosClient, BCS, TxnBuilderTypes } from "aptos";
import axios from "axios";
import { PlatformTypes } from "../platform/platform-types";
import { PlatformEncryptedStoreService } from "../platform/interfaces";
import { Types } from "../types";
import { IWalletRepository } from "../wallets/interfaces";

const {
  AccountAddress,
  EntryFunction,
  TransactionPayloadEntryFunction,
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

  @Mutation((returns) => Boolean)
  public async newTransfer(
    @Args("walletAddress", { type: () => Buffer })
    walletAddress: Uint8Array,

    @Args("recipient", { type: () => String })
    recipient: string,

    @Args("amount", { type: () => Int })
    amount: number,
  ) {
    const wallet = await this.walletRepository.getWallet(walletAddress);
    if (!wallet) {
      return false;
    }

    const pk = await this.platformEncryptedStoreService.getItem(
      Buffer.from(walletAddress).toString('hex').toUpperCase(),
    );
    if (!pk) {
      return false;
    }

    const privateKey = Buffer.from(
      pk,
      'hex',
    );

    const entryFunctionPayload = new TransactionPayloadEntryFunction(
      new EntryFunction(
        ModuleId.fromStr('0x1::ol_account'),
        new Identifier('transfer'),
        [],
        [
          Buffer.from(recipient, 'hex'),
          BCS.bcsSerializeUint64(amount),
        ],
      ),
    );

    const maxGasUnit = 2000000;
    const gasPrice = 200;

    const chainId = 1; // await this.aptosClient.getChainId();

    const timeout = 10;

    const account = await this.aptosClient.getAccount(
      Buffer.from(walletAddress).toString('hex'),
    );

    const rawTxn = new RawTransaction(
      // Transaction sender account address
      new AccountAddress(walletAddress),

      BigInt(account.sequence_number),
      entryFunctionPayload,
      // Max gas unit to spend
      BigInt(maxGasUnit),
      // Gas price per unit
      BigInt(gasPrice),
      // Expiration timestamp. Transaction is discarded if it is not executed within 10 seconds from now.
      BigInt(Math.floor(Date.now() / 1_000) + timeout),
      new ChainId(chainId),
    );

    const signer = new AptosAccount(privateKey!);

    const hash = sha3Hash.create();
    hash.update("DIEM::RawTransaction");

    const prefix = hash.digest();
    const body = BCS.bcsToBytes(rawTxn);
    const mergedArray = new Uint8Array(prefix.length + body.length);
    mergedArray.set(prefix);
    mergedArray.set(body, prefix.length);

    const signingMessage = mergedArray;

    const signature = signer.signBuffer(signingMessage);
    const sig = new Ed25519Signature(signature.toUint8Array());

    const authenticator = new TransactionAuthenticatorEd25519(
      new Ed25519PublicKey(signer.pubKey().toUint8Array()),
      sig
    );
    const signedTx = new SignedTransaction(rawTxn, authenticator);

    const bcsTxn = BCS.bcsToBytes(signedTx);

    console.log('sending...');

    try {
      const res = await axios<{
        hash: string;
      }>({
        method: 'POST',
        url: 'https://rpc.0l.fyi/v1/transactions',
        headers: {
          "content-type": "application/x.diem.signed_transaction+bcs",
        },
        data: bcsTxn,
      });
      console.log(res.status);

      if (res.status === 202) {
        console.log(res.data);
        // return new Uint8Array(Buffer.from(res.data.hash.substring(2), "hex"));
      }
    } catch (error) {
      console.error(error);
    }

    return true;
  }

}

export default TransfersResolver;

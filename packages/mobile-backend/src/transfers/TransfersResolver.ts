import { Args, ID, Int, Mutation, Resolver } from "@nestjs/graphql";
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";
import { AptosAccount, AptosClient, BCS, TxnBuilderTypes } from "aptos";
import axios from "axios";

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
  // private aptosClient = new AptosClient("http://104.248.94.195:8080");
  private aptosClient = new AptosClient("https://rpc.0l.fyi");

  @Mutation((returns) => Boolean)
  public async newTransfer(
    @Args("walletId", { type: () => ID })
    walletId: string,

    @Args("recipient", { type: () => String })
    recipient: string,

    @Args("amount", { type: () => Int })
    amount: number,
  ) {
    console.log("newTransfer", { walletId, recipient, amount });

    const walletAddress = "D0383924341821F9E43A6CFF46F0A74E"
    const privateKey = Buffer.from(
      '60B9B1BCC7F9AF9011D7FB26466CB00FD35A21DB22F373F085B3BC0604ACA78C',
      'hex',
    );

    const entryFunctionPayload = new TransactionPayloadEntryFunction(
      new EntryFunction(
        ModuleId.fromStr('0x1::ol_account'),
        new Identifier('transfer'),
        [],
        [
          Buffer.from('C19E0958797D9BC29F9D55177616F1BF44FCDD558E434AF41D19BD327FAB361C', 'hex'),
          BCS.bcsSerializeUint64(10000000),
        ],
      ),
    );

    console.log("entryFunctionPayload", entryFunctionPayload);

    const maxGasUnit = 2000000;
    const gasPrice = 200;

    const chainId = 1; // await this.aptosClient.getChainId();
    console.log("chainId", chainId);

    const timeout = 10;

    const account = await this.aptosClient.getAccount(walletAddress);

    const rawTxn = new RawTransaction(
      // Transaction sender account address
      AccountAddress.fromHex(walletAddress),

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

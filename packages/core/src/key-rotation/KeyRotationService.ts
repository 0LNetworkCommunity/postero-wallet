import { AptosAccount, BCS, TxnBuilderTypes } from "aptos";
import axios from "axios";
import { Inject, Injectable } from '@nestjs/common';
import { ed25519 } from "@noble/curves/ed25519";
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";

import { IKeyRotationService } from './interfaces';
import { Types } from '../types';
import { IOpenLibraService } from '../open-libra/interfaces';
import { IKeychainService } from "../keychain/interfaces";

const CORE_CODE_ADDRESS = new Uint8Array(
  Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex',
  ),
);

const ED25519_SCHEME = 0;

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
} = TxnBuilderTypes;

@Injectable()
class KeyRotationService implements IKeyRotationService {
  @Inject(Types.IOpenLibraService)
  private readonly openLibraService: IOpenLibraService;

  @Inject(Types.IKeychainService)
  private readonly keychainService: IKeychainService;

  public async sendKeyRotationTransaction(
    address: Uint8Array,
    newPublicKey: Uint8Array,
  ): Promise<void> {
    const account = await this.openLibraService.getAccount(address);

    const rotationMsg = new Uint8Array(
      Buffer.concat([
        CORE_CODE_ADDRESS,
        BCS.bcsSerializeStr('account'),
        BCS.bcsSerializeStr('RotationProofChallenge'),
        BCS.bcsSerializeUint64(account.sequenceNumber),
        address.length === 16
          ? Buffer.concat([Buffer.alloc(16), address])
          : address,
        account.authKey,
        BCS.bcsSerializeBytes(newPublicKey),
      ]),
    );
    const walletKey = await this.keychainService.getWalletKey(account.authKey);

    const currentPrivateKey = await walletKey.getPrivateKey();
    const newWalletKey = await this.keychainService.getWalletKey(newPublicKey);
    const newPrivateKey = await newWalletKey.getPrivateKey();

    const rotationProofSignedByCurrentPrivateKey = ed25519.sign(
      rotationMsg,
      currentPrivateKey,
    );
    const rotationProofSignedByNewPrivateKey = ed25519.sign(
      rotationMsg,
      newPrivateKey,
    );

    const args = [
      // from_scheme: u8
      BCS.bcsSerializeU8(ED25519_SCHEME),

      // from_public_key_bytes: vector<u8>
      BCS.bcsSerializeBytes(walletKey.publicKey),

      // to_scheme: u8
      BCS.bcsSerializeU8(ED25519_SCHEME),

      // to_public_key_bytes: vector<u8>
      BCS.bcsSerializeBytes(newPublicKey),

      // cap_rotate_key: vector<u8>
      BCS.bcsSerializeBytes(rotationProofSignedByCurrentPrivateKey),

      // cap_update_table: vector<u8>
      BCS.bcsSerializeBytes(rotationProofSignedByNewPrivateKey),
    ];

    const entryFunctionPayload = new TransactionPayloadEntryFunction(
      new EntryFunction(
        ModuleId.fromStr("0x1::account"),
        new Identifier("rotate_authentication_key"),
        [],
        args
      ),
    );

    const chainId = await this.openLibraService.aptosClient.getChainId();

    const maxGasUnit = 2000000;
    const gasPrice = 200;

    const timeout = 120;

    const rawTxn = new RawTransaction(
      // Transaction sender account address
      AccountAddress.fromHex(Buffer.from(address).toString("hex")),

      account.sequenceNumber,
      entryFunctionPayload,
      // Max gas unit to spend
      BigInt(maxGasUnit),
      // Gas price per unit
      BigInt(gasPrice),
      // Expiration timestamp. Transaction is discarded if it is not executed within x seconds from now.
      BigInt(Math.floor(Date.now() / 1_000) + timeout),

      new ChainId(chainId),
    );

    const signer = new AptosAccount(currentPrivateKey);

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
      sig,
    );
    const signedTx = new SignedTransaction(rawTxn, authenticator);

    const bcsTxn = BCS.bcsToBytes(signedTx);

    console.log("sending...");
    try {
      const res = await axios<{
        hash: string;
      }>({
        method: 'POST',
        url: `${this.openLibraService.rpcHost}/v1/transactions`,
        headers: {
          'content-type': 'application/x.diem.signed_transaction+bcs',
        },
        data: bcsTxn,
      });
      console.log(res.status);

      if (res.status === 202) {
        console.log(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default KeyRotationService;

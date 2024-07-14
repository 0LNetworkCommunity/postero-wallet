import { BCS, TxnBuilderTypes } from "aptos";
import { Inject, Injectable } from '@nestjs/common';
import { ed25519 } from "@noble/curves/ed25519";

import { IKeyRotationService } from './interfaces';
import { Types } from "../../types";
import { IOpenLibraService } from "../../open-libra/interfaces";
import { IKeychainService } from "../keychain/interfaces";
import { IPendingTransactionsService } from "../transactions/interfaces";
import { IWalletRepository } from "../interfaces";

const CORE_CODE_ADDRESS = new Uint8Array(
  Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex',
  ),
);

const ED25519_SCHEME = 0;

const {
  EntryFunction,
  TransactionPayloadEntryFunction,
  ModuleId,
  Identifier,
} = TxnBuilderTypes;

@Injectable()
class KeyRotationService implements IKeyRotationService {
  @Inject(Types.IOpenLibraService)
  private readonly openLibraService: IOpenLibraService;

  @Inject(Types.IKeychainService)
  private readonly keychainService: IKeychainService;

  @Inject(Types.IPendingTransactionsService)
  private readonly pendingTransactionsService: IPendingTransactionsService;

  @Inject(Types.IWalletRepository)
  private readonly walletRepository: IWalletRepository;

  public async sendKeyRotationTransaction(
    walletAddress: Uint8Array,
    newPublicKey: Uint8Array,
  ): Promise<Uint8Array> {
    const account = await this.openLibraService.getAccount(walletAddress);

    const rotationMsg = new Uint8Array(
      Buffer.concat([
        CORE_CODE_ADDRESS,
        BCS.bcsSerializeStr('account'),
        BCS.bcsSerializeStr('RotationProofChallenge'),
        BCS.bcsSerializeUint64(account.sequenceNumber),
        walletAddress.length === 16
          ? Buffer.concat([Buffer.alloc(16), walletAddress])
          : walletAddress,
        account.authKey,
        BCS.bcsSerializeBytes(newPublicKey),
      ]),
    );
    const walletKey = await this.keychainService.getWalletKeyFromAuthKey(account.authKey);
    const currentPrivateKey = await walletKey.getPrivateKey();
    const newWalletKey = await this.keychainService.getWalletKey(newPublicKey);
    const newPrivateKey = await newWalletKey.getPrivateKey();

    await this.walletRepository.saveWalletAuthKey(
      walletAddress,
      newWalletKey.authKey,
    );

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

    const maxGasUnit = BigInt(2_000_000);
    const gasPrice = BigInt(200);

    const timeout = 60 * 1; // 1 minute
    const expirationTimestamp = BigInt(
      Math.floor(Date.now() / 1_000) + timeout,
    );

    const serializer = new BCS.Serializer();
    entryFunctionPayload.serialize(serializer);
    const b = serializer.getBytes();

    const hash = await this.pendingTransactionsService.newPendingTransaction(
      walletAddress,
      b,
      maxGasUnit,
      gasPrice,
      expirationTimestamp,
    );

    return hash;
  }
}

export default KeyRotationService;

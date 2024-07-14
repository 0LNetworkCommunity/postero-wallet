
export interface IKeyRotationService {
  sendKeyRotationTransaction(
    address: Uint8Array,
    newPublicKey: Uint8Array,
  ): Promise<Uint8Array>;
}

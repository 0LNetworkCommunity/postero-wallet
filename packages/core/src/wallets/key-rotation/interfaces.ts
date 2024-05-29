
export interface IKeyRotationService {
  sendKeyRotationTransaction(
    address: Uint8Array,
    newPublicKey: Uint8Array,
  ): Promise<void>;
}

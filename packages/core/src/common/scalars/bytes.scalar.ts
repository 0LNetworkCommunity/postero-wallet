import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Bytes', () => Buffer)
export class BytesScalar implements CustomScalar<string, Buffer | Uint8Array> {
  public readonly description = 'Bytes';

  private static INVALID_HEX_REPRESENTATION =
    'Invalid bytes literal hex representation';

  private static checkLiteral(value: string) {
    if ((value.length & 1) === 1) {
      throw new Error(BytesScalar.INVALID_HEX_REPRESENTATION);
    }

    if (/^[0-9ABCDEF]*$/i.test(value) === false) {
      throw new Error(BytesScalar.INVALID_HEX_REPRESENTATION);
    }
  }

  public parseValue(value: string): Uint8Array {
    BytesScalar.checkLiteral(value);
    return new Uint8Array(Buffer.from(value, 'hex'));
  }

  public serialize(value: Buffer | Uint8Array): string {
    const buff = Buffer.isBuffer(value) ? value : Buffer.from(value);
    return buff.toString('hex').toUpperCase();
  }

  public parseLiteral(ast: ValueNode): Uint8Array {
    if (ast.kind === Kind.STRING) {
      BytesScalar.checkLiteral(ast.value);
      return new Uint8Array(Buffer.from(ast.value, 'hex'));
    }
    throw new Error(BytesScalar.INVALID_HEX_REPRESENTATION);
  }
}

import { CustomScalar, Scalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";

@Scalar("Bytes", (type) => Buffer)
export class BytesScalar implements CustomScalar<string, Buffer> {
  description = "Date custom scalar type";

  parseValue(value: string): Buffer {
    return Buffer.from(value, "hex");
  }

  serialize(value: Buffer): string {
    // Handle case when value is an Uint8Array
    if (!Buffer.isBuffer(value)) {
      return Buffer.from(value).toString("hex").toUpperCase();
    }
    return value.toString("hex").toUpperCase();
  }

  parseLiteral(ast: ValueNode): Buffer {
    if (ast.kind === Kind.STRING) {
      return Buffer.from(ast.value, "hex");
    }
    throw new Error(`Cannot parse value for Bytes: ${ast}`);
  }
}

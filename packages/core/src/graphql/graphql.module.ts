import { Module } from "@nestjs/common";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { ApolloDriverConfig } from "@nestjs/apollo";
import ApolloDriver from "./apollo.driver";
import { GraphQLService } from "./graphql.service";
import { DateScalar } from "../common/scalars/date.scalar";
import { BytesScalar } from "../common/scalars/bytes.scalar";

import { Types } from "../types";
import { BigIntScalar } from "./bigint.scalar";
import { DecimalScalar } from "./decimal.scalar";

@Module({
  imports: [
    DateScalar,
    BytesScalar,
    DecimalScalar,
    BigIntScalar,

    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  providers: [
    {
      provide: Types.IGraphQLService,
      useClass: GraphQLService,
    },
  ],
  exports: [Types.IGraphQLService],
})
export class GraphQLModule {}

import { Module } from "@nestjs/common";
import { GraphQLModule as NestJsGraphQLModule } from "@nestjs/graphql";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { DirectiveLocation, GraphQLDirective } from "graphql";

import { upperDirectiveTransformer } from "../common/directives/upper-case.directive";
import { DateScalar } from "../common/scalars/date.scalar";
import ApolloDriver from "./apollo.driver";
import { BytesScalar } from "../common/scalars/bytes.scalar";
import { GraphQLService } from "./graphql.service";
import { Types } from "../types";

@Module({
  imports: [
    DateScalar,
    BytesScalar,

    NestJsGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, "upper"),
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: "upper",
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
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

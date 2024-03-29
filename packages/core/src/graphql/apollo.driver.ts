import { Injectable } from "@nestjs/common";
import {
  ApolloDriver as NestJsApolloDriver,
  ApolloDriverConfig,
} from "@nestjs/apollo";
import { GraphQLSchema } from "graphql";

@Injectable()
export class ApolloDriver extends NestJsApolloDriver {
  public schema?: GraphQLSchema;

  public async start(options: ApolloDriverConfig) {
    this.schema = options.schema;
    await super.start(options);
  }
}

export default ApolloDriver;

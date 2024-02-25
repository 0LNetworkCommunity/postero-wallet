import { NestFactory } from "@nestjs/core";
import express from "express";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";

import { AppModule } from "./app/app.module";
import { WindowManagerService } from "./window-manager/WindowManagerService";
import { IGraphQLService } from "./graphql/interfaces";
import { Types } from "./types";
import { WindowType } from "./window-manager/types";

const bootstrap = async () => {
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );
  await app.init();

  const gqlModule = app.get<GraphQLModule<ApolloDriver>>(GraphQLModule);
  const apolloServer = gqlModule.graphQlAdapter;

  const graphqlService = app.get<IGraphQLService>(Types.IGraphQLService);
  graphqlService.registerGraphQLServer(apolloServer);

  const windowManagerService = app.get<WindowManagerService>(Types.IWindowManagerService);
  await windowManagerService.createWindow(WindowType.Main);
};

export default bootstrap;

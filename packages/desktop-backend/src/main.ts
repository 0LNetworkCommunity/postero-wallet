import "reflect-metadata";
import Bluebird from "bluebird";

Bluebird.config({
  cancellation: true,
});

import bootstrap from "./bootstrap";

bootstrap();

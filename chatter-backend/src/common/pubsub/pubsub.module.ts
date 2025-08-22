import { Global, Module } from "@nestjs/common";
import { PUB_SUB } from "../constants/injection-token";
import { PubSub } from "graphql-subscriptions";

@Global() // Marks the module as global so it can be used across the application without needing to import it in every module
@Module({
  providers: [{
    provide: PUB_SUB,
    useValue: new PubSub(),
  }],
  exports: [PUB_SUB],
})
export class PubSubModule {}

import { AuthGuard } from "@nestjs/passport";

export class LocalAuthGuard extends AuthGuard("local") { // "local" in AuthGuard("local") binds this guard to the strategy named "local", which is typically defined in your local.strategy.ts file
    
}
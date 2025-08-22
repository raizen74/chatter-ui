import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './common/database/database.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { Request } from 'express';
import { AuthService } from './auth/auth.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        subscriptions: {
          'graphql-ws': {
            // Callback function executed on client connection
            onConnect: (context: any) => {
              // cookie parser is only available for http requests, not websockets, so we manually parse cookies
              try {
                const request: Request = context.extra.request;
                const user = authService.verifyWs(request);
                context.user = user; // attach the user to the context for later use in messages.resolver.ts
              } catch (err) {
                new Logger().error(err);
                throw new UnauthorizedException();
              }
              const { connectionParams, extra } = context;
              console.log('Client connected for subscriptions.');
              // You can perform authentication here using connectionParams if needed
            },
          }, // listen for GraphQL subscriptions on /graphql
        },
      }),
      imports: [AuthModule], // import AuthModule to use AuthService in the factory
      inject: [AuthService], // inject AuthService into the factory
    }),
    DatabaseModule,
    UsersModule,
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    // colorize: true,
                    // translateTime: 'SYS:standard',
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ChatsModule,
    PubSubModule,
    // Other modules can be imported here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

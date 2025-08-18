import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // tells the strategy where to get the JWT from the incoming request -> cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies.Authentication, // Authentication cookie given in the Auth service
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'), // JWT Strategy checks the JWT validity with JWT_SECRET, if valid proceed, if not it throws Unauthorized exception
    });
  }

  validate(payload: TokenPayload) {
    return payload; // The payload will be available in the request object, which includes the user information, so we do not need to query the database
  }
}

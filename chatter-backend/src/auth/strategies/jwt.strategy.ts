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
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies.Authentication, // Authentication cookie given in the Auth service
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'), // Ensure JWT_SECRET is set in your environment variables
    });
  }

  validate(payload: TokenPayload) {
    return payload; // The payload will be available in the request object
  }
}

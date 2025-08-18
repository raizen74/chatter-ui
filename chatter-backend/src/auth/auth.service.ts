import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {}
  /**
   * Logs in a user by generating a JWT token and setting it as a cookie in the response.
   * @param user - The user to log in.
   * @param response - The HTTP response object to set the cookie on.
   */
  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION'), // cookie expires at the same time as JWT
    );

    const tokenPayload: TokenPayload = {
      _id: user._id.toString(),
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);  // inject user data into the token

    response.cookie('Authentication', token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      // secure: process.env.NODE_ENV === 'production',
      expires,
    });  // add a cookie to the response
  }
}

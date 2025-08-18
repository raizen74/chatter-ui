import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "src/users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string) {
    try {
      return await this.usersService.verifyUser(email, password);  // return the user attached to the request object
    } catch (err) {  // catch the NotFoundException from abstract.repository.ts
      throw new UnauthorizedException('Credentials are not valid.');  // respond with 401 Unauthorized to /auth/login invalid request
    }
  }
}

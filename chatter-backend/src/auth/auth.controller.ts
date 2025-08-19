import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';

// Operates at /auth/login
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,  // CurrentUser has logic to extract user which is the one returned by the LocalStrategy.validate method
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);  // return the response with the JWT injected as cookie
  }

  @Post('logout')
  logout(
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(response);
  }
}

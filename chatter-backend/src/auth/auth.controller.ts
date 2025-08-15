import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from './curret-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User
    @Res({ passthrough: true }) response: Response,
  ) {

  }
}

import { ConfigService } from '@nestjs/config';
import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Public() // Để chặn kiểm tra JWT Guard
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req): any {
    return this.authService.login(req.user);
  }

  // @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

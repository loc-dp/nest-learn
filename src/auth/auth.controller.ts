import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // Để chặn kiểm tra JWT Guard
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req): any {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('/register')
  handleRegister(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  // @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

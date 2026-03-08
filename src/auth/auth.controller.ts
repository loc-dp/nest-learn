import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // Để bypass   kiểm tra JWT Guard
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage('Login successful')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response as any);
  }

  @Public()
  @ResponseMessage('User registered successfully')
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

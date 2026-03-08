import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUser(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        const { password, ...result } = user.toObject();
        return result;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    const refreshToken = this.createrRefreshToken(payload);

    await this.usersService.updateUserToken(refreshToken, _id.toString());

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(
        this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue,
      ),
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(registerDto: RegisterUserDto) {
    let newUser = await this.usersService.register(registerDto);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  createrRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_SECRET',
      ) as string,
      expiresIn:
        ms(
          this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue,
        ) / 1000,
    });
    return refreshToken;
  }

  processNewToken = (refreshToken: string) => {
    try{
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_SECRET'
        ) as string,
      });
    }
    catch (error) {
      throw new BadRequestException('Invalid refresh token please login again');
    }
  }
}

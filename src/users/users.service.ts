import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserM } from './schemas/user.schema';
import { Model, mongo } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import type { IUser } from './users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) // dùng inject để tiêm vào mongoose model
    private userModel: Model<UserM>, // Khai báo loại của userModel là Model<UserM>
  ) {}

  getHashPassword(password: string): string {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const { name, email, password, age, gender, address, company } =
      createUserDto;
    const isExistUser = await this.userModel.findOne({ email });
    if (isExistUser) {
      throw new BadRequestException(`Email already exists ${email}`);
    }
    const hashPassword = this.getHashPassword(password);
    const createdUser = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      gender,
      age,
      address,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return createdUser;
  }

  async register(registerDto: RegisterUserDto) {
    const { name, email, password, age, gender, address } = registerDto;

    const isExistUser = await this.userModel.findOne({ email });
    if (isExistUser) {
      throw new BadRequestException(`Email already exists ${email}`);
    }
    const hashPassword = this.getHashPassword(password);
    let registerUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: 'user',
    });
    return registerUser;
  }

  async findAll() {
    return this.userModel.find();
  }

  @ResponseMessage('User retrieved successfully')
  async findOne(id: string) {
    if (!mongo.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }

    return await this.userModel.findOne({ _id: id }).select('-password');
  }

  findOneByUser(username: string) {
    return this.userModel.findOne({ email: username });
  }

  isValidPassword(password: string, hashPassword: string): boolean {
    return compareSync(password, hashPassword);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: user._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongo.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
    return await this.userModel.updateOne(
      { _id: id },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
}

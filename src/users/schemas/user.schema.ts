import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email!: string;

  @Prop()
  password!: string;

  @Prop()
  name!: string;

  @Prop()
  age!: number;

  @Prop()
  phone!: string;

  @Prop()
  address!: string;

  @Prop()
  createAt!: string;

  @Prop()
  updateAt!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

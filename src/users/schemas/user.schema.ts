import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
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

  @Prop({ type: Boolean, default: false })
  isDeleted!: boolean;

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre hook: tự động lọc bỏ các document đã bị soft delete trong mọi query find
UserSchema.pre(/^find/, async function (this: any) {
  this.find({ isDeleted: { $ne: true } });
});

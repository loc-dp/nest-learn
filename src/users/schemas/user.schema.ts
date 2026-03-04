import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  name!: string;

  @Prop()
  age!: number;

  @Prop({ type: Object })
  company!: {
    _id: Types.ObjectId;
    name: string;
  };

  @Prop()
  phone!: string;

  @Prop()
  gender!: string;

  @Prop()
  role!: string;

  @Prop()
  refreshToken!: string;

  @Prop()
  address!: string;

  @Prop({ type: Date, default: null })
  createdAt!: Date | null;

  @Prop({ type: Date, default: null })
  updatedAt!: Date | null;

  @Prop({ type: Boolean, default: false })
  isDeleted!: boolean;

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;

  @Prop({ type: Object })
  createdBy!: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy!: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy!: {
    _id: Types.ObjectId;
    email: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre hook: tự động lọc bỏ các document đã bị soft delete trong mọi query find
UserSchema.pre(/^find/, async function (this: any) {
  this.find({ isDeleted: { $ne: true } });
});

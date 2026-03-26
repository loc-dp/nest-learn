import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name!: string;

  @Prop()
  isActive!: boolean;

  @Prop()
  description!: string;

  @Prop({
    type: [Object],
    default: [],
    _id: false,
  })
  permissions!: Object[];

  @Prop({ type: Object })
  createdBy!: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy!: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Boolean, default: false })
  isDeleted!: boolean;

  @Prop({ type: Object })
  deletedBy!: {
    _id: Types.ObjectId;
    email: string;
  };

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

// Pre hook: tự động lọc bỏ các document đã bị soft delete trong mọi query find
RoleSchema.pre(/^find/, async function (this: any) {
  this.find({ isDeleted: { $ne: true } });
});

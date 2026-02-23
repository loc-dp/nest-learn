import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
  @Prop()
  name!: string;

  @Prop()
  address!: string;

  @Prop({ type: Object })
  createdBy!: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy!: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy!: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  description!: string;

  @Prop({ type: Boolean, default: false })
  isDeleted!: boolean;

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// Pre hook: tự động lọc bỏ các document đã bị soft delete trong mọi query find
CompanySchema.pre(/^find/, async function (this: any) {
  this.find({ isDeleted: { $ne: true } });
});

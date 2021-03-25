import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUserType extends Document {
  name: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
}

interface IUserTypeModel extends Model<IUserType> {}

const UserTypeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: false, max: 64 },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const UserType = mongoose.model<IUserType, IUserTypeModel>(
  'UserType',
  UserTypeSchema,
);

export { IUserType, UserType, UserTypeSchema };

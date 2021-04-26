import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { IUserType } from './userType.model';
import { default as bcrypt } from 'bcrypt';
import { IClass } from './class.model';

interface ISmartschoolProvider {
  id: string;
  token: string;
}

interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  userType: IUserType['name'];

  smartschoolProvider?: ISmartschoolProvider;

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  comparePassword(candidatePassword: String, cb: Function): void;
}

interface IUserModel extends PaginateModel<IUser> {}

const userSchema: Schema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      max: 64,
    },
    lastname: {
      type: String,
      required: true,
      max: 64,
    },
    email: {
      type: String,
      required: false,
      max: 128,
    },
    userType: {
      type: String,
      required: true,
      max: 64,
    },
    smartschoolProvider: {
      id: {
        type: String,
        required: false,
      },
      token: {
        type: String,
        required: false,
      },
    },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual('id').get(function(this: IUser) {
  return this._id;
});


userSchema.plugin(mongoosePaginate);
const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export { IUser, User, userSchema };

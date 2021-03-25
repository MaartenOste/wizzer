import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { IUserType } from './userType.model';
import { default as bcrypt } from 'bcrypt';
import { IClass } from './class.model';

interface ILocalProvider {
  password: string;
}

interface ISmartschoolProvider {
  id: string;
  token: string;
}

interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  userType: IUserType['name'];
  _classId: IClass['_id'];

  localProvider?: ILocalProvider;
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
    _classId: {
      type: Schema.Types.ObjectId || null,
      ref: 'Class',
      default: null,
      required: false,
    },
    localProvider: {
      password: {
        type: String,
        required: false,
      },
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

userSchema.virtual('class', {
  ref: 'Class',
  localField: '_classId',
  foreignField: '_id',
  justOne: true,
});

userSchema.pre('save', function(next) {
  const member: IUser = this as IUser;

  if (!member.isModified('localProvider.password')) return next();

  try {
    return bcrypt.genSalt(10, (errSalt, salt) => {
      if (errSalt) throw errSalt;

      bcrypt.hash(member.localProvider.password, salt, (errHash, hash) => {
        if (errHash) throw errHash;

        member.localProvider.password = hash;
        return next();
      });
    });
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = function(
  candidatePassword: String,
  cb: Function,
) {
  const user = this;
  bcrypt.compare(
    candidatePassword,
    user.localProvider.password,
    (err, isMatch) => {
      if (err) return cb(err, null);
      return cb(null, isMatch);
    },
  );
};

userSchema.plugin(mongoosePaginate);
const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export { IUser, User, userSchema };

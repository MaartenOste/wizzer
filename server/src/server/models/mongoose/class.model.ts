import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { default as bcrypt } from 'bcrypt';
import { default as slug } from 'slug';
import { IUser } from './user.model';
import { IExerciseGroup } from './exercisegroup.model';

interface IExercises {
  _exerciseGroupId: IExerciseGroup;
  public: boolean;
  _addedAt: Number;
}

interface IClass extends Document {
  name: string;
  slug: string;

  _exercises: Array<IExercises>;
  _studentIds: Array<IUser['_id']>;
  _teacherId: IUser['_id'];

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  slugify(): void;
}

interface IClassModel extends PaginateModel<IClass> {}

const classSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    _exercises: [
      {
        _exerciseGroupId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: false,
        },
        public: {
          required: false,
          type: Boolean,
        },
        _addedAt: {
          required: false,
          type: Number,
        },
      } || null,
    ], 
    _studentIds: [
      { type: Schema.Types.ObjectId, ref: 'ExerciseGroup', required: false } || null,
    ],
    _teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
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

classSchema.methods.slugify = function() {
  this.slug = slug(this.name);
};

classSchema.pre<IClass>('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  }
  return next();
});

classSchema.virtual('id').get(function(this: IClass) {
  return this._id;
});

classSchema.virtual('students', {
  ref: 'User',
  localField: '_studentIds',
  foreignField: '_id',
  justOne: false,
});

classSchema.virtual('teacher', {
  ref: 'User',
  localField: '_teacherId',
  foreignField: '_id',
  justOne: false,
});

classSchema.virtual('exercises', {
  ref: 'ExerciseGroup',
  localField: '_exercises._exerciseGroupId',
  foreignField: '_id',
  justOne: false,
});

classSchema.plugin(mongoosePaginate);
const Class = mongoose.model<IClass, IClassModel>('Class', classSchema);

export { IClass, Class, classSchema };

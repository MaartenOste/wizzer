import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { default as slug } from 'slug';
import { IUser } from './user.model';

interface IExerciseGroup extends Document {
  title: string;
  slug: string;
  description: string;
  instructionVideo: string;
  _createdBy: IUser['_id'];
  exercises: Array<Object>;
  example: Object;
  type: string;
  subType: string;

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  slugify(): void;
}

interface IExerciseGroupModel extends PaginateModel<IExerciseGroup> {}

const exerciseGroupSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,
      lowercase: true,
    },
    instructionVideo: {
      type: String,
      required: false,
    },
    _createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exercises: [{ type: Object, required: true }],
    example: { type: Object, required: true },
    type: {
      type: String,
      required: true,
    },
    subType: {
      type: String,
      required: true,
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

exerciseGroupSchema.virtual('id').get(function(this: IExerciseGroup) {
  return this._id;
});

exerciseGroupSchema.virtual('createdBy', {
  ref: 'User',
  localField: '_createdBy',
  foreignField: '_id',
  justOne: true,
});

exerciseGroupSchema.methods.slugify = function() {
  this.slug = slug(this.title);
  this.subType = slug(this.subType);
};

exerciseGroupSchema.pre<IExerciseGroup>('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  }
  return next();
});

exerciseGroupSchema.plugin(mongoosePaginate);
const ExerciseGroup = mongoose.model<IExerciseGroup, IExerciseGroupModel>(
  'ExerciseGroup',
  exerciseGroupSchema,
);

export { IExerciseGroup, ExerciseGroup, exerciseGroupSchema };

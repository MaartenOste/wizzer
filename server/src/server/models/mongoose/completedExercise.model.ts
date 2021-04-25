import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { default as slug } from 'slug';
import { IClass } from './class.model';
import { IExerciseGroup } from './exercisegroup.model';
import { IUser } from './user.model';

interface IAnswer {
  after: Array<Array<String>>;
  difficulty: String;
  first: Array<Array<String>>;
  scorePostDiff: String;
  scorePreDiff: String;
}

interface ICompletedExercise extends Document {
  score: string;
  answers: IAnswer;

  _completedBy: IUser['_id'];
  completedBy: IUser;

  _classId: IClass['_id'];
  _exerciseId: IExerciseGroup['_id'];

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
}

interface ICompletedExerciseModel extends PaginateModel<ICompletedExercise> {}

const completedExerciseSchema: Schema = new Schema(
  {
    score: {
      type: String,
      required: true,
      default: null,
    },
    answers: {
      type: Object,
      required: true,
    },
    _completedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    _classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    _exerciseId: {
      type: Schema.Types.ObjectId,
      ref: 'ExerciseGroup',
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

completedExerciseSchema.virtual('id').get(function(this: ICompletedExercise) {
  return this._id;
});

completedExerciseSchema.virtual('completedBy', {
  ref: 'User',
  localField: '_completedBy',
  foreignField: '_id',
  justOne: true,
});

completedExerciseSchema.virtual('class', {
  ref: 'Class',
  localField: '_classId',
  foreignField: '_id',
  justOne: true,
});

completedExerciseSchema.virtual('exercise', {
  ref: 'ExerciseGroup',
  localField: '_exerciseId',
  foreignField: '_id',
  justOne: true,
});

completedExerciseSchema.plugin(mongoosePaginate);
const CompletedExercise = mongoose.model<
  ICompletedExercise,
  ICompletedExerciseModel
>('CompletedExercise', completedExerciseSchema);

export { ICompletedExercise, CompletedExercise, completedExerciseSchema };

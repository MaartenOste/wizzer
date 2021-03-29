import { default as mongoose, Connection } from 'mongoose';
import { default as faker } from 'faker';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import {
  IClass,
  Class,
  ICompletedExercise,
  CompletedExercise,
  IUser,
  User,
  IExerciseGroup,
  ExerciseGroup,
  IUserType,
  UserType,
} from '../../models/mongoose';

interface ISmartschoolProvider {
  id: string;
  token: string;
}

interface IExercises {
  _exerciseGroupId: IExerciseGroup['_id'];
  public: boolean;
}

class MongoDBDatabase {
  private config: IConfig;
  private logger: ILogger;
  private db: Connection;

  private classGroups: Array<IClass>;
  private users: Array<IUser>;
  private userTypes: Array<IUserType>;
  private exercises: Array<IExerciseGroup>;
  private completedExercises: Array<ICompletedExercise>;

  constructor(logger: ILogger, config: IConfig) {
    this.logger = logger;
    this.config = config;

    this.classGroups = [];
    this.users = [];
    this.userTypes = [];
    this.exercises = [];
    this.completedExercises = [];
  }

  public connect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      mongoose
        .connect(this.config.mongoDBConnection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(data => {
          this.db = mongoose.connection;

          this.logger.info('Connected to the mongodb database', {});

          resolve(true);
        })
        .catch(error => {
          this.logger.error("Can't connect to the database", error);

          reject(error);
        });
    });
  }

  public disconnect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db
        .close(true)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          this.logger.error("Can't disconnect the database", error);

          reject(error);
        });
    });
  }

  private userTypeCreate = async (name: string) => {
    const userTypeDetail = {
      name,
    };
    const userType: IUserType = new UserType(userTypeDetail);

    try {
      const createdUserType = await userType.save();
      this.userTypes.push(createdUserType);

      this.logger.info(`UserType created with id: ${createdUserType._id}`, {});
    } catch (err) {
      this.logger.error(
        `An error occurred when creating a userType ${err}`,
        err,
      );
    }
  };

  private createUserTypes = async () => {
    const promises = [];

    promises.push(this.userTypeCreate('Student'));

    promises.push(this.userTypeCreate('Teacher'));
    return await Promise.all(promises);
  };

  private userCreate = async (
    firstname: string,
    lastname: string,
    email: string,
    userType: IUserType['name'],
    localProvider?: Object,
    smartschoolProvider?: ISmartschoolProvider,
  ) => {
    const userDetail = {
      firstname,
      lastname,
      email,
      userType,
      localProvider,
      smartschoolProvider,
    };
    const user: IUser = new User(userDetail);

    try {
      const createdUser = await user.save();
      this.users.push(createdUser);

      this.logger.info(
        `User (${createdUser.userType}) created with id: ${createdUser._id}`,
        {},
      );
    } catch (err) {
      this.logger.error(`An error occurred when creating a user ${err}`, err);
    }
  };

  private createUsers = async () => {
    const promises = [];

    for (let i = 0; i < 50; i++) {
      let fname = faker.name.firstName();
      let lname = faker.name.lastName();
      promises.push(
        this.userCreate(
          fname,
          lname,
          `${faker.internet.email(fname, lname, 'smartschool.be')}`,
          this.userTypes[0].name,
          { password: 'lel' },
          { id: faker.random.uuid(), token: faker.random.uuid() },
        ),
      );
    }
    for (let i = 0; i < 5; i++) {
      let fname = faker.name.firstName();
      let lname = faker.name.lastName();
      promises.push(
        this.userCreate(
          fname,
          lname,
          `${faker.internet.email(fname, lname, 'smartschool.be')}`,
          this.userTypes[1].name,
          { password: 'lel' },
          { id: faker.random.uuid(), token: faker.random.uuid() },
        ),
      );
    }
    return await Promise.all(promises);
  };

  private exerciseCreate = async (
    title: string,
    description: string,
    instructionVideo: string,
    _createdBy: IUser['_id'],
    exercises: Array<Object>,
    example: Object,
    type: string,
    subType: string,
  ) => {
    const exerciseDetail = {
      title,
      description,
      instructionVideo,
      _createdBy,
      exercises,
      example,
      type,
      subType,
    };
    const exerciseGroup: IExerciseGroup = new ExerciseGroup(exerciseDetail);

    try {
      const createdExerciseGroup = await exerciseGroup.save();
      this.exercises.push(createdExerciseGroup);

      this.logger.info(
        `ExerciseGroup created with id: ${createdExerciseGroup._id}`,
        {},
      );
    } catch (err) {
      this.logger.error(
        `An error occurred when creating a exerciseGroup ${err}`,
        err,
      );
    }
  };

  private createExercises = async () => {
    const promises = [];
    const types: Array<String> = [
      'getallenkennis',
      'bewerkingen',
      'meetkunde',
      'toepassingen',
      'meten_en_metend_rekenen',
    ];
    const subTypes: any = {
      getallenkennis: [
        'getallen gebruiken om te zeggen hoeveel er zijn',
        'getallen gebruiken in een rangorde',
        'getallen gebruiken bij een maateenheid',
        'getallen gebruiken in een bewerking',
        'getallen gebruiken als code',
        'we geven de natuurlijke getallen tot 1000 een plaats op honderdvelden',
        'we geven de natuurlijke getallen tot 1000 een plaats op getallenassen',
        'we vergelijken en ordenen natuurlijke getallen',
        'duizendtal, honderdtal, tiental en eenheid',
        'we structureren getallen',
        'tellen, terugtellen en doortellen per 1, per 2, per 5, per 10, per 50 of per 100',
        'patronen',
        'schatten',
        'afronden',
        'even getallen',
        'oneven getallen',
        'ik deel 18',
        'gemeenschappelijke delers',
        'kenmerken van deelbaarheid',
        'veelvouden',
        'breuken',
        'de breukenladder',
        'stambreuken',
      ],
      bewerkingen: [
        'ik ken rekentaal',
        'eigenschappen van en relaties tussen bewerkingen',
        'ik controleer met de omgekeerde bewerking',
        'hoofdrekenen (optellen, aftrekken, vermenigvuldigen en delen)',
        'maaltafels en de deeltafels/delingstafels',
        'hoofdrekenen met breuken',
        'schatten',
        'cijferen - Optellen',
        'cijferen - Aftrekken',
        'cijferen - Vermenigvuldigen',
        'cijferen - Delen',
      ],
      meetkunde: [
        'meten door te vergelijken',
        'meten met natuurlijke maateenheden',
        'lengte',
        'inhoud',
        'gewicht',
        'tijd',
        'geldwaarden',
        'temperatuur',
      ],
      meten_en_metend_rekenen: [
        'we oriënteren ons ruimtelijk',
        'rechte lijnen',
        'oppervlakken',
        'vlakke figuren',
        'hoeken',
        'veelhoeken',
        'vierhoeken (vierkant, rechthoek, ruit, parallellogram en trapezium)',
        'diagonalen',
        'driehoeken',
        'symmetrie',
        'gelijkheid van vorm én van grootte',
        'schaduwbeelden',
        'kijklijnen of viseerlijnen',
        'patronen',
      ],
      toepassingen: ['werkwijze (heuristiek)', 'voorbeelden'],
    };
    for (let i = 0; i < 25; i++) {
      let type = types[Math.floor(Math.random() * types.length)].toString();
      promises.push(
        this.exerciseCreate(
          faker.lorem.sentence(),
          faker.lorem.paragraph(5),
          faker.internet.url(),
          this.users.filter(user => {
            return user.userType === 'Teacher';
          })[Math.floor(Math.random() * 5)]._id,
          [
            { randomdata: 'lel' },
            { randomdata: 'yeet' },
            { randomdata: 'skeet' },
          ],
          { example: `Voorbeeld ${i}` },
          type,
          subTypes[type][Math.floor(Math.random() * subTypes[type].length)],
        ),
      );
    }
    return await Promise.all(promises);
  };

  private classCreate = async (
    name: string,
    _exercises: Array<IExercises>,
    _studentIds: Array<IUser['_id']>,
    _teacherId: IUser['_id'],
  ) => {
    const classDetail = {
      name,
      _exercises,
      _studentIds,
      _teacherId,
    };
    const classGroup: IClass = new Class(classDetail);

    try {
      const createdClassGroup = await classGroup.save();
      this.classGroups.push(createdClassGroup);

      this.logger.info(
        `ClassGroups created with id: ${createdClassGroup._id}`,
        {},
      );
    } catch (err) {
      this.logger.error(
        `An error occurred when creating a classGroups ${err}`,
        err,
      );
    }
  };

  private createClasses = async () => {
    const promises = [];
    let teachers = this.users.filter(user => {
      return user.userType === 'Teacher';
    });
    for (let i = 0; i < teachers.length; i++) {
      let localExercises = this.exercises
        .filter(ex => {
          return ex._createdBy.toString() === teachers[i]._id.toString();
        })
        .map(ex => {
          return {
            _exerciseGroupId: ex._id,
            public: faker.random.boolean(),
            _addedAt: Date.now(),
          };
        });

      promises.push(
        this.classCreate(
          `${faker.random.number(6)}${faker.random.word()[0].toUpperCase()}`,
          localExercises,
          this.users
            .filter(user => {
              return user.userType === 'Student';
            })
            .slice(i * 10, i * 10 + 9),
          teachers[i],
        ),
      );
    }

    return await Promise.all(promises);
  };

  private completedExCreate = async (
    score: string,
    answers: Object,

    _completedBy: IUser['_id'],
    _classId: IClass['_id'],
    _exerciseId: IExerciseGroup['_id'],
  ) => {
    const classDetail = {
      score,
      answers,
      _completedBy,
      _classId,
      _exerciseId,
    };
    const completedExercise: ICompletedExercise = new CompletedExercise(
      classDetail,
    );

    try {
      const createdCompletedExercise = await completedExercise.save();
      this.completedExercises.push(createdCompletedExercise);

      this.logger.info(
        `CompletedExercise created with id: ${createdCompletedExercise._id}`,
        {},
      );
    } catch (err) {
      this.logger.error(
        `An error occurred when creating a completedExercise ${err}`,
        err,
      );
    }
  };

  private createCompletedEx = async () => {
    const promises = [];
    for (let i = 0; i < this.classGroups.length; i++) {
      for (let j = 0; j < this.classGroups[i]._exercises.length - 1; j++) {
        for (let k = 0; k < this.classGroups[i]._studentIds.length; k++) {
          promises.push(
            this.completedExCreate(
              `${faker.random.number(5)}/5`,
              [
                {
                  answerData: { data: 'randomdata' },
                  correct: faker.random.boolean(),
                },
                {
                  answerData: { data: 'randomdata' },
                  correct: faker.random.boolean(),
                },
                {
                  answerData: { data: 'randomdata' },
                  correct: faker.random.boolean(),
                },
                {
                  answerData: { data: 'randomdata' },
                  correct: faker.random.boolean(),
                },
              ],
              this.classGroups[i]._studentIds[k],
              this.classGroups[i]._id,
              this.classGroups[i]._exercises[j]._exerciseGroupId,
            ),
          );
        }
      }
    }
    return await Promise.all(promises);
  };

  public seed = async () => {
    this.userTypes = await UserType.estimatedDocumentCount()
      .exec()
      .then(async (count: Number) => {
        if (count === 0) {
          await this.createUserTypes();
        }
        return UserType.find().exec();
      });

    this.users = await User.estimatedDocumentCount()
      .exec()
      .then(async (count: Number) => {
        if (count === 0) {
          await this.createUsers();
        }
        return User.find().exec();
      });

    this.exercises = await ExerciseGroup.estimatedDocumentCount()
      .exec()
      .then(async (count: Number) => {
        if (count === 0) {
          await this.createExercises();
        }
        return ExerciseGroup.find().exec();
      });

    this.classGroups = await Class.estimatedDocumentCount()
      .exec()
      .then(async (count: Number) => {
        if (count === 0) {
          await this.createClasses();
        }
        return Class.find().exec();
      });

    this.completedExercises = await CompletedExercise.estimatedDocumentCount()
      .exec()
      .then(async (count: Number) => {
        if (count === 0) {
          await this.createCompletedEx();
        }
        return CompletedExercise.find().exec();
      });
  };
}

export default MongoDBDatabase;

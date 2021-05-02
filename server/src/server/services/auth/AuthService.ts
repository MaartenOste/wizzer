import { default as passport, PassportStatic } from 'passport';
const SmartschoolStrategy = require('@diekeure/passport-smartschool');
import { IConfig } from '../config';
import { Class, User } from '../../models/mongoose';
import { default as axios } from 'axios';

class AuthService {
  private config: IConfig;
  public passport: PassportStatic;
  private LocalSmartschoolStrategy = SmartschoolStrategy;


  constructor(config: IConfig) {
    this.config = config;
    //this.initializeLocalStrategy();
    this.initializeSmartschoolStrategy();
    //this.initializeJwtStrategy();
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    this.passport = passport;
  }

  private initializeSmartschoolStrategy() {
    passport.use(
      new this.LocalSmartschoolStrategy(
        {
          clientID: '42d03a7a0ac7',
          clientSecret: 'ee9d1bbbad97',
          callbackURL: 'https://wizzer.be/api/auth/smartschool',
          scope: 'userinfo fulluserinfo',
        },
        function(accessToken: any, refreshToken: any, profile: any, cb: any) {
          if (profile._json.isCoAccount === 1) {
            return cb(null, false);
          }

          axios
            .get(
              `https://sintjozefsinstituutbao.smartschool.be/Api/V1/fulluserinfo?access_token=${accessToken}`,
            )
            .then(response => {
              const data = response.data;
              
              User.findOne(
                { 'smartschoolProvider.id': data.userID },
                async function(err: any, user: any) {

                  if (!user || Object.keys(user).length === 0) {
                    let userType;
                    data.basisrol === 'Leerkracht'
                      ? (userType = 'Teacher')
                      : (userType = 'Student');
                    let tempuser = new User({
                      firstname: data.name,
                      lastname: data.surname,
                      email: data.email,
                      userType,
                      smartschoolProvider: {
                        id: data.userID,
                        token: 'azerazer',
                      },
                    });
                    
                    await tempuser.save();
                    
                    if (data.basisrol === 'Leerkracht') {
                      let tempClass = new Class({
                        name: 'Klas van ' + data.name + ' ' + data.surname,
                      
                        _exercises: [],
                        _studentIds: [],
                        _teacherId: tempuser.id
                      });
                      await tempClass.save();
                      
                    }

                    return cb(false, tempuser);
                  }
                  return cb(false, user);
                },
              );
            });
        },
      ),
    );
  }
}

export default AuthService;

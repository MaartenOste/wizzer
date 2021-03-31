import { Request, Response, NextFunction, response } from 'express';
import { default as passport, PassportStatic } from 'passport';
import { default as passportLocal } from 'passport-local';
import { default as passportJwt } from 'passport-jwt';
import { default as jwt } from 'jsonwebtoken';
const SmartschoolStrategy = require('@diekeure/passport-smartschool');
import { Environment, IConfig } from '../config';
import { User } from '../../models/mongoose';
import { Role } from './auth.types';
import { UnauthorizedError, ForbiddenError } from '../../utilities';
import { default as axios} from 'axios';


class AuthService {
  private config: IConfig;
  public passport: PassportStatic;
  private LocalStrategy = passportLocal.Strategy;
  private LocalSmartschoolStrategy = SmartschoolStrategy;
  private ExtractJwt = passportJwt.ExtractJwt;
  private JwtStrategy = passportJwt.Strategy;

  constructor(config: IConfig) {
    this.config = config;
    //this.initializeLocalStrategy();
    this.initializeSmartschoolStrategy();
    //this.initializeJwtStrategy();
    passport.serializeUser((user, done) => {
      //console.log('serialize: ', user);

      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      //console.log('deserialize: ', user);
      
      done(null, user);
    });

    this.passport = passport;
  }

  private initializeLocalStrategy() {
    passport.use(
      new this.LocalStrategy(
        {
          usernameField: 'email',
        },
        async (email: string, password: string, done) => {
          try {
            const user = await User.findOne({
              email: email,
            });
            if (!user) {
              return done(null, false, { message: 'No user by that email' });
            } else {
              return user.comparePassword(
                password,
                (error: Error, isMatch: boolean) => {
                  if (!isMatch) {
                    return done(null, false);
                  }
                  return done(null, user);
                },
              );
            }
          } catch (error) {
            return done(error, false);
          }
        },
      ),
    );
  }

  private initializeSmartschoolStrategy() {
    passport.use(
      new this.LocalSmartschoolStrategy (
        {
          clientID: '42d03a7a0ac7',
          clientSecret: 'ee9d1bbbad97',
          callbackURL: 'http://localhost:8080/api/auth/smartschool',
          scope: 'userinfo fulluserinfo'
        },
        function(accessToken: any, refreshToken: any, profile: any, cb: any) {
          
          console.log(profile._json.isCoAccount);

          if (profile._json.isCoAccount === 1) {
            return cb(null,false)
          }

          axios.get(`https://sintjozefsinstituutbao.smartschool.be/Api/V1/fulluserinfo?access_token=${accessToken}`)
          .then((response) => {
            const data = response.data;
            console.log(data);
            console.log(data.userID);
            
            
            //const user = { userId: tempuser.id, username: `${tempuser.firstname} ${tempuser.lastname}`}
            User.find({ 'smartschoolProvider.id': data.userID }, async function(err:any, user:any) {
              if (!user || user.length === 0) {
                let userType;
                data.basisrol === 'Leerkracht'? userType = 'Teacher': userType = 'Student';
                let tempuser = new User({firstname: data.name, lastname: data.surname, email: data.email, userType, smartschoolProvider:{id: data.userID, token:'azerazer'}});
                console.log('saving new user');
                
                await tempuser.save();
                return cb(false, tempuser);
              }
              console.log('user found');
              return cb(false, user);
            });
          });
        },
      ),
    );
  }

  public createToken(user: any): string {
    const payload = {
      id: user._id,
    };
    return jwt.sign(payload, this.config.auth.jwt.secret, {
      expiresIn: 60 * 120,
    });
  }
}

export default AuthService;

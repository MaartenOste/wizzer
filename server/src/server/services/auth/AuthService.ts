import { Request, Response, NextFunction } from 'express';
import { default as passport, PassportStatic } from 'passport';
import { default as passportLocal } from 'passport-local';
import { default as passportJwt } from 'passport-jwt';
import { default as jwt } from 'jsonwebtoken';
//import { default as SmartschoolStrategy } from '@diekeure/passport-smartschool';
let SmartschoolStrategy = require('@diekeure/passport-smartschool').Strategy;

import { Environment, IConfig } from '../config';
import { User } from '../../models/mongoose';
import { Role } from './auth.types';
import { UnauthorizedError, ForbiddenError } from '../../utilities';

class AuthService {
  private config: IConfig;
  public passport: PassportStatic;
  private LocalStrategy = passportLocal.Strategy;
  private ExtractJwt = passportJwt.ExtractJwt;
  private JwtStrategy = passportJwt.Strategy;

  constructor(config: IConfig) {
    this.config = config;

    this.initializeLocalStrategy();
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
      new SmartschoolStrategy(
        {
          clientID: '42d03a7a0ac7',
          clientSecret: 'ee9d1bbbad97',
          callbackURL: 'https://wizzer.be/api/auth/smartschool',
        },
        function(accessToken: any, refreshToken: any, profile: any, cb: any) {
          console.log(accessToken, refreshToken, profile, cb);

          User.findOrCreate({ smartschoolId: profile.id }, function(err, user) {
            return cb(err, user);
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

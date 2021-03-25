export enum Environment {
  development = 'development',
  local = 'local',
  production = 'production',
  staging = 'staging',
  test = 'test',
}

export enum ServerProtocol {
  http = 'http',
  https = 'https',
}

export interface IServerConfig {
  host: string;
  port: number;
  protocol: ServerProtocol;
}

export interface IAuthConfig {
  bcryptSalt: number;
  jwt: IJwtConfig;
  smartschool?: ISmartschoolConfig;
}

export interface IJwtConfig {
  secret: string;
  session: boolean;
}

export interface IFacebookConfig {
  clientId: string;
  clientSecret: string;
}

export interface ISmartschoolConfig {
  clientId: string;
  clientSecret: string;
  session: boolean;
}

export interface IConfig {
  env: Environment;
  docs: boolean;
  server: IServerConfig;
  mongoDBConnection: string;
  auth: IAuthConfig;
}

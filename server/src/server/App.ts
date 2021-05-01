import { default as http, createServer, Server } from 'http';
import {
  default as express,
  Application,
} from 'express';

const session = require('express-session');

import { default as Router } from './router';
import {
  GlobalMiddleware,
} from './middleware';
import { ILogger, IConfig, AuthService } from './services';
import { default as passport } from 'passport';

class App {
  public app: Application;
  private rootPath: string;
  private config: IConfig;
  private logger: ILogger;
  private router: Router;
  private server: Server;
  private authService: AuthService;

  constructor(rootPath: string, logger: ILogger, config: IConfig) {
    this.rootPath = rootPath;
    this.logger = logger;
    this.config = config;

    this.createExpress();
    this.createServer();
  }

  private createExpress(): void {
    this.app = express();
    GlobalMiddleware.load(this.rootPath, this.app, this.config);
    this.app.use(
      session({
        secret: 'MU0q8GTY*FcVfrWrES',
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
        },
      }),
    );
    this.createPassport();
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.createRouter();
  }

  private createServer(): void {
    this.server = createServer(this.app);
    this.server.on('error', (error?: Error) => {
      this.gracefulShutdown(error);
    });
    this.server.on('close', () => {
      this.logger.info('Server is closed!', {});
    });
    this.server.on('listening', () => {
      this.logger.info(
        `Server is listening on ${this.config.server.host}:${this.config.server.port}`,
        {},
      );
    });
  }

  private createPassport(): void {
    this.authService = new AuthService(this.config);
  }

  private createRouter(): void {
    this.router = new Router(
      this.rootPath,
      this.app,
      this.config,
      this.authService,
    );
  }

  public start(): void {
    this.server.listen(this.config.server.port, this.config.server.host);
  }

  public stop(): void {
    this.server.close((error?: Error) => {
      this.gracefulShutdown(error);
    });
  }

  private gracefulShutdown(error?: Error): void {
    this.logger.info('Server is gracefully shutdown!', error || {});

    if (error) {
      process.exit(1);
    }
    process.exit();
  }
}

export default App;

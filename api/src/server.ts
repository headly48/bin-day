import Koa, { BaseContext, DefaultState, ParameterizedContext } from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import winston from "winston";
import { createConnection, ConnectionOptions } from "typeorm";
import "reflect-metadata";

import { logger } from "./logger";
import { config } from "./config";
// import { unprotectedRouter } from "./unprotectedRoutes";
// import { protectedRouter } from "./routes/protectedRoutes";
import { cron } from "./cron";
import { Db, MongoClient } from "mongodb";
import { loadData } from "./data/data-loader";

import {default as passport } from 'koa-passport';
import { default as session } from 'koa-session';

import {default as PassportLocal} from 'passport-local';

import {Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { UsersRepository } from "./repositories/UsersRepository";
import { configureAuth } from "./utils/auth";
import { unAuthenticatedRoutes } from "./routes/UnAuthenticatedRoutes";
import { authenticatedRoutes } from "./routes/AuthenticatedRoutes";
import { UsersService } from "./services/UsersService";
import { LocationsRepository } from "./repositories/LocationsRepository";


const connectionOptions: ConnectionOptions = {
  type: "postgres",
  url: config.databaseUrl,
  synchronize: true,
  logging: false,
  entities: config.dbEntitiesPath,
  ssl: config.dbsslconn, // if not development, will use SSL
  extra: {},
};
if (connectionOptions.ssl) {
  connectionOptions.extra.ssl = {
    rejectUnauthorized: false, // Heroku uses self signed certificates
  };
}

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection(connectionOptions)
  .then(async () => {
    const app = new Koa<DefaultState, ServerContext>();

    app.context.appContext = await createAppContext();

    // await loadData((app.context.appContext as AppContext).mongo.db);

    // Provides important security headers to make your app more secure
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "cdnjs.cloudflare.com",
            "fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          imgSrc: [
            "'self'",
            "data:",
            "online.swagger.io",
            "validator.swagger.io",
          ],
        },
      })
    );

    // TODO: Update session key
    // app.keys = new Keygrip(['64bytes_long_string_1', '64bytes_long_string_2'], 'sha512', 'base64')

    app.keys = ['super-secret-key'];
    app.use(session(app));

    // Enable cors with default options
    app.use(cors());

    // Logger middleware -> use winston as logger (logging.ts with config)
    app.use(logger(winston));

    // Enable bodyParser with default options
    app.use(bodyParser());

    configureAuth(app.context.appContext.repositories.usersRepository);

    app.use(passport.initialize());
    app.use(passport.session());


  //   passport.use(new JWTStrategy({
  //       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //       secretOrKey   : 'your_jwt_secret'
  //   },
  //   async function (jwtPayload, cb) {
  //     console.log("JWT STRAT")
  //     const collection = app.context.mongo.db.collection("users");

  //     const record = await collection.findOne({
  //       username: jwtPayload.username
  //     })

  //     if(record) {
  //       cb(null, record);
  //     } else {
  //       cb(new Error("User does not exist"));
  //     }
  //   }
  // ));




    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    // app.use(
    //   jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] })
    // );

    // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(unAuthenticatedRoutes.routes()).use(unAuthenticatedRoutes.allowedMethods());
    app.use(authenticatedRoutes.routes()).use(authenticatedRoutes.allowedMethods());

    // Register cron job to do any action needed
    cron.start();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error: string) => console.log("TypeORM connection error: ", error));



const createAppContext = async (): Promise<AppContext> => {
  const url = "mongodb://binday:password@localhost:27017";
  const client = new MongoClient(url);
  const dbName = "BinDay";

  await client.connect();
  const db = client.db(dbName);

  const usersRepository = new UsersRepository(db);
  const locationsRepository = new LocationsRepository(db);

  const usersService = new UsersService(usersRepository, locationsRepository)
  return {
    mongo: {
      db,
    },
    repositories: {
      usersRepository,
      locationsRepository
    },
    services: {
      usersService
    }
    
  };
};

export type ServerContext = {
  appContext: AppContext;
};

type AppContext = {
  mongo: {
    db: Db;
  };
  repositories: {
    usersRepository: UsersRepository,
    locationsRepository: LocationsRepository
  }
  services: {
    usersService: UsersService
  }
};

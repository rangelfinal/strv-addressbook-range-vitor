import { EntityManager, MikroORM, RequestContext } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/postgresql";
import FirebaseAdmin from "firebase-admin";
import { Server } from "http";
import Koa from "koa";
import bodyParser from "koa-body";
import koaHelmet from "koa-helmet";
import jwt from "koa-jwt";
import logger from "koa-logger";
import Router from "koa-router";
import { contactController } from "./contact/contact.controller";
import { userController } from "./user/user.controller";
import { User } from "./user/user.entity";

export const JWTSecret = "2e610f6a-0f4f-4edf-9b3d-68b815262701"; // Temp fake secret for development

// Basic dependency injection based on https://github.com/mikro-orm/koa-ts-example-app/blob/7c291ce75c38760175261c082e8b8f1c2635bc40/app/server.ts#L11
export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
};

export const app = new Koa();

// Setup logger
app.use(logger());

// Setup helmet <https://github.com/helmetjs/helmet>
app.use(koaHelmet());

// Basic 401 handling to format koa-jwt errors
app.use((ctx, next) =>
  next().catch((err: Error & { status: number }) => {
    console.error(err);
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        message: "Protected resource, use Authorization header to get access\n",
      };
    } else {
      throw err;
    }
  })
);

// Initialize firebase and export firestore instance
FirebaseAdmin.initializeApp();
export const Firestore = FirebaseAdmin.firestore();

// Basic 'GET /' endpoint
const baseController = new Router();
baseController.get("/", (ctx) => {
  ctx.body = {
    message:
      "This is a back end tech assessment developed by Vitor Rangel to STRV",
  };
});

const defaultPort = process.env.PORT ? Number(process.env.PORT) : 3000;

export const serve = async (port: number = defaultPort): Promise<Server> => {
  DI.orm = await MikroORM.init(); // CLI config will be used automatically
  DI.em = DI.orm.em;
  DI.userRepository = DI.em.getRepository(User);

  // Setup body parsing middleware
  app.use(bodyParser());

  // Create clean request context for mikro-orm for each context https://mikro-orm.io/docs/installation#request-context
  app.use((ctx, next) => RequestContext.createAsync(DI.orm.em, next));

  app.use(baseController.routes()).use(baseController.allowedMethods());

  // Endpoints to login and register new user
  app.use(userController.routes()).use(userController.allowedMethods());

  // Middleware below this line is only reached if JWT token is valid
  app.use(jwt({ secret: JWTSecret }));

  // Endpoints to register a new contact
  app.use(contactController.routes()).use(contactController.allowedMethods());

  // Basic 401 handling to format koa-jwt errors
  app.use((ctx, next) =>
    next().catch((err: Error & { status: number }) => {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          message: "Protected resource, use Authorization header to get access",
        };
      } else {
        throw err;
      }
    })
  );

  // Listen to requests
  return app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};

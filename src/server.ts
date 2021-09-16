import Koa from "koa";
import jwt from "koa-jwt";
import bodyParser from "koa-body";
import Router from "koa-router";
import { EntityManager, MikroORM, RequestContext } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/postgresql";
import { User } from "./user/user.entity";
import FirebaseAdmin from "firebase-admin";
import serviceAccount from "./path/to/serviceAccountKey.json";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.GCLOUD_PROJECT = "strv-addressbook-rangel-vitor";

// Basic dependency injection based on https://github.com/mikro-orm/koa-ts-example-app/blob/7c291ce75c38760175261c082e8b8f1c2635bc40/app/server.ts#L11
export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
};

export const app = new Koa();
const api = new Router();

// Initialize firebase and export firestore instance
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
});
export const Firestore = FirebaseAdmin.firestore();

// Basic 'GET /' endpoint
api.get(
  "/",
  (ctx) =>
    (ctx.body = {
      message: `This is a back end tech assessment developed by Vitor Rangel to STRV`,
    })
);

// Endpoints to register a new user and login
api.use("/user");

// Middleware below this line is only reached if JWT token is valid
app.use(jwt({ secret: "shared-secret" }));

// Endpoints to register a new contact
api.use("/contact");

const port = process.env.PORT || 3000;

(async () => {
  DI.orm = await MikroORM.init(); // CLI config will be used automatically
  DI.em = DI.orm.em;
  DI.userRepository = DI.em.getRepository(User);

  // Setup body parsing middleware
  app.use(bodyParser());

  // Create clean request context for mikro-orm for each context https://mikro-orm.io/docs/installation#request-context
  app.use((ctx, next) => RequestContext.createAsync(DI.orm.em, next));

  // Setup router
  app.use(api.routes());

  // Setup middleware to handle OPTIONS requests
  app.use(api.allowedMethods());

  // Basic 404 handling
  app.use((ctx, next) => {
    ctx.status = 404;
    ctx.body = { message: "No route found" };
  });

  // Basic 401 handling to format koa-jwt errors
  app.use((ctx, next) =>
    next().catch((err) => {
      if (err.status == 401) {
        ctx.status = 401;
        ctx.body =
          "Protected resource, use Authorization header to get access\n";
      } else {
        throw err;
      }
    })
  );

  // Listen to requests
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
})();

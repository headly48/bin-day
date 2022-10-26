import { Passport } from "koa-passport";
import { SwaggerRouter } from "koa-swagger-decorator";
import { user, lga } from "./controller";
import {default as passport } from 'koa-passport';

const protectedRouter = new SwaggerRouter();

protectedRouter.get("/test1", (ctx) => {
  ctx.body = "unauthenticated route successful";
})

protectedRouter.get("/test", passport.authenticate("jwt", { session: false }), (ctx) => {
  ctx.body = "authenticated route successful";
})

// USER ROUTES
protectedRouter.get("/users", user.getUsers);
protectedRouter.get("/users/:id", user.getUser);
protectedRouter.post("/users", user.createUser);
protectedRouter.put("/users/:id", user.updateUser);
protectedRouter.delete("/users/:id", user.deleteUser);
protectedRouter.delete("/testusers", user.deleteTestUsers);

protectedRouter.get("/lga", lga.findLGA);

// Swagger endpoint
protectedRouter.swagger({
  title: "node-typescript-koa-rest",
  description:
    "API REST using NodeJS and KOA framework, typescript. TypeORM for SQL with class-validators. Middlewares JWT, CORS, Winston Logger.",
  version: "1.8.0",
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(__dirname);

export { protectedRouter };

import { Context, Next } from "koa";
import { Passport } from "koa-passport";
import winston from "winston";
import { default as passport } from 'koa-passport';

export const isAuthenticated = (ctx: Context, next: Next) => {
  winston.log("info", "isAuthenticated")

  return passport.authenticate('jwt', {session: false})(ctx, next)
  // if (!ctx.isAuthenticated()) {
  //   ctx.status = 401;
  // } else {
  //   next();
  // }
}
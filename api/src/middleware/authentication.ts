import { Context, Next } from "koa";


export const isAuthenticated = (ctx: Context, next: Next) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
      } else {
        next();
      }
}
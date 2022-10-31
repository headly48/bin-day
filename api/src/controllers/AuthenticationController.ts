import { BaseContext } from "koa";
import { default as passport } from 'koa-passport';
import { RouterContext } from "@koa/router";
import { ServerContext } from "../server";
import winston from "winston";

export default class AuthenticationController {

    public static async register(ctx: RouterContext<any, ServerContext>): Promise<void> {

        const { username, password, name } = ctx.request.body;

        if (!username || !password) {
            ctx.status = 400;
            ctx.body = {
                errors: [
                    { id: "BODY_INVALID" }
                ]
            };
            return;
        }

        try {

            await ctx.appContext.services.usersService.registerUser({
                username, password, name
            })

            ctx.status = 201;
        } catch (err) {
            if (err.message === "USER_EXISTS") {
                ctx.status = 400;
                ctx.body = {
                    errors: [
                        { id: "USER_EXISTS" }
                    ]
                };
            } else {
                winston.log("error", "Error registering user", err)
                ctx.status = 500;
            }
        }


        // Login user after registration to return session
        await passport.authenticate('local', (err, user, info) => {
            if (user) {
                ctx.login(user);
                ctx.status = 200
            } else {
                ctx.status = 400;
                ctx.body = { status: 'error' };
            }
        })(ctx, null)
    }

    public static async loginUser(ctx: BaseContext): Promise<void> {

        return passport.authenticate('local', async (err, user, info) => {
            winston.log("info", `Logging in use6r`, user, info);

            if (user) {
                winston.log("info", `inside`);
                await (ctx as any).login(user);
                ctx.status = 200;
            } else {
                ctx.status = 400;
                ctx.body = { status: 'error' };
            }
        })(ctx as any, null);
    }
}
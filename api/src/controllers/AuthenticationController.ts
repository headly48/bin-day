import { BaseContext } from "koa";
import { description, request, summary, tagsAll } from "koa-swagger-decorator";
import { default as passport } from 'koa-passport';
import { RouterContext } from "@koa/router";
import { ServerContext } from "../server";
import winston from "winston";
const jwt = require('jsonwebtoken');

export default class AuthController {

    public static async register(ctx: RouterContext<any, ServerContext>): Promise<void> {

        const collection = ctx.appContext.mongo.db.collection("users");

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

        const record = await collection.findOne({
            username: username
        })

        if (record) {
            ctx.status = 400;
            ctx.body = {
                errors: [
                    { id: "USER_EXISTS" }
                ]
            };
            return;
        }

        await collection.insertOne({ username, password, name })

        // const user = await queries.addUser(ctx.request.body);


        // passport.authenticate("local", {session: false}, (error, user, info) => {


        // })


        // passport.authenticate('local',
        //     {
        //         session: false
        //     }, (err, user, info) => {

        //         // if (user) {
        //         //     ctx.login(user);
        //         //     ctx.redirect('/auth/status');
        //         // } else {
        //         //     ctx.status = 400;
        //         //     ctx.body = { status: 'error' };
        //         // }

        //     })(ctx);

    }

    public static async loginUser(ctx: BaseContext): Promise<void> {

        return passport.authenticate('local', async (err, user, info) => {
            winston.log("info", `Logging in use6r`, user, info);

            if (user) {
                winston.log("info", `inside`);
                await (ctx as any).login(user);

                // winston.log("info", `inside2`, test);
                ctx.status = 200;
                // ctx.body = 'accepted';
            } else {
                ctx.status = 400;
                ctx.body = { status: 'error' };
            }
        })(ctx as any, null);
    }
}
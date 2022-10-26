import { BaseContext } from "koa";
import { description, request, summary, tagsAll } from "koa-swagger-decorator";
import {default as passport } from 'koa-passport';
import { RouterContext } from "@koa/router";
import { ServerContext } from "../server";
import winston from "winston";
const jwt = require('jsonwebtoken');

@tagsAll(["Auth"])
export default class AuthController {

    @request("post", "/auth/register")
    @summary("Register user")
    @description("A simple welcome message to verify the service is up and running.")
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

    @request("post", "/auth/login")
    @summary("Register user")
    @description("A simple welcome message to verify the service is up and running.")
    public static async login(ctx: BaseContext): Promise<void> {
        winston.log("info", `Login`, ctx.body);
        
        passport.authenticate('local', {session: false}, async (err, user, info) => {
            winston.log("info", `Login inside`, user, info);
            if (err || !user) {
                ctx.status = 400;
                ctx.body = {
                    message: 'Something is not right',
                    user   : user
                }
            }

            // winston.log("info", ctx);

            await (ctx as any).login(user, {session: false}, (err: any) => {
               winston.log("info", `passport login`);
               if (err) {
                   ctx.status = 400;
               }

               // generate a signed son web token with the contents of user object and return it in the response
               const token = jwt.sign(user, 'your_jwt_secret');
               ctx.body = {user, token};
            });
        })(ctx as any, undefined);
    }
}
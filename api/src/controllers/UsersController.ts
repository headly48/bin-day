import { RouterContext } from "@koa/router";
import { Context } from "koa";
import { ServerContext } from "../server";
import { UserEntity } from "../repositories/UsersRepository";



export class UsersController {

    public static async getUserLocations(ctx: RouterContext<any, ServerContext>) {

        const user: UserEntity = ctx.state.user
        const locations = await ctx.appContext.repositories.locationsRepository.getAllLocationsCreatedBy(user._id);

        ctx.status = 200;
        ctx.body = {
            locations: locations.map((loc) => {
                delete loc._id
                delete loc.createdBy
                return ({
                    ...loc
                })
            }
            )
        }
    }

    public static async getUser(ctx: RouterContext<any, ServerContext>) {

        const user: UserEntity = ctx.state.user

        ctx.body = {
            id: user._id,
            username: user.username
        };
        ctx.status = 200;
    }
}
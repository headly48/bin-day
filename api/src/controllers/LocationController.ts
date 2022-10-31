import { RouterContext } from "@koa/router";
import { Context } from "koa";
import { use } from "koa-passport";
import { ServerContext } from "../server";
import winston from "winston";
import { UserEntity } from "../repositories/UsersRepository";
import { Location } from "../dto/Location";

export class LocationController {


    public static async createLocation(ctx: RouterContext<any, ServerContext>): Promise<Location> {

        const user: UserEntity = ctx.state.user;
        const location: Location = ctx.request.body;

        winston.log("info", `Creating location for ${user.username}`);

        const LocationEntity = await ctx.appContext.services.usersService.createLocation(user, location)
        
        ctx.status = 200;

        return {
            name: LocationEntity.name,
            location: LocationEntity.location,
            address: LocationEntity.address,
            bins: LocationEntity.bins
        }
    } 
}
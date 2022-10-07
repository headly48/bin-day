import { RouterContext } from "@koa/router";
import { isNumber } from "class-validator";
import { Server } from "http";
import { BaseContext, DefaultState } from "koa";
import { description, request, summary, tagsAll } from "koa-swagger-decorator";
import winston from "winston";
import { ServerContext } from "../server";

export default class LGAController {
  @request("get", "/lga")
  public static async findLGA(
    ctx: RouterContext<any, ServerContext>
  ): Promise<void> {
    const lat = Number(ctx.query.lat);
    const long = Number(ctx.query.long);

    if (!isNumber(lat) || !isNumber(long)) {
      winston.log("error", `Invalid geo lat:${lat}, long: ${long}`);
      ctx.status = 400;
      throw new Error("Bad Request");
    }

    const collection = ctx.appContext.mongo.db.collection("lgas");


    const results = collection.find({

        <location field>: {
            $geoWithin: {
               $geometry: {
                  type: <"Polygon" or "MultiPolygon"> ,
                  coordinates: [ <coordinates> ]
               }
            }
         }
    });

    ctx.body = await results.toArray();
  }
}

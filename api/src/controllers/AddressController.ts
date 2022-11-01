import { RouterContext } from "@koa/router";
import { ServerContext } from "../server";
import { default as axios } from "axios";
import { config, isDevMode } from "../config";
import winston from "winston";

let mockAddressesData = require("../../mock-data/address/autocomplete.json")
let mockEmptyAddressesData = require("../../mock-data/address/autocomplete_empty.json")

let mockAddressData = require("../../mock-data/address/address-details.json")
var mockInvalidAddressData = require("../../mock-data/address/address-details-invalid.json")

export class AddressController {

    public static async searchAddresses(ctx: RouterContext<any, ServerContext>) {

        const queryTerm = ctx.request.query.query;
        const country = ctx.request.query.country;
        const sessionToken = ctx.request.query.sessiontoken;

        if(!queryTerm) {
            ctx.status = 400;
            return;
        }

        if(!sessionToken) {
            ctx.status = 400;
            winston.log('info', "Search addresses, SessionToken not supplied")
            return;
        }

        try {
            if(isDevMode) {
                ctx.body = queryTerm === "empty" ? mockEmptyAddressesData : mockAddressesData
                ctx.status = 200
                return;
            }

            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
                params: {
                    key: config.addressSearch.apiKey,
                    input: queryTerm,
                    types: "address",
                    sessiontoken: sessionToken,
                    components: country ? `country:${country}` : undefined
                }
            })

            ctx.body = response.data
            ctx.status = 200
        } catch (err) {
            winston.log('error', "Unable to fetch address suggestions", err)
            ctx.status = 500;
        }
    }

    public static async searchAddress(ctx: RouterContext<any, ServerContext>) {

        const placeId = ctx.params.id;
        const sessionToken = ctx.request.query.sessiontoken;

        if(!placeId) {
            ctx.status = 400;
            winston.log('info', "Search address, placeId not supplied")
            return;
        }

        if(!sessionToken) {
            ctx.status = 400;
            winston.log('info', "Search addresses, SessionToken not supplied")
            return;
        }


        try {
            if(isDevMode) {
                const data = placeId === "ChIJfZ8k5fKuEmsRA8jHYY6X7VA" ? mockInvalidAddressData : mockAddressData
                ctx.status = 200

                if(data.status !== "OK") {
                    ctx.status = 400;
                    winston.log('error', "Unable to fetch place details", placeId)
                    return;
                }

                ctx.body = data;
                return;
            }

            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
                params: {
                    key: config.addressSearch.apiKey,
                    place_id: placeId,
                    types: "address",
                    sessiontoken: sessionToken,
                }
            })

            if(response.data.status !== "OK") {
                ctx.status = 400;
                winston.log('error', "Unable to fetch place details", placeId)

                return;
            }

            ctx.body = response.data
            ctx.status = 200
        } catch (err) {
            winston.log('error', "Unable to fetch address suggestions", err)
            ctx.status = 500;
        }
    }
}
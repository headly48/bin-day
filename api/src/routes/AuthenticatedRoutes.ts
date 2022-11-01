import Router from "@koa/router";
import { UsersController } from "../controllers/UsersController";
import { LocationController } from "../controllers/LocationController";
import { isAuthenticated } from "../middleware/authentication";
import { AddressController } from "../controllers/AddressController";

const authenticatedRoutes = new Router();
authenticatedRoutes.use(isAuthenticated)


// authenticatedRoutes.use(bodyParser())
authenticatedRoutes.get("/user/locations", UsersController.getUserLocations);

authenticatedRoutes.get("/user", UsersController.getUser);


authenticatedRoutes.post("/location", LocationController.createLocation);


// TODO: Add Rate Limit
authenticatedRoutes.get("/address/search", AddressController.searchAddresses);
authenticatedRoutes.get("/address/:id", AddressController.searchAddress);

export { authenticatedRoutes };
import Router from "@koa/router";
import { UsersController } from "../controllers/UsersController";
import { LocationController } from "../controllers/LocationController";

const authenticatedRoutes = new Router();
// authenticatedRoutes.use(isAuthenticated)


// authenticatedRoutes.use(bodyParser())
authenticatedRoutes.get("/user/locations", UsersController.getUserLocations);




authenticatedRoutes.post("/location", LocationController.createLocation);



export { authenticatedRoutes };
import Router from "@koa/router";
import AuthenticationController from "../controllers/AuthenticationController";

const unAuthenticatedRoutes = new Router();


unAuthenticatedRoutes.post("/auth/login", AuthenticationController.loginUser);
unAuthenticatedRoutes.post("/auth/register", AuthenticationController.register);

export {unAuthenticatedRoutes}


